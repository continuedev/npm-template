import fs from "fs";
import https from "https";
import path from "path";
import { Dependency } from "../types";
import { nodeModulesPath } from "./paths";
const tar = require("tar");

export async function installPackages(
  dependencies: Dependency[]
): Promise<void> {
  for (const dep of dependencies) {
    await installSinglePackage(dep);
  }
}

export async function getPackageInfo(dep: Dependency): Promise<any> {
  if (!dep.name || !dep.version) {
    throw new Error("Invalid dependency object");
  }
  const absoluteVersion = (
    dep.version.startsWith("^") ? dep.version.slice(1) : dep.version
  ).split(" ")[0];
  const resp = await fetch(
    `https://registry.npmjs.org/${dep.name}/${absoluteVersion}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  );
  const data = await resp.json();
  return data;
}

async function downloadToNodeModules(
  dep: Dependency,
  shasum: string
): Promise<void> {
  // Construct the download URL
  const url = `https://registry.npmjs.org/${dep.name}/-/${dep.name}-${dep.version}.tgz`;
  const tarballPath = path.join(
    nodeModulesPath,
    `${dep.name.replace("@", "%40").replace("/", "%2F")}-${dep.version}.tgz`
  );

  // Download the tarball
  await new Promise((resolve, reject) => {
    const fileStream = fs.createWriteStream(tarballPath);

    https
      .get(url, (response) => {
        response.pipe(fileStream);

        fileStream.on("finish", () => {
          fileStream.close();
          resolve(null);
        });
      })
      .on("error", (error) => {
        fileStream.close();
        fs.unlink(tarballPath, () => {}); // Delete the file if an error occurs
        console.error(
          `Error downloading package ${dep.name}@${dep.version}:`,
          error
        );
        reject(error);
      });
  });

  // Extract the tarball
  try {
    await tar.extract({
      file: tarballPath,
      cwd: nodeModulesPath,
    });
  } catch (e) {
    console.error(`Error extracting package ${dep.name}@${dep.version}:`, e);
    return;
  } finally {
    // Delete the tarball
    fs.unlinkSync(tarballPath);
  }

  // Move to target directory
  const destPath = path.join(nodeModulesPath, dep.name);
  fs.renameSync(path.join(nodeModulesPath, "package"), destPath);
}

async function installSinglePackage(dep: Dependency) {
  console.log(`Installing ${dep.name}@${dep.version}...`);

  try {
    const data = await getPackageInfo(dep);
    await downloadToNodeModules(
      {
        ...dep,
        version: data.version,
      },
      data.dist.shasum
    );
  } catch (e) {
    console.error(`Error installing package ${dep.name}@${dep.version}:`, e);
    return;
  }
}

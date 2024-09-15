import fs from "fs";
import https from "https";
import path from "path";
import { Dependency, DependencyInstallation } from "../types";
import { nodeModulesPath } from "./paths";
import { getPackageInfo } from "./registry";
const tar = require("tar");

export async function installPackages(
  dependencies: Dependency[]
): Promise<void> {
  for (const dep of dependencies) {
    await installSinglePackage(dep);
  }
}

async function downloadToNodeModules(
  dep: DependencyInstallation,
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
  const destParentPath = dep.parentDirectory
    ? path.join(nodeModulesPath, dep.parentDirectory)
    : nodeModulesPath;
  if (!fs.existsSync(destParentPath)) {
    fs.mkdirSync(destParentPath, { recursive: true });
  }
  const destPath = path.join(destParentPath, dep.name);
  fs.renameSync(path.join(nodeModulesPath, "package"), destPath);
}

export async function installSinglePackage(dep: DependencyInstallation) {
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

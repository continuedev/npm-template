import fs from "fs";
import { DEFAULT_PACKAGE_JSON } from "../../util/packageJson";
import { outputDir, packageJsonPath } from "../../util/paths";
import { getPackageInfo } from "../../util/registry";

export async function addPackage(pkg: string) {
  let [packageName, version] = pkg.split("@");

  // If no specified version, or version is "latest", request latest version number
  if (!version || version === "latest") {
    const info = await getPackageInfo({
      name: packageName,
      version: "latest",
    });
    version = info.version;
  }

  // Create output dir and package.json if not exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  if (!fs.existsSync(packageJsonPath)) {
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(DEFAULT_PACKAGE_JSON, null, 2)
    );
  }

  // Add package to package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  packageJson.dependencies[packageName] = version || "latest";
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

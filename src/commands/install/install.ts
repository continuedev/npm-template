import fs from "fs";
import { installPackages } from "../../util/download";
import { DEFAULT_PACKAGE_JSON } from "../../util/packageJson";
import { nodeModulesPath, packageJsonPath } from "../../util/paths";
import { constructInstallationPlan } from "./TODO";

/**
 * This is the function that is called when the `install` CLI command is run
 */
export async function installAllDependencies() {
  console.log("Installing dependencies...");

  // Delete the node_modules folder if it exists - it is assumed that we always install from scratch
  if (fs.existsSync(nodeModulesPath)) {
    fs.rmSync(nodeModulesPath, { recursive: true });
  }
  fs.mkdirSync(nodeModulesPath);

  // Make sure package.json exists
  if (!fs.existsSync(packageJsonPath)) {
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(DEFAULT_PACKAGE_JSON, undefined, 2)
    );
  }

  // Get top-level dependencies from package.json
  const topLevelDependencies: Record<string, string> = JSON.parse(
    fs.readFileSync(packageJsonPath, "utf8")
  ).dependencies;

  // Construct an installation plan
  const installationPlan =
    await constructInstallationPlan(topLevelDependencies);

  // Execute the installation plan (download dependencies to their specified locations)
  await installPackages(installationPlan);
}

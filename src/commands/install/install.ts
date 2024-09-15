import fs from "fs";
import { installPackages } from "../../util/download";
import { nodeModulesPath, packageJsonPath } from "../../util/paths";
import { constructInstallationPlan } from "./TODO";

/**
 * name: the name of the dependency
 * version: the version of the dependency
 * parentDirectory: if undefined, we install at the root of node_modules. Otherwise, this string defines
 * the relative path starting from node_modules of the parent folder where this dependency should be installed
 */
export type DependencyInstallation = {
  name: string;
  version: string;
  parentDirectory?: string;
};

// An installation plan specifies which versions of dependencies to install and where to install them
export type InstallationPlan = DependencyInstallation[];

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

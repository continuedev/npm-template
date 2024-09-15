import { InstallationPlan } from "../../types";

/**
 *
 * @param topLevelDependencies The list of dependencies as determined by package.json's `dependencies` object
 * @returns The installation plan
 */
export async function constructInstallationPlan(
  topLevelDependencies: Record<string, string>
): Promise<InstallationPlan> {
  // TODO -> Determine the full list of dependencies to download
  return [
    {
      name: "is-thirteen",
      version: "2.0.0",
    },
  ];
}

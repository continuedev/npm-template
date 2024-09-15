import fs from "fs";
import path from "path";
import { DEFAULT_PACKAGE_JSON } from "./packageJson";

export const outputDir = path.join(process.cwd(), "output");
export const packageJsonPath = path.join(outputDir, "package.json");
export const packageLockJsonPath = path.join(outputDir, "package-lock.json");
export const nodeModulesPath = path.join(outputDir, "node_modules");
export const globalCachePath = path.join(process.cwd(), "global-cache");
export const cacheManifestPath = path.join(globalCachePath, "manifest.json");

export function setupFreshOutputDir() {
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, {
      force: true,
      recursive: true,
    });
  }

  fs.mkdirSync(outputDir);
  fs.mkdirSync(nodeModulesPath);
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(DEFAULT_PACKAGE_JSON, undefined, 2)
  );
}

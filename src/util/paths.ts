import path from "path";

export const outputDir = path.join(process.cwd(), "output");
export const packageJsonPath = path.join(outputDir, "package.json");
export const packageLockJsonPath = path.join(outputDir, "package-lock.json");
export const nodeModulesPath = path.join(outputDir, "node_modules");
export const globalCachePath = path.join(process.cwd(), "global-cache");
export const cacheManifestPath = path.join(globalCachePath, "manifest.json");

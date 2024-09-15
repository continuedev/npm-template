import fs from "fs";
import path from "path";
import { DependencyInstallation } from "../types";
import { installSinglePackage } from "./download";
import { nodeModulesPath } from "./paths";

describe("installSinglePackage", () => {
  it("downloads and installs to a specified directory", async () => {
    const dep: DependencyInstallation = {
      name: "is-thirteen",
      version: "2.0.0",
      parentDirectory: "test/node_modules",
    };

    await installSinglePackage(dep);
    const modulePath = path.join(
      nodeModulesPath,
      "test",
      "node_modules",
      "is-thirteen"
    );

    // Check if the directories exist
    expect(fs.existsSync(modulePath)).toBe(true);

    // Check the renamed package directory
    const packageJsonPath = path.join(modulePath, "package.json");
    expect(fs.existsSync(packageJsonPath)).toBe(true);
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

    expect(packageJson.name).toBe(dep.name);
    expect(packageJson.version).toBe(dep.version);
  });

  it("downloads and installs to the root of node_modules", async () => {
    const dep: DependencyInstallation = {
      name: "is-thirteen",
      version: "2.0.0",
    };

    await installSinglePackage(dep);
    const modulePath = path.join(nodeModulesPath, "is-thirteen");

    // Check if the directories exist
    expect(fs.existsSync(modulePath)).toBe(true);

    // Check the renamed package directory
    const packageJsonPath = path.join(modulePath, "package.json");
    expect(fs.existsSync(packageJsonPath)).toBe(true);
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

    expect(packageJson.name).toBe(dep.name);
    expect(packageJson.version).toBe(dep.version);
  });
});

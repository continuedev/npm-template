import fs from "fs";
import path from "path";
import { DEFAULT_PACKAGE_JSON } from "../../util/packageJson";
import { nodeModulesPath, outputDir, packageJsonPath } from "../../util/paths";
import { installAllDependencies } from "./install";

describe("npm install function", () => {
  it("should install is-thirteen", async () => {
    // Hardcode package.json to include only is-thirteen
    if (!outputDir) {
      fs.mkdirSync(outputDir);
    }
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(
        {
          ...DEFAULT_PACKAGE_JSON,
          dependencies: {
            "is-thirteen": "2.0.0",
          },
        },
        undefined,
        2
      )
    );

    // Run install command
    await installAllDependencies();

    // Check that is-thirteen is installed
    const p = path.join(nodeModulesPath, "is-thirteen");
    expect(fs.existsSync(p)).toBe(true);
    const isThirteenPackageJson = JSON.parse(
      fs.readFileSync(path.join(p, "package.json"), "utf8")
    );
    expect(isThirteenPackageJson.version).toBe("2.0.0");
  });
});

import fs from "fs";
import { packageJsonPath } from "../../util/paths";
import { addPackage } from "./add";

describe("npm add function", () => {
  it("should add package to package.json with exact version", async () => {
    await addPackage("is-fourteen@0.0.14");
    const packageJson = JSON.parse(
      await fs.promises.readFile(packageJsonPath, "utf8")
    );
    expect(packageJson.dependencies["is-fourteen"]).toBe("0.0.14");
  });

  it("should add package with latest version", async () => {
    await addPackage("is-thirteen");
    const packageJson = JSON.parse(
      await fs.promises.readFile(packageJsonPath, "utf8")
    );
    expect(packageJson.dependencies["is-thirteen"]).toBe("2.0.0"); // hasn't changed in 8 years
  });
});

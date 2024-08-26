import { IPackageJson } from "package-json-type";

export const DEFAULT_PACKAGE_JSON: IPackageJson = {
  name: "my-package",
  version: "1.0.0",
  description: "",
  main: "index.js",
  scripts: {
    test: 'echo "Error: no test specified" && exit 1',
  },
  keywords: [],
  author: "",
  license: "Apache-2.0",
  dependencies: {},
};

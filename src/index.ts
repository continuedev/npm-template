import { program } from "commander";
import { addPackage } from "./commands/add/add";
import { installAllDependencies } from "./commands/install/install";

/**
 * Adds the dependency to the “dependencies” object in package.json
 *
 * Argument <package>: A "name@version" string as defined [here](https://github.com/npm/node-semver#versions)
 */
program
  .command("add <package>")
  .description("Add a package")
  .action(addPackage);

/**
 * Resolves the full dependency list from package.json and downloads all of the required packages to the “node_modules” folder
 *
 * This command has no arguments
 */
program
  .command("install")
  .description("Install dependencies")
  .action(installAllDependencies);

program.parse(process.argv);

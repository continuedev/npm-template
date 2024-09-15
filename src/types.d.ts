export interface Dependency {
  name: string;
  version: string;
}

/**
 * name: the name of the dependency
 * version: the version of the dependency
 * parentDirectory: if undefined, we install at the root of node_modules. Otherwise, this string defines
 * the relative path starting from node_modules of the parent folder where this dependency should be installed
 */
export interface DependencyInstallation extends Dependency {
  parentDirectory?: string;
}

// An installation plan specifies which versions of dependencies to install and where to install them
export type InstallationPlan = DependencyInstallation[];

import { CLIFlags, PackageSourceLocal, PluginLoadResult, SnowpackConfig, SnowpackPlugin, SnowpackUserConfig } from './types';
export declare const DEFAULT_PACKAGES_LOCAL_CONFIG: PackageSourceLocal;
/**
 * Convert CLI flags to an incomplete Snowpack config representation.
 * We need to be careful about setting properties here if the flag value
 * is undefined, since the deep merge strategy would then overwrite good
 * defaults with 'undefined'.
 */
export declare function expandCliFlags(flags: CLIFlags): SnowpackUserConfig;
export declare function validatePluginLoadResult(plugin: SnowpackPlugin, result: PluginLoadResult | string | void | undefined | null): void;
export declare function createConfiguration(config?: SnowpackUserConfig): SnowpackConfig;
export declare function loadConfiguration(overrides?: SnowpackUserConfig, configPath?: string): Promise<SnowpackConfig>;

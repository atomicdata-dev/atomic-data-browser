"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rimraf_1 = __importDefault(require("rimraf"));
const crypto_1 = __importDefault(require("crypto"));
const find_cache_dir_1 = __importDefault(require("find-cache-dir"));
const deepmerge_1 = __importDefault(require("deepmerge"));
const fs_1 = require("fs");
const colors = __importStar(require("kleur/colors"));
const path_1 = __importDefault(require("path"));
const local_install_1 = require("./local-install");
const logger_1 = require("../logger");
const scan_imports_1 = require("../scan-imports");
const util_1 = require("../util");
const PROJECT_CACHE_DIR = find_cache_dir_1.default({ name: 'snowpack' }) ||
    // If `projectCacheDir()` is null, no node_modules directory exists.
    // Use the current path (hashed) to create a cache entry in the global cache instead.
    // Because this is specifically for dependencies, this fallback should rarely be used.
    path_1.default.join(util_1.GLOBAL_CACHE_DIR, crypto_1.default.createHash('md5').update(process.cwd()).digest('hex'));
const DEV_DEPENDENCIES_DIR = path_1.default.join(PROJECT_CACHE_DIR, process.env.NODE_ENV || 'development');
/**
 * Install dependencies needed in "dev" mode. Generally speaking, this scans
 * your entire source app for dependency install targets, installs them,
 * and then updates the "hash" file used to check node_modules freshness.
 */
async function installDependencies(config) {
    const installTargets = await scan_imports_1.getInstallTargets(config, config.packageOptions.source === 'local' ? config.packageOptions.knownEntrypoints : []);
    if (installTargets.length === 0) {
        logger_1.logger.info('Nothing to install.');
        return;
    }
    // 2. Install dependencies, based on the scan of your final build.
    const installResult = await local_install_1.run({
        config,
        installTargets,
        installOptions,
        shouldPrintStats: false,
    });
    await util_1.updateLockfileHash(DEV_DEPENDENCIES_DIR);
    return installResult;
}
// A bit of a hack: we keep this in local state and populate it
// during the "prepare" call. Useful so that we don't need to pass
// this implementation detail around outside of this interface.
// Can't add it to the exported interface due to TS.
let installOptions;
/**
 * Local Package Source: A generic interface through which Snowpack
 * interacts with esinstall and your locally installed dependencies.
 */
exports.default = {
    async load(spec) {
        const dependencyFileLoc = path_1.default.join(DEV_DEPENDENCIES_DIR, spec);
        return fs_1.promises.readFile(dependencyFileLoc);
    },
    modifyBuildInstallOptions({ installOptions, config }) {
        if (config.packageOptions.source !== 'local') {
            return installOptions;
        }
        installOptions.cwd = config.root;
        installOptions.rollup = config.packageOptions.rollup;
        installOptions.sourcemap = config.buildOptions.sourcemap;
        installOptions.polyfillNode = config.packageOptions.polyfillNode;
        installOptions.packageLookupFields = config.packageOptions.packageLookupFields;
        installOptions.packageExportLookupFields = config.packageOptions.packageExportLookupFields;
        return installOptions;
    },
    async prepare(commandOptions) {
        const { config } = commandOptions;
        // Set the proper install options, in case an install is needed.
        const dependencyImportMapLoc = path_1.default.join(DEV_DEPENDENCIES_DIR, 'import-map.json');
        logger_1.logger.debug(`Using cache folder: ${path_1.default.relative(config.root, DEV_DEPENDENCIES_DIR)}`);
        installOptions = deepmerge_1.default(commandOptions.config.packageOptions, {
            dest: DEV_DEPENDENCIES_DIR,
            env: { NODE_ENV: process.env.NODE_ENV || 'development' },
            treeshake: false,
        });
        // Start with a fresh install of your dependencies, if needed.
        let dependencyImportMap = { imports: {} };
        try {
            dependencyImportMap = JSON.parse(await fs_1.promises.readFile(dependencyImportMapLoc, { encoding: 'utf8' }));
        }
        catch (err) {
            // no import-map found, safe to ignore
        }
        if (!(await util_1.checkLockfileHash(DEV_DEPENDENCIES_DIR)) || !fs_1.existsSync(dependencyImportMapLoc)) {
            logger_1.logger.debug('Cache out of date or missing. Updating...');
            const installResult = await installDependencies(config);
            dependencyImportMap = (installResult === null || installResult === void 0 ? void 0 : installResult.importMap) || { imports: {} };
        }
        else {
            logger_1.logger.debug(`Cache up-to-date. Using existing cache`);
        }
        return dependencyImportMap;
    },
    resolvePackageImport(spec, dependencyImportMap, config) {
        if (dependencyImportMap.imports[spec]) {
            const importMapEntry = dependencyImportMap.imports[spec];
            return path_1.default.posix.join(config.buildOptions.metaUrlPath, 'pkg', importMapEntry);
        }
        return false;
    },
    async recoverMissingPackageImport(_, config) {
        logger_1.logger.info(colors.yellow('Dependency cache out of date. Updating...'));
        const installResult = await installDependencies(config);
        const dependencyImportMap = installResult.importMap;
        return dependencyImportMap;
    },
    clearCache() {
        return rimraf_1.default.sync(PROJECT_CACHE_DIR);
    },
    getCacheFolder() {
        return PROJECT_CACHE_DIR;
    },
};

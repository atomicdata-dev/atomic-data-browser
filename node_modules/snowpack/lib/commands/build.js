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
exports.command = exports.build = void 0;
const fs_1 = require("fs");
const glob_1 = __importDefault(require("glob"));
const colors = __importStar(require("kleur/colors"));
const mkdirp_1 = __importDefault(require("mkdirp"));
const p_queue_1 = __importDefault(require("p-queue"));
const path_1 = __importDefault(require("path"));
const perf_hooks_1 = require("perf_hooks");
const url_1 = __importDefault(require("url"));
const build_import_proxy_1 = require("../build/build-import-proxy");
const build_pipeline_1 = require("../build/build-pipeline");
const file_urls_1 = require("../build/file-urls");
const import_resolver_1 = require("../build/import-resolver");
const optimize_1 = require("../build/optimize");
const hmr_server_engine_1 = require("../hmr-server-engine");
const logger_1 = require("../logger");
const rewrite_imports_1 = require("../rewrite-imports");
const scan_imports_1 = require("../scan-imports");
const local_1 = __importDefault(require("../sources/local"));
const util_1 = require("../util");
const local_install_1 = require("../sources/local-install");
const CONCURRENT_WORKERS = require('os').cpus().length;
let hmrEngine = null;
function getIsHmrEnabled(config) {
    return config.buildOptions.watch && !!config.devOptions.hmr;
}
function handleFileError(err, builder) {
    logger_1.logger.error(`✘ ${builder.fileURL}`);
    throw err;
}
function createBuildFileManifest(allFiles) {
    const result = {};
    for (const sourceFile of allFiles) {
        for (const outputFile of Object.entries(sourceFile.output)) {
            result[outputFile[0]] = {
                source: url_1.default.fileURLToPath(sourceFile.fileURL),
                contents: outputFile[1],
            };
        }
    }
    return result;
}
/**
 * Scan a directory and remove any empty folders, recursively.
 */
async function removeEmptyFolders(directoryLoc) {
    if (!(await fs_1.promises.stat(directoryLoc)).isDirectory()) {
        return false;
    }
    // If folder is empty, clear it
    const files = await fs_1.promises.readdir(directoryLoc);
    if (files.length === 0) {
        await fs_1.promises.rmdir(directoryLoc);
        return false;
    }
    // Otherwise, step in and clean each contained item
    await Promise.all(files.map((file) => removeEmptyFolders(path_1.default.join(directoryLoc, file))));
    // After, check again if folder is now empty
    const afterFiles = await fs_1.promises.readdir(directoryLoc);
    if (afterFiles.length == 0) {
        await fs_1.promises.rmdir(directoryLoc);
    }
    return true;
}
async function installOptimizedDependencies(scannedFiles, installDest, commandOptions) {
    var _a;
    const baseInstallOptions = {
        dest: installDest,
        external: commandOptions.config.packageOptions.external,
        env: { NODE_ENV: process.env.NODE_ENV || 'production' },
        treeshake: commandOptions.config.buildOptions.watch
            ? false
            : ((_a = commandOptions.config.optimize) === null || _a === void 0 ? void 0 : _a.treeshake) !== false,
    };
    const pkgSource = util_1.getPackageSource(commandOptions.config.packageOptions.source);
    const installOptions = pkgSource.modifyBuildInstallOptions({
        installOptions: baseInstallOptions,
        config: commandOptions.config,
        lockfile: commandOptions.lockfile,
    });
    // 1. Scan imports from your final built JS files.
    // Unlike dev (where we scan from source code) the built output guarantees that we
    // will can scan all used entrypoints. Set to `[]` to improve tree-shaking performance.
    const installTargets = await scan_imports_1.getInstallTargets(commandOptions.config, [], scannedFiles);
    // 2. Install dependencies, based on the scan of your final build.
    const installResult = await local_install_1.run({
        installTargets,
        installOptions,
        config: commandOptions.config,
        shouldPrintStats: false,
    });
    return installResult;
}
/**
 * FileBuilder - This class is responsible for building a file. It is broken into
 * individual stages so that the entire application build process can be tackled
 * in stages (build -> resolve -> write to disk).
 */
class FileBuilder {
    constructor({ fileURL, mountEntry, outDir, config, }) {
        this.output = {};
        this.filesToResolve = {};
        this.filesToProxy = [];
        this.fileURL = fileURL;
        this.mountEntry = mountEntry;
        this.outDir = outDir;
        this.config = config;
    }
    async buildFile() {
        this.filesToResolve = {};
        const isSSR = this.config.buildOptions.ssr;
        const srcExt = path_1.default.extname(url_1.default.fileURLToPath(this.fileURL));
        const fileOutput = this.mountEntry.static
            ? { [srcExt]: { code: await util_1.readFile(this.fileURL) } }
            : await build_pipeline_1.buildFile(this.fileURL, {
                config: this.config,
                isDev: false,
                isSSR,
                isHmrEnabled: false,
            });
        for (const [fileExt, buildResult] of Object.entries(fileOutput)) {
            let { code, map } = buildResult;
            if (!code) {
                continue;
            }
            let outFilename = path_1.default.basename(url_1.default.fileURLToPath(this.fileURL));
            const extensionMatch = util_1.getExtensionMatch(this.fileURL.toString(), this.config._extensionMap);
            if (extensionMatch) {
                const [inputExt, outputExts] = extensionMatch;
                if (outputExts.length > 1) {
                    outFilename = util_1.addExtension(path_1.default.basename(url_1.default.fileURLToPath(this.fileURL)), fileExt);
                }
                else {
                    outFilename = util_1.replaceExtension(path_1.default.basename(url_1.default.fileURLToPath(this.fileURL)), inputExt, fileExt);
                }
            }
            const outLoc = path_1.default.join(this.outDir, outFilename);
            const sourceMappingURL = outFilename + '.map';
            if (this.mountEntry.resolve && typeof code === 'string') {
                switch (fileExt) {
                    case '.css': {
                        if (map)
                            code = util_1.cssSourceMappingURL(code, sourceMappingURL);
                        this.filesToResolve[outLoc] = {
                            baseExt: fileExt,
                            root: this.config.root,
                            contents: code,
                            locOnDisk: url_1.default.fileURLToPath(this.fileURL),
                        };
                        break;
                    }
                    case '.js': {
                        if (fileOutput['.css']) {
                            // inject CSS if imported directly
                            code = `import './${util_1.replaceExtension(outFilename, '.js', '.css')}';\n` + code;
                        }
                        code = build_import_proxy_1.wrapImportMeta({ code, env: true, hmr: false, config: this.config });
                        if (map)
                            code = util_1.jsSourceMappingURL(code, sourceMappingURL);
                        this.filesToResolve[outLoc] = {
                            baseExt: fileExt,
                            root: this.config.root,
                            contents: code,
                            locOnDisk: url_1.default.fileURLToPath(this.fileURL),
                        };
                        break;
                    }
                    case '.html': {
                        code = build_import_proxy_1.wrapHtmlResponse({
                            code,
                            hmr: getIsHmrEnabled(this.config),
                            hmrPort: hmrEngine ? hmrEngine.port : undefined,
                            isDev: false,
                            config: this.config,
                            mode: 'production',
                        });
                        this.filesToResolve[outLoc] = {
                            baseExt: fileExt,
                            root: this.config.root,
                            contents: code,
                            locOnDisk: url_1.default.fileURLToPath(this.fileURL),
                        };
                        break;
                    }
                }
            }
            this.output[outLoc] = code;
            if (map) {
                this.output[path_1.default.join(this.outDir, sourceMappingURL)] = map;
            }
        }
    }
    async resolveImports(importMap) {
        let isSuccess = true;
        this.filesToProxy = [];
        for (const [outLoc, rawFile] of Object.entries(this.filesToResolve)) {
            // don’t transform binary file contents
            if (Buffer.isBuffer(rawFile.contents)) {
                continue;
            }
            const file = rawFile;
            const resolveImportSpecifier = import_resolver_1.createImportResolver({
                fileLoc: file.locOnDisk,
                config: this.config,
            });
            const resolvedCode = await rewrite_imports_1.transformFileImports(file, (spec) => {
                var _a, _b;
                // Try to resolve the specifier to a known URL in the project
                let resolvedImportUrl = resolveImportSpecifier(spec);
                // If not resolved, then this is a package. During build, dependencies are always
                // installed locally via esinstall, so use localPackageSource here.
                if (importMap.imports[spec]) {
                    resolvedImportUrl = local_1.default.resolvePackageImport(spec, importMap, this.config);
                }
                // If still not resolved, then this imported package somehow evaded detection
                // when we scanned it in the previous step. If you find a bug here, report it!
                if (!resolvedImportUrl) {
                    isSuccess = false;
                    logger_1.logger.error(`${file.locOnDisk} - Could not resolve unknown import "${spec}".`);
                    return spec;
                }
                // Ignore "http://*" imports
                if (util_1.isRemoteUrl(resolvedImportUrl)) {
                    return resolvedImportUrl;
                }
                // Ignore packages marked as external
                if ((_a = this.config.packageOptions.external) === null || _a === void 0 ? void 0 : _a.includes(resolvedImportUrl)) {
                    return resolvedImportUrl;
                }
                // Handle normal "./" & "../" import specifiers
                const importExtName = path_1.default.extname(resolvedImportUrl);
                const isBundling = !!((_b = this.config.optimize) === null || _b === void 0 ? void 0 : _b.bundle);
                const isProxyImport = importExtName &&
                    importExtName !== '.js' &&
                    !path_1.default.posix.isAbsolute(spec) &&
                    // If using our built-in bundler, treat CSS as a first class citizen (no proxy file needed).
                    // TODO: Remove special `.module.css` handling by building css modules to native JS + CSS.
                    (!isBundling || !/(?<!module)\.css$/.test(resolvedImportUrl));
                const isAbsoluteUrlPath = path_1.default.posix.isAbsolute(resolvedImportUrl);
                let resolvedImportPath = util_1.removeLeadingSlash(path_1.default.normalize(resolvedImportUrl));
                // We treat ".proxy.js" files special: we need to make sure that they exist on disk
                // in the final build, so we mark them to be written to disk at the next step.
                if (isProxyImport) {
                    if (isAbsoluteUrlPath) {
                        this.filesToProxy.push(path_1.default.resolve(this.config.buildOptions.out, resolvedImportPath));
                    }
                    else {
                        this.filesToProxy.push(path_1.default.resolve(path_1.default.dirname(outLoc), resolvedImportPath));
                    }
                    resolvedImportPath = resolvedImportPath + '.proxy.js';
                    resolvedImportUrl = resolvedImportUrl + '.proxy.js';
                }
                // When dealing with an absolute import path, we need to honor the baseUrl
                if (isAbsoluteUrlPath) {
                    resolvedImportUrl = util_1.relativeURL(path_1.default.dirname(outLoc), path_1.default.resolve(this.config.buildOptions.out, resolvedImportPath));
                }
                // Make sure that a relative URL always starts with "./"
                if (!resolvedImportUrl.startsWith('.') && !resolvedImportUrl.startsWith('/')) {
                    resolvedImportUrl = './' + resolvedImportUrl;
                }
                return resolvedImportUrl;
            });
            this.output[outLoc] = resolvedCode;
        }
        return isSuccess;
    }
    async writeToDisk() {
        mkdirp_1.default.sync(this.outDir);
        for (const [outLoc, code] of Object.entries(this.output)) {
            const encoding = typeof code === 'string' ? 'utf8' : undefined;
            await fs_1.promises.writeFile(outLoc, code, encoding);
        }
    }
    async getProxy(originalFileLoc) {
        const proxiedCode = this.output[originalFileLoc];
        const proxiedUrl = originalFileLoc
            .substr(this.config.buildOptions.out.length)
            .replace(/\\/g, '/');
        return build_import_proxy_1.wrapImportProxy({
            url: proxiedUrl,
            code: proxiedCode,
            hmr: false,
            config: this.config,
        });
    }
    async writeProxyToDisk(originalFileLoc) {
        const proxyCode = await this.getProxy(originalFileLoc);
        const importProxyFileLoc = originalFileLoc + '.proxy.js';
        await fs_1.promises.writeFile(importProxyFileLoc, proxyCode, 'utf8');
    }
}
async function build(commandOptions) {
    const { config } = commandOptions;
    const isDev = !!config.buildOptions.watch;
    const isSSR = !!config.buildOptions.ssr;
    // Fill in any command-specific plugin methods.
    // NOTE: markChanged only needed during dev, but may not be true for all.
    if (isDev) {
        for (const p of config.plugins) {
            p.markChanged = (fileLoc) => onWatchEvent(fileLoc) || undefined;
        }
    }
    const buildDirectoryLoc = config.buildOptions.out;
    const internalFilesBuildLoc = path_1.default.join(buildDirectoryLoc, config.buildOptions.metaUrlPath);
    if (config.buildOptions.clean) {
        util_1.deleteFromBuildSafe(buildDirectoryLoc, config);
    }
    mkdirp_1.default.sync(buildDirectoryLoc);
    mkdirp_1.default.sync(internalFilesBuildLoc);
    for (const runPlugin of config.plugins) {
        if (runPlugin.run) {
            logger_1.logger.debug(`starting ${runPlugin.name} run() (isDev=${isDev})`);
            const runJob = runPlugin
                .run({
                isDev: isDev,
                // @ts-ignore: deprecated
                isHmrEnabled: getIsHmrEnabled(config),
                // @ts-ignore: internal API only
                log: (msg, data = {}) => {
                    if (msg === 'CONSOLE_INFO' || msg === 'WORKER_MSG') {
                        logger_1.logger.info(data.msg.trim(), { name: runPlugin.name });
                    }
                },
            })
                .catch((err) => {
                logger_1.logger.error(err.toString(), { name: runPlugin.name });
                if (!isDev) {
                    process.exit(1);
                }
            });
            // Wait for the job to complete before continuing (unless in watch mode)
            if (!isDev) {
                await runJob;
            }
        }
    }
    // Write the `import.meta.env` contents file to disk
    logger_1.logger.debug(`generating meta files`);
    await fs_1.promises.writeFile(path_1.default.join(internalFilesBuildLoc, 'env.js'), build_import_proxy_1.generateEnvModule({ mode: 'production', isSSR }));
    if (getIsHmrEnabled(config)) {
        await fs_1.promises.writeFile(path_1.default.resolve(internalFilesBuildLoc, 'hmr-client.js'), util_1.HMR_CLIENT_CODE);
        await fs_1.promises.writeFile(path_1.default.resolve(internalFilesBuildLoc, 'hmr-error-overlay.js'), util_1.HMR_OVERLAY_CODE);
        hmrEngine = new hmr_server_engine_1.EsmHmrEngine({ port: config.devOptions.hmrPort });
    }
    logger_1.logger.info(colors.yellow('! building source files...'));
    const buildStart = perf_hooks_1.performance.now();
    const buildPipelineFiles = {};
    /** Install all needed dependencies, based on the master buildPipelineFiles list.  */
    async function installDependencies() {
        var _a;
        const scannedFiles = Object.values(buildPipelineFiles)
            .map((f) => Object.values(f.filesToResolve))
            .reduce((flat, item) => flat.concat(item), []);
        const installDest = path_1.default.join(buildDirectoryLoc, config.buildOptions.metaUrlPath, 'pkg');
        const installResult = await installOptimizedDependencies(scannedFiles, installDest, commandOptions);
        const allFiles = glob_1.default.sync(`**/*`, {
            cwd: installDest,
            absolute: true,
            nodir: true,
            dot: true,
            follow: true,
        });
        if (!((_a = config.optimize) === null || _a === void 0 ? void 0 : _a.bundle)) {
            for (const installedFileLoc of allFiles) {
                if (!installedFileLoc.endsWith('import-map.json') &&
                    path_1.default.extname(installedFileLoc) !== '.js') {
                    const proxiedCode = await util_1.readFile(url_1.default.pathToFileURL(installedFileLoc));
                    const importProxyFileLoc = installedFileLoc + '.proxy.js';
                    const proxiedUrl = installedFileLoc.substr(buildDirectoryLoc.length).replace(/\\/g, '/');
                    const proxyCode = await build_import_proxy_1.wrapImportProxy({
                        url: proxiedUrl,
                        code: proxiedCode,
                        hmr: false,
                        config: config,
                    });
                    await fs_1.promises.writeFile(importProxyFileLoc, proxyCode, 'utf8');
                }
            }
        }
        return installResult;
    }
    // 0. Find all source files.
    for (const [mountedDir, mountEntry] of Object.entries(config.mount)) {
        const finalDestLocMap = new Map();
        const allFiles = glob_1.default.sync(`**/*`, {
            ignore: [...config.exclude, ...config.testOptions.files],
            cwd: mountedDir,
            absolute: true,
            nodir: true,
            dot: true,
            follow: true,
        });
        for (const rawLocOnDisk of allFiles) {
            const fileLoc = path_1.default.resolve(rawLocOnDisk); // this is necessary since glob.sync() returns paths with / on windows.  path.resolve() will switch them to the native path separator.
            const finalUrl = file_urls_1.getUrlForFileMount({ fileLoc, mountKey: mountedDir, mountEntry, config });
            const finalDestLoc = path_1.default.join(buildDirectoryLoc, finalUrl);
            const existedFileLoc = finalDestLocMap.get(finalDestLoc);
            if (existedFileLoc) {
                const errorMessage = `Error: Two files overlap and build to the same destination: ${finalDestLoc}\n` +
                    `  File 1: ${existedFileLoc}\n` +
                    `  File 2: ${fileLoc}\n`;
                throw new Error(errorMessage);
            }
            const outDir = path_1.default.dirname(finalDestLoc);
            const buildPipelineFile = new FileBuilder({
                fileURL: url_1.default.pathToFileURL(fileLoc),
                mountEntry,
                outDir,
                config,
            });
            buildPipelineFiles[fileLoc] = buildPipelineFile;
            finalDestLocMap.set(finalDestLoc, fileLoc);
        }
    }
    // 1. Build all files for the first time, from source.
    const parallelWorkQueue = new p_queue_1.default({ concurrency: CONCURRENT_WORKERS });
    const allBuildPipelineFiles = Object.values(buildPipelineFiles);
    for (const buildPipelineFile of allBuildPipelineFiles) {
        parallelWorkQueue.add(() => buildPipelineFile.buildFile().catch((err) => handleFileError(err, buildPipelineFile)));
    }
    await parallelWorkQueue.onIdle();
    const buildEnd = perf_hooks_1.performance.now();
    logger_1.logger.info(`${colors.green('✔')} build complete ${colors.dim(`[${((buildEnd - buildStart) / 1000).toFixed(2)}s]`)}`);
    // 2. Install all dependencies. This gets us the import map we need to resolve imports.
    let installResult = await installDependencies();
    logger_1.logger.info(colors.yellow('! verifying build...'));
    // 3. Resolve all built file imports.
    const verifyStart = perf_hooks_1.performance.now();
    for (const buildPipelineFile of allBuildPipelineFiles) {
        parallelWorkQueue.add(() => buildPipelineFile
            .resolveImports(installResult.importMap)
            .catch((err) => handleFileError(err, buildPipelineFile)));
    }
    await parallelWorkQueue.onIdle();
    const verifyEnd = perf_hooks_1.performance.now();
    logger_1.logger.info(`${colors.green('✔')} verification complete ${colors.dim(`[${((verifyEnd - verifyStart) / 1000).toFixed(2)}s]`)}`);
    // 4. Write files to disk.
    logger_1.logger.info(colors.yellow('! writing build to disk...'));
    const allImportProxyFiles = new Set(allBuildPipelineFiles.map((b) => b.filesToProxy).reduce((flat, item) => flat.concat(item), []));
    for (const buildPipelineFile of allBuildPipelineFiles) {
        parallelWorkQueue.add(() => buildPipelineFile.writeToDisk());
        for (const builtFile of Object.keys(buildPipelineFile.output)) {
            if (allImportProxyFiles.has(builtFile)) {
                parallelWorkQueue.add(() => buildPipelineFile
                    .writeProxyToDisk(builtFile)
                    .catch((err) => handleFileError(err, buildPipelineFile)));
            }
        }
    }
    await parallelWorkQueue.onIdle();
    const buildResultManifest = createBuildFileManifest(allBuildPipelineFiles);
    // TODO(fks): Add support for virtual files (injected by snowpack, plugins)
    // and web_modules in this manifest.
    // buildResultManifest[path.join(internalFilesBuildLoc, 'env.js')] = {
    //   source: null,
    //   contents: generateEnvModule({mode: 'production', isSSR}),
    // };
    // "--watch --hmr" mode - Tell users about the HMR WebSocket URL
    if (hmrEngine) {
        logger_1.logger.info(`[HMR] WebSocket URL available at ${colors.cyan(`ws://localhost:${hmrEngine.port}`)}`);
    }
    // 5. Optimize the build.
    if (!config.buildOptions.watch) {
        if (config.optimize || config.plugins.some((p) => p.optimize)) {
            const optimizeStart = perf_hooks_1.performance.now();
            logger_1.logger.info(colors.yellow('! optimizing build...'));
            await optimize_1.runBuiltInOptimize(config);
            await build_pipeline_1.runPipelineOptimizeStep(buildDirectoryLoc, {
                config,
                isDev: false,
                isSSR: config.buildOptions.ssr,
                isHmrEnabled: false,
            });
            const optimizeEnd = perf_hooks_1.performance.now();
            logger_1.logger.info(`${colors.green('✔')} optimize complete ${colors.dim(`[${((optimizeEnd - optimizeStart) / 1000).toFixed(2)}s]`)}`);
            await removeEmptyFolders(buildDirectoryLoc);
            await build_pipeline_1.runPipelineCleanupStep(config);
            logger_1.logger.info(`${colors.underline(colors.green(colors.bold('▶ Build Complete!')))}\n\n`);
            return {
                result: buildResultManifest,
                onFileChange: () => {
                    throw new Error('build().onFileChange() only supported in "watch" mode.');
                },
                shutdown: () => {
                    throw new Error('build().shutdown() only supported in "watch" mode.');
                },
            };
        }
    }
    // "--watch" mode - Start watching the file system.
    // Defer "chokidar" loading to here, to reduce impact on overall startup time
    logger_1.logger.info(colors.cyan('watching for changes...'));
    const chokidar = await Promise.resolve().then(() => __importStar(require('chokidar')));
    function onDeleteEvent(fileLoc) {
        delete buildPipelineFiles[fileLoc];
    }
    async function onWatchEvent(fileLoc) {
        logger_1.logger.info(colors.cyan('File changed...'));
        const mountEntryResult = file_urls_1.getMountEntryForFile(fileLoc, config);
        if (!mountEntryResult) {
            return;
        }
        onFileChangeCallback({ filePath: fileLoc });
        const [mountKey, mountEntry] = mountEntryResult;
        const finalUrl = file_urls_1.getUrlForFileMount({ fileLoc, mountKey, mountEntry, config });
        const finalDest = path_1.default.join(buildDirectoryLoc, finalUrl);
        const outDir = path_1.default.dirname(finalDest);
        const changedPipelineFile = new FileBuilder({
            fileURL: url_1.default.pathToFileURL(fileLoc),
            mountEntry,
            outDir,
            config,
        });
        buildPipelineFiles[fileLoc] = changedPipelineFile;
        // 1. Build the file.
        await changedPipelineFile.buildFile().catch((err) => {
            var _a;
            logger_1.logger.error(fileLoc + ' ' + err.toString(), { name: (_a = err.__snowpackBuildDetails) === null || _a === void 0 ? void 0 : _a.name });
            hmrEngine &&
                hmrEngine.broadcastMessage({
                    type: 'error',
                    title: `Build Error` + err.__snowpackBuildDetails
                        ? `: ${err.__snowpackBuildDetails.name}`
                        : '',
                    errorMessage: err.toString(),
                    fileLoc,
                    errorStackTrace: err.stack,
                });
        });
        // 2. Resolve any ESM imports. Handle new imports by triggering a re-install.
        let resolveSuccess = await changedPipelineFile.resolveImports(installResult.importMap);
        if (!resolveSuccess) {
            await installDependencies();
            resolveSuccess = await changedPipelineFile.resolveImports(installResult.importMap);
            if (!resolveSuccess) {
                logger_1.logger.error('Exiting...');
                process.exit(1);
            }
        }
        // 3. Write to disk. If any proxy imports are needed, write those as well.
        await changedPipelineFile.writeToDisk();
        const allBuildPipelineFiles = Object.values(buildPipelineFiles);
        const allImportProxyFiles = new Set(allBuildPipelineFiles
            .map((b) => b.filesToProxy)
            .reduce((flat, item) => flat.concat(item), []));
        for (const builtFile of Object.keys(changedPipelineFile.output)) {
            if (allImportProxyFiles.has(builtFile)) {
                await changedPipelineFile.writeProxyToDisk(builtFile);
            }
        }
        if (hmrEngine) {
            hmrEngine.broadcastMessage({ type: 'reload' });
        }
    }
    const watcher = chokidar.watch(Object.keys(config.mount), {
        ignored: config.exclude,
        ignoreInitial: true,
        persistent: true,
        disableGlobbing: false,
        useFsEvents: util_1.isFsEventsEnabled(),
    });
    watcher.on('add', (fileLoc) => onWatchEvent(fileLoc));
    watcher.on('change', (fileLoc) => onWatchEvent(fileLoc));
    watcher.on('unlink', (fileLoc) => onDeleteEvent(fileLoc));
    // Allow the user to hook into this callback, if they like (noop by default)
    let onFileChangeCallback = () => { };
    return {
        result: buildResultManifest,
        onFileChange: (callback) => (onFileChangeCallback = callback),
        async shutdown() {
            await watcher.close();
        },
    };
}
exports.build = build;
async function command(commandOptions) {
    try {
        await build(commandOptions);
    }
    catch (err) {
        logger_1.logger.error(err.message);
        logger_1.logger.debug(err.stack);
        process.exit(1);
    }
    if (commandOptions.config.buildOptions.watch) {
        // We intentionally never want to exit in watch mode!
        return new Promise(() => { });
    }
}
exports.command = command;

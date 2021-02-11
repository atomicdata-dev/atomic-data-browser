"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createImportResolver = exports.getFsStat = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = require("../util");
const file_urls_1 = require("./file-urls");
/** Perform a file disk lookup for the requested import specifier. */
function getFsStat(importedFileOnDisk) {
    try {
        return fs_1.default.statSync(importedFileOnDisk);
    }
    catch (err) {
        // file doesn't exist, that's fine
    }
    return false;
}
exports.getFsStat = getFsStat;
/** Resolve an import based on the state of the file/folder found on disk. */
function resolveSourceSpecifier(lazyFileLoc, config) {
    const lazyFileStat = getFsStat(lazyFileLoc);
    // Handle directory imports (ex: "./components" -> "./components/index.js")
    if (lazyFileStat && lazyFileStat.isDirectory()) {
        const trailingSlash = lazyFileLoc.endsWith('/') ? '' : '/';
        lazyFileLoc = lazyFileLoc + trailingSlash + 'index.js';
    }
    else if (lazyFileStat && lazyFileStat.isFile()) {
        lazyFileLoc = lazyFileLoc;
    }
    else if (util_1.hasExtension(lazyFileLoc, '.css')) {
        lazyFileLoc = lazyFileLoc;
    }
    else if (util_1.hasExtension(lazyFileLoc, '.js')) {
        const tsWorkaroundImportFileLoc = util_1.replaceExtension(lazyFileLoc, '.js', '.ts');
        if (getFsStat(tsWorkaroundImportFileLoc)) {
            lazyFileLoc = tsWorkaroundImportFileLoc;
        }
    }
    else if (util_1.hasExtension(lazyFileLoc, '.jsx')) {
        const tsWorkaroundImportFileLoc = util_1.replaceExtension(lazyFileLoc, '.jsx', '.tsx');
        if (getFsStat(tsWorkaroundImportFileLoc)) {
            lazyFileLoc = tsWorkaroundImportFileLoc;
        }
    }
    else {
        lazyFileLoc = lazyFileLoc + '.js';
    }
    // Transform the file extension (from input to output)
    const extensionMatch = util_1.getExtensionMatch(lazyFileLoc, config._extensionMap);
    if (extensionMatch) {
        const [inputExt, outputExts] = extensionMatch;
        if (outputExts.length > 1) {
            lazyFileLoc = util_1.addExtension(lazyFileLoc, outputExts[0]);
        }
        else {
            lazyFileLoc = util_1.replaceExtension(lazyFileLoc, inputExt, outputExts[0]);
        }
    }
    return file_urls_1.getUrlForFile(lazyFileLoc, config);
}
/**
 * Create a import resolver function, which converts any import relative to the given file at "fileLoc"
 * to a proper URL. Returns false if no matching import was found, which usually indicates a package
 * not found in the import map.
 */
function createImportResolver({ fileLoc, config }) {
    return function importResolver(spec) {
        var _a;
        // Ignore "http://*" imports
        if (util_1.isRemoteUrl(spec)) {
            return spec;
        }
        // Ignore packages marked as external
        if ((_a = config.packageOptions.external) === null || _a === void 0 ? void 0 : _a.includes(spec)) {
            return spec;
        }
        if (spec.startsWith('/')) {
            return spec;
        }
        if (spec.startsWith('./') || spec.startsWith('../')) {
            const importedFileLoc = path_1.default.resolve(path_1.default.dirname(fileLoc), spec);
            return resolveSourceSpecifier(importedFileLoc, config) || spec;
        }
        const aliasEntry = util_1.findMatchingAliasEntry(config, spec);
        if (aliasEntry && (aliasEntry.type === 'path' || aliasEntry.type === 'url')) {
            const { from, to } = aliasEntry;
            let result = spec.replace(from, to);
            if (aliasEntry.type === 'url') {
                return result;
            }
            const importedFileLoc = path_1.default.resolve(config.root, result);
            return resolveSourceSpecifier(importedFileLoc, config) || spec;
        }
        return false;
    };
}
exports.createImportResolver = createImportResolver;

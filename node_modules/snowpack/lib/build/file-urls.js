"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUrlForFile = exports.getMountEntryForFile = exports.getUrlForFileMount = void 0;
const path_1 = __importDefault(require("path"));
const util_1 = require("../util");
/**
 * Map a file path to the hosted URL for a given "mount" entry.
 */
function getUrlForFileMount({ fileLoc, mountKey, mountEntry, config, }) {
    const fileName = path_1.default.basename(fileLoc);
    const resolvedDirUrl = mountEntry.url === '/' ? '' : mountEntry.url;
    const mountedUrl = fileLoc.replace(mountKey, resolvedDirUrl).replace(/[/\\]+/g, '/');
    if (mountEntry.static) {
        return mountedUrl;
    }
    const extensionMatch = util_1.getExtensionMatch(fileName, config._extensionMap);
    if (!extensionMatch) {
        return mountedUrl;
    }
    const [inputExt, outputExts] = extensionMatch;
    if (outputExts.length > 1) {
        return util_1.addExtension(mountedUrl, outputExts[0]);
    }
    else {
        return util_1.replaceExtension(mountedUrl, inputExt, outputExts[0]);
    }
}
exports.getUrlForFileMount = getUrlForFileMount;
/**
 * Get the final, hosted URL path for a given file on disk.
 */
function getMountEntryForFile(fileLoc, config) {
    // PERF: Use `for...in` here instead of the slower `Object.entries()` method
    // that we use everywhere else, since this function can get called 100s of
    // times during a build.
    for (const mountKey in config.mount) {
        if (!config.mount.hasOwnProperty(mountKey)) {
            continue;
        }
        if (!fileLoc.startsWith(mountKey + path_1.default.sep)) {
            continue;
        }
        return [mountKey, config.mount[mountKey]];
    }
    return null;
}
exports.getMountEntryForFile = getMountEntryForFile;
/**
 * Get the final, hosted URL path for a given file on disk.
 */
function getUrlForFile(fileLoc, config) {
    const mountEntryResult = getMountEntryForFile(fileLoc, config);
    if (!mountEntryResult) {
        return null;
    }
    const [mountKey, mountEntry] = mountEntryResult;
    return getUrlForFileMount({ fileLoc, mountKey, mountEntry, config });
}
exports.getUrlForFile = getUrlForFile;

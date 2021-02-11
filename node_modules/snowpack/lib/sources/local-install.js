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
exports.run = void 0;
const esinstall_1 = require("esinstall");
const colors = __importStar(require("kleur/colors"));
const perf_hooks_1 = require("perf_hooks");
const util_1 = __importDefault(require("util"));
const logger_1 = require("../logger");
async function run({ config, installOptions, installTargets, shouldPrintStats, }) {
    if (installTargets.length === 0) {
        return {
            importMap: { imports: {} },
            newLockfile: null,
            stats: null,
        };
    }
    // start
    const installStart = perf_hooks_1.performance.now();
    logger_1.logger.info(colors.yellow('! building dependencies...'));
    let newLockfile = null;
    const finalResult = await esinstall_1.install(installTargets, {
        cwd: config.root,
        importMap: newLockfile || undefined,
        alias: config.alias,
        logger: {
            debug: (...args) => logger_1.logger.debug(util_1.default.format(...args)),
            log: (...args) => logger_1.logger.info(util_1.default.format(...args)),
            warn: (...args) => logger_1.logger.warn(util_1.default.format(...args)),
            error: (...args) => logger_1.logger.error(util_1.default.format(...args)),
        },
        ...installOptions,
    });
    logger_1.logger.debug('Successfully ran esinstall.');
    // finish
    const installEnd = perf_hooks_1.performance.now();
    logger_1.logger.info(`${colors.green(`✔`) + ' dependencies ready!'} ${colors.dim(`[${((installEnd - installStart) / 1000).toFixed(2)}s]`)}`);
    if (shouldPrintStats && finalResult.stats) {
        logger_1.logger.info(esinstall_1.printStats(finalResult.stats));
    }
    return {
        importMap: finalResult.importMap,
        newLockfile,
        stats: finalResult.stats,
    };
}
exports.run = run;

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
exports.paintDashboard = exports.getServerInfoMessage = exports.getPort = exports.paintEvent = void 0;
const detect_port_1 = __importDefault(require("detect-port"));
const colors = __importStar(require("kleur/colors"));
const path_1 = __importDefault(require("path"));
const readline_1 = __importDefault(require("readline"));
const logger_1 = require("../logger");
const IS_FILE_CHANGED_MESSAGE = /File changed\.\.\./;
/** Convert a logger's history into the proper dev console format. */
function summarizeHistory(history) {
    // Note: history array can get long over time. Performance matters here!
    return history.reduce((historyString, record) => {
        let line;
        // We want to summarize common repeat "file changed" events to reduce noise.
        // All other logs should be included verbatim, with all repeats added.
        if (record.count === 1) {
            line = record.val;
        }
        else if (IS_FILE_CHANGED_MESSAGE.test(record.val)) {
            line = record.val + colors.green(` [x${record.count}]`);
        }
        else {
            line = Array(record.count).fill(record.val).join('\n');
        }
        // Note: this includes an extra '\n' character at the start.
        // Fine for our use-case, but be aware.
        return historyString + '\n' + line;
    }, '');
}
exports.paintEvent = {
    BUILD_FILE: 'BUILD_FILE',
    LOAD_ERROR: 'LOAD_ERROR',
    SERVER_START: 'SERVER_START',
    WORKER_COMPLETE: 'WORKER_COMPLETE',
    WORKER_MSG: 'WORKER_MSG',
    WORKER_RESET: 'WORKER_RESET',
};
/**
 * Get the actual port, based on the `defaultPort`.
 * If the default port was not available, then we'll prompt the user if its okay
 * to use the next available port.
 */
async function getPort(defaultPort) {
    const bestAvailablePort = await detect_port_1.default(defaultPort);
    if (defaultPort !== bestAvailablePort) {
        let useNextPort = false;
        if (process.stdout.isTTY) {
            const rl = readline_1.default.createInterface({ input: process.stdin, output: process.stdout });
            useNextPort = await new Promise((resolve) => {
                rl.question(colors.yellow(`! Port ${colors.bold(defaultPort)} not available. Run on port ${colors.bold(bestAvailablePort)} instead? (Y/n) `), (answer) => {
                    resolve(!/^no?$/i.test(answer));
                });
            });
            rl.close();
        }
        if (!useNextPort) {
            logger_1.logger.error(`✘ Port ${colors.bold(defaultPort)} not available. Use ${colors.bold('--port')} to specify a different port.`);
            process.exit(1);
        }
    }
    return bestAvailablePort;
}
exports.getPort = getPort;
function getServerInfoMessage({ startTimeMs, port, protocol, hostname, remoteIp }, isBuilding = false) {
    let output = '';
    const isServerStarted = startTimeMs > 0 && port > 0 && protocol;
    if (isServerStarted) {
        output += `  ${colors.bold(colors.cyan(`${protocol}//${hostname}:${port}`))}`;
        if (remoteIp) {
            output += `${colors.cyan(` • `)}${colors.bold(colors.cyan(`${protocol}//${remoteIp}:${port}`))}`;
        }
        output += '\n';
        output += colors.dim(
        // Not to hide slow startup times, but likely there were extraneous factors (prompts, etc.) where the speed isn’t accurate
        startTimeMs < 1000 ? `  Server started in ${startTimeMs}ms.` : `  Server started.`);
        if (isBuilding) {
            output += colors.dim(` Building...`);
        }
        output += '\n\n';
    }
    else {
        output += colors.dim(`  Server starting…`) + '\n\n';
    }
    return output;
}
exports.getServerInfoMessage = getServerInfoMessage;
const WORKER_BASE_STATE = { done: false, error: null, output: '' };
function paintDashboard(bus, config) {
    let serverInfo;
    const allWorkerStates = {};
    const allFileBuilds = new Set();
    for (const plugin of config.plugins.map((p) => p.name)) {
        allWorkerStates[plugin] = { ...WORKER_BASE_STATE };
    }
    function setupWorker(id) {
        if (!allWorkerStates[id]) {
            allWorkerStates[id] = { ...WORKER_BASE_STATE };
        }
    }
    function repaint() {
        // Clear Page
        process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');
        // Header
        process.stdout.write(`${colors.bold(`snowpack`)}\n\n`);
        // Server Stats
        serverInfo && process.stdout.write(getServerInfoMessage(serverInfo, allFileBuilds.size > 0));
        // Console Output
        const history = logger_1.logger.getHistory();
        if (history.length) {
            process.stdout.write(`${colors.underline(colors.bold('▼ Console'))}\n`);
            process.stdout.write(summarizeHistory(history));
            process.stdout.write('\n\n');
        }
        // Worker Dashboards
        for (const [script, workerState] of Object.entries(allWorkerStates)) {
            if (!workerState.output) {
                continue;
            }
            const colorsFn = Array.isArray(workerState.error) ? colors.red : colors.reset;
            process.stdout.write(`${colorsFn(colors.underline(colors.bold('▼ ' + script)))}\n\n`);
            process.stdout.write('  ' + workerState.output.trim().replace(/\n/gm, '\n  '));
            process.stdout.write('\n\n');
        }
    }
    bus.on(exports.paintEvent.BUILD_FILE, ({ id, isBuilding }) => {
        if (isBuilding) {
            allFileBuilds.add(path_1.default.relative(config.root, id));
        }
        else {
            allFileBuilds.delete(path_1.default.relative(config.root, id));
        }
        repaint();
    });
    bus.on(exports.paintEvent.WORKER_MSG, ({ id, msg }) => {
        setupWorker(id);
        allWorkerStates[id].output += msg;
        repaint();
    });
    bus.on(exports.paintEvent.WORKER_COMPLETE, ({ id, error }) => {
        allWorkerStates[id].done = true;
        allWorkerStates[id].error = allWorkerStates[id].error || error;
        repaint();
    });
    bus.on(exports.paintEvent.WORKER_RESET, ({ id }) => {
        allWorkerStates[id] = { ...WORKER_BASE_STATE };
        repaint();
    });
    bus.on(exports.paintEvent.SERVER_START, (info) => {
        serverInfo = info;
        repaint();
    });
    // replace logging behavior with repaint (note: messages are retrieved later, with logger.getHistory())
    logger_1.logger.on('debug', () => {
        repaint();
    });
    logger_1.logger.on('info', () => {
        repaint();
    });
    logger_1.logger.on('warn', () => {
        repaint();
    });
    logger_1.logger.on('error', () => {
        repaint();
    });
    repaint();
}
exports.paintDashboard = paintDashboard;

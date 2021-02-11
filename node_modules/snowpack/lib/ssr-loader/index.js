"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLoader = void 0;
const fs_1 = require("fs");
const url_1 = require("url");
const sourcemaps_1 = require("./sourcemaps");
const transform_1 = require("./transform");
// This function makes it possible to load modules from the snowpack server, for the sake of SSR.
function createLoader({ load }) {
    const cache = new Map();
    const graph = new Map();
    function getModule(importer, imported, urlStack) {
        if (imported[0] === '/' || imported[0] === '.') {
            const pathname = url_1.resolve(importer, imported);
            if (!graph.has(pathname))
                graph.set(pathname, new Set());
            graph.get(pathname).add(importer);
            return _load(pathname, urlStack);
        }
        return Promise.resolve(nodeRequire(imported));
    }
    function invalidateModule(path) {
        cache.delete(path);
        const dependents = graph.get(path);
        graph.delete(path);
        if (dependents)
            dependents.forEach(invalidateModule);
    }
    async function _load(url, urlStack) {
        if (urlStack.includes(url)) {
            console.warn(`Circular dependency: ${urlStack.join(' -> ')} -> ${url}`);
            return {};
        }
        if (cache.has(url)) {
            return cache.get(url);
        }
        const promise = load(url)
            .then((loaded) => initializeModule(url, loaded, urlStack.concat(url)))
            .catch((e) => {
            cache.delete(url);
            throw e;
        });
        cache.set(url, promise);
        return promise;
    }
    async function initializeModule(url, loaded, urlStack) {
        const { code, deps, css, names } = transform_1.transform(loaded.contents);
        const exports = {};
        const allCss = new Set(css.map((relative) => url_1.resolve(url, relative)));
        const args = [
            {
                name: 'global',
                value: global,
            },
            {
                name: 'require',
                value: (id) => {
                    // TODO can/should this restriction be relaxed?
                    throw new Error(`Use import instead of require (attempted to load '${id}' from '${url}')`);
                },
            },
            {
                name: names.exports,
                value: exports,
            },
            {
                name: names.__export,
                value: (name, get) => {
                    Object.defineProperty(exports, name, { get });
                },
            },
            {
                name: names.__export_all,
                value: (mod) => {
                    for (const name in mod) {
                        Object.defineProperty(exports, name, {
                            get: () => mod[name],
                        });
                    }
                },
            },
            {
                name: names.__import,
                value: (source) => getModule(url, source, urlStack).then((mod) => mod.exports),
            },
            {
                name: names.__import_meta,
                value: { url },
            },
            ...(await Promise.all(deps.map(async (dep) => {
                const module = await getModule(url, dep.source, urlStack);
                module.css.forEach((dep) => allCss.add(dep));
                return {
                    name: dep.name,
                    value: module.exports,
                };
            }))),
        ];
        const fn = new Function(...args.map((d) => d.name), `${code}\n//# sourceURL=${url}`);
        try {
            fn(...args.map((d) => d.value));
        }
        catch (e) {
            e.stack = await sourcemaps_1.sourcemap_stacktrace(e.stack, async (address) => {
                if (fs_1.existsSync(address)) {
                    // it's a filepath
                    return fs_1.readFileSync(address, 'utf-8');
                }
                try {
                    const { contents } = await load(address);
                    return contents;
                }
                catch (_a) {
                    // fail gracefully
                }
            });
            throw e;
        }
        return {
            exports,
            css: Array.from(allCss),
        };
    }
    return {
        importModule: async (url) => {
            return _load(url, []);
        },
        invalidateModule: (url) => {
            invalidateModule(url);
        },
    };
}
exports.createLoader = createLoader;
function nodeRequire(source) {
    // mirror Rollup's interop by allowing both of these:
    //  import fs from 'fs';
    //  import { readFileSync } from 'fs';
    return {
        exports: new Proxy(require(source), {
            get(mod, prop) {
                if (prop === 'default')
                    return mod;
                return mod[prop];
            },
        }),
        css: [],
    };
}

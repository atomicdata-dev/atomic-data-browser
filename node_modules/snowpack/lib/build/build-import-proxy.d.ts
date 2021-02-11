/// <reference types="node" />
import { SnowpackConfig } from '../types';
export declare function getMetaUrlPath(urlPath: string, config: SnowpackConfig): string;
export declare function wrapImportMeta({ code, hmr, env, config, }: {
    code: string;
    hmr: boolean;
    env: boolean;
    config: SnowpackConfig;
}): string;
export declare function wrapHtmlResponse({ code, hmr, hmrPort, isDev, config, mode, }: {
    code: string;
    hmr: boolean;
    hmrPort?: number;
    isDev: boolean;
    config: SnowpackConfig;
    mode: 'development' | 'production';
}): string;
export declare function wrapImportProxy({ url, code, hmr, config, }: {
    url: string;
    code: string | Buffer;
    hmr: boolean;
    config: SnowpackConfig;
}): Promise<string>;
export declare function generateEnvModule({ mode, isSSR, }: {
    mode: 'development' | 'production';
    isSSR: boolean;
}): string;

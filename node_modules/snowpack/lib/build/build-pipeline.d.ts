import { SnowpackBuildMap, SnowpackConfig, SnowpackPlugin } from '../types';
export interface BuildFileOptions {
    isDev: boolean;
    isSSR: boolean;
    isHmrEnabled: boolean;
    config: SnowpackConfig;
}
export declare function getInputsFromOutput(fileLoc: string, plugins: SnowpackPlugin[]): string[];
export declare function runPipelineOptimizeStep(buildDirectory: string, { config }: BuildFileOptions): Promise<null>;
export declare function runPipelineCleanupStep({ plugins }: SnowpackConfig): Promise<void>;
/** Core Snowpack file pipeline builder */
export declare function buildFile(srcURL: URL, buildFileOptions: BuildFileOptions): Promise<SnowpackBuildMap>;

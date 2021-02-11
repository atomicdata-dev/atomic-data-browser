import { SnowpackSourceFile } from './types';
export declare function scanCodeImportsExports(code: string): Promise<any[]>;
export declare function transformEsmImports(_code: string, replaceImport: (specifier: string) => string): Promise<string>;
export declare function transformFileImports({ baseExt, contents }: SnowpackSourceFile<string>, replaceImport: (specifier: string) => string): Promise<string>;

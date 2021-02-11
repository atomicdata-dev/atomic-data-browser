/// <reference types="node" />
import fs from 'fs';
import { SnowpackConfig } from '../types';
/** Perform a file disk lookup for the requested import specifier. */
export declare function getFsStat(importedFileOnDisk: string): fs.Stats | false;
/**
 * Create a import resolver function, which converts any import relative to the given file at "fileLoc"
 * to a proper URL. Returns false if no matching import was found, which usually indicates a package
 * not found in the import map.
 */
export declare function createImportResolver({ fileLoc, config }: {
    fileLoc: string;
    config: SnowpackConfig;
}): (spec: string) => string | false;

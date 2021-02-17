/** Returns SNOWPACK_PUBLIC_ prefixed enf variable */
export const getSnowpackEnv = (key: string): string => {
  //@ts-ignore This key does exist
  return import.meta.env['SNOWPACK_PUBLIC_' + key];
};

/** Returns true if this is run in locally, in Development mode */
export function isDev(): boolean {
  //@ts-ignore This key does exist
  return import.meta.env['MODE'] == 'development';
}

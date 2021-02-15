export const getEnv = (key: string): string => {
  //@ts-ignore This key does exist
  return import.meta.env['SNOWPACK_PUBLIC_' + key];
};

/** Returns true if this is run in locally, in Development mode */
export function isDev(): boolean {
  return getEnv('MODE') == 'development';
}

export function isTest(): boolean {
  return getEnv('NODE_ENV') == 'test';
}

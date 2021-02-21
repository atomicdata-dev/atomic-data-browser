import * as __SNOWPACK_ENV__ from './env.js';

export const getSnowpackEnv = (key) => {
  return __SNOWPACK_ENV__["SNOWPACK_PUBLIC_" + key];
};
export function isDev() {
  return __SNOWPACK_ENV__["MODE"] == "development";
}

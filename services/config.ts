/*eslint no-useless-escape: "off"*/
import { execSync } from 'child_process';
import dotenv from 'dotenv';

/**
 * @description Get Package Version
 * @private
 * @returns {string}
 */
const packageVersionGetter = (): string => {
  const version_buffer = execSync(
    `echo $(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]')`,
  );
  return version_buffer ? version_buffer.toString() : '0.0.1';
};

/**
 * @description Get Package Name
 * @private
 * @returns {string}
 */
const packageNameGetter = (): string => {
  const name_buffer = execSync(
    `echo $(cat package.json | grep name | head -1 | awk -F: '{ print $2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]')`,
  );
  return name_buffer ? name_buffer.toString() : 'favoriate-movies';
};

/**
 * @description Get Package Description
 * @private
 * @returns {string}
 */
const packageDescriptionGetter = (): string => {
  const description_buffer = execSync(
    `echo $(cat package.json | grep description | head -1 | awk -F: '{ print $2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]')`,
  );
  return description_buffer
    ? description_buffer.toString()
    : 'favoriate-movies-server';
};

// load config
dotenv.config();

const env = process.env.NODE_ENV || 'development';
const configs = {
  base: {
    ENV: env,
    DEV: env === 'development',
    // Pkg Base
    NAME: packageNameGetter(),
    DESCRIPTION: packageDescriptionGetter(),
    // API
    PREFIX: process.env.APPAPIPREFIX || 'v1',
    VERSION: packageVersionGetter(),
    API_EXPLORER_PATH: process.env.APPAPIEXPLORERPATH || '/api',
    // Server Setting
    HOST: process.env.APPHOST || 'localhost',
    PORT: process.env.APPPORT || 7080,

    JWT: {
      KEY: process.env.JWTKEY || 'lib',
      SECRET: process.env.JWTSECRET || 'lib',
    },

    DB_SETTINGS: {
      host: process.env.DBHOST || 'localhost',
      port: process.env.DBPORT || 5432,
      username: process.env.DBUSERNAME || 'postgres',
      password: process.env.DBPASSWORD || '123',
      database: process.env.DBDATABASE || 'movies',
      schema: process.env.DBSCHEMA || 'public',
      userTable: process.env.DBRATETABLE || 'movies',
    },

    REDIS_URL: process.env.REDIS_URL || "redis://127.0.0.1:6379",
  },
  development: {},
  production: {
    PORT: process.env.APPPORT || 7080,
  },
  test: {
    PORT: 7080,
  },
};

const config = { ...configs.base, ...configs[env] };

export { config };

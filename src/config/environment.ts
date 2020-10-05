export type BotMode = 'publisher' | 'subscriber' | 'pub/sub'

export interface DiscordConfig {
  auth: {
    token: string
  }
}

export interface ElasticSearchConfig {
  host: string,
  auth: {
    username: string,
    password: string
  }
}

export interface BotConfig {
  prefix: string,
  mode: BotMode
}

export interface RapidApiConfig {
  key: string,
  host: string
}

export interface BaseServiceConfig {
  host: string,
  port: number | string,
  auth?: {
    username?: string,
    password?: string
  }
}

export interface Config {
  discord: DiscordConfig,
  es?: ElasticSearchConfig,
  bot: BotConfig,
  rapidApi: {
    wordsApi: RapidApiConfig,
    urbanDictionary: RapidApiConfig
  },
  redis: BaseServiceConfig,
  mongo: BaseServiceConfig,
}

export const environment: Config = function () {
  const env = require("../../config.json");
  env.mode = env.mode || process.env.BOT_MODE || "publisher";
  env.version = process.env.BOT_VERSION || "0.0.0";
  return env;
}();

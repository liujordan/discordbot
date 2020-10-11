import AWS from "aws-sdk";
import {Configuration} from "aws-sdk/clients/appconfig";

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

// export const environment: Config = function () {
//
//   if (appConfig) {
//     return appConfig
//   }
//   const env = require("../../config.json");
//   env.mode = env.mode || process.env.BOT_MODE || "publisher";
//   env.version = process.env.BOT_VERSION || "0.0.0";
//
//   const appconfig = new AWS.AppConfig();
//
//   appconfig.getConfiguration({
//     Application: 'discordbot', /* required */
//     ClientId: 'discordbot-unique-id-haha1', /* required */
//     Configuration: 'base', /* required */
//     Environment: 'dev', /* required */
//     // ClientConfigurationVersion: '1'
//   }, (_, config) => {
//     appConfig = JSON.parse(config.Content.toString())
//     console.log(appConfig)
//   });
//   return env;
// }();

let appConfig: Config;
let appConfigVersion: string;

export const environmentAsync: Promise<Config> = async function () {
  const appconfig = new AWS.AppConfig();

  return new Promise<Configuration>((resolve, reject) => {
    appconfig.getConfiguration({
      Application: 'discordbot',
      ClientId: 'discordbot-unique-id-haha1',
      Configuration: 'base',
      Environment: 'dev',
      ClientConfigurationVersion: appConfigVersion
    }, (err, data) => {
      if (err)
        reject(err);
      resolve(data);
    });
  }).then(config => {
    appConfigVersion = config.ConfigurationVersion;
    if (config.Content.toString().length > 0) {
      appConfig = JSON.parse(config.Content.toString());
    }

    return appConfig;
  })
    .catch(err => {
      throw err;
    });
  // const env = require("../../config.json");
  // env.mode = env.mode || process.env.BOT_MODE || "publisher";
  // env.version = process.env.BOT_VERSION || "0.0.0";
  // return Promise.resolve(env)
}();

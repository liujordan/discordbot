import AWS from 'aws-sdk';
import {Configuration} from "aws-sdk/clients/appconfig";

export type BotMode = 'publisher' | 'subscriber' | 'pub/sub'

export interface DiscordConfig {
  auth: {
    token: string;
  };
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
  topggApi: {
    key: string
  }
}

export interface ConfigProvider {
  getConfig(): Promise<Config>
}

export class JsonConfigProvider implements ConfigProvider {
  getConfig(): Promise<Config> {
    return Promise.resolve(require("../../../config.json"));
  }
}

export class EnvironmentConfigProvider implements ConfigProvider {
  getConfig(): Promise<Config> {
    return null;
  }
}

export class AwsAppConfigProvider implements ConfigProvider {
  appConfig: Config;
  appConfigVersion: string;

  private async fetchConfigurationFromAws(): Promise<Configuration> {
    const appconfig = new AWS.AppConfig();
    return appconfig.getConfiguration({
      Application: 'discordbot',
      ClientId: 'discordbot-unique-id-haha1',
      Configuration: 'base',
      Environment: 'prod',
      ClientConfigurationVersion: this.appConfigVersion
    }).promise()
  }

  async getConfig(): Promise<Config> {
    let config: Configuration = await this.fetchConfigurationFromAws();

    this.appConfigVersion = config.ConfigurationVersion;
    if (config.Content.toString().length > 0) {
      this.appConfig = JSON.parse(config.Content.toString());
    }

    return this.appConfig;
  }
}




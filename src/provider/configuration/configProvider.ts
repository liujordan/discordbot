import AWS from 'aws-sdk';
import AppConfig from "aws-sdk/clients/appconfig";

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
}

export interface ConfigProvider {
  getConfig(): any
}

export class JsonConfigProvider implements ConfigProvider {
  getConfig(): Config {
    return null;
  }
}

export class EnvironmentConfigProvider implements ConfigProvider {
  getConfig(): Config {
    return null;
  }
}

export class AwsAppConfigProvider implements ConfigProvider {
  async getConfig(): Promise<AppConfig.Types.ConfigurationProfile> {
    let config = new AWS.AppConfig({apiVersion: '2019-10-09'});
    let params = {
      ApplicationId: 'discordbot',
      ConfigurationProfileId: 'base' /* required */
    };
    return config.getConfigurationProfile(params).promise();
  }
}

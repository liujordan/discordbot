import {RedisCommand} from "../utils/redisConnector";
import {Channel, Client, TextChannel} from "discord.js";
import winston from "winston";

export interface Command {
  name: string
  helpString: string
  exampleString?: string
  execute: (Client, RedisCommand) => any
}

const logger = winston.loggers.get('commands');

export class BaseCommand implements Command {
  name: string = "DEFAULT";
  helpString: string = "DEFAULT HELP STRING";
  exampleString: string = "";
  bot: Client;

  constructor(bot: Client) {
    this.bot = bot;

  }

  execute(bot: Client, message: RedisCommand) {
    return;
  }

  send(rc: RedisCommand, message): void {
    this.getChannel(rc).then((channel: TextChannel) => {
      channel.send(message).catch(logger.error);
    });
  }

  getChannel(rc: RedisCommand): Promise<Channel> {
    return this.bot.channels.fetch(rc.data.channel_id);
  }
}
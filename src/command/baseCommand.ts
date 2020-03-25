import {RedisCommand} from "../utils/redisConnector";
import {Channel, Client, TextChannel} from "discord.js";
import {Logger} from "winston";
import {getLogger} from "../utils/logger";
import {MongoConnector} from "../mongo/mongoConnector";

export interface Command {
  name: string
  helpString: string
  exampleString?: string
  execute: (RedisCommand) => any
}


export class BaseCommand implements Command {
  name: string = "DEFAULT";
  helpString: string = "DEFAULT HELP STRING";
  exampleString: string = "";
  bot: Client;
  logger: Logger = getLogger('commands');
  mc: MongoConnector;

  constructor(bot: Client, mc: MongoConnector) {
    this.bot = bot;
    this.mc = mc;
  }

  execute(message: RedisCommand) {
    return;
  }

  send(rc: RedisCommand, message): void {
    this.getChannel(rc).then((channel: TextChannel) => {
      channel.send(message).catch(this.logger.error);
    });
  }

  getChannel(rc: RedisCommand): Promise<Channel> {
    return this.bot.channels.fetch(rc.data.channel_id);
  }
}
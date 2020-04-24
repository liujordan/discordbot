import {RedisCommand, RedisService} from "../services/redisService";
import {Client} from "discord.js";
import {Logger} from "winston";
import {getLogger} from "../utils/logger";
import {MongoConnector} from "../mongo/mongoConnector";
import {Service} from "../di/serviceDecorator";
import {DiscordService} from "../services/discordService";
import {MaplestoryApi} from "../services/maplestoryService";

export interface Command {
  name: string
  helpString: string
  exampleString?: string
  execute: (RedisCommand) => any
}

@Service()
export class BaseCommand implements Command {
  name: string = "DEFAULT";
  helpString: string = "DEFAULT HELP STRING";
  exampleString: string = "";
  bot: Client;
  logger: Logger = getLogger('commands');

  constructor(
    public ds: DiscordService,
    public mc: MongoConnector,
    public rs: RedisService,
    public ms: MaplestoryApi
  ) {
    this.bot = ds.client;
  }

  execute(message: RedisCommand) {
    return;
  }

  send(rc: RedisCommand, message): void {
    rc.channel.send(message).catch(this.logger.error);
  }
}

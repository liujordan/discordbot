import {RedisService} from "../services/caching/redisService";
import {Client} from "discord.js";
import {Logger} from "winston";
import {getLogger} from "../utils/logger";
import {Service} from "../di/serviceDecorator";
import {DiscordService} from "../services/discordService";
import {MaplestoryApi} from "../services/maplestoryService";
import {ParsedMessage} from "discord-command-parser";

export interface Command {
  name: string
  helpString: string
  exampleString?: string
  execute: (m: ParsedMessage) => Promise<void>
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
    public rs: RedisService,
    public ms: MaplestoryApi
  ) {
    this.bot = ds.client;
  }

  async execute(message: ParsedMessage): Promise<void> {
    return;
  }

  send(rc: ParsedMessage, message): void {
    rc.message.channel.send(message).catch(this.logger.error);
  }
}

import {BaseCommand} from './baseCommand';
import {logger} from "../utils/logger";
import {RedisCommand} from "../utils/redisConnector";
import {Client, TextChannel} from "discord.js";
import {getChannel} from "../utils/utils";

export class Help extends BaseCommand {
  name = 'help';

  execute(bot: Client, pm: RedisCommand) {
    getChannel(bot, pm).then((channel: TextChannel) => {
      channel.send('`top` is the only command rn').catch(logger.error);
    });
  }
}

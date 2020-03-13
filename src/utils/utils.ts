import {Channel, Client} from "discord.js";
import {RedisCommand} from "./redisConnector";

export function getChannel(bot: Client, rc: RedisCommand): Promise<Channel> {
  return bot.channels.fetch(rc.data.channel_id);
}
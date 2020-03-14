import {BaseCommand} from "./baseCommand";
import {RedisCommand} from "../utils/redisConnector";
import {TextChannel} from "discord.js";
import {getItemCategories} from "../utils/maplestoryApi";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export class Shop extends BaseCommand {

  execute(rc: RedisCommand) {
    this.getChannel(rc).then((channel: TextChannel) => {
      getItemCategories().then(resp => {
        let out = Object.keys(resp.data);
        let cur = resp.data;
        rc.arguments.forEach(arg => {
          arg = capitalizeFirstLetter(arg);
          cur = cur[arg];
          if (cur == null) {
            out = ["No such category"];
            return;
          } else {
            if (Array.isArray(cur)) {
              out = cur.map(i => JSON.stringify(i));
            } else {
              out = Object.keys(cur);
            }
          }
        });
        channel.send(out).catch(this.logger.error);
      });
    });
  }
}
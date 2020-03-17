import {BaseCommand} from "./baseCommand";
import {RedisCommand} from "../utils/redisConnector";
import {MessageEmbed, TextChannel} from "discord.js";
import {IconGridBuilder, MaplestoryApi} from "../utils/maplestoryApi";
import {MongoConnector} from "../utils/mongoConnector";


const ms: MaplestoryApi = MaplestoryApi.getInstance();
const mc: MongoConnector = MongoConnector.getInstance();

export class Inv extends BaseCommand {

  execute(rc: RedisCommand) {
    this.getChannel(rc).then((channel: TextChannel) => {
      mc.getInventory(rc.data.user_id).then(inv => {
        new IconGridBuilder(inv).getBuffer().then(invImage => {
          let embed = new MessageEmbed()
            .attachFiles([{attachment: invImage, name: `${rc.data.user_id}_inv_0.png`}])
            .setImage(`attachment://${rc.data.user_id}_inv_0.png`);
          channel.send(embed).catch(this.logger.error);
        });
      });
    });
  }
}
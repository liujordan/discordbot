import {BaseCommand} from "./baseCommand";
import {RedisCommand} from "../utils/redisConnector";
import {MaplestoryApi} from "../maplestory/maplestoryApi";
import {MongoConnector} from "../mongo/mongoConnector";
import {MessageEmbed} from "discord.js";


const ms: MaplestoryApi = MaplestoryApi.getInstance();
const mc: MongoConnector = MongoConnector.getInstance();

export class Inv extends BaseCommand {

  execute(rc: RedisCommand) {
    rc.user
      .getAvatar()
      .then(a => a.getInventory())
      .then(inv => {
        const page = parseInt(rc.arguments[0]) - 1 || 0;
        switch (rc.arguments.length) {
          case 2:
            if (!/^[0-9]+:[0-9]+$/g.test(rc.arguments[1])) return;
            let coords = rc.arguments[1].split(":");
            let item = inv.getItem(page, parseInt(coords[0]) - 1, parseInt(coords[1]) - 1);
            return item.getEmbed().then(i => rc.channel.send(i));
          default:
            inv.renderPage(page).then(invImage => {
              let embed = new MessageEmbed()
                .attachFiles([{attachment: invImage, name: `${rc.data.user_id}_inv_0.png`}])
                .setImage(`attachment://${rc.data.user_id}_inv_0.png`);
              rc.channel.send(embed).catch(this.logger.error);
            });
        }
      });
  }
}
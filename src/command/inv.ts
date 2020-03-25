import {BaseCommand} from "./baseCommand";
import {RedisCommand} from "../utils/redisConnector";
import {getItem, MaplestoryApi} from "../maplestory/maplestoryApi";
import {MongoConnector} from "../mongo/mongoConnector";
import {AvatarModel} from "../mongo/models/avatar.model";
import {IconGridBuilder} from "../maplestory/iconGridBuilder";
import {MessageEmbed} from "discord.js";


const ms: MaplestoryApi = MaplestoryApi.getInstance();
const mc: MongoConnector = MongoConnector.getInstance();

export class Inv extends BaseCommand {

  execute(rc: RedisCommand) {
    AvatarModel.findOne({user: rc.user._id})
      .then(a => {
        if (a == null) {
          return rc.user.createAvatar();
        }
        return Promise.resolve(a);
      })
      .then(a => {
        let itemsPromises = a.inventory.map(item => {
          console.log(item);
          return getItem(item.item_id);
        });
        Promise.all(itemsPromises).then(inv => {
          new IconGridBuilder(inv).getBuffer().then(invImage => {
            let embed = new MessageEmbed()
              .attachFiles([{attachment: invImage, name: `${rc.data.user_id}_inv_0.png`}])
              .setImage(`attachment://${rc.data.user_id}_inv_0.png`);
            rc.channel.send(embed).catch(this.logger.error);
          });
        });
      });
  }
}
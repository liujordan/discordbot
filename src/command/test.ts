import {environment} from '../config/environment';
import {BaseCommand} from './baseCommand';
import {RedisCommand} from "../utils/redisConnector";
import {MaplestoryApi} from "../maplestory/maplestoryApi";
import {TextChannel} from "discord.js";
import {ItemModel} from "../mongo/models/item.model";
import {AvatarModel} from "../mongo/models/avatar.model";

const ms = MaplestoryApi.getInstance();

export class Test extends BaseCommand {
  name = 'test';
  helpString = 'Defines a word or phrase using the urban dictionary';
  exampleString = `${environment.bot.prefix}define wombo combo`;


  execute(rc: RedisCommand) {
    this.getChannel(rc).then((channel: TextChannel) => {
      let item = new ItemModel({item_id: 1082016, user: rc.user._id}).save();
      let avatar = AvatarModel.findOne({user: rc.user._id});
      Promise.all([item, avatar]).then(results => {
        const a = results[1];
        return a.addItem(results[0]);
      })
        .then(a => {
          channel.send(JSON.stringify(a.inventory));
        });
    });
  }
}

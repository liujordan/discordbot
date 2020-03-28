import {environment} from '../config/environment';
import {BaseCommand} from './baseCommand';
import {RedisCommand} from "../utils/redisConnector";
import {MaplestoryApi} from "../maplestory/maplestoryApi";

const ms = MaplestoryApi.getInstance();

export class Test extends BaseCommand {
  name = 'test';
  helpString = 'Defines a word or phrase using the urban dictionary';
  exampleString = `${environment.bot.prefix}define wombo combo`;


  execute(rc: RedisCommand) {
    // Avatar.findOne({user: rc.user._id}).then(a => {
    //   return a.getInventoryAsItems();
    // }).then((items: MaplestoryItem[]) => {
    //   const mgr = new InventoryManager(items);
    //   rc.channel.send(JSON.stringify(mgr));
    // });
    // // Avatar.findOne({user: rc.user._id})
    // //   .then(a => {
    // //     let i;
    // //     return new Item({item_id: 1082016, user: rc.user._id}).save().then(item => {
    // //       i = item;
    // //       return a.addItem(item);
    // //     }).then(a => {
    // //       return a.setArmor(i);
    // //     }).then(a => {
    // //       return a
    // //         .populate('inventory');
    // //     }).then(a => {
    // //       return a.render();
    // //     });
    // //   }).then(buff => {
    // //   // rc.channel.send("", {files: [{attachment: buff, name: "asdf.png"}]});
    // //   let embed = new MessageEmbed()
    // //     .attachFiles([{attachment: buff, name: "asdf.gif"}])
    // //     .setImage("attachment://asdf.gif");
    // //   rc.channel.send(embed);
    // });

    // this.getChannel(rc).then((channel: TextChannel) => {
    //   let item = new ItemModel({item_id: 1082016, user: rc.user._id}).save();
    //   let avatar = AvatarModel.findOne({user: rc.user._id});
    //   let result;
    //   Promise.all([item, avatar]).then(results => {
    //     result = results;
    //     const a = results[1];
    //     return a.addItem(results[0]);
    //   })
    //     .then(a => {
    //       a.setArmor(result[0]).then(a => {
    //         channel.send(JSON.stringify(a));
    //       });
    //     });
    // });
  }
}

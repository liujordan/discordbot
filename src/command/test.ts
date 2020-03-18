import {environment} from '../config/environment';
import {BaseCommand} from './baseCommand';
import {RedisCommand} from "../utils/redisConnector";
import {getIcon, Item, MaplestoryApi} from "../maplestory/maplestoryApi";
import {TextChannel} from "discord.js";
import Jimp from 'jimp';

const ms = MaplestoryApi.getInstance();

export class Test extends BaseCommand {
  name = 'test';
  helpString = 'Defines a word or phrase using the urban dictionary';
  exampleString = `${environment.bot.prefix}define wombo combo`;


  execute(rc: RedisCommand) {
    this.getChannel(rc).then((channel: TextChannel) => {
      let things = [ms.getItem("3015432"), ms.getItem("3015432")];
      Promise.all<Item>(things).then(results => {
        let morethings: Promise<Jimp>[] = results.map(item => {
          return Jimp.read(getIcon(item));
        });
        Promise.all<Jimp>(morethings).then(results2 => {
          results2.map(r => r.contain(40, 40));
          let c = new Jimp(80, 80);
          let r1 = results2[0];
          let r2 = results2[1];
          c.blit(r1, 0, 0);
          c.blit(r2, 40, 40);
          c.getBuffer('image/png', (err, res) => {
            if (err) console.error(err);
            channel.send("", {files: [{attachment: res}]});
          });
        });
      });
    });
  }
}

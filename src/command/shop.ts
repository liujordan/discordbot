import {BaseCommand} from "./baseCommand";
import {RedisCommand} from "../utils/redisConnector";
import {Message, MessageEmbed, TextChannel} from "discord.js";
import {defaultIconPageCols, defaultIconPageRows, getIcon, Item, MaplestoryApi} from "../maplestory/maplestoryApi";
import Jimp from 'jimp';
import {MongoConnector} from "../utils/mongoConnector";

function capitalizeFirstLetter(str: string) {
  var splitStr = str.split(' ');
  for (var i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(' ');
}

let buy = "✅";
let sell = "🚫";

const ms = MaplestoryApi.getInstance();
const mc = MongoConnector.getInstance();

export class Shop extends BaseCommand {
  exampleString = `%shop setup other chair 1 0:0`;

  doTheThingWithTheMessage(msg: Message, item: Item) {
    msg.react(buy).catch(this.logger.error);
    // msg.react(sell).catch(this.logger.error);

    const filter = (reaction, user) => {
      return [buy, sell].includes(reaction.emoji.name) && !user.bot;
    };
    // let items = ms.getItemsByCategory(overall, cat, subcat);
    // let maxPage = Math.floor(items.length / (cols * rows));
    const collector = msg.createReactionCollector(filter, {max: 1, time: 60000});
    collector.on('collect', (r, u) => {
      if (r.emoji.name == buy) {
        msg.channel.send(`<@${u.id}> bought ${item.description.name}`);
        mc.addToInventory(u.id, item).catch(this.logger.error);
      }
      if (r.emoji.name == sell) msg.channel.send(`<@${u.id}> sold ${item.description.name}`);
      // if (r.emoji.name == "👈") page -= 1;
      // if (r.emoji.name == "👉") page += 1;
      // if (page < 0) {
      //   page += maxPage;
      // }
      // page %= maxPage;
      // ms.getItemIconPageCached(overall, cat, subcat, page).then(buff => {
      //   const embed = new MessageEmbed()
      //     .attachFiles([{attachment: buff, name: `asdf${page}.png`}])
      //     .setImage(`attachment://asdf${page}.png`)
      //     .setDescription(`${page}/${maxPage}`);
      //   msg.edit(embed).catch(this.logger.error);
      // });
    });
  }

  execute(rc: RedisCommand) {
    let idx = 0;
    let x, y;
    this.getChannel(rc).then((channel: TextChannel) => {
      ms.getItemCategories().then(categories => {

        // check each argument is valid
        rc.arguments = rc.arguments.map(capitalizeFirstLetter);

        let out = this.isValid(rc, categories);
        if (out.length > 0) return this.send(rc, out);

        // get the page number
        if (rc.arguments.length >= 4 && /^\d*$/.test(rc.arguments[3])) {
          idx = parseInt(rc.arguments[3]) - 1;
          if (idx < 0) return this.send(rc, "invalid page number");
        }

        let items = ms.getItemsByCategory(rc.arguments[0], rc.arguments[1], rc.arguments[2]);

        // get the x:y coords of the thing
        if (rc.arguments.length >= 5 && /^[0-9]*:[0-9]*$/.test(rc.arguments[4])) {
          let thing = rc.arguments[4].split(":");
          x = parseInt(thing[0]) - 1;
          y = parseInt(thing[1]) - 1;
          if (x < 0 || y < 0) return this.send(rc, "invalid page number");
          ms.getItem(items[idx * defaultIconPageCols * defaultIconPageRows + y * defaultIconPageCols + x].id).then(item => {
            Jimp.read(getIcon(item)).then(jimp => {
              jimp.contain(70, 70).getBuffer("image/png", (err, buff) => {
                let embed = new MessageEmbed()
                  .setTitle(item.description.name)
                  .setDescription(item.description.description)
                  .attachFiles([{attachment: buff, name: `${item.id}.png`}])
                  .setImage(`attachment://${item.id}.png`)
                  .setFooter(`Would you like to buy this?`);
                channel.send(embed)
                  .then(msg => {
                    this.doTheThingWithTheMessage(msg, item);
                  })
                  .catch(this.logger.error);
              });
            });
          });
          return;
        }
        ms.getItemIconPageCached(rc.arguments[0], rc.arguments[1], rc.arguments[2], idx)
          .then(buff => {
            const embed = new MessageEmbed()
              .attachFiles([{attachment: buff, name: `asdf${idx}.png`}])
              .setImage(`attachment://asdf${idx}.png`)
              .setDescription(`${idx + 1}/${Math.ceil(items.length / (defaultIconPageCols * defaultIconPageRows))}`);
            channel.send(embed)
              .then(msg => {
                // this.doTheThingWithTheMessage(msg, ItemCategory.equip, rc.arguments[1], rc.arguments[2], idx);
              })
              .catch(this.logger.error);
          })
          .catch(this.logger.error);
      });
    });
  }

  // stupid. returns a the error string to send if the valid is not valid
  private isValid(rc: RedisCommand, categories: any): string[] {
    let out = Object.keys(categories);
    let cur: any = categories;

    for (let arg of rc.arguments) {
      arg = capitalizeFirstLetter(arg);
      cur = cur[arg];

      if (cur == null) {
        return ["No such category"];
      }


      if (Array.isArray(cur)) {
        // reached second last layer
        out = cur.map(i => i.item1);
        let temp = {};
        cur.forEach(i => {
          temp[i.item1] = {itemLow: i.item2, itemHigh: i.item3};
        });
        cur = temp;
      } else if (cur.itemLow) {
        // reached last layer
        out = [];
        return [];
      } else {
        // reached every other layer above
        out = Object.keys(cur);
      }
    }
    return out;
  }
}
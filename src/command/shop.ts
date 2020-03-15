import {BaseCommand} from "./baseCommand";
import {RedisCommand} from "../utils/redisConnector";
import {Message, TextChannel} from "discord.js";
import {getItemIconLinkById, ItemCategory, MaplestoryApi} from "../utils/maplestoryApi";

function capitalizeFirstLetter(str: string) {
  var splitStr = str.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(' ');
}

const ms = MaplestoryApi.getInstance();

export class Shop extends BaseCommand {
  send2(channel: TextChannel, out: string[], cat: string, subcat: string, args: string[]) {
    // TODO change this to use MessageEmbed instead of options
    let itemIdx = 0;
    if (cat !== "" && subcat !== "") {
      let items = ms.getItemsByCategory(((<any>ItemCategory)[args[0]]), cat, subcat);
      let options = {
        embed: {
          description: `${itemIdx + 1}/${items.length}`,
          image: {
            url: getItemIconLinkById(items[itemIdx].id)
          }
        }
      };
      channel.send("", options).then(msg => this.doTheThingWithTheMessage(msg, items, itemIdx)).catch(console.error);
    } else {
      channel.send(out).catch(console.error);
    }
  }

  doTheThingWithTheMessage(msg: Message, items, itemIdx: number) {
    msg.react("👈").catch(this.logger.error);
    msg.react("👉").catch(this.logger.error);

    const filter = (reaction, user) => {
      return ["👈", "👉"].includes(reaction.emoji.name) && !user.bot;
    };
    const collector = msg.createReactionCollector(filter, {time: 60000});
    collector.on('collect', r => {
      if (r.emoji.name == "👈") itemIdx -= 1;
      if (r.emoji.name == "👉") itemIdx += 1;
      if (itemIdx < 0) {
        itemIdx += items.length;
      }
      itemIdx %= items.length;

      msg.edit("", {
        embed: {
          description: `${itemIdx + 1}/${items.length}`,
          image: {
            url: getItemIconLinkById(items[itemIdx].id)
          }
        }
      });
    });
  }

  execute(rc: RedisCommand) {
    this.getChannel(rc).then((channel: TextChannel) => {
      ms.getItemCategories().then(categories => {
        let out = Object.keys(categories);
        let cur: any = categories;
        let itemid = "";
        let cat: string = "";
        let subCat: string = "";
        rc.arguments.forEach(arg => {
          arg = capitalizeFirstLetter(arg);
          cur = cur[arg];


          if (cur == null) {
            out = ["No such category"];
            return;
          }


          if (Array.isArray(cur)) {
            // reached second last layer
            out = cur.map(i => i.item1);
            let temp = {};
            cur.forEach(i => {
              temp[i.item1] = {itemLow: i.item2, itemHigh: i.item3};
            });
            cur = temp;
            cat = arg;
          } else if (cur.itemLow) {
            // reached last layer
            out = [];
            itemid = cur.itemLow;
            subCat = arg;
            return;
          } else {
            // reached every other layer above
            out = Object.keys(cur);
          }
        });
        this.send2(channel, out, cat, subCat, rc.arguments);
      });
    });
  }
}
import {BaseCommand} from "./baseCommand";
import {RedisCommand} from "../utils/redisConnector";
import {Message, MessageEmbed, TextChannel} from "discord.js";
import {ItemCategory, MaplestoryApi} from "../utils/maplestoryApi";

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
  exampleString = `%shop equip armor glove [1234]`;

  // send2(channel: TextChannel, out: string[], cat: string, subcat: string, args: string[]) {
  //   // TODO change this to use MessageEmbed instead of options
  //   let itemIdx = 0;
  //   if (cat !== "" && subcat !== "") {
  //     let items = ms.getItemsByCategory(((<any>ItemCategory)[args[0]]), cat, subcat);
  //     let options = {
  //       embed: {
  //         description: `${itemIdx + 1}/${items.length}`,
  //         image: {
  //           url: getItemIconLinkById(items[itemIdx].id)
  //         }
  //       }
  //     };
  //     channel.send("", options).then(msg => this.doTheThingWithTheMessage(msg, items, itemIdx)).catch(console.error);
  //   } else {
  //     channel.send(out).catch(console.error);
  //   }
  // }

  doTheThingWithTheMessage(msg: Message, overall, cat, subcat, page: number) {
    msg.react("👈").catch(this.logger.error);
    msg.react("👉").catch(this.logger.error);

    const filter = (reaction, user) => {
      return ["👈", "👉"].includes(reaction.emoji.name) && !user.bot;
    };
    let items = ms.getItemsByCategory(overall, cat, subcat);
    let maxPage = Math.ceil(items.length / (ms.cols * ms.rows));
    const collector = msg.createReactionCollector(filter, {time: 60000});
    collector.on('collect', r => {
      if (r.emoji.name == "👈") page -= 1;
      if (r.emoji.name == "👉") page += 1;
      if (page < 0) {
        page += maxPage;
      }
      page %= maxPage;
      ms.getItemIconPageCached(overall, cat, subcat, page).then(buff => {
        const embed = new MessageEmbed()
          .attachFiles([{attachment: buff, name: `asdf${page}.png`}])
          .setImage(`attachment://asdf${page}.png`)
          .setDescription(`${page}/${maxPage}`);
        msg.edit(embed).catch(this.logger.error);
      });
    });
  }

  execute(rc: RedisCommand) {
    let idx = 0;
    this.getChannel(rc).then((channel: TextChannel) => {
      ms.getItemCategories().then(categories => {

        // check each argument is valid
        let out = this.isValid(rc, categories);
        console.log(out);
        if (out.length > 0) return this.send(rc, out);

        // get the page number
        if (rc.arguments.length == 4 && /^\d*$/.test(rc.arguments[3])) {
          idx = parseInt(rc.arguments[3]);
        }
        rc.arguments = rc.arguments.map(capitalizeFirstLetter);
        let items = ms.getItemsByCategory(ItemCategory.equip, rc.arguments[1], rc.arguments[2]);
        ms.getItemIconPageCached(ItemCategory.equip, rc.arguments[1], rc.arguments[2], idx)
          .then(buff => {
            const embed = new MessageEmbed()
              .attachFiles([{attachment: buff, name: `asdf${idx}.png`}])
              .setImage(`attachment://asdf${idx}.png`)
              .setDescription(`${idx}/${Math.ceil(items.length / (ms.cols * ms.rows))}`);
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
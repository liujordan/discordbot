//   owner: IUser['_id'];
import mongoose, {Document, Schema} from "mongoose";
import {IUser} from "./user.model";
import {getIcon, getItem} from "../../maplestory/maplestoryApi";
import {MessageEmbed} from "discord.js";
import Jimp from "jimp";

export const ItemSchema: Schema = new Schema({
  user: {type: Schema.Types.ObjectId, required: true},
  item_id: {type: String, required: true},
  max_upgrades: {type: Number, default: 0},
  used_upgrades: {type: Number, default: 0}
});

export interface IItem extends Document {
  _id: string
  user: IUser['_id'];
  item_id: number
  max_upgrades: number
  used_upgrades: number
  getEmbed: () => Promise<MessageEmbed>
}

ItemSchema.methods.getEmbed = function (): Promise<MessageEmbed> {
  let item;
  return getItem(this.item_id)
    .then(i => {
      item = i;
      return getIcon(i);
    })
    .then(buff => {
      return Jimp.read(buff);
    }).then(jimp => {
      return new Promise((resolve, reject) => {
        jimp.contain(70, 70).getBuffer("image/png", (err, buff) => {
          if (err) return reject(err);
          return resolve(buff);
        });
      });
    }).then((buff: Buffer) => {
      const embed = new MessageEmbed()
        .attachFiles([{attachment: buff, name: `${this.item_id}.png`}])
        .setTitle(`${item.description.name} ${(this.used_upgrades > 0) ? '+' + this.used_upgrades : ''}`)
        .setDescription(`${this.max_upgrades != 0 ? 'Number of upgrades available:' + (this.max_upgrades - this.used_upgrades) + '\n' : ''}`)
        .setImage(`attachment://${this.item_id}.png`);
      return Promise.resolve(embed);
    });
};

export const Item = mongoose.model<IItem>('Item', ItemSchema);

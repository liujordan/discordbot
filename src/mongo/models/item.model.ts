//   owner: IUser['_id'];
import mongoose, {Document, Schema} from "mongoose";
import {IUser} from "./user.model";
import {getIcon, getItem} from "../../maplestory/maplestoryApi";
import {MessageEmbed} from "discord.js";
import Jimp from "jimp";

export const ItemSchema: Schema = new Schema({
  user: {type: Schema.Types.ObjectId, required: false},
  appearance_id: {type: String, required: true},
  max_upgrades: {type: Number, default: 0},
  used_upgrades: {type: Number, default: 0},
  m_att: {type: Number, default: 0},
  w_att: {type: Number, default: 0},
  str: {type: Number, default: 0},
  dex: {type: Number, default: 0},
  int: {type: Number, default: 0},
  luk: {type: Number, default: 0},
  def: {type: Number, default: 0},
  m_def: {type: Number, default: 0},
  res: {type: Number, default: 0},
});

export interface IItem extends Document {
  _id: string
  user: IUser['_id'];
  appearance_id: number
  max_upgrades: number
  used_upgrades: number
  getEmbed: () => Promise<MessageEmbed>
  w_att: number
  m_att: number
  str: number
  dex: number
  int: number
  luk: number
  def: number
  m_def: number
  res: number
}

ItemSchema.methods.getEmbed = function (): Promise<MessageEmbed> {
  let item;
  return getItem(this.appearance_id)
    .then(i => {
      item = i;
      return getIcon(i);
    }).then(buff => {
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
        .attachFiles([{attachment: buff, name: `${this.appearance_id}.png`}])
        .setTitle(`${item.description.name} ${(this.used_upgrades > 0) ? '+' + this.used_upgrades : ''}`)
        .setDescription(`${this.max_upgrades != 0 ? 'Number of upgrades available:' + (this.max_upgrades - this.used_upgrades) + '\n' : ''}`)
        .setImage(`attachment://${this.appearance_id}.png`);
      return Promise.resolve(embed);
    });
};

export const Item = mongoose.model<IItem>('Item', ItemSchema);

//   owner: IUser['_id'];
import mongoose, {Document, Schema} from "mongoose";
import {IUser} from "./user.model";
import {IItem, ItemSchema} from "./item.model";
import {getLogger} from "../../utils/logger";
import {getItem} from "../../maplestory/maplestoryApi";

const logger = getLogger("avatar");
const AvatarSchema: Schema = new Schema({
  user: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
  slots: {
    hat: {type: Schema.Types.ObjectId, default: undefined, ref: 'Item'},
    cape: {type: Schema.Types.ObjectId, default: undefined, ref: 'Item'},
    top: {type: Schema.Types.ObjectId, default: undefined, ref: 'Item'},
    glove: {type: Schema.Types.ObjectId, default: undefined, ref: 'Item'},
    overall: {type: Schema.Types.ObjectId, default: undefined, ref: 'Item'},
    bottom: {type: Schema.Types.ObjectId, default: undefined, ref: 'Item'},
    shield: {type: Schema.Types.ObjectId, default: undefined, ref: 'Item'},
    shoes: {type: Schema.Types.ObjectId, default: undefined, ref: 'Item'},
  },
  inventory: [ItemSchema]
});

export interface IAvatar extends Document {
  _id: string
  user: IUser['_id'];
  slots: {
    hat: IItem['_id'];
    cape: IItem['_id'];
    top: IItem['_id'];
    glove: IItem['_id'];
    overall: IItem['_id'];
    bottom: IItem['_id'];
    shield: IItem['_id'];
    shoes: IItem['_id'];
  }
  addItem: (IItem) => Promise<IAvatar>;
  inventory: IItem[];
}


AvatarSchema.methods.setArmor = function (characterItem: IItem) {
  getItem(characterItem.item_id).then(item => {
    if (item.typeInfo.category.toLowerCase() != 'armor') {
      return logger.error(`Tried to set non-armour item ${item.id} as armour`);
    }
    this.slots[item.typeInfo.subCategory] = characterItem._id;
    this.save();
  });
};

AvatarSchema.methods.addItem = function (i: IItem): Promise<IAvatar> {
  this.inventory.push(i);
  return this.save();
};

export const AvatarModel = mongoose.model<IAvatar>('AvatarModel', AvatarSchema);

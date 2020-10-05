//   owner: IUser['_id'];
import mongoose, {Document, Schema} from "mongoose";
import deepPopulate from 'mongoose-deep-populate';
import {IUser} from "./user.model";
import {IItem, Item} from "./item.model";
import {getLogger} from "../../utils/logger";
import {getItem} from "../../maplestory/maplestoryApi";
import encodeurl from 'encodeurl';
import axios from 'axios';
import {MaplestoryItem} from "../../maplestory/maplestoryItem";
import {InventoryManager} from "../../maplestory/inventoryManager";

const logger = getLogger("avatar");
const AvatarSchema: Schema = new Schema({
  user: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
  skinId: {type: Schema.Types.String, required: true, ref: 'User', default: 2012},
  slots: {
    hat: {type: Schema.Types.ObjectId, required: false, ref: 'Item'},
    cape: {type: Schema.Types.ObjectId, required: false, ref: 'Item'},
    top: {type: Schema.Types.ObjectId, required: false, ref: 'Item'},
    glove: {type: Schema.Types.ObjectId, required: false, ref: 'Item'},
    overall: {type: Schema.Types.ObjectId, required: false, ref: 'Item'},
    bottom: {type: Schema.Types.ObjectId, required: false, ref: 'Item'},
    shield: {type: Schema.Types.ObjectId, required: false, ref: 'Item'},
    shoes: {type: Schema.Types.ObjectId, required: false, ref: 'Item'},
  },
  cashSlots: {
    hat: {type: Schema.Types.ObjectId, required: false, ref: 'Item'},
    cape: {type: Schema.Types.ObjectId, required: false, ref: 'Item'},
    top: {type: Schema.Types.ObjectId, required: false, ref: 'Item'},
    glove: {type: Schema.Types.ObjectId, required: false, ref: 'Item'},
    overall: {type: Schema.Types.ObjectId, required: false, ref: 'Item'},
    bottom: {type: Schema.Types.ObjectId, required: false, ref: 'Item'},
    shield: {type: Schema.Types.ObjectId, required: false, ref: 'Item'},
    shoes: {type: Schema.Types.ObjectId, required: false, ref: 'Item'},
  },
  inventory: [{type: Schema.Types.ObjectId, ref: 'Item'}]
});
AvatarSchema.plugin(deepPopulate(mongoose));
const slotNames = ['hat', 'cape', 'top', 'glove', 'overall', 'bottom', 'shield', 'shoes'];

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
  },
  cashSlots: {
    hat: IItem['_id'];
    cape: IItem['_id'];
    top: IItem['_id'];
    glove: IItem['_id'];
    overall: IItem['_id'];
    bottom: IItem['_id'];
    shield: IItem['_id'];
    shoes: IItem['_id'];
  }
  skinId: string;
  addItem: (IItem) => Promise<IAvatar>;
  setArmor: (IItem) => Promise<IAvatar>;
  render: () => Promise<Buffer>
  inventory: IItem['_id'][] | IItem[];
  getInventoryAsItems: () => Promise<MaplestoryItem[]>
  getInventory: () => Promise<InventoryManager>
}


AvatarSchema.methods.setArmor = function (characterItem: IItem): Promise<IAvatar> {
  return getItem(characterItem.appearance_id)
    .then(item => {
      if (item.typeInfo.category.toLowerCase() != 'armor') {
        logger.error(`Tried to set non-armour item ${item.id} as armour`);
        return Promise.resolve(this);
      }
      this.slots[item.typeInfo.subCategory.toLowerCase()] = characterItem._id;
      return this;
    });
};

AvatarSchema.methods.addItem = function (i: IItem): Promise<IAvatar> {
  this.inventory.push(i);
  return Promise.resolve(this);
};

AvatarSchema.methods.getInventoryAsItems = function (): Promise<MaplestoryItem[]> {
  return this
    .deepPopulate('inventory')
    .then((a: IAvatar) => {
      return Promise.all((a.inventory as IItem[]).map(i => getItem(i.appearance_id)));
    });
};

AvatarSchema.methods.render = function (): Promise<Buffer> {
  let itemIds = [];
  // let itemIds = [12000, 2000, 20038];
  let fuck = [];
  for (let category of slotNames) {
    if (this.slots.hasOwnProperty(category)) {
      if (this.slots[category] == null) {
        continue;
      }
      fuck.push(this.slots[category]);
    }
  }
  let fuck2 = fuck.map(i => Item.findOne({_id: i}));
  return Promise.all(fuck2).then(shit => {
    shit.forEach(i => {
      itemIds.push(i.appearance_id);
    });
    let out = [];
    itemIds.forEach(id => {
      out.push(`{"itemid": "${id}", "version": "${'211.1.0'}"}`);
    });
    const url = `https://maplestory.io/api/gms/211.1.0/character/${this.skinId}/${encodeurl(out.join(','))}/stand1/`;
    console.log(url)
    // const url = 'https://maplestory.io/api/character/' + encodeurl(out.join(',')) + '/stand1/animated?showears=false&showLefEars=false&showHighLefEars=undefined&resize=1&name=&flipX=undefined';
    return axios.get(url, {responseType: 'arraybuffer'}).then(resp => {
      return Buffer.from(resp.data, 'binary');
    });
  });
};

AvatarSchema.methods.getInventory = function (): Promise<InventoryManager> {
  return this.deepPopulate('inventory')
    .then(i => new InventoryManager(this.inventory));
};

export const Avatar = mongoose.model<IAvatar>('Avatar', AvatarSchema);

//   owner: IUser['_id'];
import mongoose, {Document, Schema} from "mongoose";
import {IUser} from "./user.model";

export const ItemSchema: Schema = new Schema({
  user: {type: Schema.Types.ObjectId, required: true},
  item_id: {type: String, required: true}
});

export interface IItem extends Document {
  _id: string
  user: IUser['_id'];
  item_id: number
}

export const ItemModel = mongoose.model<IItem>('ItemModel', ItemSchema);

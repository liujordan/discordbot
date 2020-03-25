import mongoose, {Document, Schema} from "mongoose";
import {AvatarModel, IAvatar} from "./avatar.model";

const UserSchema: Schema = new Schema({
  discord_id: {type: String, required: true}
});

export interface IUser extends Document {
  _id: string
  discord_id: string
  createAvatar: () => Promise<IAvatar>
}

UserSchema.methods.createAvatar = function (): Promise<IAvatar> {
  return new AvatarModel({user: this._id}).save();
};
export const User = mongoose.model<IUser>('User', UserSchema);

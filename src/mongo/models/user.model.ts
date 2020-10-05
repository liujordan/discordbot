import mongoose, {Document, Schema} from "mongoose";
import {Avatar, IAvatar} from "./avatar.model";

const UserSchema: Schema = new Schema({
  discord_id: {type: String, required: true}
});

export interface IUser extends Document {
  _id: string
  discord_id: string
  createAvatar: () => Promise<IAvatar>
  getAvatar: () => Promise<IAvatar>
}

UserSchema.methods.createAvatar = function (): Promise<IAvatar> {
  return new Avatar({user: this._id}).save();
};

UserSchema.methods.getAvatar = function (): Promise<IAvatar> {
  return Avatar
    .findOne({user: this._id})
    .then(a => {
      if (a == null) {
        return new Avatar({user: this._id}).save();
      }
      return Promise.resolve(a);
    });
};
export const User = mongoose.model<IUser>('User', UserSchema);

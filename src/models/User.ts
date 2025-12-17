
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  stripeCustomerId?: string;
  premium: boolean;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  stripeCustomerId: { type: String },
  premium: { type: Boolean, default: false },
});

export const User = mongoose.model<IUser>("User", UserSchema);
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  premium: boolean;
  stripeCustomerId: string;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  premium: { type: Boolean, default: false },
  stripeCustomerId: { type: String, required: true }
});

export default mongoose.model<IUser>("User", UserSchema);
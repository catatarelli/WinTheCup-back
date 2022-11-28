import { model, Schema } from "mongoose";
import type { InferSchemaType } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

const User = model("User", userSchema, "users");

export type UserStructure = InferSchemaType<typeof userSchema>;

export default User;

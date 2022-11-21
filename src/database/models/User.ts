import { model, Schema } from "mongoose";

// eslint-disable-next-line @typescript-eslint/naming-convention
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 4,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

// eslint-disable-next-line @typescript-eslint/naming-convention
const User = model("User", UserSchema, "users");

export default User;

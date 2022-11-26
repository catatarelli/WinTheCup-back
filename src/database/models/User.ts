import { model, Schema } from "mongoose";

const predictionSchema = new Schema({
  match: {
    type: String,
  },
  goalsTeam1: {
    type: Number,
  },
  goalsTeam2: {
    type: Number,
  },
  redCards: {
    type: Number,
  },
  yellowCards: {
    type: Number,
  },
  penalties: {
    type: Number,
  },
  picture: {
    type: String,
  },
  backupPicure: {
    type: String,
  },
});

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
  predictions: [predictionSchema],
});

const User = model("User", userSchema, "users");

export default User;

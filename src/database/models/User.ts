import mongoose, { model, Schema } from "mongoose";
import type { InferSchemaType } from "mongoose";

const predictionSchema = new Schema({
  match: {
    type: String,
    unique: true,
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
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
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

export type PredictionStructure = InferSchemaType<typeof predictionSchema>;
export type UserStructure = InferSchemaType<typeof userSchema>;

export default User;

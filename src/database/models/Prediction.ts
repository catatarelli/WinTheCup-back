import { model, Schema } from "mongoose";
import type { InferSchemaType } from "mongoose";

const predictionSchema = new Schema({
  match: {
    type: String,
    unique: true,
    required: true,
  },
  goalsTeam1: {
    type: Number,
    required: true,
  },
  goalsTeam2: {
    type: Number,
    required: true,
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
  backupPicture: {
    type: String,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Prediction = model("Prediction", predictionSchema, "predictions");

export type PredictionStructure = InferSchemaType<typeof predictionSchema>;

export default Prediction;

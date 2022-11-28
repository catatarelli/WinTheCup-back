import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import mongoose from "mongoose";
import type { PredictionStructure } from "../database/models/Prediction";

const predictionFactory = Factory.define<PredictionStructure>(() => ({
  match: "Argentina vs England",
  goalsTeam1: faker.datatype.number(9),
  goalsTeam2: faker.datatype.number(9),
  redCards: faker.datatype.number(9),
  yellowCards: faker.datatype.number(9),
  penalties: faker.datatype.number(9),
  picture: faker.image.sports(),
  backupPicure: faker.image.sports(),
  createdBy: new mongoose.Types.ObjectId(),
}));

export const getRandomPrediction = () => predictionFactory.build();

export const getRandomPredictionsList = (number: number) =>
  predictionFactory.buildList(number);

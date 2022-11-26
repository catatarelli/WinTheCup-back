import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import type { PredictionStructure } from "../database/models/User";

const predictionFactory = Factory.define<PredictionStructure>(() => ({
  match: "Argentina vs England",
  goalsTeam1: faker.datatype.number(),
  goalsTeam2: faker.datatype.number(),
  redCards: faker.datatype.number(),
  yellowCards: faker.datatype.number(),
  penalties: faker.datatype.number(),
  picture: faker.image.sports(),
  backupPicure: faker.image.sports(),
}));

export const getRandomPredictionsList = (number: number) =>
  predictionFactory.buildList(number);

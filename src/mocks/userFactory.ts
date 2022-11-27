import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import type { UserStructure } from "../database/models/User";
import mongoose from "mongoose";
import { getRandomPredictionsList } from "./predictionsFactory";

const usersFactory = Factory.define<UserStructure>(() => ({
  _id: new mongoose.Types.ObjectId(),
  username: faker.internet.userName(),
  password: faker.internet.password(),
  email: faker.internet.email(),
  predictions: new mongoose.Types.DocumentArray(getRandomPredictionsList(2)),
}));

export const getRandomUser = () => usersFactory.build();

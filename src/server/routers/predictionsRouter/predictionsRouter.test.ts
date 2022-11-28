/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { secretWord } from "../../../loadEnvironments.js";
import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectDatabase from "../../../database/connectDatabase.js";
import User from "../../../database/models/User.js";
import type { UserWithId } from "../../../types/types.js";
import app from "../../app.js";
import { getRandomUser } from "../../../mocks/userFactory.js";
import { getRandomPrediction } from "../../../mocks/predictionsFactory.js";
import Prediction from "../../../database/models/Prediction.js";

let server: MongoMemoryServer;

const user = getRandomUser() as UserWithId;
const requestUserToken = jwt.sign(
  { username: user.username, id: user._id.toString() },
  secretWord
);

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDatabase(server.getUri());
});

beforeEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await server.stop();
});

describe("Given a GET /predictions endpoint", () => {
  describe("When it receives a request from a logged in user that is in the database", () => {
    test("Then it should call the response method status with a 200, and a list of predictions of that user", async () => {
      const expectedStatus = 200;

      const response = await request(app)
        .get("/predictions")
        .set("Authorization", `Bearer ${requestUserToken}`)
        .set("Content-Type", "application/json")
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("predictions");
    });
  });

  describe("When it receives a request from a user that is not logged in", () => {
    test("Then it should call the response method status with a 401 and an error", async () => {
      const expectedStatus = 401;

      const response = await request(app)
        .get("/predictions")
        .set("Content-Type", "application/json")
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error");
    });
  });
});

describe("Given a GET /predictions/:predictionId endpoint", () => {
  describe("When it receives a request from a logged in user with existing prediction id", () => {
    test("Then it should call the response method status with a 200, and the prediction", async () => {
      const expectedStatus = 200;

      const prediction = getRandomPrediction();

      const predictionWithOwner = { ...prediction, createdBy: user._id };

      const newPrediction = await Prediction.create(predictionWithOwner);

      const response = await request(app)
        .get(`/predictions/${newPrediction.id}`)
        .set("Authorization", `Bearer ${requestUserToken}`)
        .set("Content-Type", "application/json")
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("match");
    });
  });

  describe("When it receives a request from a logged in user with incorrect prediction id 'abc123'", () => {
    test("Then it should call the response method status with a 400 and an error", async () => {
      const expectedStatus = 400;
      const predictionId = "abc123";

      const response = await request(app)
        .get(`/predictions/${predictionId}`)
        .set("Authorization", `Bearer ${requestUserToken}`)
        .set("Content-Type", "application/json")
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error");
    });
  });
});

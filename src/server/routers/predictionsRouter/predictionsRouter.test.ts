import { secretWord } from "../../../loadEnvironments.js";
import request from "supertest";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectDatabase from "../../../database/connectDatabase.js";
import User from "../../../database/models/User.js";
import type { UserTokenPayload } from "../../../types/types.js";
import app from "../../app.js";

let server: MongoMemoryServer;

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

const registerData = {
  username: "panchito",
  password: "panchito123",
  email: "panchito@gmail.com",
};

describe("Given a GET /predictions endpoint", () => {
  describe("When it receives a request from a logged in user that is in the database with id 'abc123'", () => {
    test("Then it should call the response method status with a 200, and a list of predictions", async () => {
      const expectedStatus = 200;

      const hashedPassword = await bcrypt.hash(registerData.password, 10);

      const newUser = await User.create({
        username: registerData.username,
        password: hashedPassword,
        email: registerData.email,
      });

      const user = await User.findOne({ username: newUser.username });

      const tokenPayload: UserTokenPayload = {
        id: user._id.toString(),
        username: user.username,
      };

      const token = jwt.sign(tokenPayload, secretWord, { expiresIn: "2d" });

      const response = await request(app)
        .get("/predictions")
        .set("Authorization", `Bearer ${token}`)
        .set("Content-Type", "application/json")
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("predictions");
    });
  });

  describe("When it receives a request from a user that is not logged in", () => {
    test("Then it should call the response method status with a 401", async () => {
      const expectedStatus = 401;

      const response = await request(app)
        .get("/predictions")
        .set("Content-Type", "application/json")
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error");
    });
  });
});

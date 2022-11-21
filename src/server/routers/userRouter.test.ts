import "../../loadEnvironments";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectDatabase from "../../database/connectDatabase.js";
import User from "../../database/models/User.js";
import app from "../app.js";

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

describe("Given a POST /user/register endpoint", () => {
  describe("When it receives a request with username 'panchito' password 'panchito123' and email 'panchito@gmail.com'", () => {
    test("Then it should respond with a response status 201, and the new user 'panchito'", async () => {
      const expectedStatus = 201;

      const response = await request(app)
        .post("/users/register/")
        .send(registerData)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("user");
    });
  });

  describe("When it receives a request username 'panchito' and this username exists in the database ", () => {
    test("Then it should respond with a response status 409, and the message 'Error creating a new user'", async () => {
      const expectedStatus = 409;

      await User.create(registerData);

      const response = await request(app)
        .post("/users/register/")
        .send(registerData)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty(
        "error",
        "Error creating a new user"
      );
    });
  });
});

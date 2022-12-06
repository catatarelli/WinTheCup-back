import "../../../loadEnvironments";
import request from "supertest";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectDatabase from "../../../database/connectDatabase";
import User from "../../../database/models/User.js";
import app from "../../app.js";
import { getRandomUser } from "../../../mocks/userFactory";
import type { UserWithId } from "../../../types/types";
import { secretWord } from "../../../loadEnvironments";

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
        .post("/user/register/")
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
        .post("/user/register/")
        .send(registerData)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty(
        "error",
        "Error creating a new user"
      );
    });
  });
});

describe("Given a POST /user/login endpoint", () => {
  const loginData = {
    username: "panchito",
    password: "panchito123",
  };

  describe("When it receives a request with username 'panchito' password 'panchito123' and it exists in the database", () => {
    test("Then it should respond with a response status 200 and the token", async () => {
      const expectedStatus = 200;

      const hashedPassword = await bcrypt.hash(registerData.password, 10);

      await User.create({
        username: registerData.username,
        password: hashedPassword,
        email: registerData.email,
      });

      const response = await request(app)
        .post("/user/login/")
        .send(loginData)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("token");
    });
  });

  describe("When it receives a request with username 'panchito' password 'panchito123' and it doesn't exists in the database", () => {
    test("Then it should respond with a response status 401 and the message 'Wrong credentials'", async () => {
      const expectedStatus = 401;

      const response = await request(app)
        .post("/user/login/")
        .send(loginData)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error", "Wrong credentials");
    });
  });

  describe("When it receives a request with username 'panchito' password 'panchito456' and the password is incorrect", () => {
    test("Then it should respond with a response status 401 and the message 'Wrong credentials'", async () => {
      const expectedStatus = 401;

      const hashedPassword = await bcrypt.hash(registerData.password, 10);

      await User.create({
        username: registerData.username,
        password: hashedPassword,
        email: registerData.email,
      });

      const wrongLoginData = {
        username: "panchito",
        password: "panchito456",
      };

      const response = await request(app)
        .post("/user/login/")
        .send(wrongLoginData)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("error", "Wrong credentials");
    });
  });
});

describe("Given a PATCH /user/update endpoint", () => {
  describe("When it receives a request from user 'panchito' with new email 'panchito@hotmail.com'", () => {
    test("Then it should respond with a response status 200 and the updated user", async () => {
      const expectedStatus = 200;

      const user = getRandomUser() as UserWithId;

      const requestUserToken = jwt.sign(
        { username: user.username, id: user._id.toString() },
        secretWord
      );

      const hashedPassword = await bcrypt.hash(user.password, 10);

      await User.create({
        username: user.username,
        password: hashedPassword,
        email: user.email,
      });

      const updateData = {
        email: "panchito@hotmail.com",
        password: hashedPassword,
      };

      await request(app)
        .patch("/user/update/")
        .set("Authorization", `Bearer ${requestUserToken}`)
        .send(updateData)
        .expect(expectedStatus);
    });
  });
});

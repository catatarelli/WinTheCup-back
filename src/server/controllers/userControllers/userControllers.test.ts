import { secretWord } from "../../../loadEnvironments.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import User from "../../../database/models/User.js";
import { loginUser, registerUser } from "./userControllers.js";
import {
  userMock,
  userMockRegisterData,
  userMockWithId,
} from "../../../mocks/userMocks.js";
import CustomError from "../../../CustomError/CustomError.js";

beforeEach(() => {
  jest.clearAllMocks();
});

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const req: Partial<Request> = {
  body: userMock,
};

const next = jest.fn();

describe("Given a registerUser Controller", () => {
  const req: Partial<Request> = {
    body: userMockRegisterData,
  };

  describe("When it receives a request with username 'paquito', password: 'paquito123', email: 'paquito@gmail.com'", () => {
    test("Then it should call the response method status with a 201, and the json method with the user", async () => {
      const expectedStatus = 201;

      const hashedPassword = await bcrypt.hash(
        userMockRegisterData.password,
        10
      );

      User.create = jest.fn().mockResolvedValue({
        ...userMockRegisterData,
        password: hashedPassword,
      });

      await registerUser(req as Request, res as Response, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("When it receives a request and there is an error", () => {
    test("Then it should call next with a custom Error", async () => {
      User.create = jest.fn().mockRejectedValue(new Error(""));
      await registerUser(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalled();
    });
  });
});

describe("Given a loginUser Controller", () => {
  const newCustomError = new CustomError(
    "Wrong credentials",
    401,
    "Wrong credentials"
  );

  describe("When it receives a request with a username 'paquito' and password 'paquito' that are in the database", () => {
    test("Then it should respond with response status 200, and the json method with the token", async () => {
      const expectedStatus = 200;

      const token = jwt.sign(userMockWithId, secretWord);

      User.findOne = jest.fn().mockResolvedValue(userMockWithId);
      bcrypt.compare = jest.fn().mockResolvedValueOnce(true);
      jwt.sign = jest.fn().mockReturnValueOnce(token);

      await loginUser(req as Request, res as Response, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({ token });
    });
  });

  describe("When it receives username 'pepito' that is not in the database", () => {
    test("Then it should call next with a Custom Error with public message 'Wrong credentials' and response status 401", async () => {
      User.findOne = jest.fn().mockResolvedValue({});

      await loginUser(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(newCustomError);
    });
  });

  describe("When it receives a request with an empty body", () => {
    test("Then it should call next with a Custom Error with public message 'Wrong credentials' and response status 401", async () => {
      User.findOne = jest.fn().mockResolvedValue(null);

      const req: Partial<Request> = {
        body: {},
      };

      await loginUser(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(newCustomError);
    });
  });
});

import "../../../loadEnvironments.js";
import bcrypt from "bcryptjs";
import type { NextFunction, Request, Response } from "express";
import User from "../../../database/models/User.js";
import { registerUser } from "./userControllers.js";
import { userMockRegisterData } from "../../../mocks/userMocks.js";

beforeEach(() => {
  jest.clearAllMocks();
});

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
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

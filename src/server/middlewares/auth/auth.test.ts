import type { Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import CustomError from "../../../CustomError/CustomError";
import type { CustomRequest } from "../../../types/types";
import { auth } from "./auth";

beforeEach(() => {
  jest.clearAllMocks();
});

const next = jest.fn();
const req: Partial<Request> = {};

describe("Given the auth middleware", () => {
  describe("When it receives a request with no authorization header", () => {
    test("Then it should call next with a Custom Error with public message 'Missing token' and response status 401", async () => {
      const expectedError = new CustomError(
        "Authorization header missing",
        401,
        "Missing token"
      );

      req.header = jest.fn().mockReturnValueOnce(undefined);

      auth(req as CustomRequest, null, next as NextFunction);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
  describe("When it receives a request with authorization header 'abc123' and it is not a valid token", () => {
    test("Then it should call next with a Custom Error with public message 'Invalid token' and response status 401", () => {
      const expectedError = new CustomError(
        "Missing Bearer in token",
        401,
        "Invalid token"
      );

      req.header = jest.fn().mockReturnValueOnce("abc123");

      auth(req as CustomRequest, null, next as NextFunction);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a request with authorization header with a valid token", () => {
    test("Then it should add the userId property with the token to the request and call next", () => {
      req.header = jest
        .fn()
        .mockReturnValueOnce(
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWQiOiI2MzZjMGY4MmM4ZTcxM2IwMmQ3NjZiOGYiLCJpYXQiOjE2NjgwMzY3NzQsImV4cCI6MTY2ODIwOTU3NH0.RF-F_4pQ0NpthI3kSVyZMxHcEqiCPcyao7Gyzdbc_9M"
        );
      const userId = new mongoose.Types.ObjectId();
      jwt.verify = jest.fn().mockReturnValueOnce({ id: userId });

      auth(req as CustomRequest, null, next as NextFunction);

      expect(req).toHaveProperty("userId", userId);
      expect(next).toHaveBeenCalled();
    });
  });
});

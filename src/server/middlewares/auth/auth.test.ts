import type { Request, NextFunction } from "express";
import { auth } from "./auth";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import CustomError from "../../../CustomError/CustomError";
import type { CustomRequest } from "../../../types/types";

const req: Partial<Request> = {};

const next = jest.fn();

describe("Given an auth middleware", () => {
  describe("When it receives a request without an authorization header", () => {
    test("Then it should invoke next with and error status 401 and message 'Missing token'", () => {
      const expectedStatus = 401;
      const expectedError = new CustomError(
        "Authorization header missing",
        expectedStatus,
        "Missing token"
      );

      req.header = jest.fn().mockReturnValueOnce(undefined);

      auth(req as CustomRequest, null, next as NextFunction);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a request with an authorization header that doesn't begin with 'Bearer '", () => {
    test("Then it should invoke next with and error status 401 and message 'Missing bearer in Authorization header'", () => {
      const expectedStatus = 401;
      const expectedError = new CustomError(
        "Missing bearer in Authorization header",
        expectedStatus,
        "Missing token"
      );

      req.header = jest.fn().mockReturnValueOnce("1234");

      auth(req as CustomRequest, null, next as NextFunction);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a request with an authorization header 'Bearer ' and a valid token", () => {
    test("Then it should add the userId property and the token to the request and invoke next", () => {
      req.header = jest
        .fn()
        .mockReturnValueOnce(
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1pcmVpYTQiLCJpZCI6IjYzNmZjMzZjY2IxMDFhM2NkNGJlZGQ4YSIsImlhdCI6MTY2ODI2OTE3OSwiZXhwIjoxNjY4NDQxOTc5fQ.n1WpQo6lzeGiJpfngUzr86iO55218EvdpUAIRSThbUE"
        );
      const userId = new mongoose.Types.ObjectId();
      jwt.verify = jest.fn().mockReturnValueOnce({ id: userId });

      auth(req as CustomRequest, null, next as NextFunction);

      expect(next).toHaveBeenCalled();
      expect(req).toHaveProperty("userId", userId);
    });
  });
});

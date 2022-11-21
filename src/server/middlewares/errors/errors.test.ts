import type { Response } from "express";
import CustomError from "../../../CustomError/CustomError";
import CustomErrorExpressTest from "../../../CustomError/CutomErrorExpressTest";
import { generalError, unknownEndpoint } from "./errors";

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next = jest.fn();

describe("Given an errors middleware", () => {
  describe("And the function generalError", () => {
    describe("When it receives a response with customError and a status 500", () => {
      test("Then it should call the response method status with 500", () => {
        const error = new CustomError("", 500, "General Error");

        const expectedStatus = 500;

        generalError(error, null, res as Response, null);

        expect(res.status).toHaveBeenCalledWith(expectedStatus);
      });
    });

    describe("When it receives a response with customError and a publicMessage 'General Error' ", () => {
      test("Then it should return the method json with the message received", () => {
        const error = new CustomError("", 300, "General Error");

        const expectedMessage = "General Error";

        generalError(error, null, res as Response, null);

        expect(res.json).toHaveBeenCalledWith({ error: expectedMessage });
      });
    });

    describe("When it receives a response with customError and no status", () => {
      test("Then it should return the status 500", () => {
        const error = new Error("");

        const expectedStatus = 500;

        generalError(error as CustomError, null, res as Response, null);

        expect(res.status).toHaveBeenCalledWith(expectedStatus);
      });
    });

    describe("When it receives a response and a customError with no message", () => {
      test("Then it should return the method json with the public message 'Something went wrong, try again later'", () => {
        const error = new Error("");

        const expectedMessage = "Something went wrong, try again later";

        generalError(error as CustomError, null, res as Response, null);

        expect(res.json).toHaveBeenCalledWith({ error: expectedMessage });
      });
    });

    describe("When it receives a response with a validation error", () => {
      test("Then call the response method json with 'Wrong data' message", () => {
        const error = new CustomErrorExpressTest(400, "", "");
        error.details.body[0] = {
          message: "Hola a todos <3",
          name: "ValidationError",
          isJoi: true,
          details: [],
          annotate: jest.fn(),
          _original: "",
        };
        const expectedPublicMessage = "Wrong data";

        generalError(error, null, res as Response, next);

        expect(res.json).toHaveBeenCalledWith({
          error: expectedPublicMessage,
        });
      });
    });
  });

  describe("And the function unknownEndpoint", () => {
    describe("When it receives a response", () => {
      test("Then it should call the response method status with 404", () => {
        const expectedStatus = 404;

        unknownEndpoint(null, res as Response);

        expect(res.status).toHaveBeenCalledWith(expectedStatus);
      });

      test("Then it should return the method json with the message 'Unknown endpoint'", () => {
        const expectedMessage = { message: "Unknown endpoint" };

        res.json = jest.fn().mockReturnValue(expectedMessage);

        unknownEndpoint(null, res as Response);

        expect(res.json).toHaveBeenCalledWith(expectedMessage);
      });
    });
  });
});

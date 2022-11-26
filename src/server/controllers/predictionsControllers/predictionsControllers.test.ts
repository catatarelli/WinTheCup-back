import type { Response, NextFunction } from "express";
import CustomError from "../../../CustomError/CustomError";
import User from "../../../database/models/User";
import { getRandomPredictionsList } from "../../../mocks/predictionsFactory";
import type { CustomRequest } from "../../../types/types";
import { getPredictions } from "./predictionsControllers";

beforeEach(() => {
  jest.clearAllMocks();
});

const req: Partial<CustomRequest> = {
  userId: "54321",
};

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next = jest.fn();

describe("Given a getPredictions controller", () => {
  describe("When it receives request with id '54321'", () => {
    test("Then it should call the response method status with a 200 and json with a list of predictions of user '54321'", async () => {
      const expectedStatus = 200;

      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue(getRandomPredictionsList(2)),
      });

      await getPredictions(req as CustomRequest, res as Response, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
  });

  describe("When it receives a request and User.findById rejects", () => {
    test("Then next should be called with an error", async () => {
      const customError = new CustomError(
        "",
        500,
        "Database doesn't work, try again later"
      );

      const error = new Error();

      User.findById = jest.fn().mockRejectedValue(error);

      await getPredictions(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(customError);
    });
  });
});

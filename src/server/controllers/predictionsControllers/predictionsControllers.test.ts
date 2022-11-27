import type { NextFunction, Response } from "express";
import CustomError from "../../../CustomError/CustomError";
import User from "../../../database/models/User";
import {
  getRandomPrediction,
  getRandomPredictionsList,
} from "../../../mocks/predictionsFactory";
import { getRandomUser } from "../../../mocks/userFactory";
import type { CustomRequest, UserWithIdStructure } from "../../../types/types";
import { getPredictionById, getPredictions } from "./predictionsControllers";

beforeEach(() => {
  jest.clearAllMocks();
});

const res: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next = jest.fn();

describe("Given a getPredictions controller", () => {
  const req: Partial<CustomRequest> = {
    userId: "54321",
  };

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

describe("Given a getPredictionById controller", () => {
  const prediction = getRandomPrediction();
  const user = getRandomUser() as UserWithIdStructure;
  const userWithPredictions = { ...user, predictions: [prediction] };

  describe("When it receives a request with a correct prediction Id", () => {
    test("Then it should call the response method status with a 200 and json with the prediction with the prediction found", async () => {
      const params = {
        predictionId: prediction._id.toString(),
      };

      const req: Partial<CustomRequest> = {
        userId: userWithPredictions._id,
        params,
      };

      const expectedStatus = 200;

      User.findById = jest.fn().mockReturnValue(userWithPredictions);

      await getPredictionById(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith({ prediction });
    });
  });

  describe("When it receives a request with an incorrect prediction id", () => {
    test("Then it should call the next with a response status 404 and public message 'Prediction not found'", async () => {
      const params = {
        predictionId: prediction._id.toString(),
      };

      const req: Partial<CustomRequest> = {
        userId: userWithPredictions._id,
        params,
      };

      User.findById = jest.fn().mockReturnValue(user);

      await getPredictionById(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      const newCustomError = new CustomError(
        "Prediction not found",
        404,
        "Prediction not found"
      );

      expect(next).toHaveBeenCalledWith(newCustomError);
    });
  });

  describe("When it receives a request with no id in the params", () => {
    test("Then it should call the next with a Custom Error", async () => {
      const params = {
        predictionId: "",
      };

      const req: Partial<CustomRequest> = {
        userId: userWithPredictions._id,
        params,
      };

      User.findById = jest.fn().mockRejectedValue(new Error(""));

      await getPredictionById(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalled();
    });
  });
});

// Describe("Given a createPrediction controller", () => {
//   const user = getRandomUser() as UserWithIdStructure;
//   const userWithPredictions = { ...user, predictions: [mockPrediction] };

//   const req: Partial<CustomRequest> = {
//     userId: user._id,
//     body: userWithPredictions.predictions[0],
//   };
//   describe("When it receives a request with a prediction: match 'Mexico vs Poland' goalsTeam1 '2' and goalsTeam2 '1' ", () => {
//     test("Then it should call the response method status with a 200 and json with the created prediction", async () => {
//       const expectedStatus = 200;

//       User.findById = jest.fn().mockReturnValue(user);

//       await createPrediction(
//         req as CustomRequest,
//         res as Response,
//         next as NextFunction
//       );

//       expect(res.status).toHaveBeenCalledWith(expectedStatus);
//       expect(res.json).toHaveBeenCalledWith(mockPrediction);
//     });
//   });
// });

import type { NextFunction, Response } from "express";
import CustomError from "../../../CustomError/CustomError";
import Prediction from "../../../database/models/Prediction";
import {
  getRandomPrediction,
  getRandomPredictionsList,
} from "../../../mocks/predictionsFactory";
import {
  mockPrediction,
  repeatedMockPrediction,
} from "../../../mocks/predictionsMocks";
import { getRandomUser } from "../../../mocks/userFactory";
import type {
  CustomRequest,
  PredictionWithId,
  UserWithId,
} from "../../../types/types";
import {
  createPrediction,
  deletePrediction,
  getPredictionById,
  getPredictions,
} from "./predictionsControllers";

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
    test("Then it should call the response method status with a 200 and json with a list of predictions created by user '54321'", async () => {
      const expectedStatus = 200;

      Prediction.find = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue(getRandomPredictionsList(2)),
      });

      await getPredictions(req as CustomRequest, res as Response, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
  });

  describe("When it receives a request and Prediction.find rejects", () => {
    test("Then next should be called with an error", async () => {
      const customError = new CustomError(
        "",
        500,
        "Database doesn't work, try again later"
      );

      const error = new Error();

      Prediction.find = jest.fn().mockRejectedValue(error);

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
  const prediction = getRandomPrediction() as PredictionWithId;
  const req: Partial<CustomRequest> = {
    params: { predictionId: prediction._id },
  };

  describe("When it receives a request with a correct prediction Id", () => {
    test("Then it should call the response method status with a 200 and json with the prediction with the prediction found", async () => {
      const expectedStatus = 200;

      Prediction.findById = jest.fn().mockReturnValue(prediction);

      await getPredictionById(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(prediction);
    });
  });

  describe("When it receives a request with an incorrect prediction id", () => {
    test("Then it should call the next with a response status 404 and public message 'Prediction not found'", async () => {
      Prediction.findById = jest.fn().mockResolvedValue(undefined);

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
      const req: Partial<CustomRequest> = {
        params: { predictionId: "" },
      };

      Prediction.findById = jest.fn().mockRejectedValue(new Error(""));

      await getPredictionById(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalled();
    });
  });
});

describe("Given a createPrediction controller", () => {
  const user = getRandomUser() as UserWithId;

  describe("When it receives a request with a prediction: match 'Argentina vs England' and that match is already in the list of that user", () => {
    const req: Partial<CustomRequest> = {
      userId: user._id,
      body: repeatedMockPrediction,
    };

    test("Then it should call next with an error", async () => {
      Prediction.find = jest.fn().mockResolvedValue(repeatedMockPrediction);

      const customError = new CustomError(
        "Prediction already created",
        409,
        "Prediction already created"
      );

      await createPrediction(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(customError);
    });
  });

  describe("When it receives a request with a prediction: match 'Mexico vs Poland'", () => {
    test("Then it should call the response method status with a 201 and json with the prediction created", async () => {
      const req: Partial<CustomRequest> = {
        userId: user._id,
        body: mockPrediction,
      };
      const expectedStatus = 201;

      const prediction = { ...mockPrediction, createdBy: user._id };

      Prediction.find = jest.fn().mockReturnValue([]);
      Prediction.create = jest.fn().mockReturnValue(prediction);

      await createPrediction(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
  });

  describe("When it receives a request with a prediction: match 'Mexico vs Poland'", () => {
    test("And there is an error, then it should call next", async () => {
      const req: Partial<CustomRequest> = {
        userId: user._id,
        body: mockPrediction,
      };

      Prediction.find = jest.fn().mockReturnValue([]);
      Prediction.create = jest.fn().mockRejectedValue(new Error(""));

      await createPrediction(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalled();
    });
  });
});

describe("Given a deletePrediction controller", () => {
  const prediction = getRandomPrediction() as PredictionWithId;
  const req: Partial<CustomRequest> = {
    params: { predictionId: prediction._id },
  };
  describe("When it receives a request with a correct prediction Id", () => {
    test("Then it should call the response method status with a 200", async () => {
      const expectedStatus = 200;

      Prediction.findOneAndDelete = jest.fn().mockReturnValue(prediction);

      await deletePrediction(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
  });

  describe("When it receives a request with an incorrect prediction Id", () => {
    test("Then it should call next with status with a 404", async () => {
      Prediction.findOneAndDelete = jest.fn().mockRejectedValue(new Error(""));

      await getPredictionById(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalled();
    });
  });
});

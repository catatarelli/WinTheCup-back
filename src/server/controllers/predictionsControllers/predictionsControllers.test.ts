import type { NextFunction, Response } from "express";
import CustomError from "../../../CustomError/CustomError";
import type { PredictionStructure } from "../../../database/models/Prediction";
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
  editPrediction,
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

const req: Partial<CustomRequest> = {
  userId: "54321",
  params: {},
  query: { page: "0" },
};

const next = jest.fn();

describe("Given a getPredictions controller", () => {
  describe("When it receives request with id '54321'", () => {
    test("Then it should call the response method status with a 200 and json with a list of predictions created by user '54321'", async () => {
      const expectedStatus = 200;

      Prediction.countDocuments = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockReturnValue(5) });

      Prediction.find = jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            exec: jest.fn().mockReturnValue(getRandomPredictionsList(3)),
          }),
        }),
      });

      await getPredictions(req as CustomRequest, res as Response, null);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
  });

  describe("When it receives a request and Prediction.find rejects", () => {
    test("Then next should be called with an error", async () => {
      Prediction.countDocuments = jest
        .fn()
        .mockReturnValue({ exec: jest.fn().mockReturnValue(5) });

      Prediction.find = jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            exec: jest.fn().mockRejectedValue(new Error("")),
          }),
        }),
      });

      await getPredictions(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it receives a request with a filter country in its params ", () => {
    const req: Partial<CustomRequest> = {
      userId: "1234",
      params: {},
      query: { page: "0", country: "Argentina" },
    };
    test("Then it should call the response method status with a 200 and the matching prediction", async () => {
      const expectedStatus = 200;

      const expectedPrediction: PredictionStructure = {
        match: "Argentina vs Chile",
        goalsTeam1: 2,
        goalsTeam2: 3,
      };

      Prediction.find = jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            exec: jest.fn().mockReturnValue(expectedPrediction),
          }),
        }),
      });

      await getPredictions(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toBeCalledWith({
        isNextPage: false,
        isPreviousPage: false,
        predictions: expectedPrediction,
        totalPages: NaN,
      });
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
    userId: prediction.createdBy.toString(),
  };

  describe("When it receives a request with a correct prediction Id", () => {
    test("Then it should call the response method status with a 200", async () => {
      const expectedStatus = 200;

      Prediction.findById = jest.fn().mockReturnValue(prediction);

      Prediction.findByIdAndDelete = jest.fn().mockReturnValue(prediction);

      await deletePrediction(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });
  });

  describe("When it receives a request with an incorrect prediction Id", () => {
    test("Then it should call next", async () => {
      Prediction.findById = jest.fn().mockRejectedValueOnce(new Error(""));

      Prediction.findByIdAndDelete = jest
        .fn()
        .mockRejectedValueOnce(new Error(""));

      await deletePrediction(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it receives a request from a user that has not created that prediction", () => {
    test("Then it should call next", async () => {
      const req: Partial<CustomRequest> = {
        params: { predictionId: prediction._id },
        userId: "1234",
      };

      Prediction.findById = jest.fn().mockResolvedValue(prediction);

      await deletePrediction(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalled();
    });
  });
});

describe("Given a editPrediction controller", () => {
  const prediction = getRandomPrediction() as PredictionWithId;
  const req: Partial<CustomRequest> = {
    params: { predictionId: prediction._id },
    userId: prediction.createdBy.toString(),
  };

  describe("When it receives a request with a correct prediction Id", () => {
    test("Then it should call the response method status with a 200 and json with the prediction with the new information", async () => {
      const expectedStatus = 200;

      Prediction.findById = jest.fn().mockReturnValue(prediction);

      Prediction.findByIdAndUpdate = jest.fn().mockReturnValue(prediction);

      await editPrediction(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenCalledWith(prediction);
    });
  });

  describe("When it receives a request with an incorrect prediction Id", () => {
    test("Then it should call the next with a response status 404 and public message 'Prediction not found'", async () => {
      Prediction.findById = jest.fn().mockRejectedValueOnce(new Error(""));

      Prediction.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error(""));

      await editPrediction(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it receives a request from a user that has not created that prediction", () => {
    test("Then it should call next", async () => {
      const req: Partial<CustomRequest> = {
        params: { predictionId: prediction._id },
        userId: "1234",
      };

      Prediction.findById = jest.fn().mockResolvedValue(prediction);

      await editPrediction(
        req as CustomRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalled();
    });
  });
});

import type { NextFunction, Response } from "express";
import CustomError from "../../../CustomError/CustomError.js";
import type { PredictionStructure } from "../../../database/models/Prediction.js";
import Prediction from "../../../database/models/Prediction.js";
import type { CustomRequest } from "../../../types/types.js";

export const getPredictions = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;
  try {
    const predictions = await Prediction.find({
      createdBy: userId,
    });
    res.status(200).json({ predictions });
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      500,
      "Database doesn't work, try again later"
    );
    next(customError);
  }
};

export const getPredictionById = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { predictionId } = req.params;
  try {
    const prediction = await Prediction.findById(predictionId);

    if (!prediction) {
      next(
        new CustomError("Prediction not found", 404, "Prediction not found")
      );

      return;
    }

    res.status(200).json(prediction);
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      400,
      "Prediction not found"
    );
    next(customError);
  }
};

export const createPrediction = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;
  const {
    match,
    goalsTeam1,
    goalsTeam2,
    redCards,
    yellowCards,
    penalties,
    picture,
    backupPicture,
  } = req.body as PredictionStructure;

  try {
    const prediction = {
      match,
      goalsTeam1,
      goalsTeam2,
      redCards,
      yellowCards,
      penalties,
      createdBy: userId,
      picture,
      backupPicture,
    };

    const checkPrediction = await Prediction.find({ match, createdBy: userId });
    if (checkPrediction.length !== 0) {
      const customError = new CustomError(
        "Prediction already created",
        409,
        "Prediction already created"
      );
      next(customError);
      return;
    }

    const newPrediction = await Prediction.create(prediction);

    res.status(201).json({
      ...newPrediction.toJSON(),
      picture: prediction.picture
        ? `${req.protocol}://${req.get("host")}/${prediction.picture}`
        : "",
    });
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      400,
      "Error creating the prediction"
    );
    next(customError);
  }
};

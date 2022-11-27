import type { NextFunction, Response } from "express";
import CustomError from "../../../CustomError/CustomError.js";
import User from "../../../database/models/User.js";
import type { CustomRequest, PredictionData } from "../../../types/types.js";

export const getPredictions = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;
  try {
    const user = await User.findById(userId);
    res.status(200).json({ predictions: user.predictions });
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
  const { userId } = req;

  try {
    const user = await User.findById(userId);

    const prediction = user.predictions.find(
      (prediction) => prediction._id.toString() === predictionId
    );

    if (!prediction) {
      next(
        new CustomError("Prediction not found", 404, "Prediction not found")
      );

      return;
    }

    res.status(200).json({ prediction });
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      400,
      "Prediction not found"
    );
    next(customError);
  }
};

// Export const createPrediction = async (
//   req: CustomRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { userId } = req;
//   const { match, goalsTeam1, goalsTeam2 } = req.body as PredictionData;

//   try {
//     const user = await User.findById(userId);

//     const prediction = {
//       match,
//       goalsTeam1,
//       goalsTeam2,
//     };

//     user.predictions.push(prediction);

//     await user.save();

//     res.status(200).json({ prediction });
//   } catch (error: unknown) {
//     next(error);
//   }
// };

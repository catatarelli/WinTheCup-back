import type { NextFunction, Response } from "express";
import CustomError from "../../../CustomError/CustomError.js";
import User from "../../../database/models/User.js";
import type { CustomRequest } from "../../../types/types.js";

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

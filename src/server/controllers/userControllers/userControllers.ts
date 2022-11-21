import bcrypt from "bcryptjs";
import type { NextFunction, Response, Request } from "express";
import CustomError from "../../../CustomError/CustomError.js";
import User from "../../../database/models/User.js";
import type { RegisterData } from "../../../types/types.js";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password, email } = req.body as RegisterData;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,
    });

    res.status(201).json({ user: { id: newUser._id, username, email } });
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      409,
      "Error creating a new user"
    );
    next(customError);
  }
};

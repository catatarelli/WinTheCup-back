import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { NextFunction, Response, Request } from "express";
import CustomError from "../../../CustomError/CustomError.js";
import User from "../../../database/models/User.js";
import type {
  CustomRequest,
  EditUserRequestBody,
  RegisterData,
  UserCredentials,
  UserTokenPayload,
} from "../../../types/types.js";
import { secretWord } from "../../../loadEnvironments.js";

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

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body as UserCredentials;
  const user = await User.findOne({ username });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    const error = new CustomError(
      "Wrong credentials",
      401,
      "Wrong credentials"
    );
    next(error);
    return;
  }

  const tokenPayload: UserTokenPayload = {
    id: user._id.toString(),
    username,
  };

  const token = jwt.sign(tokenPayload, secretWord, {
    expiresIn: "2d",
  });

  res.status(200).json({ token });
};

export const editUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;
  const { password } = req.body as EditUserRequestBody;
  let profile;

  try {
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const newUser = {
        ...req.body,
        password: hashedPassword,
      };

      profile = await User.findByIdAndUpdate(userId, newUser, {
        returnDocument: "after",
      })
        .select("-password")
        .exec();
    } else {
      profile = await User.findByIdAndUpdate(userId, req.body, {
        returnDocument: "after",
      })
        .select("-password")
        .exec();
    }

    res.status(200).json(profile);
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      409,
      "Error updating user"
    );
    next(customError);
  }
};

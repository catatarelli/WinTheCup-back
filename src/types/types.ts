import type { JwtPayload } from "jsonwebtoken";
import type { Request } from "express";
import type { UserStructure } from "../database/models/User";
import type { PredictionStructure } from "../database/models/Prediction";

export interface UserCredentials {
  username: string;
  password: string;
}

export interface RegisterData extends UserCredentials {
  email: string;
}

export interface UserWithId extends UserStructure {
  _id: string;
}

export interface UserTokenPayload extends JwtPayload {
  id: string;
  username: string;
}

export interface CustomRequest extends Request {
  userId: string;
}
export interface PredictionWithId extends PredictionStructure {
  _id: string;
}

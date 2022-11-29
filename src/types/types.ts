import type { JwtPayload } from "jsonwebtoken";
import type * as core from "express-serve-static-core";
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

export interface CustomRequest<
  P = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any
> extends Request<P, ResBody, ReqBody> {
  userId: string;
}
export interface PredictionWithId extends PredictionStructure {
  _id: string;
}

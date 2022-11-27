import type { JwtPayload } from "jsonwebtoken";
import type { Request } from "express";
import type { UserStructure } from "../database/models/User";

export interface UserCredentials {
  username: string;
  password: string;
}

export interface RegisterData extends UserCredentials {
  email: string;
}

export interface UserWithIdStructure extends UserStructure {
  _id: string;
}

export interface UserTokenPayload extends JwtPayload {
  id: string;
  username: string;
}

export interface CustomRequest extends Request {
  userId: string;
}

export interface PredictionData {
  match: string;
  goalsTeam1: number;
  goalsTeam2: number;
  redCards?: number;
  yellowCards?: number;
  penalties?: number;
  picture?: string;
}

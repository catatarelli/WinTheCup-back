import { createClient } from "@supabase/supabase-js";
import path from "path";
import fs from "fs/promises";
import type { PredictionStructure } from "../../../../database/models/Prediction.js";
import {
  supabaseUrl,
  supabaseKey,
  supabaseBucketId,
} from "../../../../loadEnvironments.js";
import type { NextFunction, Response } from "express";
import type { CustomRequest } from "../../../../types/types.js";
import CustomError from "../../../../CustomError/CustomError.js";

const supabase = createClient(supabaseUrl, supabaseKey);
export const bucket = supabase.storage.from(supabaseBucketId);

const pictureBackup = async (
  req: CustomRequest<
    Record<string, unknown>,
    Record<string, unknown>,
    PredictionStructure
  >,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    next();
    return;
  }

  const newFilePath = path.join(
    "assets",
    "images",
    `${req.file.filename}${req.file.originalname}`
  );

  try {
    await fs.rename(
      path.join("assets", "images", req.file.filename),
      newFilePath
    );
    const fileContent = await fs.readFile(newFilePath);

    await bucket.upload(req.file.filename + req.file.originalname, fileContent);

    const {
      data: { publicUrl },
    } = bucket.getPublicUrl(req.file.filename + req.file.originalname);

    req.body.picture = newFilePath;
    req.body.backupPicture = publicUrl;

    next();
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      400,
      "Error renaming the picture"
    );
    next(customError);
  }
};

export default pictureBackup;

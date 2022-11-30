import type { NextFunction, Response } from "express";
import path from "path";
import sharp from "sharp";
import CustomError from "../../../../CustomError/CustomError.js";
import type { CustomRequest } from "../../../../types/types.js";

const pictureResize = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { originalname, filename } = req.file;

  const pathBase = `${path.basename(originalname, path.extname(originalname))}`;

  try {
    await sharp(path.join("assets", "images", filename))
      .resize(320, 180, { fit: "cover" })
      .webp({ quality: 90 })
      .toFormat("webp")
      .toFile(path.join("assets", "images", `${pathBase}.webp`));

    req.file.filename = `${pathBase}.webp`;
    req.file.originalname = `${pathBase}.webp`;

    next();
  } catch {
    const newError = new CustomError(
      "Couldn't compress the image",
      500,
      "Couldn't compress the image"
    );
    next(newError);
  }
};

export default pictureResize;

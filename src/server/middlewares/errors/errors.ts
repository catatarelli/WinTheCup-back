import chalk from "chalk";
import debug from "debug";
import type { NextFunction, Request, Response } from "express";
import { ValidationError } from "express-validation";
import type CustomError from "../../../CustomError/CustomError.js";

export const unknownEndpoint = (req: Request, res: Response) => {
  res.status(404).json({ message: "Unknown endpoint" });
};

export const generalError = (
  error: CustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  next: NextFunction
) => {
  const statusCode = error.statusCode ?? 500;
  let errorMessage =
    error.publicMessage ?? "Something went wrong, try again later";

  if (error instanceof ValidationError) {
    debug(chalk.red("Request validation error: "));
    error.details.body.forEach((errorInfo) =>
      debug(chalk.red(errorInfo.message))
    );
    errorMessage = "Wrong data";
  }

  debug(chalk.red(error.message));

  res.status(statusCode).json({ error: errorMessage });
};

import express from "express";
import { validate } from "express-validation";
import userRegisterDataSchema from "../../schemas/userRegisterDataSchema.js";
import { registerUser } from "../controllers/userControllers/userControllers.js";

// eslint-disable-next-line new-cap
const userRouter = express.Router();

userRouter.post(
  "/register",
  validate(userRegisterDataSchema, {}, { abortEarly: false }),
  registerUser
);

export default userRouter;

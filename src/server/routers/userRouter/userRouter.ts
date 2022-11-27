import express from "express";
import { validate } from "express-validation";
import userRegisterDataSchema from "../../../schemas/userRegisterDataSchema.js";
import {
  loginUser,
  registerUser,
} from "../../controllers/userControllers/userControllers.js";
import routes from "../routes.js";

const { registerRoute, loginRoute } = routes;

// eslint-disable-next-line new-cap
const userRouter = express.Router();

userRouter.post(
  registerRoute,
  validate(userRegisterDataSchema, {}, { abortEarly: false }),
  registerUser
);

userRouter.post(loginRoute, loginUser);

export default userRouter;

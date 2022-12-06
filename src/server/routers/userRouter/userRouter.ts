import express from "express";
import { validate } from "express-validation";
import userRegisterDataSchema from "../../../schemas/userRegisterDataSchema.js";
import {
  editUser,
  loginUser,
  registerUser,
} from "../../controllers/userControllers/userControllers.js";
import { auth } from "../../middlewares/auth/auth.js";
import routes from "../routes.js";

const { registerRoute, loginRoute, editUserRoute } = routes;

// eslint-disable-next-line new-cap
const userRouter = express.Router();

userRouter.post(
  registerRoute,
  validate(userRegisterDataSchema, {}, { abortEarly: false }),
  registerUser
);

userRouter.post(loginRoute, loginUser);

userRouter.patch(editUserRoute, auth, editUser);

export default userRouter;

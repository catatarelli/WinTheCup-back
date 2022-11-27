import express from "express";
import morgan from "morgan";
import cors from "cors";
import { generalError, unknownEndpoint } from "./middlewares/errors/errors.js";
import userRouter from "./routers/userRouter/userRouter.js";
import predictionsRouter from "./routers/predictionsRouter/predictionsRouter.js";
import { auth } from "./middlewares/auth/auth.js";
import routes from "./routers/routes.js";

const { userRoute, predictionsRoute } = routes;

const app = express();

app.use(cors());
app.disable("x-powered-by");

app.use(morgan("dev"));

app.use(express.json());

app.use(userRoute, userRouter);
app.use(predictionsRoute, auth, predictionsRouter);

app.use(unknownEndpoint);
app.use(generalError);

export default app;

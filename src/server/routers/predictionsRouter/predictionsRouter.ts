import express from "express";
import { getPredictions } from "../../controllers/predictionsControllers/predictionsControllers.js";

// eslint-disable-next-line new-cap
const predictionsRouter = express.Router();

predictionsRouter.get("/", getPredictions);

export default predictionsRouter;

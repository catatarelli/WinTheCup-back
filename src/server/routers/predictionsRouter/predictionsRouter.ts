import express from "express";
import {
  createPrediction,
  getPredictionById,
  getPredictions,
} from "../../controllers/predictionsControllers/predictionsControllers.js";
import routes from "../routes.js";

const { predictionRoute } = routes;

// eslint-disable-next-line new-cap
const predictionsRouter = express.Router();

predictionsRouter.get("", getPredictions);

predictionsRouter.get(predictionRoute, getPredictionById);

predictionsRouter.post("/create", createPrediction);

export default predictionsRouter;

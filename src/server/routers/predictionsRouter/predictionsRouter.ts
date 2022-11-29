import express from "express";
import multer from "multer";
import path from "path";
import {
  createPrediction,
  getPredictionById,
  getPredictions,
} from "../../controllers/predictionsControllers/predictionsControllers.js";
import handlePicture from "../../middlewares/handlePicture/handlePicture.js";
import routes from "../routes.js";

const { predictionRoute, createRoute } = routes;

const upload = multer({
  dest: path.join("assets", "images"),
  limits: {
    fileSize: 8000000,
  },
});

// eslint-disable-next-line new-cap
const predictionsRouter = express.Router();

predictionsRouter.get("", getPredictions);

predictionsRouter.get(predictionRoute, getPredictionById);

predictionsRouter.post(
  createRoute,
  upload.single("picture"),
  handlePicture,
  createPrediction
);

export default predictionsRouter;

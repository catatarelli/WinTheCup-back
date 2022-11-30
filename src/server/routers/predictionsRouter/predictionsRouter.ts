import express from "express";
import multer from "multer";
import path from "path";
import {
  createPrediction,
  deletePrediction,
  getPredictionById,
  getPredictions,
} from "../../controllers/predictionsControllers/predictionsControllers.js";
import pictureBackup from "../../middlewares/pictures/pictureBackup/pictureBackup.js";
import pictureResize from "../../middlewares/pictures/pictureResize/pictureResize.js";
import routes from "../routes.js";

const { predictionRoute, createRoute, deleteRoute } = routes;

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
  pictureResize,
  pictureBackup,
  createPrediction
);

predictionsRouter.delete(deleteRoute, deletePrediction);

export default predictionsRouter;

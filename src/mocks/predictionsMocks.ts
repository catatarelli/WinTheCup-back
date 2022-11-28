import type { PredictionStructure } from "../database/models/Prediction";

export const mockPrediction: PredictionStructure = {
  match: "Mexico vs Poland",
  goalsTeam1: 2,
  goalsTeam2: 1,
};

export const repeatedMockPrediction: PredictionStructure = {
  match: "Argentina vs England",
  goalsTeam1: 2,
  goalsTeam2: 1,
};

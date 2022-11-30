import type { NextFunction } from "express";
import fs from "fs/promises";
import CustomError from "../../../../CustomError/CustomError";
import { getRandomPrediction } from "../../../../mocks/predictionsFactory";
import type { CustomRequest } from "../../../../types/types";
import pictureResize from "./pictureResize";

const newPrediction = getRandomPrediction();

const req: Partial<CustomRequest> = {
  body: newPrediction,
};

const next = jest.fn() as NextFunction;

const file: Partial<Express.Multer.File> = {
  filename: "footballFans",
  originalname: "footballFansOriginalName",
};

let mockedFile = jest.fn();

beforeAll(async () => {
  await fs.writeFile("assets/randomprediction", "randomprediction");
});

afterAll(async () => {
  await fs.unlink("assets/randomprediction");
});

beforeEach(() => {
  jest.clearAllMocks();
});

jest.mock("sharp", () => () => ({
  resize: jest.fn().mockReturnValue({
    webp: jest.fn().mockReturnValue({
      toFormat: jest.fn().mockReturnValue({
        toFile: mockedFile,
      }),
    }),
  }),
}));

describe("Given an pictureResize middleware", () => {
  describe("When it receives a request with a file", () => {
    test("Then it should resize the image and call next", async () => {
      const expectedFile = "footballFansOriginalName.webp";
      req.file = file as Express.Multer.File;

      await pictureResize(req as CustomRequest, null, next);

      expect(next).toHaveBeenCalled();
      expect(req.file.filename).toBe(expectedFile);
    });
  });

  describe("When it receives a request with an invalid file", () => {
    test("Then next should be called with an error", async () => {
      mockedFile = jest.fn().mockRejectedValue(new Error());

      await pictureResize(req as CustomRequest, null, next);

      const newError = new CustomError(
        "Couldn't compress the image",
        500,
        "Couldn't compress the image"
      );

      expect(next).toBeCalledWith(newError);
    });
  });

  describe("When it receives a request with no file", () => {
    test("Then next should be called", async () => {
      const req: Partial<CustomRequest> = {
        body: newPrediction,
      };

      await pictureResize(req as CustomRequest, null, next);

      expect(next).toBeCalled();
    });
  });
});

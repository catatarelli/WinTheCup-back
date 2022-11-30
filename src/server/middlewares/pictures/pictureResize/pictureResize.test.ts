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
  filename: "test",
  originalname: "originalTest",
};

let mockedFile = jest.fn();

beforeAll(async () => {
  await fs.writeFile("assets/randomsession", "randomsession");
});

afterAll(async () => {
  await fs.unlink("assets/randomsession");
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
      req.file = file as Express.Multer.File;

      await pictureResize(req as CustomRequest, null, next);

      expect(next).toHaveBeenCalled();
      expect(req.file.filename).toContain(`.webp`);
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
});

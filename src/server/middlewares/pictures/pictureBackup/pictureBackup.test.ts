/* eslint-disable @typescript-eslint/consistent-type-assertions */
import type { NextFunction, Response } from "express";
import fs from "fs/promises";
import { getRandomPrediction } from "../../../../mocks/predictionsFactory";
import type { CustomRequest } from "../../../../types/types";
import pictureBackup, { bucket } from "./pictureBackup";

jest.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    storage: {
      from: () => ({
        upload: jest.fn().mockResolvedValue({ error: null }),
        bucket: () => ({
          getPublicUrl: () => ({
            publicUrl: "testFileName.webptestOriginalName.webp",
          }),
        }),
      }),
    },
  }),
}));

const fileRequest = {
  filename: "testFileName.webp",
  originalname: "testOriginalName.webp",
} as Partial<Express.Multer.File>;

const newPrediction = getRandomPrediction();

const req = {
  body: newPrediction,
  file: fileRequest,
} as Partial<CustomRequest>;

const res = {} as Partial<Response>;
const next = jest.fn() as NextFunction;

beforeEach(async () => {
  await fs.writeFile("assets/images/testFileName.webp", "testFileName");
  await fs.writeFile("assets/images/testOriginalName.webp", "testOriginalName");
});

afterAll(async () => {
  await fs.unlink("assets/images/testFileName.webptestOriginalName.webp");
  await fs.unlink("assets/images/testOriginalName.webp");
  jest.clearAllMocks();
});

describe("Given a pictureBackup middleware", () => {
  describe("When it's invoked with a file in the request", () => {
    test("Then it should rename the file, upload it to supabase and call next", async () => {
      fs.readFile = jest.fn().mockResolvedValueOnce(newPrediction.picture);

      bucket.upload = jest.fn();

      bucket.getPublicUrl = jest.fn().mockReturnValueOnce({
        data: { publicUrl: newPrediction.picture },
      });

      await pictureBackup(req as CustomRequest, res as Response, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it's invoked with a request that doesn't have a file", () => {
    test("Then it should call next", async () => {
      const emptyReq: Partial<CustomRequest> = {
        body: newPrediction,
      };

      await pictureBackup(emptyReq as CustomRequest, res as Response, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it's invoked with a file in the request and there is an error", () => {
    test("Then it should call next with an error", async () => {
      fs.readFile = jest.fn().mockRejectedValue(new Error(""));

      await pictureBackup(req as CustomRequest, res as Response, next);

      expect(next).toHaveBeenCalled();
    });
  });
});

import { NextFunction, Request, Response, Router } from "express";
import { cache } from "~/server";

const controller = Router();
controller.get(
  "/.well-known/apple-app-site-association",
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
      applinks: {},
      webcredentials: {
        apps: ["462YWVTF82.com.nymlab.passkey-test"],
      },
      appclips: {},
    });
  }
);

export default { prefixPath: "", middlewares: [], controller };

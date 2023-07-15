import { NextFunction, Request, Response, Router } from "express";
import { cache } from "~/server";

const controller = Router();

controller.post(
  "/tx",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { addr, msg } = req.body;
      const ucan = await cache.getItem<string>(addr);
      if (!ucan) {
        res.status(500).json("not found");
      } else {
        res.status(200).json("post tx");
      }
    } catch (error) {
      next(error);
    }
  }
);

export default { prefixPath: "", middlewares: [], controller };

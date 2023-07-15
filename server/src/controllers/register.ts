import { NextFunction, Request, Response, Router } from "express";
import { cache } from "~/server";

const controller = Router();

controller.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { addr, ucan } = req.body;
      cache.setItem(addr, ucan, { isCachedForever: true });
      res.status(200).json("yep");
    } catch (error) {
      next(error);
    }
  }
);

export default { prefixPath: "", middlewares: [], controller };

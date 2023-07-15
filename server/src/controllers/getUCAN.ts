import { NextFunction, Request, Response, Router } from "express";
import { cache } from "~/server";

const controller = Router();
controller.get(
  "/:addr",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { addr } = req.params;
      const ucan = await cache.getItem<string>(addr);
      if (!ucan) {
        res.status(500).json({ error: "Not found" });
      } else {
        res.status(200).json(ucan);
      }
    } catch (error) {
      next(error);
    }
  }
);

export default { prefixPath: "/ucan", middlewares: [], controller };

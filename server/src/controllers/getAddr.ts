import { NextFunction, Request, Response, Router } from "express";
import "dotenv/config";

const controller = Router();
const { SERVICE_ADDR } = process.env;
controller.get(
  "/service-addr",
  (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json(SERVICE_ADDR);
    } catch (error) {
      next(error);
    }
  }
);

export default { prefixPath: "", middlewares: [], controller };

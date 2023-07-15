import "dotenv/config";
import "~/loaders/logger.loader";

import cors from "cors";
import helmet from "helmet";
import express from "express";
import compression from "compression";
import rateLimit from "express-rate-limit";
import httpLogger from "pino-http";
import * as loaders from "./loaders";
import { Cache, CacheContainer } from "node-ts-cache";
import { MemoryStorage } from "node-ts-cache-storage-memory";

export const cache = new CacheContainer(new MemoryStorage());
const { SERVER_PORT } = process.env;

const server = express();
server.use(cors({ origin: true }));
server.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
  })
);
server.use(helmet());
server.use(compression());
server.use(express.json());
server.use(httpLogger({ logger: globalThis.logger, useLevel: "debug" }));
server.use(express.urlencoded({ extended: false }));

server.listen(SERVER_PORT, async () => {
  Cache(cache, { isCachedForever: true });
  await loaders.controllers(server);
});

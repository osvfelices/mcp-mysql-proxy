#!/usr/bin/env node

import { config as loadEnv } from "dotenv";
loadEnv();

import { startServer } from "./server";
import { validateEnv } from "./config";
import { logger } from "./logger";

async function main() {
  try {
    validateEnv();
    await startServer();
  } catch (err: any) {
    logger.error("Fatal error while starting server", {
      message: err.message,
      stack: err.stack,
    });
    process.exit(1);
  }
}

main();

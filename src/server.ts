import express, { Request, Response } from "express";
import { getConfig } from "./config";
import { handleMCPRequest } from "./handlers";
import { logger } from "./logger";

export async function startServer(): Promise<void> {
  const app = express();
  const { PORT } = getConfig();

  app.use(express.json());

  // Basic health check
  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ status: "ok" });
  });

  // Main MCP endpoint
  app.post("/mcp", handleMCPRequest);

  app.use((_req, res) => {
    res.status(404).json({ error: "Not Found" });
  });

  app.listen(PORT, () => {
    logger.info(`MCP MySQL Proxy running on port ${PORT}`);
  });
}

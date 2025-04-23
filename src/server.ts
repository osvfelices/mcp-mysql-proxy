import express, { Request, Response } from "express";
import { getConfig } from "./config";
import { handleMCPRequest } from "./handlers";
import { logger } from "./logger";

export async function startServer(): Promise<void> {
  const app = express();
  const { PORT } = getConfig();
  const MIN_PORT = PORT;
  const MAX_PORT = 3010;

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

  const getPort = (await import("get-port")).default;
  const port = await getPort({
    port: Array.from(
      { length: MAX_PORT - MIN_PORT + 1 },
      (_, i) => MIN_PORT + i
    ),
  });
  app.listen(port, () => {
    logger.info(`MCP MySQL Proxy running on port ${port}`);
  });
}

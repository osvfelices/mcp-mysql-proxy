import express, { Request, Response } from "express";
import { getConfig } from "./config";
import { handleMCPRequest } from "./handlers";
import { logger } from "./logger";
import findFreePort from "find-free-port";

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

  // Encontrar un puerto disponible en el rango especificado
  const port = await new Promise<number>((resolve, reject) => {
    findFreePort(MIN_PORT, MAX_PORT, (err: Error | null, freePort: number) => {
      if (err) reject(err);
      resolve(freePort);
    });
  });

  app.listen(port, () => {
    logger.info(`MCP MySQL Proxy running on port ${port}`);
  });
}

import { Request, Response } from "express";
import { executeQuery, getDatabaseSchema } from "./mysql";
import { logger } from "./logger";

interface MCPRequestBody {
  query?: string;
}

export async function handleMCPRequest(
  req: Request,
  res: Response
): Promise<void> {
  const { query } = req.body as MCPRequestBody;

  try {
    // If no query is provided, return database schema (used by Cursor for chart)
    if (!query || typeof query !== "string") {
      const schema = await getDatabaseSchema();
      res.status(200).json({ result: schema });
      return;
    }

    const result = await executeQuery(query);
    res.status(200).json({ result });
  } catch (err: any) {
    logger.warn("Error processing MCP request", { query, error: err.message });
    res.status(500).json({ error: err.message });
  }
}

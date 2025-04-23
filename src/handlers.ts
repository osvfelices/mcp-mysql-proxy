import { Request, Response } from "express";
import { executeQuery } from "./mysql";
import { logger } from "./logger";

interface MCPRequestBody {
  query?: string;
}

export async function handleMCPRequest(
  req: Request,
  res: Response
): Promise<void> {
  const { query } = req.body as MCPRequestBody;

  if (!query || typeof query !== "string") {
    res
      .status(400)
      .json({ error: "Missing or invalid 'query' field in request body" });
    return;
  }

  try {
    const result = await executeQuery(query);
    res.status(200).json({ result });
  } catch (err: any) {
    logger.warn("Error executing query", { query, error: err.message });
    res.status(500).json({ error: err.message });
  }
}

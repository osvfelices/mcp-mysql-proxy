import mysql from "mysql2/promise";
import { getConfig } from "./config";
import { logger } from "./logger";

const config = getConfig();

export const pool = mysql.createPool({
  host: config.MYSQL_HOST,
  port: config.MYSQL_PORT,
  user: config.MYSQL_USER,
  password: config.MYSQL_PASS,
  database: config.MYSQL_DB || undefined,
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true,
});

type QueryMetadata = {
  operation: string;
  executionTimeMs: number;
  rowsReturned?: number;
  error?: string;
};

export async function executeQuery(sql: string): Promise<any> {
  const connection = await pool.getConnection();
  const start = process.hrtime.bigint();

  const trimmed = sql.trim();
  const lower = trimmed.toLowerCase();

  const operation = lower.startsWith("select")
    ? "SELECT"
    : lower.startsWith("insert")
    ? "INSERT"
    : lower.startsWith("update")
    ? "UPDATE"
    : lower.startsWith("delete")
    ? "DELETE"
    : "OTHER";

  const allowed =
    operation === "SELECT" ||
    (operation === "INSERT" && config.ALLOW_INSERT_OPERATION) ||
    (operation === "UPDATE" && config.ALLOW_UPDATE_OPERATION) ||
    (operation === "DELETE" && config.ALLOW_DELETE_OPERATION);

  if (!allowed) {
    connection.release();
    const msg = `Operation '${operation}' not allowed`;
    logger.warn(msg);
    throw new Error(msg);
  }

  try {
    const [rows] = await connection.query(trimmed);
    const end = process.hrtime.bigint();
    const duration = Number(end - start) / 1_000_000;

    const metadata: QueryMetadata = {
      operation,
      executionTimeMs: parseFloat(duration.toFixed(3)),
      rowsReturned: Array.isArray(rows) ? rows.length : undefined,
    };

    logger.info(`Query executed`, metadata);
    return rows;
  } catch (err: any) {
    const end = process.hrtime.bigint();
    const duration = Number(end - start) / 1_000_000;

    const metadata: QueryMetadata = {
      operation,
      executionTimeMs: parseFloat(duration.toFixed(3)),
      error: err.message,
    };

    logger.error(`Query failed`, metadata);
    throw new Error(`Query failed: ${err.message}`);
  } finally {
    connection.release();
  }
}

export async function getDatabaseSchema(): Promise<any> {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `
      SELECT table_name, column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = ?
      ORDER BY table_name, ordinal_position
      `,
      [config.MYSQL_DB]
    );

    const schema: Record<string, any> = {};
    for (const row of rows as any[]) {
      if (!schema[row.table_name]) {
        schema[row.table_name] = [];
      }
      schema[row.table_name].push({
        column: row.column_name,
        type: row.data_type,
      });
    }

    return schema;
  } finally {
    connection.release();
  }
}

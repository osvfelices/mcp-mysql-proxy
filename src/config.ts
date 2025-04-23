export interface AppConfig {
  MYSQL_HOST: string;
  MYSQL_PORT: number;
  MYSQL_USER: string;
  MYSQL_PASS: string;
  MYSQL_DB?: string;
  ALLOW_INSERT_OPERATION: boolean;
  ALLOW_UPDATE_OPERATION: boolean;
  ALLOW_DELETE_OPERATION: boolean;
  PORT: number;
}

let configCache: AppConfig | null = null;

export function getConfig(): AppConfig {
  if (configCache) return configCache;

  const env = process.env;

  const requiredVars = ["MYSQL_HOST", "MYSQL_USER", "MYSQL_PASS"];
  for (const key of requiredVars) {
    if (!env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  const parseBool = (value: string | undefined, fallback = false): boolean =>
    value ? value.toLowerCase() === "true" : fallback;

  configCache = {
    MYSQL_HOST: env.MYSQL_HOST!,
    MYSQL_PORT: parseInt(env.MYSQL_PORT || "3306", 10),
    MYSQL_USER: env.MYSQL_USER!,
    MYSQL_PASS: env.MYSQL_PASS!,
    MYSQL_DB: env.MYSQL_DB,

    ALLOW_INSERT_OPERATION: parseBool(env.ALLOW_INSERT_OPERATION),
    ALLOW_UPDATE_OPERATION: parseBool(env.ALLOW_UPDATE_OPERATION),
    ALLOW_DELETE_OPERATION: parseBool(env.ALLOW_DELETE_OPERATION),

    PORT: parseInt(env.PORT || "3000", 10),
  };

  return configCache;
}

export function validateEnv(): void {
  getConfig();
}

import winston from "winston";

const isProduction = process.env.NODE_ENV === "production";

export const logger = winston.createLogger({
  level: isProduction ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    isProduction
      ? winston.format.json()
      : winston.format.printf(({ timestamp, level, message, ...meta }) => {
          const metaString = Object.keys(meta).length
            ? JSON.stringify(meta, null, 2)
            : "";
          return `${timestamp} [${level}] ${message} ${metaString}`;
        })
  ),
  transports: [new winston.transports.Console()],
});

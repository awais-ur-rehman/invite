export type AppEnv = {
  nodeEnv: string;
  port: number;
  mongodbUri: string;
  frontendBaseUrl: string;
  allowedOrigins: string[];
};

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable ${name}`);
  }
  return value;
}

export function loadEnv(): AppEnv {
  const nodeEnv = process.env.NODE_ENV ?? "development";
  const port = process.env.PORT ? Number(process.env.PORT) : 4000;
  const mongodbUri = getRequiredEnv("MONGODB_URI");
  const frontendBaseUrl = getRequiredEnv("FRONTEND_BASE_URL");
  const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? frontendBaseUrl).split(
    ","
  );

  return {
    nodeEnv,
    port,
    mongodbUri,
    frontendBaseUrl,
    allowedOrigins
  };
}

import { config } from "dotenv";
config();

import { createServer } from "http";

import { createApp } from "./app";
import { connectToDatabase } from "./config/db";

async function main() {
  const port = process.env.PORT ? Number(process.env.PORT) : 4000;

  await connectToDatabase();

  const app = createApp();
  const server = createServer(app);

  server.listen(port, () => {
    console.log(`API server listening on port ${port}`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

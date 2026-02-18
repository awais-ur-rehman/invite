import mongoose from "mongoose";
import { loadEnv } from "./env";

export async function connectToDatabase() {
  const env = loadEnv();

  await mongoose.connect(env.mongodbUri);
}

import type { Express } from "express";
import { createInviteRouter } from "../modules/invites/invite.router";

export function registerRoutes(app: Express) {
  app.use("/api/invites", createInviteRouter());
}

import { Router } from "express";
import {
  createInviteHandler,
  exportInvitePdfHandler,
  getInviteBySlugHandler,
  trackInviteViewHandler
} from "./invite.controller";

export function createInviteRouter() {
  const router = Router();

  router.post("/", createInviteHandler);
  router.get("/:slug", getInviteBySlugHandler);
  router.post("/:slug/export/pdf", exportInvitePdfHandler);
  router.post("/:slug/view", trackInviteViewHandler);

  return router;
}

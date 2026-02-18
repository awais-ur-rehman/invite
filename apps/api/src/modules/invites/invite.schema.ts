import { z } from "zod";

export const createInviteSchema = z.object({
  eventCategory: z.enum(["NIKKAH", "MEHNDI", "BARAAT", "WALIMA", "BIRTHDAY"]),
  eventTitle: z.string().min(1),
  primaryNames: z.string().min(1),
  eventDate: z.string().min(1),
  eventTime: z.string().min(1),
  venueName: z.string().min(1),
  address: z.string().min(1),
  mapsUrl: z.string().url().optional(),
  customMessage: z.string().max(1000).optional(),
  language: z.enum(["EN", "UR", "BOTH"])
});

export type CreateInviteInput = z.infer<typeof createInviteSchema>;

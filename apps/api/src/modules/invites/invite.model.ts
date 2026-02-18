import { Schema, model } from "mongoose";

const InviteSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    eventCategory: { type: String, required: true },
    templateKey: { type: String, required: true },
    eventTitle: { type: String, required: true },
    primaryNames: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    venueName: { type: String, required: true },
    address: { type: String, required: true },
    mapsUrl: { type: String },
    customMessage: { type: String },
    language: { type: String, required: true, default: "EN" },
    viewCount: { type: Number, required: true, default: 0 }
  },
  { timestamps: true }
);

export const InviteModel = model("Invite", InviteSchema);

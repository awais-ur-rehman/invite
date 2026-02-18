export type Invite = {
  slug: string;
  eventCategory: string;
  templateKey: string;
  eventTitle: string;
  primaryNames: string;
  date: string;
  time: string;
  venueName: string;
  address: string;
  mapsUrl?: string;
  customMessage?: string;
  language: "EN" | "UR" | "BOTH";
  viewCount?: number;
};

import { Invite } from "../../types/invite";

export type InviteFormValues = {
  eventCategory: "NIKKAH" | "MEHNDI" | "BARAAT" | "WALIMA" | "BIRTHDAY";
  eventTitle: string;
  primaryNames: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  address: string;
  mapsUrl?: string;
  customMessage?: string;
  language: "EN" | "UR" | "BOTH";
};

const baseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export async function createInvite(values: InviteFormValues): Promise<string> {
  const response = await fetch(`${baseUrl}/api/invites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values)
  });

  if (!response.ok) {
    throw new Error("Failed to create invite");
  }

  const data = (await response.json()) as { slug: string };
  return data.slug;
}

export async function getInviteBySlug(slug: string): Promise<Invite | null> {
  const response = await fetch(`${baseUrl}/api/invites/${slug}`, {
    method: "GET",
    cache: "no-store"
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to load invite");
  }

  const data = (await response.json()) as Invite;
  return data;
}

export async function exportInvitePdf(slug: string, imageData: string) {
  const response = await fetch(`${baseUrl}/api/invites/${slug}/export/pdf`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageData })
  });

  if (!response.ok) {
    throw new Error("Failed to export PDF");
  }

  const blob = await response.blob();
  return blob;
}

export async function trackInviteView(slug: string) {
  await fetch(`${baseUrl}/api/invites/${slug}/view`, {
    method: "POST"
  });
}

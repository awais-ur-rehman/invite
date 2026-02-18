import { CreateInviteInput } from "./invite.schema";
import { createInvite, findInviteBySlug, incrementInviteView } from "./invite.repository";

export async function createInviteAndReturnSlug(data: CreateInviteInput) {
  const invite = await createInvite(data);
  return invite.slug as string;
}

export async function getInviteBySlug(slug: string) {
  return findInviteBySlug(slug);
}

export async function trackInviteView(slug: string) {
  await incrementInviteView(slug);
}

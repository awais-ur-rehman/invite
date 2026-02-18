import { InviteModel } from "./invite.model";
import { CreateInviteInput } from "./invite.schema";

export async function createInvite(data: CreateInviteInput) {
  const slug = await generateSlug();

  const eventDateTime = new Date(`${data.eventDate}T${data.eventTime}:00`);

  const invite = await InviteModel.create({
    slug,
    eventCategory: data.eventCategory,
    templateKey: "nikkah-classic-01",
    eventTitle: data.eventTitle,
    primaryNames: data.primaryNames,
    date: eventDateTime,
    time: data.eventTime,
    venueName: data.venueName,
    address: data.address,
    mapsUrl: data.mapsUrl,
    customMessage: data.customMessage,
    language: data.language
  });

  return invite;
}

export async function findInviteBySlug(slug: string) {
  return InviteModel.findOne({ slug }).lean();
}

export async function incrementInviteView(slug: string) {
  await InviteModel.updateOne({ slug }, { $inc: { viewCount: 1 } }).exec();
}

async function generateSlug() {
  const random = Math.random().toString(36).slice(2, 8);
  return random;
}

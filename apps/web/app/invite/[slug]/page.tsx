import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Invite } from "../../../src/types/invite";
import { getInviteBySlug } from "../../../src/lib/api-client/invites";

type PageProps = {
  params: { slug: string };
};

const InviteScene = dynamic(
  () =>
    import("../../../src/components/invite/InviteScene").then(
      (m) => m.InviteScene,
    ),
  { ssr: false },
);

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const invite = await getInviteBySlug(props.params.slug);

  if (!invite) {
    return {
      title: "Invite not found",
    };
  }

  const title = `${invite.eventTitle} – ${invite.primaryNames}`;
  const description =
    invite.customMessage || `${invite.eventTitle} at ${invite.venueName}`;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const url = `${baseUrl}/invite/${props.params.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function InvitePage(props: PageProps) {
  const invite = await getInviteBySlug(props.params.slug);

  if (!invite) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: invite.eventTitle,
    startDate: new Date(invite.date).toISOString(),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: invite.venueName,
      address: invite.address,
    },
    description: invite.customMessage,
    organizer: {
      "@type": "Person",
      name: invite.primaryNames,
    },
  };

  return (
    <main className="min-h-screen bg-neutral-900 text-white">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <InviteScene invite={invite as Invite} slug={props.params.slug} />
    </main>
  );
}

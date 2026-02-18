"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import type { Invite } from "../../types/invite";
import { exportInvitePdf, trackInviteView } from "../../lib/api-client/invites";

type Props = {
  invite: Invite;
  slug: string;
};

function InviteCard({ invite }: { invite: Invite }) {
  return (
    <Html fullscreen>
      <div className="flex min-h-screen items-center justify-center">
        <div className="relative w-full max-w-md rounded-3xl border border-yellow-500/40 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 px-6 py-8 text-center shadow-[0_0_60px_rgba(0,0,0,0.6)]">
          <div className="mb-4 text-xs uppercase tracking-[0.3em] text-yellow-300/80">
            {invite.eventCategory.toLowerCase()}
          </div>
          <div className="mb-2 text-sm text-neutral-300">
            {invite.eventTitle}
          </div>
          <div className="mb-4 text-xl font-semibold text-yellow-100">
            {invite.primaryNames}
          </div>
          <div className="mb-2 text-xs text-neutral-400">
            {new Date(invite.date).toLocaleDateString()} • {invite.time}
          </div>
          <div className="mb-2 text-xs text-neutral-400">
            {invite.venueName}
          </div>
          <div className="mb-4 text-[11px] leading-snug text-neutral-500">
            {invite.address}
          </div>
          {invite.customMessage ? (
            <p className="mb-4 text-[11px] leading-snug text-neutral-300">
              {invite.customMessage}
            </p>
          ) : null}
          {invite.mapsUrl ? (
            <a
              href={invite.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-yellow-400 px-4 py-2 text-xs font-medium text-neutral-900"
            >
              Open in Google Maps
            </a>
          ) : null}
        </div>
      </div>
    </Html>
  );
}

function buildGoogleCalendarUrl(invite: Invite) {
  const start = new Date(invite.date);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

  const encodeDate = (value: Date) => {
    return value.toISOString().replace(/-|:|\.\d{3}/g, "");
  };

  const text = invite.eventTitle || "Event";
  const location = `${invite.venueName} ${invite.address}`;
  const details = invite.customMessage || "";

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text,
    dates: `${encodeDate(start)}/${encodeDate(end)}`,
    details,
    location,
  });

  return `https://www.google.com/calendar/render?${params.toString()}`;
}

export function InviteScene({ invite, slug }: Props) {
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    trackInviteView(slug).catch(() => undefined);
  }, [slug]);

  const handleDownloadPng = () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) {
      return;
    }
    const dataUrl = (canvas as HTMLCanvasElement).toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `invite-${slug}.png`;
    link.click();
  };

  const handleDownloadPdf = async () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) {
      return;
    }
    const dataUrl = (canvas as HTMLCanvasElement).toDataURL("image/png");
    setExporting(true);
    try {
      const blob = await exportInvitePdf(slug, dataUrl);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invite-${slug}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  const handleShareWhatsapp = () => {
    const url = window.location.href;
    const message = `${invite.eventTitle} - ${url}`;
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(shareUrl, "_blank");
  };

  const handleCopyLink = async () => {
    const url = window.location.href;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(url);
    }
  };

  const handleAddToCalendar = () => {
    const url = buildGoogleCalendarUrl(invite);
    window.open(url, "_blank");
  };

  return (
    <div className="relative min-h-screen">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 2]}
        className="min-h-screen"
      >
        <color attach="background" args={["#020617"]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[4, 6, 3]} intensity={0.8} />
        <mesh position={[0, 0, -4]}>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#0b1120" />
        </mesh>
        <InviteCard invite={invite} />
        <OrbitControls enablePan={false} enableZoom={false} />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center">
        <div className="pointer-events-auto mt-4 flex flex-wrap justify-center gap-2">
          <button
            className="rounded-full bg-neutral-800 px-3 py-1 text-xs text-neutral-100"
            onClick={handleDownloadPng}
          >
            Download PNG
          </button>
          <button
            className="rounded-full bg-neutral-800 px-3 py-1 text-xs text-neutral-100"
            onClick={handleDownloadPdf}
            disabled={exporting}
          >
            {exporting ? "Generating PDF..." : "Download PDF"}
          </button>
          <button
            className="rounded-full bg-neutral-800 px-3 py-1 text-xs text-neutral-100"
            onClick={handleShareWhatsapp}
          >
            Share WhatsApp
          </button>
          <button
            className="rounded-full bg-neutral-800 px-3 py-1 text-xs text-neutral-100"
            onClick={handleCopyLink}
          >
            Copy Link
          </button>
          <button
            className="rounded-full bg-neutral-800 px-3 py-1 text-xs text-neutral-100"
            onClick={handleAddToCalendar}
          >
            Add to Calendar
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { InviteFormValues, createInvite } from "../../src/lib/api-client/invites";

export default function CreateInvitePage() {
  const [loading, setLoading] = useState(false);
  const form = useForm<InviteFormValues>();

  async function onSubmit(values: InviteFormValues) {
    setLoading(true);
    try {
      const slug = await createInvite(values);
      window.location.href = `/invite/${slug}`;
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <form
        className="w-full max-w-md space-y-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <select
          className="w-full border px-3 py-2"
          {...form.register("eventCategory")}
          defaultValue="NIKKAH"
        >
          <option value="NIKKAH">Nikkah</option>
          <option value="MEHNDI">Mehndi</option>
          <option value="BARAAT">Baraat</option>
          <option value="WALIMA">Walima</option>
          <option value="BIRTHDAY">Birthday</option>
        </select>
        <input
          className="w-full border px-3 py-2"
          placeholder="Event title"
          {...form.register("eventTitle")}
        />
        <input
          className="w-full border px-3 py-2"
          placeholder="Names"
          {...form.register("primaryNames")}
        />
        <div className="flex gap-2">
          <input
            type="date"
            className="w-1/2 border px-3 py-2"
            {...form.register("eventDate")}
          />
          <input
            type="time"
            className="w-1/2 border px-3 py-2"
            {...form.register("eventTime")}
          />
        </div>
        <input
          className="w-full border px-3 py-2"
          placeholder="Venue name"
          {...form.register("venueName")}
        />
        <textarea
          className="w-full border px-3 py-2"
          placeholder="Full address"
          rows={3}
          {...form.register("address")}
        />
        <input
          className="w-full border px-3 py-2"
          placeholder="Google Maps link (optional)"
          {...form.register("mapsUrl")}
        />
        <textarea
          className="w-full border px-3 py-2"
          placeholder="Custom message (optional)"
          rows={3}
          {...form.register("customMessage")}
        />
        <select
          className="w-full border px-3 py-2"
          {...form.register("language")}
          defaultValue="EN"
        >
          <option value="EN">English</option>
          <option value="UR">Urdu</option>
          <option value="BOTH">English + Urdu</option>
        </select>
        <button
          className="mt-4 w-full bg-black text-white py-2"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create invite"}
        </button>
      </form>
    </main>
  );
}

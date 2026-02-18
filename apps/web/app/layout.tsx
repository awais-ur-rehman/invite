import "./../src/styles/globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "InvitePak",
  description: "Digital invitations for Pakistani events"
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  );
}

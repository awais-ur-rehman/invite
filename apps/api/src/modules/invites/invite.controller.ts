import { Request, Response } from "express";
import PDFDocument from "pdfkit";
import { createInviteSchema } from "./invite.schema";
import { createInviteAndReturnSlug, getInviteBySlug, trackInviteView } from "./invite.service";

export async function createInviteHandler(req: Request, res: Response) {
  const parseResult = createInviteSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  const slug = await createInviteAndReturnSlug(parseResult.data);

  return res.status(201).json({ slug });
}

export async function getInviteBySlugHandler(req: Request, res: Response) {
  const slug = req.params.slug;

  if (!slug) {
    return res.status(400).json({ error: "Missing slug" });
  }

  const invite = await getInviteBySlug(slug);

  if (!invite) {
    return res.status(404).json({ error: "Invite not found" });
  }

  return res.json(invite);
}

export async function exportInvitePdfHandler(req: Request, res: Response) {
  const slug = req.params.slug;
  const body = req.body as { imageData?: string };

  if (!slug) {
    return res.status(400).json({ error: "Missing slug" });
  }

  if (!body.imageData || !body.imageData.startsWith("data:image/png;base64,")) {
    return res.status(400).json({ error: "Invalid imageData" });
  }

  const base64 = body.imageData.replace(/^data:image\/png;base64,/, "");
  const imageBuffer = Buffer.from(base64, "base64");

  const doc = new PDFDocument({ size: "A4", margin: 0 });
  const chunks: Buffer[] = [];

  doc.on("data", (chunk) => {
    chunks.push(chunk);
  });

  doc.on("end", () => {
    const pdfBuffer = Buffer.concat(chunks);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="invite-${slug}.pdf"`
    );
    res.send(pdfBuffer);
  });

  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;

  doc.image(imageBuffer, 0, 0, { width: pageWidth, height: pageHeight });
  doc.end();
}

export async function trackInviteViewHandler(req: Request, res: Response) {
  const slug = req.params.slug;

  if (!slug) {
    return res.status(400).json({ error: "Missing slug" });
  }

  await trackInviteView(slug);

  return res.status(204).end();
}

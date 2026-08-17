import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { SITE } from "@/content/site";

export const runtime = "nodejs";

type Lead = {
  name: string; email: string; phone: string; message: string;
  reason?: string; locale?: string; source?: string; page?: string;
};

function valid(l: Partial<Lead>): l is Lead {
  return !!l.name && !!l.email && /.+@.+\..+/.test(l.email) && !!l.phone && !!l.message;
}

/* -------- forward the lead to the client's admin API (PDF p.5) --------
   The client already has an admin panel + database. When they provide the
   contact-form API, set LEAD_API_URL (+ optional LEAD_API_KEY) and every
   submission is POSTed there. Until then, leads append to data/leads.jsonl. */
async function forwardLead(lead: Lead) {
  const url = process.env.LEAD_API_URL;
  if (url) {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (process.env.LEAD_API_KEY) headers.Authorization = `Bearer ${process.env.LEAD_API_KEY}`;
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ ...lead, created_at: new Date().toISOString() }),
    });
    if (!res.ok) throw new Error(`lead api ${res.status}`);
    return "forwarded";
  }
  // Local fallback so nothing is lost before the API is wired. Serverless
  // filesystems are read-only, so this is best effort only.
  try {
    const file = path.join(process.cwd(), "data", "leads.jsonl");
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.appendFile(file, JSON.stringify({ ...lead, created_at: new Date().toISOString() }) + "\n", "utf8");
    return "file";
  } catch {
    return "unstored";
  }
}

/* -------- notify team + confirmation email: Resend REST if configured -------- */
async function sendEmails(lead: Lead) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LEAD_FROM_EMAIL; // e.g. "Blobex <hello@blobex.ca>"
  const team = process.env.LEAD_TEAM_EMAIL || SITE.email;
  if (!apiKey || !from) return "skipped";

  const send = (to: string, subject: string, html: string) =>
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject, html }),
    });

  // confirmation to the client
  await send(
    lead.email,
    lead.locale === "fr" ? "Merci — Blobex a bien reçu votre demande" : "Thanks — Blobex received your request",
    `<p>${lead.locale === "fr" ? "Bonjour" : "Hi"} ${lead.name},</p>
     <p>${lead.locale === "fr"
        ? "Merci de nous avoir contactés. Notre équipe vous répondra sous peu depuis Granby, au Québec."
        : "Thanks for reaching out. Our team will get back to you shortly from Granby, Quebec."}</p>
     <p>— Blobex</p>`
  );
  // internal notification
  await send(team, `New lead: ${lead.name} (${lead.reason || "—"})`,
    `<pre>${JSON.stringify(lead, null, 2)}</pre>`);
  return "sent";
}

export async function POST(req: Request) {
  let body: Partial<Lead>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  if (!valid(body)) return NextResponse.json({ error: "Missing required fields" }, { status: 422 });

  try {
    const stored = await forwardLead(body);
    const emailed = await sendEmails(body).catch(() => "error");
    return NextResponse.json({ ok: true, stored, emailed });
  } catch (err) {
    console.error("lead error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

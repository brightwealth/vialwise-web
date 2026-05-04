import { NextRequest, NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SubscribeBody = {
  email?: unknown;
};

export async function POST(req: NextRequest) {
  let body: SubscribeBody;
  try {
    body = (await req.json()) as SubscribeBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const apiKey = process.env.CONVERTKIT_API_KEY;
  const formId = process.env.CONVERTKIT_FORM_ID;

  if (apiKey && formId) {
    try {
      const res = await fetch(
        `https://api.convertkit.com/v3/forms/${formId}/subscribe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ api_key: apiKey, email }),
        },
      );

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("[subscribe] ConvertKit error", res.status, text);
        return NextResponse.json(
          { error: "Couldn't add you to the list. Try again in a moment." },
          { status: 502 },
        );
      }

      return NextResponse.json({ ok: true }, { status: 200 });
    } catch (err) {
      console.error("[subscribe] ConvertKit fetch failed", err);
      return NextResponse.json(
        { error: "Couldn't reach our subscription provider." },
        { status: 502 },
      );
    }
  }

  // Dev/preview fallback: log and accept so the form is testable before
  // ConvertKit is wired up. Replace with Supabase insert if preferred.
  console.info("[subscribe] (no provider configured) email=", email);
  return NextResponse.json({ ok: true, dev: true }, { status: 200 });
}

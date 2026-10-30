const TO_EMAIL = "jankanka6@seznam.cz";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as Record<string, string>)[c]);
}

export async function POST(req: Request) {
  let body: { name?: string; phone?: string; email?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ success: false, error: "invalid_body" }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const email = (body.email ?? "").trim();
  const message = (body.message ?? "").trim();

  if (!name || (!phone && !email)) {
    return Response.json({ success: false, error: "missing_fields" }, { status: 400 });
  }
  if (email && !EMAIL_RE.test(email)) {
    return Response.json({ success: false, error: "invalid_email" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return Response.json({ success: false, error: "server_misconfigured" }, { status: 500 });
  }

  const html = `
    <!DOCTYPE html>
    <html lang="cs">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body style="font-family: Arial, Helvetica, sans-serif;">
        <h2>Nová poptávka z webu – Kaňka žaluzie</h2>
        <p><strong>Jméno:</strong> ${escapeHtml(name)}</p>
        <p><strong>Telefon:</strong> ${escapeHtml(phone || "—")}</p>
        <p><strong>E-mail:</strong> ${escapeHtml(email || "—")}</p>
        <p><strong>Zpráva:</strong><br>${escapeHtml(message || "—").replace(/\n/g, "<br>")}</p>
      </body>
    </html>
  `.trim();

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Kaňka žaluzie <onboarding@resend.dev>",
        to: [TO_EMAIL],
        subject: `Nová poptávka z webu — ${name}`,
        html,
        reply_to: email || undefined,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("Resend send failed", res.status, text);
      return Response.json({ success: false, error: "send_failed" }, { status: 502 });
    }
  } catch (err) {
    console.error("Resend request error", err);
    return Response.json({ success: false, error: "send_failed" }, { status: 502 });
  }

  return Response.json({ success: true });
}

/**
 * Trip-request lead endpoint.
 *
 * Configure ONE delivery target in your hosting environment (e.g. Vercel → Settings → Environment Variables):
 *   TRIP_LEAD_WEBHOOK_URL   — any HTTPS endpoint that accepts JSON (Google Apps Script web app writing to a Sheet,
 *                             Zapier/Make webhook, Formspree, Slack incoming webhook, your CRM…)
 *   TRIP_LEAD_WEBHOOK_SECRET (optional) — sent as the X-Odiapedia-Secret header so the receiver can verify requests.
 *
 * If nothing is configured the endpoint answers { ok: false, fallback: "email" } and the form falls back to
 * opening a pre-filled email, so no request is ever silently lost.
 */

const MAX = { short: 120, long: 2000 };
const clean = (v: unknown, max = MAX.short) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);

export async function POST(req: Request) {
    let body: Record<string, unknown>;
    try {
        body = await req.json();
    } catch {
        return Response.json({ ok: false, error: "Invalid request" }, { status: 400 });
    }

    // Honeypot: real people never fill the hidden "website" field.
    if (clean(body.website)) return Response.json({ ok: true });

    const lead = {
        submittedAt: new Date().toISOString(),
        name: clean(body.name),
        email: clean(body.email),
        phone: clean(body.phone, 30),
        fromCity: clean(body.fromCity),
        startDate: clean(body.startDate, 20),
        flexibleDates: Boolean(body.flexibleDates),
        nights: clean(body.nights, 10),
        adults: clean(body.adults, 5),
        children: clean(body.children, 5),
        seniors: clean(body.seniors, 5),
        budget: clean(body.budget, 40),
        hotel: clean(body.hotel, 40),
        interests: Array.isArray(body.interests) ? body.interests.map((i) => clean(i, 40)).filter(Boolean).slice(0, 12) : [],
        accessibility: clean(body.accessibility, 500),
        message: clean(body.message, MAX.long),
        contactPreference: clean(body.contactPreference, 20),
        consentToShare: body.consentToShare === true,
        sourcePage: clean(body.sourcePage, 200),
    };

    if (!lead.name || !emailOk(lead.email)) {
        return Response.json({ ok: false, error: "Please enter your name and a valid email address." }, { status: 422 });
    }

    const url = process.env.TRIP_LEAD_WEBHOOK_URL;
    if (!url) {
        return Response.json({ ok: false, fallback: "email" }, { status: 200 });
    }

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                ...(process.env.TRIP_LEAD_WEBHOOK_SECRET ? { "x-odiapedia-secret": process.env.TRIP_LEAD_WEBHOOK_SECRET } : {}),
            },
            body: JSON.stringify(lead),
        });
        if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
        return Response.json({ ok: true });
    } catch (e) {
        console.error("trip-request delivery failed", e);
        return Response.json({ ok: false, fallback: "email" }, { status: 200 });
    }
}

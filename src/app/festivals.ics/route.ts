import { FESTIVAL_DATES } from "@/data/festival-dates";
import { SITE } from "@/lib/site";

/** iCalendar feed of Odia festival dates: subscribe once in Google, Apple or Outlook Calendar. */
export const dynamic = "force-static";

const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
const day = (iso: string) => iso.replace(/-/g, "");
const next = (iso: string) => {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10).replace(/-/g, "");
};
// Lines longer than 75 octets are folded (RFC 5545 §3.1).
const fold = (line: string) => {
    const out: string[] = [];
    let cur = "";
    for (const ch of line) {
        if (Buffer.byteLength(cur + ch) > 73) { out.push(cur); cur = " " + ch; } else cur += ch;
    }
    out.push(cur);
    return out.join("\r\n");
};

export function GET() {
    const lines = [
        "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Odiapedia//Odia festivals//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
        "X-WR-CALNAME:Odia festivals (Odiapedia)", "X-WR-TIMEZONE:Asia/Kolkata", "REFRESH-INTERVAL;VALUE=DURATION:P7D",
    ];
    for (const f of FESTIVAL_DATES) {
        lines.push(
            "BEGIN:VEVENT",
            `UID:${day(f.start)}-${f.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}@odiapedia.com`,
            "DTSTAMP:20261001T000000Z",
            `DTSTART;VALUE=DATE:${day(f.start)}`,
            `DTEND;VALUE=DATE:${next(f.end || f.start)}`,
            `SUMMARY:${esc(`${f.name} (${f.odia})`)}`,
            `DESCRIPTION:${esc(`${f.note ? f.note + ". " : ""}Source: ${f.source}.${f.href ? ` ${SITE.url}${f.href}` : ""}`)}`,
            ...(f.href ? [`URL:${SITE.url}${f.href}`] : []),
            "TRANSP:TRANSPARENT",
            "END:VEVENT",
        );
    }
    lines.push("END:VCALENDAR");
    return new Response(lines.map(fold).join("\r\n") + "\r\n", {
        headers: { "Content-Type": "text/calendar; charset=utf-8", "Cache-Control": "public, max-age=3600, s-maxage=86400" },
    });
}

import { getLanguagePairs } from "@/lib/lang-map";

// English ↔ Odia page pairs for the language switcher, fetched when it is used.
export const dynamic = "force-static";

export function GET() {
    return Response.json(getLanguagePairs(), { headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" } });
}

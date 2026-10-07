import { getSearchIndex } from "@/lib/mdx";

// Fetched by the search box only when it is opened, instead of being embedded in every page.
export const dynamic = "force-static";

export function GET() {
    return Response.json(getSearchIndex(), { headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" } });
}

/** GitHub-style slug used for heading anchors (kept in sync with the MDX heading components). */
export function slugifyHeading(text: string): string {
    return text
        .toLowerCase()
        .replace(/<[^>]+>/g, "")
        .replace(/[*_`~]/g, "")
        .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
        .replace(/[^a-z0-9\u0B00-\u0B7F\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
}

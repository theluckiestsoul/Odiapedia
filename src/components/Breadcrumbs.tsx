import Link from "next/link";
import JsonLd from "./JsonLd";
import { breadcrumbJsonLd, type Crumb } from "@/lib/seo";

/** Visible breadcrumb trail + BreadcrumbList structured data. The last crumb is the current page. */
export default function Breadcrumbs({ items, tone = "dark" }: { items: Crumb[]; tone?: "dark" | "light" }) {
    const all: Crumb[] = [{ name: "Home", href: "/" }, ...items];
    const base = tone === "light" ? "text-sand-200/80 hover:text-white" : "text-ink-500 hover:text-laterite-600";
    const current = tone === "light" ? "text-white" : "text-ink-800";
    return (
        <>
            <JsonLd data={breadcrumbJsonLd(all)} />
            <nav aria-label="Breadcrumb" className="text-sm">
                <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    {all.map((c, i) => {
                        const last = i === all.length - 1;
                        return (
                            <li key={c.href + i} className="flex items-center gap-2">
                                {last ? (
                                    <span aria-current="page" className={`${current} line-clamp-1 font-medium`}>{c.name}</span>
                                ) : (
                                    <Link href={c.href} className={`${base} transition-colors`}>{c.name}</Link>
                                )}
                                {!last && <span className={tone === "light" ? "text-sand-300/50" : "text-sand-400"} aria-hidden="true">/</span>}
                            </li>
                        );
                    })}
                </ol>
            </nav>
        </>
    );
}

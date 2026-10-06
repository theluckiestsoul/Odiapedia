import type { MDXComponents } from "mdx/types";
import type { ReactNode } from "react";
import { isValidElement } from "react";
import Link from "next/link";
import LanguageSelector from "@/components/LanguageSelector";
import Countdown from "@/components/Countdown";
import { slugifyHeading } from "@/lib/slug";

/** Plain text of MDX children (used to build heading anchors that match the table of contents). */
function textOf(node: ReactNode): string {
    if (node == null || typeof node === "boolean") return "";
    if (typeof node === "string" || typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(textOf).join("");
    if (isValidElement(node)) return textOf((node.props as { children?: ReactNode }).children);
    return "";
}

/**
 * Typography lives in globals.css (`.article-body`), so components here only add behaviour:
 * heading anchors, internal links via next/link, safe external links and scrollable tables.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        h1: ({ children }) => <h2 id={slugifyHeading(textOf(children))}>{children}</h2>,
        h2: ({ children }) => <h2 id={slugifyHeading(textOf(children))}>{children}</h2>,
        h3: ({ children }) => <h3 id={slugifyHeading(textOf(children))}>{children}</h3>,

        a: ({ href, children }) => {
            if (href?.startsWith("/")) {
                return <Link href={href}>{children}</Link>;
            }
            if (href?.startsWith("#")) {
                return <a href={href}>{children}</a>;
            }
            return (
                <a href={href} target="_blank" rel="noopener noreferrer">
                    {children}
                </a>
            );
        },

        table: ({ children }) => (
            <div className="table-wrap">
                <table>{children}</table>
            </div>
        ),

        // Components available inside MDX files
        LanguageSelector,
        Countdown,

        ...components,
    };
}

import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import LanguageSelector from "@/components/LanguageSelector";
import Countdown from "@/components/Countdown";

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        // Headings
        h1: ({ children }) => (
            <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-6 mt-12 first:mt-0 font-display">
                {children}
            </h1>
        ),
        h2: ({ children }) => (
            <h2 className="text-3xl font-bold text-amber-800 mb-4 mt-10 font-display">
                {children}
            </h2>
        ),
        h3: ({ children }) => (
            <h3 className="text-2xl font-semibold text-amber-700 mb-3 mt-8">
                {children}
            </h3>
        ),
        h4: ({ children }) => (
            <h4 className="text-xl font-semibold text-amber-600 mb-2 mt-6">
                {children}
            </h4>
        ),

        // Paragraphs
        p: ({ children }) => (
            <p className="text-amber-900/80 leading-relaxed mb-6 text-lg">
                {children}
            </p>
        ),

        // Lists
        ul: ({ children }) => (
            <ul className="list-none space-y-3 mb-6 ml-4">
                {children}
            </ul>
        ),
        ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-3 mb-6 ml-4 text-amber-900/80">
                {children}
            </ol>
        ),
        li: ({ children }) => (
            <li className="text-amber-900/80 flex items-start gap-3">
                <span className="text-amber-600 mt-1">✦</span>
                <span>{children}</span>
            </li>
        ),

        // Links
        a: ({ href, children }) => {
            const isInternal = href?.startsWith("/");
            if (isInternal) {
                return (
                    <Link
                        href={href}
                        className="text-amber-700 hover:text-amber-600 underline underline-offset-4 transition-colors"
                    >
                        {children}
                    </Link>
                );
            }
            return (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-700 hover:text-amber-600 underline underline-offset-4 transition-colors"
                >
                    {children}
                </a>
            );
        },

        // Blockquote
        blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-amber-600 pl-6 my-8 italic text-amber-900/80 bg-amber-50 py-4 pr-4 rounded-r-lg">
                {children}
            </blockquote>
        ),

        // Code
        code: ({ children }) => (
            <code className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-sm font-mono">
                {children}
            </code>
        ),
        pre: ({ children }) => (
            <pre className="bg-amber-950 border border-amber-900/10 rounded-lg p-6 overflow-x-auto mb-6 text-amber-50 font-mono text-lg leading-relaxed">
                {children}
            </pre>
        ),

        // Horizontal Rule
        hr: () => (
            <div className="my-12 flex items-center justify-center gap-4">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-600"></div>
                <div className="w-2 h-2 rotate-45 bg-amber-500"></div>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-600"></div>
            </div>
        ),

        // Strong/Bold
        strong: ({ children }) => (
            <strong className="text-amber-800 font-semibold">{children}</strong>
        ),

        // Emphasis/Italic
        em: ({ children }) => (
            <em className="text-amber-900/90 italic">{children}</em>
        ),

        // Table - all elements needed for proper rendering
        table: ({ children }) => (
            <div className="overflow-x-auto mb-8 rounded-lg border border-amber-200">
                <table className="w-full table-auto min-w-full text-left">{children}</table>
            </div>
        ),
        thead: ({ children }) => (
            <thead className="bg-amber-100 border-b border-amber-200">{children}</thead>
        ),
        tbody: ({ children }) => (
            <tbody className="divide-y divide-amber-100">{children}</tbody>
        ),
        tr: ({ children }) => (
            <tr className="hover:bg-amber-50 transition-colors">{children}</tr>
        ),
        th: ({ children }) => (
            <th className="bg-amber-50 text-amber-900 font-semibold px-4 py-3 text-left text-base whitespace-nowrap">
                {children}
            </th>
        ),
        td: ({ children }) => (
            <td className="text-amber-900/80 px-4 py-3 text-base odia-text align-middle">
                {children}
            </td>
        ),

        // Language Selector for multi-language articles
        LanguageSelector,
        Countdown,

        ...components,
    };
}


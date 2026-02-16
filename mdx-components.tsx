import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import LanguageSelector from "@/components/LanguageSelector";
import Countdown from "@/components/Countdown";

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        // Headings
        h1: ({ children }) => (
            <h1 className="text-4xl md:text-5xl font-bold text-teal-900 mb-6 mt-12 first:mt-0 tracking-wide font-display">
                {children}
            </h1>
        ),
        h2: ({ children }) => (
            <h2 className="text-3xl font-bold text-teal-800 mb-4 mt-10 tracking-wide font-display border-b-2 border-teal-100 pb-2 inline-block">
                {children}
            </h2>
        ),
        h3: ({ children }) => (
            <h3 className="text-2xl font-semibold text-teal-800 mb-3 mt-8 tracking-wide font-display">
                {children}
            </h3>
        ),
        h4: ({ children }) => (
            <h4 className="text-xl font-semibold text-teal-700 mb-2 mt-6 tracking-wide font-display">
                {children}
            </h4>
        ),

        // Paragraphs
        p: ({ children }) => (
            <p className="text-slate-700 leading-relaxed mb-6 text-lg font-sans">
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
            <ol className="list-decimal list-inside space-y-3 mb-6 ml-4 text-slate-700">
                {children}
            </ol>
        ),
        li: ({ children }) => (
            <li className="text-slate-700 flex items-start gap-3">
                <span className="text-rose-500 mt-1.5 text-sm">✦</span>
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
                        className="text-teal-700 hover:text-teal-900 underline underline-offset-4 transition-colors font-medium decoration-rose-300 hover:decoration-rose-500"
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
                    className="text-orange-600 hover:text-orange-700 underline underline-offset-4 transition-colors font-medium"
                >
                    {children}
                </a>
            );
        },

        // Blockquote
        blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-rose-400 pl-6 my-8 italic text-slate-700 bg-rose-50/50 py-6 pr-6 rounded-r-lg font-display text-xl leading-relaxed">
                {children}
            </blockquote>
        ),

        // Code
        code: ({ children }) => (
            <code className="bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono border border-slate-300">
                {children}
            </code>
        ),
        pre: ({ children }) => (
            <pre className="bg-slate-900 border border-slate-800 rounded-xl p-6 overflow-x-auto mb-8 text-slate-100 font-mono text-sm leading-relaxed shadow-lg ring-1 ring-white/10">
                {children}
            </pre>
        ),

        // Horizontal Rule
        hr: () => (
            <hr className="my-12 border-slate-200" />
        ),

        // Strong/Bold
        strong: ({ children }) => (
            <strong className="text-slate-900 font-bold">{children}</strong>
        ),

        // Emphasis/Italic
        em: ({ children }) => (
            <em className="text-slate-800 italic font-display">{children}</em>
        ),

        // Table - all elements needed for proper rendering
        table: ({ children }) => (
            <div className="overflow-x-auto mb-8 rounded-lg border border-slate-200 shadow-sm">
                <table className="w-full table-auto min-w-full text-left">{children}</table>
            </div>
        ),
        thead: ({ children }) => (
            <thead className="bg-slate-100 border-b border-slate-200 font-display">{children}</thead>
        ),
        tbody: ({ children }) => (
            <tbody className="divide-y divide-slate-100">{children}</tbody>
        ),
        tr: ({ children }) => (
            <tr className="hover:bg-teal-50/30 transition-colors">{children}</tr>
        ),
        th: ({ children }) => (
            <th className="bg-slate-50 text-slate-900 font-bold px-6 py-4 text-left text-sm whitespace-nowrap">
                {children}
            </th>
        ),
        td: ({ children }) => (
            <td className="text-slate-600 px-6 py-4 text-sm odia-text align-middle">
                {children}
            </td>
        ),

        // Language Selector for multi-language articles
        LanguageSelector,
        Countdown,

        ...components,
    };
}

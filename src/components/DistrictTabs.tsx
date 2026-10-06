"use client";

import { useEffect, useState } from "react";
import Icon from "./Icon";
import type { IconName } from "@/lib/site";

export interface DistrictTab {
    id: string;
    label: string;
    icon: IconName;
}

/**
 * Category tabs for long district pages. Every panel is rendered on the server (so search engines and
 * AI crawlers see all content); the browser just shows one panel at a time. The active tab is kept in
 * the URL hash so tabs can be linked and shared (e.g. /district/puri#places).
 */
export default function DistrictTabs({ tabs, panels }: { tabs: DistrictTab[]; panels: React.ReactNode[] }) {
    const [active, setActive] = useState(tabs[0]?.id);
    const [js, setJs] = useState(false);

    useEffect(() => {
        setJs(true);
        const fromHash = () => {
            const h = decodeURIComponent(window.location.hash.slice(1));
            if (tabs.some((t) => t.id === h)) setActive(h);
        };
        fromHash();
        window.addEventListener("hashchange", fromHash);
        return () => window.removeEventListener("hashchange", fromHash);
    }, [tabs]);

    const select = (id: string) => {
        setActive(id);
        history.replaceState(null, "", `#${id}`);
        document.getElementById("district-tabs")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <div id="district-tabs" className="scroll-mt-20">
            <div className="sticky top-[4.5rem] z-30 -mx-4 border-b border-sand-200 bg-background/95 px-4 backdrop-blur sm:mx-0 sm:px-0">
                <div role="tablist" aria-label="District sections" className="scrollbar-none flex gap-1 overflow-x-auto py-2">
                    {tabs.map((t) => (
                        <button
                            key={t.id}
                            role="tab"
                            type="button"
                            id={`tab-${t.id}`}
                            aria-selected={active === t.id}
                            aria-controls={`panel-${t.id}`}
                            onClick={() => select(t.id)}
                            className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${active === t.id ? "bg-laterite-500 text-white" : "text-ink-700 hover:bg-sand-100"}`}
                        >
                            <Icon name={t.icon} className="h-4 w-4" />
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>
            {tabs.map((t, i) => (
                <section
                    key={t.id}
                    id={`panel-${t.id}`}
                    role="tabpanel"
                    aria-labelledby={`tab-${t.id}`}
                    // Before hydration every panel is visible (no-JS readers and crawlers get the full page).
                    className={js && active !== t.id ? "hidden" : "pt-8"}
                >
                    {panels[i]}
                </section>
            ))}
        </div>
    );
}

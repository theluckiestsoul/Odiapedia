import type { IconName } from "@/lib/site";

/**
 * Small, consistent line-icon set (24x24, stroke = currentColor).
 * Replaces emoji icons so the site renders identically on every device.
 */
const PATHS: Record<IconName, React.ReactNode> = {
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" /><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5" /></>,
    language: <><path d="M4 5h9M8.5 3v2M6 5c.6 3.3 2.6 6 6 7.5" /><path d="M11 5c-.8 3.6-3.3 6.5-7 8" /><path d="m13 21 4.5-10L22 21M14.6 17.5h5.8" /></>,
    mask: <><path d="M4 5c3 1.3 5.7 1.3 8 0s5-1.3 8 0v6c0 5-3.6 9-8 9s-8-4-8-9z" /><path d="M8.5 11h1.5M14 11h1.5M9.5 15.5c1.5 1 3.5 1 5 0" /></>,
    temple: <><path d="M12 2v3M8 21V11.5c0-3 1.8-5.6 4-6.5 2.2.9 4 3.5 4 6.5V21" /><path d="M5 21h14M4 21v-6h4M20 21v-6h-4M10.5 21v-3.5a1.5 1.5 0 0 1 3 0V21" /></>,
    scroll: <><path d="M7 3h11a2 2 0 0 1 2 2v12" /><path d="M7 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-2H9v2a2 2 0 0 1-2 2" /><path d="M9 8h7M9 12h7" /></>,
    calendar: <><rect x="3" y="4.5" width="18" height="17" rx="2.5" /><path d="M3 9.5h18M8 2.5v4M16 2.5v4M7.5 14h2M11 14h2M14.5 14h2M7.5 17.5h2M11 17.5h2" /></>,
    bowl: <><path d="M3 11h18a9 9 0 0 1-18 0z" /><path d="M7 21h10M9 7c0-1.5 1-1.5 1-3M12.5 7c0-1.5 1-1.5 1-3" /></>,
    people: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5" /><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.8c2 .7 3.2 2.5 3.5 5.2" /></>,
    pin: <><path d="M12 21.5s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z" /><circle cx="12" cy="9.5" r="2.5" /></>,
    map: <><path d="m9 4-6 2.5v14L9 18l6 2.5 6-2.5v-14L15 6.5z" /><path d="M9 4v14M15 6.5v14" /></>,
    compass: <><circle cx="12" cy="12" r="9.5" /><path d="m15.5 8.5-2 5-5 2 2-5z" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20.5 20.5-4.5-4.5" /></>,
    arrow: <path d="M4 12h15M13 6l6 6-6 6" />,
    arrowLeft: <path d="M20 12H5M11 6l-6 6 6 6" />,
    leaf: <><path d="M5 19c0-9 6-14 15-14 0 9-5 15-14 15" /><path d="M5 19c3-5 6-7.5 10-9.5" /></>,
    wave: <><path d="M2 9c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" /><path d="M2 15c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" /></>,
    sparkle: <path d="M12 3c.5 4.5 2 7 7 9-5 2-6.5 4.5-7 9-.5-4.5-2-7-7-9 5-2 6.5-4.5 7-9z" />,
    shop: <><path d="M4 8h16l-1.3 11.2a2 2 0 0 1-2 1.8H7.3a2 2 0 0 1-2-1.8z" /><path d="M8.5 10.5V7a3.5 3.5 0 0 1 7 0v3.5" /></>,
    handshake: <><path d="m11 17 2 2a1.4 1.4 0 0 0 2-2" /><path d="m14 14 2.5 2.5a1.4 1.4 0 0 0 2-2L15 11l-3 1.5-1.5-1.5L14 8l5 1 3-1V4l-3 1-4-1-3 1.8L9 4 6 5 2 4v8l2 .5 6 6a1.4 1.4 0 0 0 2-2" /></>,
    info: <><circle cx="12" cy="12" r="9.5" /><path d="M12 11v6M12 7.5v.5" /></>,
    globe: <><circle cx="12" cy="12" r="9.5" /><path d="M2.5 12h19M12 2.5c2.6 2.6 4 6 4 9.5s-1.4 6.9-4 9.5c-2.6-2.6-4-6-4-9.5s1.4-6.9 4-9.5z" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8 6 18M18 6l1.8-1.8" /></>,
    moon: <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />,
    clock: <><circle cx="12" cy="12" r="9.5" /><path d="M12 6.5V12l3.5 2" /></>,
    check: <path d="m4.5 12.5 5 5 10-11" />,
    external: <><path d="M14 4h6v6M20 4l-9 9" /><path d="M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" /></>,
    chevron: <path d="m6 9 6 6 6-6" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="M6 6l12 12M18 6 6 18" />,
    quote: <path d="M9.5 7C6.5 8 5 10.3 5 13.5V18h5v-5H7.5c0-2 .8-3.3 2.5-4zM19 7c-3 1-4.5 3.3-4.5 6.5V18h5v-5H17c0-2 .8-3.3 2.5-4z" />,
    shield: <><path d="M12 2.5 4 5.5v6c0 5 3.4 8.8 8 10 4.6-1.2 8-5 8-10v-6z" /><path d="m8.5 12 2.5 2.5 4.5-5" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 6.5 8.5 6.5 8.5-6.5" /></>,
    suitcase: <><rect x="3" y="7" width="18" height="13" rx="2.5" /><path d="M8.5 7V5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2M3 12.5h18M10 12.5v2h4v-2" /></>,
    wheel: <><circle cx="12" cy="12" r="9.5" /><circle cx="12" cy="12" r="2.2" /><path d="M12 2.5v7.3M12 14.2v7.3M2.5 12h7.3M14.2 12h7.3M5.3 5.3l5.1 5.1M13.6 13.6l5.1 5.1M18.7 5.3l-5.1 5.1M10.4 13.6l-5.1 5.1" /></>,
    flag: <><path d="M5 21V3.5" /><path d="M5 4h11l-2 4 2 4H5" /></>,
    pen: <><path d="M15.5 4.5 19.5 8.5 9 19H5v-4z" /><path d="m13 7 4 4" /></>,
    list: <path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" />,
    star: <path d="m12 3 2.8 5.8 6.2.9-4.5 4.4 1 6.3L12 17.5l-5.5 2.9 1-6.3L3 9.7l6.2-.9z" />,
    hourglass: <><path d="M6 2.5h12M6 21.5h12M7 2.5c0 5 10 5 10 9.5S7 16.5 7 21.5M17 2.5c0 5-10 5-10 9.5s10 4.5 10 9.5" /></>,
    boat: <><path d="M3 15h18l-2.5 5h-13z" /><path d="M12 3v12M12 4l6 8h-6M12 6.5 7.5 12H12" /></>,
};

export default function Icon({
    name,
    className = "w-5 h-5",
    strokeWidth = 1.6,
    title,
}: {
    name: IconName;
    className?: string;
    strokeWidth?: number;
    title?: string;
}) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden={title ? undefined : true}
            role={title ? "img" : undefined}
        >
            {title ? <title>{title}</title> : null}
            {PATHS[name]}
        </svg>
    );
}

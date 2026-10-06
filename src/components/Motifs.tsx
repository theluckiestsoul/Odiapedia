/**
 * Decorative, original SVG motifs inspired by Odisha's visual heritage
 * (a stylised chariot wheel and a temple-spire silhouette). Purely ornamental: aria-hidden.
 */

export function ChariotWheel({ className = "", spokes = 16 }: { className?: string; spokes?: number }) {
    const s = Array.from({ length: spokes }, (_, i) => (i * 360) / spokes);
    return (
        <svg viewBox="0 0 200 200" className={className} aria-hidden="true" fill="none" stroke="currentColor">
            <circle cx="100" cy="100" r="94" strokeWidth="5" />
            <circle cx="100" cy="100" r="84" strokeWidth="1.5" strokeDasharray="2 5" />
            <circle cx="100" cy="100" r="74" strokeWidth="2.5" />
            <circle cx="100" cy="100" r="18" strokeWidth="4" />
            <circle cx="100" cy="100" r="8" fill="currentColor" stroke="none" />
            {s.map((deg, i) => (
                <g key={deg} transform={`rotate(${deg} 100 100)`}>
                    <path d={i % 2 === 0 ? "M100 82 L100 26" : "M100 82 L100 34"} strokeWidth={i % 2 === 0 ? 4 : 2} strokeLinecap="round" />
                    {i % 2 === 0 ? <circle cx="100" cy="52" r="5" strokeWidth="2" /> : null}
                </g>
            ))}
            {s.map((deg) => (
                <circle key={`b${deg}`} cx="100" cy="11" r="3" transform={`rotate(${deg + 360 / spokes / 2} 100 100)`} fill="currentColor" stroke="none" />
            ))}
        </svg>
    );
}

export function TempleSkyline({ className = "" }: { className?: string }) {
    return (
        <svg viewBox="0 0 600 120" preserveAspectRatio="xMidYMax slice" className={className} aria-hidden="true" fill="currentColor">
            <path d="M0 120V96h40v-8h14V70c0-8 6-16 12-20 6 4 12 12 12 20v18h16v-8h20v-30c0-14 9-28 20-34 11 6 20 20 20 34v30h18V60c0-18 12-36 26-44l2-10 2 10c14 8 26 26 26 44v30h22v-14c0-10 7-20 15-24 8 4 15 14 15 24v14h20v-6h18V58c0-12 8-24 18-30 10 6 18 18 18 30v26h14v12h40v-8h24V76c0-7 5-13 10-16 5 3 10 9 10 16v20h30v24z" />
        </svg>
    );
}

/** Thin ornamental divider with a diamond centre (ikat-like). */
export function OrnamentDivider({ className = "" }: { className?: string }) {
    return (
        <div className={`flex items-center gap-3 ${className}`} aria-hidden="true">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-sand-300 to-sand-300" />
            <span className="h-2 w-2 rotate-45 bg-laterite-400" />
            <span className="h-2.5 w-2.5 rotate-45 border border-saffron-500" />
            <span className="h-2 w-2 rotate-45 bg-laterite-400" />
            <span className="h-px flex-1 bg-gradient-to-l from-transparent via-sand-300 to-sand-300" />
        </div>
    );
}

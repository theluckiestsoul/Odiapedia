import type { Result } from "@/lib/elections";
import { partyColor } from "@/lib/elections";

const fmt = (n: number | null | undefined) => (n == null ? "–" : n.toLocaleString("en-IN"));

/** Candidate-wise result table with vote-share bars. */
export default function ElectionResult({ r }: { r: Result }) {
    const max = Math.max(...r.candidates.map((c) => c.pct ?? 0), 1);
    return (
        <div className="overflow-hidden rounded-2xl border border-sand-200 bg-white">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-sand-200 bg-sand-50 px-5 py-3">
                <h3 className="font-display text-lg font-semibold">{r.year}{r.bypoll ? " by-election" : ""}</h3>
                <p className="text-xs text-ink-500">
                    {r.turnout?.pct != null ? `Turnout ${r.turnout.pct}%` : ""}
                    {r.turnout?.votes ? ` · ${fmt(r.turnout.votes)} votes` : ""}
                    {r.majority?.votes ? ` · Margin ${fmt(r.majority.votes)}` : ""}
                </p>
            </div>
            <table className="w-full text-sm">
                <tbody className="divide-y divide-sand-100">
                    {r.candidates.map((c, i) => (
                        <tr key={`${c.name}${i}`} className={c.won ? "bg-[#f3f8ef]" : ""}>
                            <td className="w-[42%] px-5 py-2">
                                <span className="font-semibold text-ink-900">{c.name}</span>
                                {c.won && <span className="ml-2 rounded-full bg-[#5f8f4e] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">Won</span>}
                                <span className="block text-xs text-ink-500">{c.party}</span>
                            </td>
                            <td className="px-3 py-2">
                                <div className="h-2.5 overflow-hidden rounded-full bg-sand-100">
                                    <div className="h-full rounded-full" style={{ width: `${((c.pct ?? 0) / max) * 100}%`, background: partyColor(c.party) }} />
                                </div>
                            </td>
                            <td className="w-24 px-3 py-2 text-right tabular-nums">{c.pct != null ? `${c.pct}%` : "–"}</td>
                            <td className="w-28 px-5 py-2 text-right tabular-nums text-ink-600">{fmt(c.votes)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {r.partial && <p className="border-t border-sand-100 px-5 py-2 text-xs text-ink-500">Winner and runner-up only, from the statewide results table.</p>}
        </div>
    );
}

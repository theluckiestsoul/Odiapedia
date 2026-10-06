"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "./Icon";
import { SITE } from "@/lib/site";

const INTERESTS = ["Temples & heritage", "Jagannath & Puri", "Beaches", "Wildlife & forests", "Chilika & birding", "Crafts & artisan villages", "Food", "Buddhist sites", "Tribal culture (responsible)", "Festivals", "Photography", "Relaxed / family pace"];

type Status = "idle" | "sending" | "sent" | "fallback" | "error";

export default function TripPlannerForm() {
    const [status, setStatus] = useState<Status>("idle");
    const [error, setError] = useState("");
    const [mailto, setMailto] = useState("");

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        const fd = new FormData(e.currentTarget);
        const data = {
            name: fd.get("name"), email: fd.get("email"), phone: fd.get("phone"), fromCity: fd.get("fromCity"),
            startDate: fd.get("startDate"), flexibleDates: fd.get("flexibleDates") === "on", nights: fd.get("nights"),
            adults: fd.get("adults"), children: fd.get("children"), seniors: fd.get("seniors"), budget: fd.get("budget"),
            hotel: fd.get("hotel"), interests: fd.getAll("interests"), accessibility: fd.get("accessibility"),
            message: fd.get("message"), contactPreference: fd.get("contactPreference"),
            consentToShare: fd.get("consentToShare") === "on", website: fd.get("website"),
            sourcePage: typeof window !== "undefined" ? document.referrer : "",
        };
        setStatus("sending");
        try {
            const res = await fetch("/api/trip-request", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
            const json = await res.json().catch(() => ({}));
            if (json.ok) {
                setStatus("sent");
                return;
            }
            if (json.fallback === "email") {
                const lines = Object.entries(data)
                    .filter(([k, v]) => k !== "website" && v !== "" && v !== null && !(Array.isArray(v) && v.length === 0))
                    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : String(v)}`);
                const href = `mailto:${SITE.email}?subject=${encodeURIComponent("Odisha trip request – " + String(data.name || ""))}&body=${encodeURIComponent(lines.join("\n"))}`;
                setMailto(href);
                setStatus("fallback");
                window.location.href = href;
                return;
            }
            setError(json.error || "Something went wrong. Please try again.");
            setStatus("error");
        } catch {
            setError("Could not send your request. Please check your connection and try again.");
            setStatus("error");
        }
    }

    if (status === "sent") {
        return (
            <div className="card p-8 text-center md:p-12" role="status">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-chilika-500/10 text-chilika-600"><Icon name="check" className="h-7 w-7" /></span>
                <h2 className="mt-5 font-display text-3xl font-semibold">Thank you — request received</h2>
                <p className="mx-auto mt-3 max-w-md text-ink-600">We&apos;ll reply by email, usually within two working days. Meanwhile, browse our <Link href="/travel" className="text-laterite-600 underline">destination guides</Link>.</p>
            </div>
        );
    }

    const field = "mt-1.5 w-full rounded-xl border border-sand-300 bg-white px-4 py-3 text-ink-900 outline-none transition focus:border-laterite-400 focus:ring-2 focus:ring-laterite-100";
    const label = "text-sm font-semibold text-ink-800";

    return (
        <form onSubmit={onSubmit} className="card space-y-8 p-6 md:p-10" noValidate={false}>
            {/* honeypot */}
            <div className="hidden" aria-hidden="true">
                <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
            </div>

            <fieldset className="space-y-5">
                <legend className="font-display text-2xl font-semibold">About you</legend>
                <div className="grid gap-5 md:grid-cols-2">
                    <label className="block"><span className={label}>Your name *</span><input name="name" required autoComplete="name" className={field} /></label>
                    <label className="block"><span className={label}>Email *</span><input name="email" type="email" required autoComplete="email" className={field} /></label>
                    <label className="block"><span className={label}>Phone / WhatsApp <span className="font-normal text-ink-500">(optional)</span></span><input name="phone" type="tel" autoComplete="tel" className={field} /></label>
                    <label className="block"><span className={label}>Travelling from</span><input name="fromCity" placeholder="e.g. Delhi, Bengaluru, London" className={field} /></label>
                </div>
            </fieldset>

            <fieldset className="space-y-5">
                <legend className="font-display text-2xl font-semibold">Your trip</legend>
                <div className="grid gap-5 md:grid-cols-3">
                    <label className="block"><span className={label}>Arrival date</span><input name="startDate" type="date" className={field} /></label>
                    <label className="block"><span className={label}>Nights</span>
                        <select name="nights" className={field} defaultValue="4">
                            {["2", "3", "4", "5", "6", "7", "8-10", "11+"].map((n) => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </label>
                    <label className="flex items-end gap-2 pb-3 text-sm text-ink-700"><input name="flexibleDates" type="checkbox" className="h-4 w-4 accent-laterite-500" /> My dates are flexible</label>
                </div>
                <div className="grid grid-cols-3 gap-5">
                    <label className="block"><span className={label}>Adults</span><input name="adults" type="number" min={1} max={50} defaultValue={2} className={field} /></label>
                    <label className="block"><span className={label}>Children</span><input name="children" type="number" min={0} max={30} defaultValue={0} className={field} /></label>
                    <label className="block"><span className={label}>Seniors (60+)</span><input name="seniors" type="number" min={0} max={30} defaultValue={0} className={field} /></label>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                    <label className="block"><span className={label}>Budget per person (excluding flights)</span>
                        <select name="budget" className={field} defaultValue="">
                            <option value="">Prefer not to say</option>
                            <option>Under ₹10,000</option>
                            <option>₹10,000 – ₹25,000</option>
                            <option>₹25,000 – ₹50,000</option>
                            <option>Above ₹50,000</option>
                        </select>
                    </label>
                    <label className="block"><span className={label}>Stay preference</span>
                        <select name="hotel" className={field} defaultValue="Comfortable mid-range">
                            <option>Budget</option>
                            <option>Comfortable mid-range</option>
                            <option>Premium</option>
                            <option>Heritage / homestay</option>
                        </select>
                    </label>
                </div>
                <div>
                    <p className={label}>Interests</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {INTERESTS.map((i) => (
                            <label key={i} className="cursor-pointer">
                                <input type="checkbox" name="interests" value={i} className="peer sr-only" />
                                <span className="chip !px-3.5 !py-2 !text-sm transition-colors peer-checked:!border-laterite-400 peer-checked:!bg-laterite-50 peer-checked:!text-laterite-700 peer-focus-visible:ring-2 peer-focus-visible:ring-laterite-300">{i}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <label className="block"><span className={label}>Mobility or accessibility needs</span><input name="accessibility" placeholder="e.g. wheelchair user, limited walking, dietary needs" className={field} /></label>
                <label className="block"><span className={label}>Anything else?</span><textarea name="message" rows={4} placeholder="Festivals you'd like to see, places you've already visited, must-dos…" className={field} /></label>
            </fieldset>

            <fieldset className="space-y-4 rounded-2xl bg-sand-100 p-5">
                <legend className="sr-only">Consent</legend>
                <label className="flex items-start gap-3 text-sm text-ink-700">
                    <input name="consentToShare" type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 accent-laterite-500" />
                    <span>I agree that Odiapedia may share this request with up to two vetted Odisha travel partners so they can send me an itinerary and quote. <Link href="/about/privacy-policy" className="underline">Privacy policy</Link></span>
                </label>
                <label className="flex items-center gap-3 text-sm text-ink-700">
                    <span>Preferred contact:</span>
                    <select name="contactPreference" className="rounded-lg border border-sand-300 bg-white px-3 py-1.5" defaultValue="Email">
                        <option>Email</option>
                        <option>WhatsApp</option>
                        <option>Phone call</option>
                    </select>
                </label>
            </fieldset>

            {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
            {status === "fallback" && (
                <p className="rounded-xl bg-saffron-100 p-3 text-sm text-ink-800" role="status">
                    Your email app should open with the request filled in — just press send. If it didn&apos;t, <a href={mailto} className="font-semibold underline">click here</a> or write to {SITE.email}.
                </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-ink-500">Free, no obligation. We never sell your data.</p>
                <button type="submit" disabled={status === "sending"} className="btn-primary !px-8 !py-3 !text-base disabled:opacity-60">
                    {status === "sending" ? "Sending…" : "Send my trip request"}
                    <Icon name="arrow" className="h-4 w-4" />
                </button>
            </div>
        </form>
    );
}

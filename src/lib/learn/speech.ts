"use client";
/**
 * Pronunciation playback. Recorded native audio will replace this; until then we use the device's own
 * Odia text-to-speech voice *only if the device has one* (many Android phones do; most desktops don't).
 * No voice → the play buttons are simply not shown.
 */
import { useEffect, useState } from "react";

function odiaVoice(): SpeechSynthesisVoice | undefined {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return undefined;
    return window.speechSynthesis.getVoices().find((v) => /^or(-|_|$)/i.test(v.lang));
}

export function useOdiaVoice(): boolean {
    const [ok, setOk] = useState(false);
    useEffect(() => {
        if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
        const check = () => setOk(!!odiaVoice());
        check();
        window.speechSynthesis.addEventListener?.("voiceschanged", check);
        return () => window.speechSynthesis.removeEventListener?.("voiceschanged", check);
    }, []);
    return ok;
}

export function speak(text: string, rate = 0.85) {
    const v = odiaVoice();
    if (!v) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/…/g, ""));
    u.voice = v; u.lang = v.lang; u.rate = rate;
    window.speechSynthesis.speak(u);
}

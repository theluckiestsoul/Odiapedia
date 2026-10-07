"use client";
/**
 * Lazily loaded site-wide data (search index, language pairs). Kept out of every page's HTML so pages
 * stay small; fetched once per visit, only when the search box or language menu is used.
 */
import { useEffect, useState } from "react";

const cache = new Map<string, Promise<unknown>>();

export function loadJson<T>(url: string): Promise<T> {
    if (!cache.has(url)) {
        cache.set(url, fetch(url).then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status))))).catch((e) => { cache.delete(url); throw e; }));
    }
    return cache.get(url) as Promise<T>;
}

/** Returns the data once loaded (undefined before); starts loading when `when` becomes true. */
export function useLazyJson<T>(url: string, when: boolean): T | undefined {
    const [data, setData] = useState<T>();
    useEffect(() => {
        if (!when || data) return;
        let live = true;
        loadJson<T>(url).then((d) => { if (live) setData(d); }).catch(() => { /* offline: feature degrades gracefully */ });
        return () => { live = false; };
    }, [url, when, data]);
    return data;
}

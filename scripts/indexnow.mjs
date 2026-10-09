#!/usr/bin/env node
// Tells Bing, Yandex, Seznam, Naver and other IndexNow search engines about Odiapedia URLs.
// (Yahoo, DuckDuckGo and Ecosia use Bing's index, so they benefit too.)
//
//   node scripts/indexnow.mjs                 # main sitemap: articles, districts, towns, elections, PINs …
//   node scripts/indexnow.mjs --all           # also every village and gram panchayat (~59,000 URLs)
//   node scripts/indexnow.mjs https://odiapedia.com/pin/756042 https://odiapedia.com/schemes   # specific URLs
//
// The key file is public/<key>.txt, served at https://odiapedia.com/<key>.txt — keep the two in step.
const HOST = "odiapedia.com";
const KEY = "6052ab960df84c55a81ffba5e818a313";
const SITE = `https://${HOST}`;

async function locs(url) {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`${url}: HTTP ${r.status}`);
    return [...(await r.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/&amp;/g, "&"));
}

async function main() {
    const args = process.argv.slice(2);
    let urls = args.filter((a) => a.startsWith("http"));
    if (!urls.length) {
        urls = await locs(`${SITE}/sitemap.xml`);
        if (args.includes("--all")) {
            for (const s of await locs(`${SITE}/sitemaps/villages.xml`)) urls.push(...(await locs(s)));
        }
    }
    urls = [...new Set(urls)].filter((u) => u.startsWith(SITE));
    console.log(`Submitting ${urls.length} URLs to IndexNow…`);
    for (let i = 0; i < urls.length; i += 10000) {
        const batch = urls.slice(i, i + 10000);
        const r = await fetch("https://api.indexnow.org/indexnow", {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: batch }),
        });
        console.log(`  ${i + 1}–${i + batch.length}: HTTP ${r.status} ${r.status === 200 || r.status === 202 ? "accepted" : await r.text()}`);
    }
}
main().catch((e) => { console.error(e.message); process.exit(1); });

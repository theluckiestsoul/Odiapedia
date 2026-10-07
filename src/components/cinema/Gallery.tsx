/* eslint-disable @next/next/no-img-element -- Wikimedia Commons photos are hot-linked with attribution */
import type { Photo } from "@/lib/cinema";

/** Free-licence photos from Wikimedia Commons, each with its author and licence. */
export default function Gallery({ photos, title, alt }: { photos: Photo[]; title: string; alt: string }) {
    if (!photos.length) return null;
    return (
        <section aria-labelledby="gallery-h">
            <h2 id="gallery-h" className="font-display text-2xl font-semibold">{title}</h2>
            <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {photos.map((ph) => (
                    <li key={ph.src}>
                        <figure className="overflow-hidden rounded-2xl border border-sand-200 bg-white">
                            <a href={ph.page} target="_blank" rel="noopener noreferrer" className="block bg-sand-100">
                                <img src={ph.src} alt={ph.caption || alt} loading="lazy" className="aspect-[4/5] w-full object-cover object-top transition-opacity hover:opacity-90" />
                            </a>
                            <figcaption className="space-y-1 p-3 text-xs leading-snug">
                                {ph.caption && <span className="block text-ink-700">{ph.caption}</span>}
                                <span className="block text-ink-400">{[ph.credit, ph.licence].filter(Boolean).join(" · ")}</span>
                            </figcaption>
                        </figure>
                    </li>
                ))}
            </ul>
            <p className="mt-2 text-xs text-ink-500">Photos from Wikimedia Commons under their free licences; select a photo for full details.</p>
        </section>
    );
}

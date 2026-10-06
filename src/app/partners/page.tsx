import Link from "next/link";
import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import { hubMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";
import type { IconName } from "@/lib/site";

export const metadata = hubMetadata({
    title: "Partner with Odiapedia – Travel, Artisans, Publishers & Sponsors",
    description: "Work with Odiapedia: become a vetted travel partner, list your craft or handloom business, sponsor a cultural resource or license our datasets — always clearly labelled and editorially independent.",
    path: "/partners",
});

const OFFERS: { icon: IconName; title: string; who: string; what: string }[] = [
    { icon: "suitcase", title: "Travel partners", who: "Registered Odisha tour operators, homestays and guides", what: "Receive qualified, consent-based trip requests from readers planning a visit. Lead-fee or commission models." },
    { icon: "shop", title: "Artisans & co-operatives", who: "Weavers, craft co-operatives, GI-authorised sellers", what: "A verified profile in our crafts directory and labelled placements on relevant craft pages." },
    { icon: "book", title: "Publishers & authors", who: "Odia publishers, translators, educational creators", what: "Labelled book features and reading-list sponsorships — separate from editorial reviews." },
    { icon: "calendar", title: "Cultural events", who: "Festival organisers, institutions, diaspora associations", what: "Event listings and labelled promotion around festival and calendar pages." },
    { icon: "globe", title: "Institutions & data", who: "Universities, museums, libraries, media", what: "Collaborations on sourced resources — maps, timelines, festival and literature datasets." },
    { icon: "mail", title: "Newsletter & site sponsorship", who: "Brands aligned with Odisha's culture", what: "Brand placement around — never inside — our editorial content." },
];

export default function PartnersPage() {
    const mail = (subject: string) => `mailto:${SITE.partnershipsEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("Organisation:\nWebsite:\nRegistration / GST (if applicable):\nWhat you'd like to do with Odiapedia:\n")}`;
    return (
        <div>
            <PageHero
                variant="dark"
                title="Partner with Odiapedia"
                description="Reach people who are actively learning about, travelling to and buying from Odisha — on a platform that readers trust because sponsors cannot buy its content."
                icon="handshake"
                eyebrow="Partnerships"
                crumbs={[{ name: "Partners", href: "/partners" }]}
            >
                <a href={mail("Partnership enquiry")} className="btn-primary"><Icon name="mail" className="h-4 w-4" />Start a conversation</a>
            </PageHero>

            <section className="container-page py-14">
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {OFFERS.map((o) => (
                        <div key={o.title} className="card flex flex-col p-6">
                            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-laterite-50 text-laterite-600"><Icon name={o.icon} className="h-5 w-5" /></span>
                            <h2 className="mt-4 font-display text-2xl font-semibold">{o.title}</h2>
                            <p className="mt-1 text-sm font-medium text-ink-500">{o.who}</p>
                            <p className="mt-3 flex-1 text-sm text-ink-700">{o.what}</p>
                            <a href={mail(`${o.title} – partnership enquiry`)} className="mt-5 text-sm font-semibold text-laterite-600 hover:underline">Enquire →</a>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-sand-100 py-14">
                <div className="container-page grid gap-10 lg:grid-cols-2">
                    <div>
                        <h2 className="font-display text-3xl font-semibold">Our ground rules</h2>
                        <ul className="mt-6 space-y-3 text-ink-700">
                            {[
                                "Paid placements are always labelled “Sponsored” or “Featured partner”.",
                                "No sponsor can change a fact, a conclusion or a ranking in our articles.",
                                "Travel partners must have valid registration, transparent pricing and a written refund policy.",
                                "Reader data is shared only with explicit consent, and only what is needed.",
                                "We review partner quality regularly — complaints, refunds and response times.",
                            ].map((r) => (
                                <li key={r} className="flex gap-3"><Icon name="check" className="mt-1 h-5 w-5 shrink-0 text-chilika-600" />{r}</li>
                            ))}
                        </ul>
                        <p className="mt-6 text-sm">Read the full <Link href="/about/sponsorship-policy" className="font-semibold text-laterite-600 underline">sponsorship &amp; affiliate policy</Link>.</p>
                    </div>
                    <div className="card p-6 md:p-8">
                        <h2 className="font-display text-2xl font-semibold">What to send us</h2>
                        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-ink-700">
                            <li>Your organisation&apos;s name, website and location</li>
                            <li>Business registration / GST and any tourism licences (for travel partners)</li>
                            <li>GI authorisation or artisan card details (for craft sellers), if applicable</li>
                            <li>What you would like to do with Odiapedia</li>
                        </ul>
                        <a href={mail("Partnership enquiry")} className="btn-dark mt-6"><Icon name="mail" className="h-4 w-4" />Email {SITE.partnershipsEmail}</a>
                    </div>
                </div>
            </section>
        </div>
    );
}

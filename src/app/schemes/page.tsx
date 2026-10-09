import PageHero from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import { hubMetadata } from "@/lib/seo";

export const metadata = hubMetadata({
    title: "Odisha Government Schemes: Subhadra, CM-KISAN, GJAY",
    description: "Who qualifies and how to apply for Odisha's Subhadra Yojana (₹10,000 a year for women), CM-KISAN (farmers and landless households) and Gopabandhu Jan Arogya Yojana (health cover) — from the official portals.",
    path: "/schemes",
    keywords: ["subhadra yojana eligibility", "cm kisan odisha", "gopabandhu jan arogya yojana", "odisha government schemes", "subhadra yojana apply"],
});

const CHECKED = "9 October 2026";

type Scheme = { id: string; name: string; odia: string; dept: string; who: string; what: string[]; eligible: string[]; notEligible: string[]; apply: string[]; helpline: string; portal: string; sources: { t: string; u: string }[] };

const SCHEMES: Scheme[] = [
    {
        id: "subhadra",
        name: "Subhadra Yojana",
        odia: "ସୁଭଦ୍ରା ଯୋଜନା",
        dept: "Department of Women and Child Development",
        who: "Women aged 21 to 59",
        what: ["₹10,000 a year, paid in two instalments into the woman's own Aadhaar-linked bank account.", "Paid for five years, starting in 2024-25."],
        eligible: [
            "A resident of Odisha.",
            "Covered under NFSA or SFSS (food security ration card). A woman from a family not covered can apply if the family's annual income is not more than ₹2.5 lakh.",
            "Aged 21 or more and under 60 on the cut-off date (for 2026-27: born between 2 April 1966 and 1 April 2005), going by the date of birth on Aadhaar.",
        ],
        notEligible: [
            "Already receiving ₹1,500 a month (₹18,000 a year) or more from any state or central scheme, such as a pension or scholarship.",
            "She or a family member is a current or former MP or MLA, pays income tax, or is an elected representative of a municipality or panchayati raj body (ward members and councillors excepted).",
            "She or a family member is a regular, permanent or contractual government or public-undertaking employee, or a pensioner of one (outsourced and remunerated workers can still qualify).",
            "The family owns a four-wheeler (tractors, mini-trucks and small commercial vehicles excepted), or more than 5 acres of irrigated or 10 acres of unirrigated land.",
        ],
        apply: ["Apply free of cost at an Anganwadi centre, Mo Seva Kendra, Common Service Centre or the Block / municipal office during the registration window announced on the portal.", "Aadhaar e-KYC and a bank account linked to Aadhaar are required."],
        helpline: "14678",
        portal: "https://subhadra.odisha.gov.in",
        sources: [{ t: "Eligibility criteria, Subhadra portal (Government of Odisha)", u: "https://subhadra.odisha.gov.in/eligibility-criteria" }, { t: "Subhadra FAQ", u: "https://subhadra.odisha.gov.in/faq" }],
    },
    {
        id: "cm-kisan",
        name: "CM-KISAN",
        odia: "ସିଏମ୍ କିଷାନ",
        dept: "Department of Agriculture & Farmers' Empowerment",
        who: "Small and marginal farmers and landless agricultural households in rural Odisha",
        what: [
            "Small and marginal farmers: ₹4,000 a year — ₹2,000 for each of the two crop seasons. Together with PM-KISAN's ₹6,000, rural small farmers receive ₹10,000 a year.",
            "Landless agricultural households: ₹12,500 of livelihood support, in three instalments, to take up farming or allied activities.",
            "Medium and large farmers get only PM-KISAN (₹6,000 a year in three instalments).",
        ],
        eligible: ["A permanent resident of Odisha, 18 or older.", "Small or marginal farmer with less than 5 acres of farmland in a rural area, or a rural landless household that lives mainly from farm work.", "Must have a valid ration card. An AgriStack Farmer ID is required for new registrations."],
        notEligible: ["Medium and large farmers; more than one member of the same family.", "The farmer, spouse or a family member pays income tax, or is a government or PSU employee, retired employee or pensioner.", "Current or former holders of constitutional posts, ministers, MPs, MLAs, mayors or zilla parishad presidents.", "Doctors, engineers, lawyers, chartered accountants and architects registered with professional bodies."],
        apply: ["Register on the CM-KISAN portal, or through a Common Service Centre or Mo Seva Kendra. The same portal registers farmers for PM-KISAN.", "The money is paid directly into the bank account; e-KYC is required."],
        helpline: "155333 (Krushak Samruddhi)",
        portal: "https://cmkisan.odisha.gov.in",
        sources: [{ t: "CM-KISAN portal (Government of Odisha)", u: "https://cmkisan.odisha.gov.in" }, { t: "“Odisha replaces KALIA with CM Kisan Yojana” — The Asian Age, 28 August 2024", u: "https://www.asianage.com/nation/odisha-replaces-kalia-with-cm-kisan-yojana-for-farmers-1819733" }],
    },
    {
        id: "gjay",
        name: "Gopabandhu Jan Arogya Yojana (GJAY)",
        odia: "ଗୋପବନ୍ଧୁ ଜନ ଆରୋଗ୍ୟ ଯୋଜନା",
        dept: "Department of Health & Family Welfare",
        who: "Free treatment at government hospitals for everyone; cashless private treatment for NFSA/SFSA families",
        what: [
            "Free treatment at government health facilities for all residents, with no annual limit.",
            "Cashless treatment at empanelled private hospitals up to ₹5 lakh per family per year, with a further ₹5 lakh for women once the family limit is used (₹10 lakh in all).",
            "Since January 2025 the scheme is integrated with Ayushman Bharat PM-JAY, which widens the hospital network inside and outside Odisha. It began in 2018 as the Biju Swasthya Kalyan Yojana (BSKY).",
        ],
        eligible: ["Families covered under NFSA or SFSA, and holders of a valid GJAY/BSKY Smart Health Card, for private-hospital cover."],
        notEligible: [],
        apply: ["No separate enrolment: eligible families are included from the food-security records. Check or collect the Smart Health Card at a Mo Seva Kendra, and show it at the hospital's Swasthya Mitra desk (in an emergency, within 72 hours of admission)."],
        helpline: "104 (health), 155369 (Smart Health Card)",
        portal: "https://en.vikaspedia.in/viewcontent/schemesall/state-specific-schemes/welfare-schemes-of-odisha/gopabandhu-jana-arogya-yojana-gjay-of-odisha-govt?lgn=en",
        sources: [{ t: "GJAY — Vikaspedia (Government of India portal)", u: "https://en.vikaspedia.in/viewcontent/schemesall/state-specific-schemes/welfare-schemes-of-odisha/gopabandhu-jana-arogya-yojana-gjay-of-odisha-govt?lgn=en" }, { t: "GJAY information, AIIMS Bhubaneswar", u: "https://aiimsbhubaneswar.nic.in/schemes/gopabandhu-swasthya-kalyan-yojana-bsky/" }],
    },
];

export default function SchemesPage() {
    return (
        <div>
            <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: SCHEMES.flatMap((s) => [{ "@type": "Question", name: `Who is eligible for ${s.name}?`, acceptedAnswer: { "@type": "Answer", text: s.eligible.join(" ") } }, { "@type": "Question", name: `What does ${s.name} give?`, acceptedAnswer: { "@type": "Answer", text: s.what.join(" ") } }]) }} />
            <PageHero title="Odisha government schemes" odia="ଓଡ଼ିଶା ସରକାରୀ ଯୋଜନା" description="Plain-language guides to the state's biggest benefit schemes: who qualifies, what you get, and where to apply — taken from the official scheme portals." icon="shield" eyebrow="Government" crumbs={[{ name: "Schemes", href: "/schemes" }]}>
                <div className="flex flex-wrap gap-2">{SCHEMES.map((s) => <a key={s.id} href={`#${s.id}`} className="chip !bg-white hover:border-laterite-300">{s.name}</a>)}</div>
            </PageHero>
            <div className="container-page space-y-14 py-12">
                {SCHEMES.map((s) => (
                    <section key={s.id} id={s.id} className="scroll-mt-28 rounded-3xl border border-sand-200 bg-white p-6 md:p-8">
                        <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">{s.dept}</p>
                        <h2 className="mt-1 font-display text-3xl font-semibold">{s.name}</h2>
                        <p lang="or" className="font-odia text-lg text-laterite-600">{s.odia}</p>
                        <p className="mt-2 text-ink-700">For: {s.who}</p>
                        <div className="mt-6 grid gap-6 lg:grid-cols-2">
                            <div>
                                <h3 className="font-semibold text-ink-900">What you get</h3>
                                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-ink-700">{s.what.map((x) => <li key={x}>{x}</li>)}</ul>
                                <h3 className="mt-5 font-semibold text-ink-900">How to apply</h3>
                                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-ink-700">{s.apply.map((x) => <li key={x}>{x}</li>)}</ul>
                                <p className="mt-4 text-sm">Helpline: <strong>{s.helpline}</strong> · <a href={s.portal} target="_blank" rel="noopener noreferrer" className="font-semibold text-laterite-600 hover:underline">Official information ↗</a></p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-ink-900">Who is eligible</h3>
                                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-ink-700">{s.eligible.map((x) => <li key={x}>{x}</li>)}</ul>
                                {s.notEligible.length > 0 && (
                                    <>
                                        <h3 className="mt-5 font-semibold text-ink-900">Not eligible</h3>
                                        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-ink-700">{s.notEligible.map((x) => <li key={x}>{x}</li>)}</ul>
                                    </>
                                )}
                            </div>
                        </div>
                        <p className="mt-6 border-t border-sand-100 pt-3 text-xs text-ink-500">Sources: {s.sources.map((x, i) => <span key={x.u}>{i ? "; " : ""}<a href={x.u} className="underline" target="_blank" rel="noopener noreferrer">{x.t}</a></span>)}. Checked {CHECKED}.</p>
                    </section>
                ))}
                <p className="max-w-3xl text-sm text-ink-600">Rules, amounts and application windows change. Always confirm on the official portal or helpline before applying, and never pay anyone to apply for you — applications are free. Odiapedia is not a government website. More schemes will be added as we check them against official sources.</p>
            </div>
        </div>
    );
}

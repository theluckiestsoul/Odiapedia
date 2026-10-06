import Image from "next/image";
import Breadcrumbs from "./Breadcrumbs";
import Icon from "./Icon";
import { ChariotWheel } from "./Motifs";
import type { IconName } from "@/lib/site";
import type { Crumb } from "@/lib/seo";

interface PageHeroProps {
    title: string;
    odia?: string;
    description?: string;
    eyebrow?: string;
    icon?: IconName;
    image?: string;
    imageAlt?: string;
    crumbs?: Crumb[];
    children?: React.ReactNode;
    /** "light" = sand background, "dark" = ink/laterite background */
    variant?: "light" | "dark";
}

/** Consistent hero used by every hub/listing page. */
export default function PageHero({ title, odia, description, eyebrow, icon, image, imageAlt, crumbs, children, variant = "light" }: PageHeroProps) {
    const dark = variant === "dark";
    return (
        <section className={`relative overflow-hidden ${dark ? "bg-ink-900 text-white" : "bg-sand-100"}`}>
            <div className={`absolute inset-0 ${dark ? "bg-ikat-light" : "bg-ikat"} opacity-70`} aria-hidden="true" />
            <ChariotWheel className={`pointer-events-none absolute -right-24 -top-24 h-[22rem] w-[22rem] ${dark ? "text-white/[0.06]" : "text-laterite-500/[0.08]"} md:h-[30rem] md:w-[30rem]`} />
            <div className="container-page relative grid items-center gap-10 py-12 md:py-16 lg:grid-cols-[1.25fr_1fr] lg:py-20">
                <div className="animate-fade-up">
                    {crumbs && (
                        <div className="mb-6">
                            <Breadcrumbs items={crumbs} tone={dark ? "light" : "dark"} />
                        </div>
                    )}
                    {(eyebrow || icon) && (
                        <div className={`eyebrow mb-4 ${dark ? "!text-saffron-300" : ""}`}>
                            {icon && <Icon name={icon} className="h-4 w-4" />}
                            {eyebrow}
                        </div>
                    )}
                    <h1 className={`text-balance font-display text-4xl font-semibold leading-[1.08] md:text-5xl lg:text-6xl ${dark ? "!text-white" : ""}`}>{title}</h1>
                    {odia && <p lang="or" className={`mt-3 font-odia-serif text-2xl md:text-3xl ${dark ? "text-saffron-200" : "text-laterite-600"}`}>{odia}</p>}
                    {description && <p className={`mt-5 max-w-2xl text-pretty text-lg leading-relaxed ${dark ? "text-sand-100/85" : "text-ink-600"}`}>{description}</p>}
                    {children && <div className="mt-8">{children}</div>}
                </div>
                {image && (
                    <div className="relative hidden aspect-[4/3] overflow-hidden rounded-[2rem] border-4 border-white shadow-2xl shadow-laterite-900/20 lg:block">
                        <Image src={image} alt={imageAlt || ""} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" priority />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/50 to-transparent p-3 text-right text-[11px] text-white/80">Illustration</div>
                    </div>
                )}
            </div>
            <div className="border-temple" aria-hidden="true" />
        </section>
    );
}

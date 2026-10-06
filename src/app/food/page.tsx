import Link from "next/link";
import CategoryHub from "@/components/CategoryHub";
import Icon from "@/components/Icon";
import { hubMetadata } from "@/lib/seo";

export const metadata = hubMetadata({
    title: "Odia Food: Dishes, Sweets & Recipes of Odisha",
    description:
        "A guide to Odia cuisine — Jagannath Temple Mahaprasad, pakhala, dalma, santula, machha besara, dahibara aloodum, pithas, and sweets like rasagola, chhena poda and rasabali.",
    path: "/food",
    keywords: ["odia food", "odisha food", "odia recipes", "famous food of odisha", "odisha sweets", "pakhala", "dalma", "mahaprasad", "chhena poda"],
});

export default function FoodPage() {
    return (
        <CategoryHub
            category="food"
            title="Odia Food"
            odia="ଓଡ଼ିଆ ଖାଦ୍ୟ"
            description="Temple kitchens, mustard-and-turmeric home cooking, fermented rice for hot summers and the chhena sweets Odisha is famous for."
            heroChildren={<Link href="/food/recipes" className="btn-primary"><Icon name="bowl" className="h-4 w-4" />Browse all Odia recipes</Link>}
            groups={[
                { title: "Start here", slugs: ["famous-foods", "mahaprasad", "pakhala-bhata", "dalma"] },
                { title: "Temple food", slugs: ["kanika", "khechudi"] },
                { title: "Everyday & regional dishes", slugs: ["santula", "dahi-baigana", "ghanta-tarkari", "machha-besara", "chingudi-malai", "dahibara-aloodum"] },
                { title: "Sweets & pithas", slugs: ["rasagola", "chhena-poda", "rasabali", "chenna-jhilli", "chhena-gaja", "khaja", "odia-pitha", "manda-pitha", "arisa-pitha"] },
            ]}
        />
    );
}

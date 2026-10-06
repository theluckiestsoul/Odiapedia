import CategoryHub from "@/components/CategoryHub";
import { hubMetadata } from "@/lib/seo";

export const metadata = hubMetadata({
    title: "Famous People of Odisha: Poets, Reformers & Freedom Fighters",
    description:
        "Biographies of people who shaped Odisha — Jayadeva, Sarala Das, Fakir Mohan Senapati, Madhusudan Das, Gopabandhu Das, Rama Devi, Veer Surendra Sai, Biju Patnaik, Kelucharan Mohapatra and more.",
    path: "/people",
    keywords: ["famous people of odisha", "odia poets", "freedom fighters of odisha", "odia writers", "great personalities of odisha"],
});

export default function PeoplePage() {
    return (
        <CategoryHub
            category="people"
            title="People of Odisha"
            odia="ଓଡ଼ିଶାର ବରେଣ୍ୟ ବ୍ୟକ୍ତିତ୍ୱ"
            description="Poets and saints, reformers and freedom fighters, artists and statesmen — the lives behind Odisha's language, identity and culture."
            groups={[
                { title: "Poets, saints & writers", slugs: ["jayadeva", "sarala-das", "upendra-bhanja", "bhima-bhoi", "fakir-mohan-senapati", "radhanath-ray", "gangadhar-meher", "gopinath-mohanty"] },
                { title: "Reformers & freedom fighters", slugs: ["madhusudan-das", "gopabandhu-das", "veer-surendra-sai", "rama-devi", "baji-rout"] },
                { title: "Leaders, scientists & artists", slugs: ["biju-patnaik", "pathani-samanta", "kelucharan-mohapatra"] },
            ]}
        />
    );
}

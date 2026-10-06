/**
 * Site-wide constants. Edit here to change brand details, contact addresses or social profiles.
 */
export const SITE = {
    name: "Odiapedia",
    odiaName: "ଓଡ଼ିଆପିଡ଼ିଆ",
    url: "https://odiapedia.com",
    tagline: "The encyclopedia of Odisha and the Odia language",
    description:
        "Odiapedia is a free, bilingual encyclopedia of Odisha — the Odia language, history, culture, festivals, food, people, districts and travel — written from cited sources.",
    email: "contact@odiapedia.com",
    correctionsEmail: "contact@odiapedia.com",
    partnershipsEmail: "contact@odiapedia.com",
    social: {
        x: "https://x.com/TheOdiaPedia",
        instagram: "https://www.instagram.com/odia.pedia/",
        facebook: "https://www.facebook.com/profile.php?id=61586243815755",
        youtube: "https://www.youtube.com/@TheOdiapedia",
    },
    locale: "en_IN",
} as const;

export type IconName =
    | "book" | "language" | "mask" | "temple" | "scroll" | "calendar" | "bowl" | "people" | "pin" | "map" | "compass"
    | "search" | "arrow" | "arrowLeft" | "leaf" | "wave" | "sparkle" | "shop" | "handshake" | "info" | "globe" | "sun"
    | "moon" | "clock" | "check" | "external" | "chevron" | "menu" | "close" | "quote" | "shield" | "mail" | "suitcase"
    | "wheel" | "flag" | "pen" | "list" | "star" | "hourglass" | "boat";

export interface CategoryInfo {
    key: string;
    href: string;
    label: string;
    odia: string;
    icon: IconName;
    blurb: string;
    image?: string;
}

/** Knowledge pillars shown on the homepage, hubs, breadcrumbs and article badges. */
export const CATEGORIES: Record<string, CategoryInfo> = {
    language: {
        key: "language", href: "/language", label: "Language", odia: "ଭାଷା", icon: "language",
        blurb: "Odia, a classical language of India — its script, history, dialects and literature.",
        image: "/images/odia-script.png",
    },
    learn: {
        key: "learn", href: "/learn", label: "Learn Odia", odia: "ଓଡ଼ିଆ ଶିଖନ୍ତୁ", icon: "pen",
        blurb: "Free lessons: the alphabet, numbers, greetings and everyday phrases.",
        image: "/images/odia-literature.png",
    },
    history: {
        key: "history", href: "/history", label: "History", odia: "ଇତିହାସ", icon: "scroll",
        blurb: "From ancient Kalinga and Kharavela to the temple-building dynasties and modern Odisha.",
        image: "/images/kalinga-war-dhauli.png",
    },
    culture: {
        key: "culture", href: "/culture", label: "Culture & Festivals", odia: "ସଂସ୍କୃତି", icon: "mask",
        blurb: "Rath Yatra, Raja, Nuakhai, Odissi, Chhau, Pattachitra, handlooms and GI crafts.",
        image: "/images/ratha-yatra-chariots.png",
    },
    food: {
        key: "food", href: "/food", label: "Food", odia: "ଖାଦ୍ୟ", icon: "bowl",
        blurb: "Mahaprasad, pakhala, dalma, pithas and the chhena sweets Odisha is known for.",
        image: "/images/odia-pithas-sweets.png",
    },
    people: {
        key: "people", href: "/people", label: "People", odia: "ବ୍ୟକ୍ତିତ୍ୱ", icon: "people",
        blurb: "Poets, reformers, freedom fighters, artists and leaders who shaped Odisha.",
        image: "/images/madhusudan-das.png",
    },
    districts: {
        key: "districts", href: "/districts", label: "Districts", odia: "ଜିଲ୍ଲା", icon: "pin",
        blurb: "All 30 districts of Odisha — places, heritage, food and people of each region.",
    },
    travel: {
        key: "travel", href: "/travel", label: "Travel", odia: "ଭ୍ରମଣ", icon: "suitcase",
        blurb: "Destination guides, itineraries and practical planning for visiting Odisha.",
        image: "/images/konark-sun-temple.png",
    },
    calendar: {
        key: "calendar", href: "/calendar", label: "Odia Calendar", odia: "ପଞ୍ଜିକା", icon: "calendar",
        blurb: "Today's panchanga — tithi, nakshatra, Odia month, sunrise — and the festival year.",
    },
    about: {
        key: "about", href: "/about", label: "About", odia: "ବିଷୟରେ", icon: "info",
        blurb: "Our mission, editorial standards and how to contribute.",
    },
};

export function categoryInfo(key: string): CategoryInfo {
    return (
        CATEGORIES[key] || {
            key, href: `/${key}`, label: key.charAt(0).toUpperCase() + key.slice(1), odia: "", icon: "book", blurb: "",
        }
    );
}

/** Format YYYY-MM-DD for display without timezone drift. */
export function formatDate(iso: string): string {
    const m = iso?.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!m) return iso;
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${Number(m[3])} ${months[Number(m[2]) - 1]} ${m[1]}`;
}

export function absoluteUrl(path: string): string {
    if (!path) return SITE.url;
    return path.startsWith("http") ? path : `${SITE.url}${path.startsWith("/") ? "" : "/"}${path}`;
}

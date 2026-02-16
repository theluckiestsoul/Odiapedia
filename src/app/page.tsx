import { getAllArticlesMetadata } from "@/lib/mdx";
import HomeClient from "./HomeClient";

const sections = [
  {
    href: "/language",
    title: "Language",
    odia: "ଭାଷା",
    description: "The classical Odia language, one of the oldest in India with a rich literary tradition spanning millennia.",
    icon: "📚",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    href: "/culture",
    title: "Culture",
    odia: "ସଂସ୍କୃତି",
    description: "Vibrant traditions, classical Odissi dance, intricate Pattachitra art, and sacred festivals.",
    icon: "🎭",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    href: "/history",
    title: "History",
    odia: "ଇତିହାସ",
    description: "From the mighty Kalinga Empire to the architectural wonders of ancient temple kingdoms.",
    icon: "🏛️",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    href: "/history/timeline",
    title: "Timeline",
    odia: "ସମୟରେଖା",
    description: "65+ events from prehistoric caves to modern Odisha — explore a million years of history.",
    icon: "📜",
    color: "text-stone-600",
    bg: "bg-stone-50",
  },
  {
    href: "/calendar",
    title: "Calendar",
    odia: "ପଞ୍ଜିକା",
    description: "Odia Panjika with 12 months, festivals, tithi, nakshatra, and Odia year.",
    icon: "🗓️",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
  },
  {
    href: "/food",
    title: "Food",
    odia: "ଖାଦ୍ୟ",
    description: "Sacred temple prasad, aromatic coastal curries, and legendary sweets like Rasagola.",
    icon: "🍛",
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    href: "/people",
    title: "People",
    odia: "ଲୋକ",
    description: "Remarkable individuals who shaped Odisha's identity through arts, freedom, and innovation.",
    icon: "👥",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    href: "/districts",
    title: "Districts",
    odia: "ଜିଲ୍ଲା",
    description: "Explore the 30 districts of Odisha, from Angul to Sundargarh.",
    icon: "📍",
    color: "text-pink-600",
    bg: "bg-pink-50",
  },
  {
    href: "/about",
    title: "About",
    odia: "ବିଷୟରେ",
    description: "Learn about our mission to preserve and share Odia heritage with the world.",
    icon: "ℹ️",
    color: "text-slate-600",
    bg: "bg-slate-50",
  },
];

export default function Home() {
  const latestArticles = getAllArticlesMetadata().slice(0, 6);

  return (
    <HomeClient sections={sections} latestArticles={latestArticles} />
  );
}

import Link from "next/link";
import Image from "next/image";
import { getAllArticlesMetadata } from "@/lib/mdx";

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

const categoryIcons: Record<string, string> = {
  language: "📚",
  culture: "🎭",
  history: "🏛️",
  food: "🍛",
  people: "👥",
  about: "ℹ️",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 flex items-center justify-center overflow-hidden bg-slate-50">
        {/* Coastal Background Gradients */}
        <div className="absolute top-0 left-0 right-0 h-[700px] bg-gradient-to-b from-teal-50/80 via-blue-50/50 to-transparent -z-10"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-teal-200/20 rounded-full blur-[100px] -z-10 mix-blend-multiply animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-[100px] -z-10 mix-blend-multiply animate-pulse delay-1000"></div>

        {/* Pattern Overlay */}
        <div className="absolute inset-0 bg-water opacity-30 -z-5 pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Logo */}
          <div className="mb-12 flex justify-center">
            <div className="relative w-36 h-36 rounded-2xl overflow-hidden shadow-2xl shadow-teal-900/20 rotate-3 hover:rotate-0 transition-transform duration-500 border-4 border-white/70 backdrop-blur-md ring-1 ring-teal-100">
              <Image
                src="/logo.png"
                alt="Odiapedia"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tight font-display drop-shadow-sm text-transparent bg-clip-text bg-gradient-to-r from-teal-800 to-blue-900 pb-2">
            Odiapedia
          </h1>

          <div className="text-3xl md:text-4xl text-teal-700 mb-10 font-medium odia-text opacity-90 drop-shadow-sm">
            ଓଡ଼ିଆପିଡ଼ିଆ
          </div>

          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            The open encyclopedia for Odisha&apos;s classical language, culture, history, and heritage.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/learn/alphabet"
              className="px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-full hover:from-teal-700 hover:to-teal-600 transition-all duration-300 shadow-lg shadow-teal-600/25 hover:shadow-teal-600/40 font-medium text-lg flex items-center gap-2 group ring-1 ring-teal-400/50"
            >
              Start Exploring
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 bg-white/80 backdrop-blur-sm text-slate-700 rounded-full hover:bg-white border border-slate-200 transition-all duration-300 font-medium text-lg hover:border-teal-200 hover:text-teal-700 shadow-sm hover:shadow-md"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Odia Parba Banner - Coastal Vibrance Style */}
      <section className="py-12 border-y border-teal-100 bg-gradient-to-r from-teal-50 via-cyan-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-water opacity-10 mix-blend-multiply pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="text-center md:text-left">
            <span className="inline-block px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-sm font-bold mb-3 border border-teal-200 shadow-sm animate-pulse">
              🚀 Upcoming Event
            </span>
            <h2 className="text-4xl font-bold text-teal-900 mb-2 font-display">
              Odia Parba 2026
            </h2>
            <p className="text-slate-700 text-lg flex items-center justify-center md:justify-start gap-2">
              <span>📍 New Delhi</span>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
              <span>📅 March 13-15, 2026</span>
            </p>
          </div>
          <Link
            href="/culture/odia-parba-en"
            className="inline-flex items-center px-8 py-4 bg-white text-teal-700 font-bold rounded-xl border-2 border-teal-100 hover:border-teal-300 hover:text-teal-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 shadow-sm group"
          >
            View Event Details
            <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Explore Section */}
      <section className="py-24 bg-white relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 font-display">
              Explore by <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">Category</span>
            </h2>
            <p className="text-slate-500 text-xl max-w-2xl mx-auto font-light">
              Dive into the rich tapestry of Odisha's heritage through our curated collections
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="group block p-8 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-teal-900/10 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
              >
                {/* Hover Gradient Border Effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-teal-100 rounded-2xl transition-colors duration-300 pointer-events-none"></div>

                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-blue-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
                <div className={`absolute -right-10 -bottom-10 w-40 h-40 rounded-full ${section.bg} opacity-20 group-hover:scale-150 transition-transform duration-500 blur-2xl`}></div>

                <div className="flex items-start justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl ${section.bg} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform relative z-10 shadow-sm group-hover:rotate-6 duration-300`}>
                    {section.icon}
                  </div>
                  <span className="text-slate-300 group-hover:text-teal-300 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-teal-700 transition-colors font-display relative z-10">
                  {section.title}
                </h2>
                <div className="text-sm font-medium text-teal-600/80 mb-3 odia-text relative z-10">{section.odia}</div>
                <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 relative z-10 text-sm">
                  {section.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2 font-display">
                Latest Articles
              </h2>
              <p className="text-slate-500">
                Fresh content from our contributors
              </p>
            </div>
            <Link href="/history" className="hidden md:inline-flex items-center text-teal-600 font-bold hover:text-teal-700 hover:bg-teal-50 px-4 py-2 rounded-lg transition-colors">
              View all articles
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getAllArticlesMetadata()
              .slice(0, 6)
              .map((article) => (
                <Link
                  key={`${article.category}/${article.slug}`}
                  href={`/${article.category}/${article.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-teal-200 hover:shadow-lg hover:shadow-teal-900/5 transition-all duration-300 flex flex-col h-full"
                >
                  <div className="p-6 flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-1 rounded border border-teal-100">
                        {article.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-teal-700 line-clamp-2 transition-colors font-display">
                      {article.title}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed">
                      {article.description}
                    </p>
                  </div>
                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between group-hover:bg-teal-50/30 transition-colors">
                    <span className="text-sm font-medium text-slate-400 group-hover:text-teal-600 transition-colors">Read article</span>
                    <span className="text-teal-600 transform translate-x-0 group-hover:translate-x-1 opacity-0 group-hover:opacity-100 transition-all font-bold">→</span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}

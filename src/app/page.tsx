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
    gradient: "from-blue-900 to-indigo-950",
  },
  {
    href: "/culture",
    title: "Culture",
    odia: "ସଂସ୍କୃତି",
    description: "Vibrant traditions, classical Odissi dance, intricate Pattachitra art, and sacred festivals.",
    icon: "🎭",
    gradient: "from-purple-900 to-fuchsia-950",
  },
  {
    href: "/history",
    title: "History",
    odia: "ଇତିହାସ",
    description: "From the mighty Kalinga Empire to the architectural wonders of ancient temple kingdoms.",
    icon: "🏛️",
    gradient: "from-amber-900 to-orange-950",
  },
  {
    href: "/food",
    title: "Food",
    odia: "ଖାଦ୍ୟ",
    description: "Sacred temple prasad, aromatic coastal curries, and legendary sweets like Rasagola.",
    icon: "🍛",
    gradient: "from-red-900 to-rose-950",
  },
  {
    href: "/people",
    title: "People",
    odia: "ଲୋକ",
    description: "Remarkable individuals who shaped Odisha's identity through arts, freedom, and innovation.",
    icon: "👥",
    gradient: "from-emerald-900 to-teal-950",
  },
  {
    href: "/about",
    title: "About",
    odia: "ବିଷୟରେ",
    description: "Learn about our mission to preserve and share Odia heritage with the world.",
    icon: "ℹ️",
    gradient: "from-slate-800 to-zinc-950",
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
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/20 via-black to-black"></div>
        <div className="absolute inset-0 pattern-overlay opacity-30"></div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-amber-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-amber-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-900/5 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-amber-600/50 shadow-2xl shadow-amber-900/30">
              <Image
                src="/logo.png"
                alt="Odiapedia"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-6xl md:text-8xl font-bold mb-4 font-display">
            <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent text-glow">
              Odiapedia
            </span>
          </h1>

          <p className="text-3xl md:text-4xl text-amber-500/80 mb-6 odia-text font-medium">
            ଓଡ଼ିଆପିଡ଼ିଆ
          </p>

          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-600"></div>
            <div className="w-3 h-3 rotate-45 bg-amber-500"></div>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-600"></div>
          </div>

          <p className="text-xl md:text-2xl text-amber-100/70 mb-12 max-w-3xl mx-auto leading-relaxed">
            Discover the ancient land of Odisha — its classical language, sacred temples,
            vibrant art, legendary cuisine, and timeless traditions.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/culture"
              className="group inline-flex items-center justify-center px-10 py-5 text-lg font-semibold text-black bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 rounded-full hover:from-amber-300 hover:via-yellow-200 hover:to-amber-400 shadow-lg shadow-amber-900/30 transition-all duration-300 transform hover:-translate-y-1"
            >
              Begin Your Journey
              <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold text-amber-300 border-2 border-amber-600/50 rounded-full hover:border-amber-500 hover:bg-amber-900/20 transition-all duration-300"
            >
              About Odiapedia
            </Link>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-24 fill-black" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      {/* Explore Section */}
      <section className="py-24 bg-black relative">
        <div className="absolute inset-0 pattern-overlay opacity-20"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-amber-100 mb-4 font-display">
              Explore Odisha
            </h2>
            <p className="text-amber-500/70 text-2xl odia-text">
              ଓଡ଼ିଶା ଅନୁସନ୍ଧାନ କରନ୍ତୁ
            </p>
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="h-px w-24 bg-gradient-to-r from-transparent to-amber-600"></div>
              <div className="w-2 h-2 rotate-45 bg-amber-500"></div>
              <div className="h-px w-24 bg-gradient-to-l from-transparent to-amber-600"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="group relative overflow-hidden rounded-2xl card-hover"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-90`}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute inset-0 border border-amber-600/20 rounded-2xl group-hover:border-amber-500/40 transition-colors"></div>

                <div className="relative p-8 min-h-[280px] flex flex-col justify-end">
                  <span className="text-5xl mb-4 block transform group-hover:scale-110 transition-transform duration-300">
                    {section.icon}
                  </span>
                  <div className="flex items-baseline gap-3 mb-3">
                    <h3 className="text-2xl font-bold text-amber-100 group-hover:text-amber-300 transition-colors font-display">
                      {section.title}
                    </h3>
                    <span className="text-amber-500/70 odia-text">
                      {section.odia}
                    </span>
                  </div>
                  <p className="text-amber-100/60 text-sm leading-relaxed">
                    {section.description}
                  </p>

                  {/* Arrow indicator */}
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="py-20 bg-gradient-to-b from-black to-neutral-950 relative">
        <div className="absolute inset-0 pattern-overlay opacity-5"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-amber-100 mb-4 font-display">
              Latest Articles
            </h2>
            <p className="text-amber-100/60 text-lg">
              Start exploring with our newest content
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {getAllArticlesMetadata()
              .slice(0, 6)
              .map((article) => (
                <Link
                  key={`${article.category}/${article.slug}`}
                  href={`/${article.category}/${article.slug}`}
                  className="group bg-gradient-to-br from-amber-950/30 to-orange-950/30 rounded-2xl p-6 border border-amber-900/30 hover:border-amber-600/50 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">
                      {categoryIcons[article.category] || "📄"}
                    </span>
                    <div className="flex-1">
                      <span className="text-xs text-amber-500/60 uppercase tracking-wider">
                        {article.category}
                      </span>
                      <h3 className="text-lg font-semibold text-amber-100 group-hover:text-amber-300 transition-colors mb-2 mt-1">
                        {article.title}
                      </h3>
                      <p className="text-amber-100/60 text-sm line-clamp-2">
                        {article.description}
                      </p>
                      <span className="inline-block mt-3 text-amber-500 text-sm group-hover:text-amber-400">
                        Read article →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Heritage Section */}
      <section className="py-24 bg-gradient-to-b from-black via-amber-950/10 to-black relative overflow-hidden">
        <div className="absolute inset-0 pattern-overlay opacity-10"></div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-600/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-600/50 to-transparent"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <span className="text-6xl">🛕</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-amber-100 mb-6 font-display">
            Preserving Our Sacred Heritage
          </h2>

          <p className="text-xl text-amber-100/60 mb-8 max-w-2xl mx-auto leading-relaxed">
            From the Sun Temple of Konark to the sacred shores of Puri,
            Odisha&apos;s heritage spans thousands of years of art, spirituality, and culture.
          </p>

          <p className="text-3xl text-amber-500/80 odia-text font-medium mb-8">
            ଆମର ପବିତ୍ର ଐତିହ୍ୟକୁ ସଂରକ୍ଷଣ କରିବା
          </p>

          <div className="flex items-center justify-center gap-8 text-4xl">
            <span className="opacity-60 hover:opacity-100 transition-opacity cursor-default">🌅</span>
            <span className="opacity-60 hover:opacity-100 transition-opacity cursor-default">🎨</span>
            <span className="opacity-100">🛕</span>
            <span className="opacity-60 hover:opacity-100 transition-opacity cursor-default">💃</span>
            <span className="opacity-60 hover:opacity-100 transition-opacity cursor-default">📜</span>
          </div>
        </div>
      </section>
    </div>
  );
}

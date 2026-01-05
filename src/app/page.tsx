import Link from "next/link";

const sections = [
  {
    href: "/language",
    title: "Language",
    odia: "ଭାଷା",
    description: "Discover the classical Odia language, one of the oldest in India with a rich literary tradition.",
    icon: "📚",
    color: "from-blue-500 to-blue-600",
  },
  {
    href: "/culture",
    title: "Culture",
    odia: "ସଂସ୍କୃତି",
    description: "Explore vibrant traditions, festivals, dance, music, and art forms of Odisha.",
    icon: "🎭",
    color: "from-purple-500 to-purple-600",
  },
  {
    href: "/history",
    title: "History",
    odia: "ଇତିହାସ",
    description: "Journey through the ancient kingdoms, temples, and historical events of Odisha.",
    icon: "🏛️",
    color: "from-amber-500 to-amber-600",
  },
  {
    href: "/food",
    title: "Food",
    odia: "ଖାଦ୍ୟ",
    description: "Savor the unique flavors of Odia cuisine, from temple prasad to coastal delicacies.",
    icon: "🍛",
    color: "from-red-500 to-red-600",
  },
  {
    href: "/people",
    title: "People",
    odia: "ଲୋକ",
    description: "Meet the remarkable individuals who have shaped Odisha's identity through time.",
    icon: "👥",
    color: "from-green-500 to-green-600",
  },
  {
    href: "/about",
    title: "About",
    odia: "ବିଷୟରେ",
    description: "Learn about Odiapedia and our mission to share Odia heritage with the world.",
    icon: "ℹ️",
    color: "from-gray-500 to-gray-600",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                Odiapedia
              </span>
            </h1>
            <p className="text-3xl md:text-4xl text-gray-700 mb-4 odia-text font-medium">
              ଓଡ଼ିଆପିଡ଼ିଆ
            </p>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Discover the rich heritage of Odisha — its classical language, vibrant culture,
              ancient history, delicious cuisine, and remarkable people.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/culture"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-full hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Start Exploring
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-full hover:border-orange-300 hover:text-orange-600 transition-all duration-300"
              >
                About Odiapedia
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-1 left-0 right-0">
          <svg className="w-full h-24 fill-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </section>

      {/* Sections Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore Odisha
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Dive into the diverse aspects of Odia heritage and discover what makes Odisha unique.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="group relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-orange-200 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{section.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                        {section.title}
                      </h3>
                      <span className="text-gray-400 odia-text text-sm">
                        {section.odia}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {section.description}
                    </p>
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-orange-500 to-orange-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Preserving Our Heritage
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Odiapedia is dedicated to documenting and sharing the rich cultural heritage
            of Odisha with people around the world.
          </p>
          <p className="text-2xl text-white odia-text font-medium">
            ଆମର ଐତିହ୍ୟକୁ ସଂରକ୍ଷଣ କରିବା
          </p>
        </div>
      </section>
    </div>
  );
}

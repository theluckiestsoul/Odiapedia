import Link from "next/link";

const footerLinks = [
    { href: "/language", label: "Language" },
    { href: "/culture", label: "Culture" },
    { href: "/history", label: "History" },
    { href: "/food", label: "Food" },
    { href: "/people", label: "People" },
    { href: "/about", label: "About" },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gradient-to-b from-black to-neutral-950 border-t border-amber-900/30 pattern-overlay">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Brand */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <span className="text-3xl font-bold bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent font-display">
                                Odiapedia
                            </span>
                        </div>
                        <p className="text-amber-100/60 text-sm leading-relaxed">
                            Discover the rich heritage of Odisha - its language, culture,
                            history, cuisine, and remarkable people.
                        </p>
                        <p className="text-amber-500/80 text-lg font-medium odia-text">
                            ଓଡ଼ିଶାର ସମୃଦ୍ଧ ଐତିହ୍ୟ ଆବିଷ୍କାର କରନ୍ତୁ
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-6">
                            Explore
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-amber-100/60 hover:text-amber-300 transition-colors text-sm animated-underline inline-block"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* About */}
                    <div>
                        <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-6">
                            Our Mission
                        </h3>
                        <p className="text-amber-100/60 text-sm leading-relaxed">
                            Odiapedia is a comprehensive resource dedicated to preserving and
                            sharing knowledge about Odia culture, traditions, and heritage with
                            the world.
                        </p>
                        <div className="mt-6 flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-xl">
                                🛕
                            </div>
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-xl">
                                🎭
                            </div>
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-xl">
                                🍛
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-amber-900/30">
                    <div className="text-center">
                        <p className="text-amber-100/40 text-sm">
                            © {currentYear} Odiapedia. Made with ❤️ for Odisha
                        </p>
                        <p className="text-amber-600/50 text-xs mt-2 odia-text">
                            ଓଡ଼ିଶାକୁ ଭଲ ପାଇବା ସହିତ ତିଆରି
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

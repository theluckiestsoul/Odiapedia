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
        <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                                Odiapedia
                            </span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Discover the rich heritage of Odisha - its language, culture,
                            history, cuisine, and remarkable people.
                        </p>
                        <p className="text-gray-500 text-sm font-medium">
                            ଓଡ଼ିଶାର ସମୃଦ୍ଧ ଐତିହ୍ୟ ଆବିଷ୍କାର କରନ୍ତୁ
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                            Explore
                        </h3>
                        <ul className="space-y-2">
                            {footerLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-600 hover:text-orange-600 transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* About */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                            About Odiapedia
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Odiapedia is a comprehensive resource dedicated to preserving and
                            sharing knowledge about Odia culture, traditions, and heritage with
                            the world.
                        </p>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-200">
                    <p className="text-center text-gray-500 text-sm">
                        © {currentYear} Odiapedia. Made with ❤️ for Odisha.
                    </p>
                </div>
            </div>
        </footer>
    );
}

# Odiapedia

> Discover the rich heritage of Odisha — its classical language, vibrant culture, ancient history, delicious cuisine, and remarkable people.

## 🌐 Overview

Odiapedia is a comprehensive digital encyclopedia dedicated to documenting and sharing the rich cultural heritage of Odisha (India) with the world.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with Navbar/Footer
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Global styles
│   ├── language/           # Odia Language section
│   ├── culture/            # Culture & Traditions
│   ├── history/            # Historical content
│   ├── food/               # Odia cuisine
│   ├── people/             # Notable personalities
│   └── about/              # About Odiapedia
└── components/
    ├── Navbar.tsx          # Navigation component
    └── Footer.tsx          # Footer component
```

## 🎨 Features

- **Modern Design**: Clean, responsive UI with mobile-first approach
- **Odia Typography**: Proper rendering of Odia script using Noto Sans Oriya
- **SEO Optimized**: Meta tags, Open Graph, and semantic HTML
- **Fast Performance**: Built with Next.js 16 and optimized for speed

## 📚 Content Sections

| Section | Description |
|---------|-------------|
| **Language** | Odia language, script, and literature |
| **Culture** | Festivals, dance, music, and art |
| **History** | Ancient kingdoms and historical events |
| **Food** | Traditional cuisine and recipes |
| **People** | Notable personalities from Odisha |
| **About** | About the Odiapedia project |

## 🛠️ Tech Stack

- [Next.js 16](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Noto Sans Oriya](https://fonts.google.com/noto/specimen/Noto+Sans+Oriya) - Odia font

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

---

Made with ❤️ for Odisha | ଓଡ଼ିଶାକୁ ଭଲ ପାଇବା ସହିତ ତିଆରି

## Deployment settings (environment variables)

| Variable | Purpose |
|---|---|
| `TRIP_LEAD_WEBHOOK_URL` | Where trip-planner requests (`/travel/plan`) are delivered as JSON — e.g. a Google Apps Script web app that appends to a Google Sheet, a Zapier/Make webhook, Formspree or your CRM. If unset, the form falls back to opening a pre-filled email to contact@odiapedia.com. |
| `TRIP_LEAD_WEBHOOK_SECRET` | Optional shared secret sent as the `X-Odiapedia-Secret` header. |
| `NEXT_PUBLIC_GA_ID` | Google Analytics measurement ID (optional). |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console verification token. |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | Bing Webmaster Tools verification token. |

## Content conventions

Articles live in `content/<category>/<slug>.mdx`. Frontmatter supports `title`, `description`, `date`, `updated`, `author`, `lang`, `alternates`, `odiaTitle`, `keywords`, `facts` (infobox), `sources` (shown as references), `faq` (shown on the page and as structured data), `changelog`, `image`, `imageCredit`, `noindex` and `mergedInto`. Do not start the body with a `# H1` (the template renders the title), and avoid `{ } < >` in prose — MDX treats them as code. Festival dates for the "Today in Odisha" panel live in `src/data/festival-dates.ts`; add only dates confirmed by an official holiday list or reliable panchang.

## AI & search discoverability

`/robots.txt` explicitly allows search and AI crawlers, `/sitemap.xml` uses real last-updated dates, and `/llms.txt` + `/llms-full.txt` give AI assistants a structured map of the site. Every article emits Article, BreadcrumbList and (when present) FAQPage JSON-LD.

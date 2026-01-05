# SEO Guide for Odiapedia

## What is SEO?

**SEO (Search Engine Optimization)** is the practice of making your website discoverable by search engines like Google, Bing, and DuckDuckGo. When someone searches "Odia food recipes" or "Raja Parba festival", good SEO helps your website appear in those search results.

---

## Why SEO Matters for Odiapedia

Without SEO:
- Google won't know your website exists
- People searching for Odia culture won't find you
- Your content stays invisible

With SEO:
- Google indexes all your pages
- People find your articles through search
- Organic traffic grows over time

---

## What We Implemented

### 1. Metadata (Title & Description)

**What it is:** Every page has a title and description that Google displays in search results.

**Where we added it:**

```tsx
// src/app/layout.tsx
export const metadata: Metadata = {
  title: "Odiapedia - Discover Odia Culture, Language & Heritage",
  description: "Explore the rich heritage of Odisha...",
};
```

**How Google sees it:**
```
Odiapedia - Discover Odia Culture, Language & Heritage
https://odiapedia.com
Explore the rich heritage of Odisha - its classical language, 
vibrant culture, ancient history, delicious cuisine...
```

**Each article has its own metadata** from frontmatter:
```yaml
---
title: "Raja Parba - The Festival Celebrating Womanhood"
description: "Discover Raja Parba, a unique three-day festival..."
---
```

---

### 2. Sitemap (`/sitemap.xml`)

**What it is:** A file listing ALL your pages so Google knows what to index.

**File:** `src/app/sitemap.ts`

**What it generates:**
```xml
<urlset>
  <url>
    <loc>https://odiapedia.com/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://odiapedia.com/culture</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://odiapedia.com/culture/raja-parba</loc>
    <priority>0.6</priority>
  </url>
  <!-- All other pages -->
</urlset>
```

**View it live:** https://odiapedia.com/sitemap.xml

---

### 3. Robots.txt (`/robots.txt`)

**What it is:** Instructions for search engine crawlers.

**File:** `src/app/robots.ts`

**What it says:**
```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/

Sitemap: https://odiapedia.com/sitemap.xml
```

This tells Google:
- ✅ Crawl all public pages
- ❌ Don't crawl internal API routes
- 📍 Here's the sitemap location

**View it live:** https://odiapedia.com/robots.txt

---

### 4. Clean URLs

**Bad URLs (hard to index):**
```
odiapedia.com/article?id=123&type=culture
```

**Good URLs (SEO-friendly):**
```
odiapedia.com/culture/raja-parba
odiapedia.com/food/famous-foods
```

Our MDX system creates clean, readable URLs automatically.

---

### 5. Semantic HTML & Headings

Google reads your page structure. We use proper heading hierarchy:

```html
<h1>Raja Parba</h1>           <!-- Main title (1 per page) -->
  <h2>The Three Days</h2>     <!-- Section -->
    <h3>Pahili Raja</h3>      <!-- Subsection -->
  <h2>Traditions</h2>
```

This helps Google understand your content structure.

---

### 6. Internal Links

Articles link to each other:

```markdown
*Related: [Odia Culture](/culture) • [Famous Foods](/food/famous-foods)*
```

This helps Google discover more pages and understand relationships.

---

## Next Steps for Complete SEO

### Step 1: Submit to Google Search Console

1. Go to: https://search.google.com/search-console
2. Click "Add Property"
3. Enter: `odiapedia.com`
4. Verify ownership (add DNS record or HTML tag)
5. Go to "Sitemaps" → Submit: `https://odiapedia.com/sitemap.xml`

### Step 2: Wait for Indexing

Google typically indexes within 1-7 days. You can check:
- Search `site:odiapedia.com` on Google
- Monitor Search Console for indexed pages

### Step 3: Optional Enhancements

| Enhancement | Benefit | Priority |
|-------------|---------|----------|
| Add Open Graph images | Better social sharing | Medium |
| Add structured data (JSON-LD) | Rich search results | Medium |
| Add alt text to images | Image search ranking | Low |
| Get backlinks | Domain authority | Long-term |

---

## Summary

| SEO Element | Status | Location |
|-------------|--------|----------|
| Page titles | ✅ Done | `layout.tsx` + frontmatter |
| Meta descriptions | ✅ Done | `layout.tsx` + frontmatter |
| Sitemap | ✅ Done | `/sitemap.xml` |
| Robots.txt | ✅ Done | `/robots.txt` |
| Clean URLs | ✅ Done | `/[category]/[slug]` |
| Semantic headings | ✅ Done | MDX components |
| Internal links | ✅ Done | Article content |
| Google Search Console | ⏳ Pending | Manual step |

---

## How to Know SEO is Working

In 1-2 weeks, try:
1. Search `site:odiapedia.com` on Google
2. Search "Raja Parba festival Odisha" 
3. Check Google Search Console for impressions/clicks

Your content will start appearing in search results! 🎉

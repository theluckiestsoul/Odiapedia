
import { getAllArticlesMetadata } from "@/lib/mdx";
import { movieReviews } from "@/data/movie-reviews";
import { cinemaEvents } from "@/data/cinema-timeline";

export type UpdateType = "article" | "review" | "event";

export interface UpdateItem {
    id: string;
    type: UpdateType;
    title: string;
    description: string;
    date: string; // ISO Date string for sorting
    image?: string;
    link: string;
    tag: string;
}

export function getLatestUpdates(): UpdateItem[] {
    const updates: UpdateItem[] = [];

    // 1. Articles (Use actual dates from frontmatter)
    const articles = getAllArticlesMetadata();
    articles.forEach(article => {
        updates.push({
            id: `article-${article.slug}`,
            type: "article",
            title: article.title,
            description: article.excerpt,
            date: article.date, // Assumes YYYY-MM-DD
            link: `/${article.category}/${article.slug}`,
            tag: "Read Article"
        });
    });

    // 2. Movie Reviews (Use release year as proxy for now, or add a 'reviewedDate' to data)
    // For this demo, we'll assign recent dummy dates to make them appear 'new', but slightly older than today's articles
    movieReviews.forEach((review, index) => {
        // Mocking dates: Start from 2 days ago to let real articles take precedence
        const mockDate = new Date();
        mockDate.setDate(mockDate.getDate() - (index + 2));

        updates.push({
            id: `review-${review.id}`,
            type: "review",
            title: `${review.title} Movie Review`,
            description: `${review.rating}/5 Stars - ${review.verdict.en}`,
            date: mockDate.toISOString().split('T')[0],
            image: review.poster,
            link: "/culture/cinema/reviews",
            tag: "Movie Review"
        });
    });

    // 3. Cinema Timeline (Use year, but prioritized for the 'New Feature' aspect)
    // We can highlight the Cinema Timeline launch itself as an update
    // Set to yesterday so real breaking news (like Hampi) comes first
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    updates.push({
        id: "feature-cinema-timeline",
        type: "event",
        title: "Odia Cinema Timeline Launched",
        description: "Explore the complete history of Ollywood from 1936 to 2024. Over 80 years of cinematic heritage documented.",
        date: yesterday.toISOString().split('T')[0],
        image: "/images/cinema/sita_bibaha.png",
        link: "/culture/cinema/timeline",
        tag: "New Feature"
    });

    // Sort by Date Descending
    return updates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

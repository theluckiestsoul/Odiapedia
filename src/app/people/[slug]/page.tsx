import { createArticleRoute } from "@/components/ArticleRoute";

const route = createArticleRoute("people");

export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.ArticlePage;

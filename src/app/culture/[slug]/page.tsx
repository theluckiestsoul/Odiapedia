import { createArticleRoute } from "@/components/ArticleRoute";

const route = createArticleRoute("culture");

export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.ArticlePage;

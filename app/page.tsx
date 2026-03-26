import { getBlogPostSummaries } from "@/app/lib/blog";
import { PortfolioApp } from "@/app/components/portfolio/PortfolioApp";

export default async function Home() {
  const blogPosts = await getBlogPostSummaries();

  return <PortfolioApp blogPosts={blogPosts} />;
}

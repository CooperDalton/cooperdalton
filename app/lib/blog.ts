import { cache } from "react";
import { promises as fs } from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

import type { BlogPost } from "@/app/types/portfolio";

const BLOG_DIRECTORY = path.join(process.cwd(), "content", "blog");

interface BlogPostFrontmatter {
  title: string;
  date: string | Date;
  summary: string;
}

export interface BlogPostPageData extends BlogPost {
  publishedAt: string;
  contentHtml: string;
}

function isBlogPostFrontmatter(value: unknown): value is BlogPostFrontmatter {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<BlogPostFrontmatter>;

  return (
    typeof candidate.title === "string" &&
    (typeof candidate.date === "string" || candidate.date instanceof Date) &&
    typeof candidate.summary === "string"
  );
}

function normalizeBlogDate(date: string | Date) {
  return typeof date === "string" ? date : date.toISOString().slice(0, 10);
}

function formatBlogDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

function getSlugFromFileName(fileName: string) {
  return fileName.replace(/\.md$/, "");
}

const getMarkdownFileNames = cache(async () => {
  const entries = await fs.readdir(BLOG_DIRECTORY);

  return entries.filter((entry) => entry.endsWith(".md"));
});

const readBlogPost = cache(async (slug: string): Promise<BlogPostPageData> => {
  const filePath = path.join(BLOG_DIRECTORY, `${slug}.md`);
  const fileContents = await fs.readFile(filePath, "utf8");
  const { data, content } = matter(fileContents);

  if (!isBlogPostFrontmatter(data)) {
    throw new Error(`Invalid frontmatter in blog post "${slug}".`);
  }

  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkHtml)
    .process(content);

  return {
    slug,
    title: data.title,
    date: formatBlogDate(data.date),
    publishedAt: normalizeBlogDate(data.date),
    summary: data.summary,
    contentHtml: processedContent.toString(),
  };
});

export const getBlogPostSummaries = cache(async (): Promise<BlogPost[]> => {
  const fileNames = await getMarkdownFileNames();
  const posts = await Promise.all(
    fileNames.map(async (fileName) => {
      const post = await readBlogPost(getSlugFromFileName(fileName));

      return {
        slug: post.slug,
        title: post.title,
        date: post.date,
        summary: post.summary,
        publishedAt: post.publishedAt,
      };
    }),
  );

  return posts
    .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt))
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      date: post.date,
      summary: post.summary,
    }));
});

export async function getBlogPost(slug: string) {
  try {
    return await readBlogPost(slug);
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return null;
    }

    throw error;
  }
}

export async function getBlogSlugs() {
  const fileNames = await getMarkdownFileNames();

  return fileNames.map((fileName) => ({
    slug: getSlugFromFileName(fileName),
  }));
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getBlogPost,
  getBlogPostSummaries,
  getBlogSlugs,
} from "@/app/lib/blog";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getBlogSlugs();
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: "Blog | Cooper Dalton",
    };
  }

  return {
    title: `${post.title} | Cooper Dalton`,
    description: post.summary,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const [post, posts] = await Promise.all([
    getBlogPost(slug),
    getBlogPostSummaries(),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030712] px-6 py-16 text-white md:px-10">
      <div className="blog-stars pointer-events-none absolute inset-0" />
      <aside className="fixed top-24 left-8 hidden w-72 xl:block">
        <div className="rounded-3xl border border-white/10 bg-slate-950/78 p-5 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-200">
            All posts
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
            {posts.map((blogPost) => {
              const isActive = blogPost.slug === post.slug;

              return (
                <li key={blogPost.slug} className="flex gap-2">
                  <span className="text-slate-500">-</span>
                  <Link
                    href={`/blog/${blogPost.slug}`}
                    className={`transition hover:text-white ${
                      isActive ? "text-white" : "text-slate-300"
                    }`}
                  >
                    {blogPost.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      <article className="relative mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.24em] text-slate-500">
          <Link href="/" className="transition hover:text-slate-200">
            Home
          </Link>
          <span>/</span>
          <Link href="/blog" className="transition hover:text-slate-200">
            Blog
          </Link>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5 xl:hidden">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-200">
            All posts
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
            {posts.map((blogPost) => {
              const isActive = blogPost.slug === post.slug;

              return (
                <li key={blogPost.slug} className="flex gap-2">
                  <span className="text-slate-500">-</span>
                  <Link
                    href={`/blog/${blogPost.slug}`}
                    className={`transition hover:text-white ${
                      isActive ? "text-white" : "text-slate-300"
                    }`}
                  >
                    {blogPost.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <header className="mt-8 border-b border-white/10 pb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-200">
            {post.date}
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-white md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
            {post.summary}
          </p>
        </header>

        <div
          className="blog-prose mt-10"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </article>
    </main>
  );
}

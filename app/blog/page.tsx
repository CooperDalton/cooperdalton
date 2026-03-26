import type { Metadata } from "next";
import Link from "next/link";

import { getBlogPostSummaries } from "@/app/lib/blog";

export const metadata: Metadata = {
  title: "Blog | Cooper Dalton",
  description: "Notes on building, systems, habits, and shipping small things.",
};

export default async function BlogIndexPage() {
  const posts = await getBlogPostSummaries();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030712] px-6 py-16 text-white md:px-10">
      <div className="blog-stars pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-4xl">
        <Link
          href="/"
          className="text-xs uppercase tracking-[0.3em] text-slate-400 transition hover:text-slate-200"
        >
          Back to home
        </Link>

        <header className="mt-6 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-200">
            Writing
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-white md:text-5xl">
            Blog posts
          </h1>
          <p className="mt-4 text-base leading-8 text-slate-300">
            A running collection of notes on software, taste, habits, and
            learning in public.
          </p>
        </header>

        <div className="mt-10 grid gap-4">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-white/20 hover:bg-white/7"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                {post.date}
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">
                {post.title}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                {post.summary}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

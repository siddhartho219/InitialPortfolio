"use client";

import Link from "next/link";

import BlogCard from "@/components/blog/BlogCard";
import { useBlogPosts } from "@/hooks/useBlogPosts";

export default function BlogListingPage() {
  const { posts, loading, configured } = useBlogPosts();

  return (
    <>
      <style>{`
        .blog-page {
          padding: var(--section-pad);
        }
        .blog-page__header {
          max-width: 1120px;
          margin: 0 auto var(--section-gap);
        }
        .blog-page__back {
          display: inline-flex;
          font-family: var(--fm);
          font-size: var(--fs-caption);
          letter-spacing: var(--ls-label);
          text-transform: uppercase;
          color: var(--text-s);
          text-decoration: none;
          margin-bottom: 1.5rem;
          transition: color 0.2s ease;
        }
        .blog-page__back:hover {
          color: var(--accent);
        }
        .blog-page__title {
          font-family: var(--fd);
          font-weight: 800;
          font-size: var(--fs-h2);
          line-height: var(--lh-heading);
          letter-spacing: var(--ls-heading);
          color: var(--text);
          margin: 0;
        }
        .blog-page__subtitle {
          font-family: var(--fb);
          font-size: var(--fs-body);
          color: var(--text-s);
          margin: 0.5rem 0 0;
        }
        .blog-page__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.1rem;
          max-width: 1120px;
          margin: 0 auto;
        }
        .blog-page__status {
          font-family: var(--fb);
          font-size: var(--fs-body);
          color: var(--text-m);
          max-width: 1120px;
          margin: 0 auto;
        }
        @media (max-width: 767px) {
          .blog-page {
            padding: 5rem 1.2rem 3rem;
          }
        }
      `}</style>

      <main className="blog-page">
        <header className="blog-page__header">
          <Link href="/" className="blog-page__back">
            ← Back to home
          </Link>
          <h1 className="blog-page__title">Blog</h1>
          <p className="blog-page__subtitle">All posts</p>
        </header>

        {!configured ? null : loading ? (
          <p className="blog-page__status">Loading posts…</p>
        ) : posts.length === 0 ? (
          <p className="blog-page__status">More posts coming soon.</p>
        ) : (
          <div className="blog-page__grid">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}

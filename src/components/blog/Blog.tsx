"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import BlogCard from "@/components/blog/BlogCard";
import AnimateSection from "@/components/ui/AnimateSection";
import Reveal from "@/components/ui/Reveal";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { drop } from "@/lib/motion";

export default function Blog() {
  const { posts, loading, configured } = useBlogPosts(4);

  // Firebase not configured (and not still loading): render nothing quietly.
  // IMPORTANT: keep the section mounted while loading — the 3D camera
  // choreography reads #blog from live DOM order on mount, so the section
  // must exist from the first commit or the blog camera shot is skipped.
  if (!configured && !loading) return null;

  return (
    <>
      <style>{`
        .blog {
          padding: var(--section-pad);
        }
        .blog__header {
          max-width: 1120px;
          margin: 0 auto var(--section-gap);
          display: flex;
          flex-wrap: wrap;
          align-items: flex-end;
          justify-content: space-between;
          gap: 1rem;
        }
        .blog__title {
          font-family: var(--fd);
          font-weight: 800;
          font-size: var(--fs-h2);
          line-height: var(--lh-heading);
          letter-spacing: var(--ls-heading);
          color: var(--text);
          margin: 0;
        }
        .blog__subtitle {
          font-family: var(--fb);
          font-size: var(--fs-body);
          color: var(--text-s);
          margin: 0.5rem 0 0;
        }
        .blog__all-link {
          font-family: var(--fm);
          font-size: var(--fs-label);
          letter-spacing: var(--ls-label);
          text-transform: uppercase;
          color: var(--accent);
          text-decoration: none;
          padding-bottom: 2px;
          border-bottom: 1px solid color-mix(in srgb, var(--accent) 35%, transparent);
          transition: border-color 0.2s ease, color 0.2s ease;
          white-space: nowrap;
        }
        .blog__all-link:hover {
          border-color: var(--accent);
          color: var(--text);
        }
        .blog__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.1rem;
          max-width: 1120px;
          margin: 0 auto;
        }
        .blog__status {
          font-family: var(--fb);
          font-size: var(--fs-body);
          color: var(--text-m);
          max-width: 1120px;
          margin: 0 auto;
        }
        .blog-card {
          display: flex;
          flex-direction: column;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          transition:
            transform 0.25s ease,
            border-color 0.25s ease,
            background 0.25s ease,
            box-shadow 0.25s ease;
        }
        .blog-card:hover {
          transform: translateY(-4px) scale(1.015);
          border-color: var(--border-h);
          background: var(--surface-h);
          box-shadow:
            0 18px 44px -18px color-mix(in srgb, var(--violet) 30%, transparent),
            0 4px 18px -8px color-mix(in srgb, var(--accent) 16%, transparent);
        }
        @media (prefers-reduced-motion: reduce) {
          .blog-card:hover {
            transform: none;
          }
        }
        .blog-card__media {
          position: relative;
          height: 150px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .blog-card__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.7) saturate(0.7);
          transition: filter 0.3s ease;
        }
        .blog-card:hover .blog-card__img {
          filter: brightness(0.9) saturate(1);
        }
        .blog-card__placeholder {
          height: 150px;
          flex-shrink: 0;
          background: linear-gradient(
            135deg,
            color-mix(in srgb, var(--violet) 35%, var(--bg)),
            color-mix(in srgb, var(--accent) 18%, var(--bg))
          );
        }
        .blog-card__body {
          padding: var(--space-4);
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          flex: 1;
        }
        .blog-card__date {
          font-family: var(--fm);
          font-size: var(--fs-caption);
          letter-spacing: var(--ls-label);
          text-transform: uppercase;
          color: var(--accent);
        }
        .blog-card__title {
          font-family: var(--fb);
          font-size: var(--fs-title);
          font-weight: 600;
          margin: 0;
          line-height: var(--lh-title);
        }
        .blog-card__title a {
          color: var(--text);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .blog-card__title a:hover {
          color: var(--accent);
        }
        .blog-card__desc {
          font-family: var(--fb);
          font-size: var(--fs-sm);
          color: var(--text-m);
          line-height: var(--lh-sm);
          margin: 0;
          flex: 1;
        }
        .blog-card__more {
          font-family: var(--fm);
          font-size: var(--fs-caption);
          letter-spacing: var(--ls-label);
          text-transform: uppercase;
          margin-top: 0.25rem;
        }
        .blog-card__more a {
          color: var(--text-s);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .blog-card__more a:hover {
          color: var(--accent);
        }
      `}</style>

      <section id="blog" className="blog">
        <Reveal className="blog__header">
          <div>
            <h2 className="blog__title">Blog</h2>
            <p className="blog__subtitle">Notes &amp; write-ups</p>
          </div>
          <Link href="/blog" className="blog__all-link">
            View all posts →
          </Link>
        </Reveal>

        {loading ? (
          <p className="blog__status">Loading posts…</p>
        ) : posts.length === 0 ? (
          <p className="blog__status">More posts coming soon.</p>
        ) : (
          <AnimateSection className="blog__grid" variant="drop">
            {posts.map((post) => (
              <motion.div key={post.id} variants={drop}>
                <BlogCard post={post} />
              </motion.div>
            ))}
          </AnimateSection>
        )}
      </section>
    </>
  );
}

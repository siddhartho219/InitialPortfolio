"use client";

import { useEffect, use, useState } from "react";

import Link from "next/link";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { getClientDb } from "@/firebase";
import type { BlogPost } from "@/types";

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function renderParagraphs(content: string) {
  return content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(false);

  useEffect(() => {
    const db = getClientDb();
    if (!db) {
      setLoading(false);
      setConfigured(false);
      return;
    }
    setConfigured(true);

    const q = query(collection(db, "blogs"), where("slug", "==", slug));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const doc = snapshot.docs[0];
        setPost(
          doc ? ({ id: doc.id, ...(doc.data() as Omit<BlogPost, "id">) } as BlogPost) : null,
        );
        setLoading(false);
      },
      () => setLoading(false),
    );

    // Fallback: if Firestore never delivers (API disabled / blocked), stop
    // loading so we land on the not-found fallback instead of hanging.
    const timeout = window.setTimeout(() => setLoading(false), 5000);

    return () => {
      unsubscribe();
      window.clearTimeout(timeout);
    };
  }, [slug]);

  const paragraphs = post ? renderParagraphs(post.content) : [];

  return (
    <>
      <style>{`
        .blog-post {
          padding: var(--section-pad);
        }
        .blog-post__inner {
          max-width: 760px;
          margin: 0 auto;
        }
        .blog-post__back {
          display: inline-flex;
          font-family: var(--fm);
          font-size: var(--fs-caption);
          letter-spacing: var(--ls-label);
          text-transform: uppercase;
          color: var(--text-s);
          text-decoration: none;
          margin-bottom: 2rem;
          transition: color 0.2s ease;
        }
        .blog-post__back:hover {
          color: var(--accent);
        }
        .blog-post__meta {
          font-family: var(--fm);
          font-size: var(--fs-caption);
          letter-spacing: var(--ls-label);
          text-transform: uppercase;
          color: var(--accent);
          margin: 0 0 0.75rem;
        }
        .blog-post__title {
          font-family: var(--fd);
          font-weight: 800;
          font-size: var(--fs-display);
          line-height: var(--lh-display);
          letter-spacing: var(--ls-display);
          color: var(--text);
          margin: 0 0 1.5rem;
        }
        .blog-post__cover {
          width: 100%;
          border-radius: 12px;
          border: 1px solid var(--border);
          margin-bottom: 2rem;
          display: block;
        }
        .blog-post__tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 2rem;
        }
        .blog-post__tag {
          font-family: var(--fm);
          font-size: var(--fs-caption);
          color: var(--text-s);
          border: 1px solid var(--border);
          border-radius: 4px;
          padding: 2px 8px;
        }
        .blog-post__content p {
          font-family: var(--fb);
          font-size: var(--fs-body);
          line-height: var(--lh-body);
          color: var(--text-s);
          margin: 0 0 1.25rem;
        }
        .blog-post__status {
          font-family: var(--fb);
          font-size: var(--fs-body);
          color: var(--text-m);
        }
        .blog-post__notfound {
          font-family: var(--fb);
          font-size: var(--fs-title);
          font-weight: 600;
          color: var(--text);
          margin: 0 0 0.75rem;
        }
        .blog-post__notfound-sub {
          font-family: var(--fb);
          font-size: var(--fs-body);
          color: var(--text-m);
          margin: 0 0 1.5rem;
        }
        .blog-post__notfound-link {
          font-family: var(--fm);
          font-size: var(--fs-label);
          letter-spacing: var(--ls-label);
          text-transform: uppercase;
          color: var(--accent);
          text-decoration: none;
        }
        .blog-post__notfound-link:hover {
          color: var(--text);
        }
        @media (max-width: 767px) {
          .blog-post {
            padding: 5rem 1.2rem 3rem;
          }
          .blog-post__title {
            font-size: var(--fs-h2);
            line-height: var(--lh-heading);
          }
        }
      `}</style>

      <main className="blog-post">
        <div className="blog-post__inner">
          <Link href="/blog" className="blog-post__back">
            ← All posts
          </Link>

          {!configured ? null : loading ? (
            <p className="blog-post__status">Loading post…</p>
          ) : post ? (
            <>
              <p className="blog-post__meta">{formatDate(post.publishedDate)}</p>
              <h1 className="blog-post__title">{post.title}</h1>

              {post.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.coverImage}
                  alt=""
                  className="blog-post__cover"
                />
              ) : null}

              {post.tags && post.tags.length > 0 ? (
                <div className="blog-post__tags">
                  {post.tags.map((tag) => (
                    <span className="blog-post__tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="blog-post__content">
                {paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="blog-post__notfound">Post not found</p>
              <p className="blog-post__notfound-sub">
                That post doesn&apos;t exist or was unpublished.
              </p>
              <Link href="/blog" className="blog-post__notfound-link">
                ← Back to all posts
              </Link>
            </>
          )}
        </div>
      </main>
    </>
  );
}

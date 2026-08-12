import type { BlogPost } from "@/types";

import Link from "next/link";

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="blog-card">
      {post.coverImage ? (
        <div className="blog-card__media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt=""
            loading="lazy"
            className="blog-card__img"
          />
        </div>
      ) : (
        <div className="blog-card__placeholder" aria-hidden="true" />
      )}

      <div className="blog-card__body">
        <time className="blog-card__date" dateTime={post.publishedDate}>
          {formatDate(post.publishedDate)}
        </time>

        <h3 className="blog-card__title">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>

        {post.excerpt ? <p className="blog-card__desc">{post.excerpt}</p> : null}

        <span className="blog-card__more">
          <Link href={`/blog/${post.slug}`}>Read more →</Link>
        </span>
      </div>
    </article>
  );
}

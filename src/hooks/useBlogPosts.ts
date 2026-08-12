"use client";

import { useEffect, useState } from "react";

import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import { getClientDb } from "@/firebase";
import type { BlogPost } from "@/types";

type UseBlogPostsResult = {
  posts: BlogPost[];
  loading: boolean;
  configured: boolean;
};

/**
 * Live Firestore feed of blog posts, newest first. The whole point of the
 * blog is that publishing from the CMS shows up with no redeploy, so this
 * uses onSnapshot (same pattern as MessagesPage) rather than a static file.
 * getClientDb() can return null when Firebase isn't configured — callers
 * must handle `configured === false` gracefully (render nothing, not an
 * error).
 */
export function useBlogPosts(max = 0): UseBlogPostsResult {
  const [posts, setPosts] = useState<BlogPost[]>([]);
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

    let q = query(collection(db, "blogs"), orderBy("publishedDate", "desc"));
    if (max > 0) {
      q = query(q, limit(max));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<BlogPost, "id">),
          })),
        );
        setLoading(false);
      },
      () => setLoading(false),
    );

    // Fallback: if Firestore never delivers a snapshot (API disabled,
    // blocked network, rules error that retries forever), stop loading so
    // the section degrades to the quiet empty state instead of hanging on
    // "Loading posts…".
    const timeout = window.setTimeout(() => setLoading(false), 5000);

    return () => {
      unsubscribe();
      window.clearTimeout(timeout);
    };
  }, [max]);

  return { posts, loading, configured };
}

"use client";
import Breadcrumb from "@/src/components/breadcrumbs";
import Markdown from "@/src/components/markdown";
import { postCache } from "@/src/lib/cache-posts";
import { supabase } from "@/src/supabase/client";
import { Post } from "@/src/types/posts";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [post, setPost] = useState<Post | null>(postCache.get(slug) ?? null);
  const [loading, setLoading] = useState(!post);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (post) return; // cache hit, skip fetch

    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        setError(error.message);
      } else {
        postCache.set(slug, data);
        setPost(data);
      }
      setLoading(false);
    };

    fetchPost();
  }, [slug, post]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Failed to load post: {error}</p>;
  if (!post) return null;

  return (
    <article className="mx-auto px-4 py-10">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: post.title }]}
      />
      <Markdown content={post.content_md} />
    </article>
  );
}

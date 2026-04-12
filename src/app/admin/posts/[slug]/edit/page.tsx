"use client";
import PostForm from "@/src/components/post-form";
import { postCache } from "@/src/lib/cache-posts";
import { useParams } from "next/navigation";

export default function EditPost() {
  const { slug } = useParams() as { slug: string };
  const post = postCache.get(slug);

  if (!post) return <p>Post not found</p>;

  return <PostForm post={post} />;
}

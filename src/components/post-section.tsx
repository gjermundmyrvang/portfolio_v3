"use client";

import { usePosts } from "../hooks/usePosts";
import { PostList } from "./post-list";

export default function PostsSection() {
  const { posts, loading, error } = usePosts();

  if (error)
    return (
      <p className="text-sm text-red-500">Failed to load posts: {error}</p>
    );
  if (loading || !posts)
    return <p className="text-sm text-neutral-400">Loading...</p>;

  const featured = posts.filter((p) => p.featured);
  const rest = posts.filter((p) => !p.featured);

  return (
    <>
      {featured.length > 0 && <PostList posts={featured} title="Featured" />}
      {rest.length > 0 && <PostList posts={rest} title="Posts" />}
      {posts.length === 0 && (
        <p className="text-sm text-neutral-400">No posts yet.</p>
      )}
    </>
  );
}

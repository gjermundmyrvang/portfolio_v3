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

  const ongoing = posts.filter((p) => p.ongoing);
  const featured = posts.filter((p) => p.featured);
  const rest = posts.filter((p) => !p.ongoing && !p.featured);

  return (
    <>
      {ongoing.length > 0 && (
        <PostList posts={ongoing} title="Ongoing Projects" />
      )}
      {featured.length > 0 && (
        <PostList posts={featured} title="Featured Projects" />
      )}
      {rest.length > 0 && <PostList posts={rest} title="More Projects" />}
      {posts.length === 0 && (
        <p className="text-sm text-neutral-400">No posts yet.</p>
      )}
    </>
  );
}

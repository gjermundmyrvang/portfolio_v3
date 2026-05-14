"use client";

import { usePosts } from "../hooks/usePosts";
import { PostList } from "./post-list";

export default function PostsSection() {
  const { posts, loading, error } = usePosts();

  if (error)
    return (
      <p className="text-sm text-red-500">Failed to load posts: {error}</p>
    );
  if (loading || !posts) return <LoadingPosts />;

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

function LoadingPosts() {
  const range = [...Array(10).keys()];
  return (
    <div className="flex flex-col gap-3">
      {range.map((n) => (
        <div key={n} className="w-fill bg-neutral-100 animate-pulse"></div>
      ))}
    </div>
  );
}

"use client";
import { PostList } from "../components/post-list";
import { usePosts } from "../hooks/usePosts";

export default function Home() {
  const { posts, loading, error } = usePosts();

  if (error)
    return (
      <p className="text-sm text-red-500 p-8">Failed to load posts: {error}</p>
    );
  if (loading || !posts)
    return <p className="text-sm text-neutral-400 p-8">Loading...</p>;

  const featured = posts.filter((p) => p.featured);
  const rest = posts.filter((p) => !p.featured);

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 flex flex-col gap-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Blog</h1>
        <p className="text-sm text-neutral-500">Simple and clean CMS setup</p>
      </div>

      {featured.length > 0 && <PostList posts={featured} title="Featured" />}

      {rest.length > 0 && <PostList posts={rest} title="Posts" />}

      {posts.length === 0 && (
        <p className="text-sm text-neutral-400">No posts yet.</p>
      )}
    </div>
  );
}

"use client";
import { PostList } from "@/src/components/post-list";
import { usePosts } from "@/src/hooks/usePosts";
import { supabase } from "@/src/supabase/client";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  const { posts, loading, error, refetch } = usePosts();

  const handleDelete = async (id: string) => {
    const ok = window.confirm("Permanently delete post?");
    if (!ok) return;
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) throw new Error(error.message);
    refetch();
  };

  if (error) return <p>Failed to load posts: {error}</p>;
  if (loading || !posts) return <p>Loading posts</p>;

  return (
    <div className="">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-end">
          <Link
            href="/admin/posts/new"
            className="bg-black text-white px-4 py-2 text-sm flex items-center gap-2 hover:cursor-pointer hover:shadow-2xl transition-shadow"
          >
            <Plus size={22} />
            <span className="hidden sm:block">
              <pre>New Post</pre>
            </span>
          </Link>
        </div>

        {posts.length > 0 ? (
          <PostList
            posts={posts}
            title=""
            adminList
            deletePost={handleDelete}
          />
        ) : (
          <p className="text-sm text-neutral-400">No posts yet.</p>
        )}
      </div>
    </div>
  );
}

import { postCache } from "@/src/lib/cache-posts";
import { supabase } from "@/src/supabase/client";
import { Post } from "@/src/types/posts";
import { useCallback, useEffect, useState } from "react";

export function usePosts() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data: posts, error } = await supabase
      .from("posts")
      .select("*")
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
      setLoading(false);
      setPosts(null);
      return;
    }

    setPosts(posts);
    posts.forEach((post) => postCache.set(post.slug, post));
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPosts();
  }, [loadPosts]);

  return { posts, loading, error, refetch: loadPosts };
}

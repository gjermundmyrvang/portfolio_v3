import { useState, useEffect, useCallback } from "react";
import { getPostLikeState, toggleLike } from "../lib/post-likes";

type PostLikeState = {
  liked: boolean;
  likeCount: number;
};

export function usePostLike(postId: string) {
  const [state, setState] = useState<PostLikeState>({
    liked: false,
    likeCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchState() {
      try {
        setLoading(true);
        const result = await getPostLikeState(postId);
        if (!cancelled) setState(result);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e : new Error(String(e)));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchState();
    return () => {
      cancelled = true;
    };
  }, [postId]);

  const toggle = useCallback(async () => {
    // Optimistic update
    setState((prev) => ({
      liked: !prev.liked,
      likeCount: prev.likeCount + (prev.liked ? -1 : 1),
    }));

    try {
      const result = await toggleLike(postId);
      setState(result);
    } catch (e) {
      // Rollback if failed
      setState((prev) => ({
        liked: !prev.liked,
        likeCount: prev.likeCount + (prev.liked ? -1 : 1),
      }));
      setError(e instanceof Error ? e : new Error(String(e)));
    }
  }, [postId]);

  return { ...state, loading, error, toggle };
}

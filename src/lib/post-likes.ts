import { supabase } from "../supabase/client";

// Returns the current user, signing in anonymously if needed
async function getOrCreateAnonUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) return user;

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  return data.user!;
}

type PostLikeState = {
  liked: boolean;
  likeCount: number;
};

export async function getPostLikeState(postId: string): Promise<PostLikeState> {
  const user = await getOrCreateAnonUser();

  const [{ count }, { data: myLike }] = await Promise.all([
    supabase
      .from("post_likes")
      .select("*", { count: "exact", head: true })
      .eq("post_id", postId)
      .throwOnError(),
    supabase
      .from("post_likes")
      .select("post_id")
      .eq("post_id", postId)
      .eq("user_id", user.id)
      .maybeSingle()
      .throwOnError(),
  ]);

  return {
    likeCount: count ?? 0,
    liked: !!myLike,
  };
}

export async function toggleLike(postId: string): Promise<PostLikeState> {
  const user = await getOrCreateAnonUser();

  // Try to insert; if the unique constraint fires, delete instead
  const { error: insertError } = await supabase
    .from("post_likes")
    .insert({ post_id: postId, user_id: user.id });

  if (!insertError) {
    // Liked successfully — return optimistic state
    const { count } = await supabase
      .from("post_likes")
      .select("*", { count: "exact", head: true })
      .eq("post_id", postId)
      .throwOnError();
    return { liked: true, likeCount: count ?? 1 };
  }

  // Unique constraint violation = already liked
  const isAlreadyLiked = insertError.code === "23505";
  if (!isAlreadyLiked) throw insertError;

  await supabase
    .from("post_likes")
    .delete()
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .throwOnError();

  const { count } = await supabase
    .from("post_likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId)
    .throwOnError();

  return { liked: false, likeCount: count ?? 0 };
}

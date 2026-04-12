import { Post } from "../types/posts";

const cache = new Map<string, Post>();

export const postCache = {
  set: (slug: string, post: Post) => cache.set(slug, post),
  get: (slug: string) => cache.get(slug),
};

import Link from "next/link";
import { Post } from "../types/posts";
import { Newspaper, Pen, Trash } from "lucide-react";

type PostList = {
  posts: Post[];
  title: string;
  adminList?: boolean;
  deletePost?: (id: string) => Promise<void>;
};

export function PostList({
  posts,
  title,
  adminList = false,
  deletePost,
}: PostList) {
  return (
    <section className="flex flex-col gap-3">
      <p className="text-xs uppercase tracking-widest text-neutral-400">
        {title}
      </p>
      {posts.map((post) =>
        adminList ? (
          <PostRowAdmin key={post.id} post={post} deletePost={deletePost!} />
        ) : (
          <PostRow key={post.id} post={post} />
        ),
      )}
    </section>
  );
}

function formatDate(dateStr?: string) {
  return dateStr
    ? new Date(dateStr).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;
}

function PostRow({ post }: { post: Post }) {
  const date = formatDate(post.created_at);

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group flex items-start justify-between gap-4 py-3 border-b border-neutral-100 hover:border-neutral-300 transition-colors"
    >
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-medium">{post.title || post.slug}</p>
        {post.summary && (
          <p className="text-xs text-neutral-500 line-clamp-1">
            {post.summary}
          </p>
        )}
      </div>
      {date && (
        <span className="text-xs text-neutral-400 whitespace-nowrap pt-0.5">
          {date}
        </span>
      )}
    </Link>
  );
}

type PostRowAdminProps = {
  post: Post;
  deletePost: (id: string) => Promise<void>;
};

function PostRowAdmin({ post, deletePost }: PostRowAdminProps) {
  const date = formatDate(post.created_at);

  return (
    <div className="group flex items-start justify-between gap-4 py-3 border-b border-neutral-100 hover:border-neutral-300 transition-colors">
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <p className="text-sm font-medium line-clamp-1">
          {post.title || post.slug}
        </p>
        {post.summary && (
          <p className="text-xs text-neutral-500 line-clamp-1">
            {post.summary}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {date && (
          <pre className="text-xs text-neutral-400 whitespace-nowrap text-end">
            {date}
          </pre>
        )}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href={`/admin/posts/${post.slug}/edit`}
            className="text-xs text-gray-500 hover:text-blue-600 inline-flex items-center gap-1"
          >
            <Pen size={16} />
            <span className="hidden sm:block">
              <pre>Edit</pre>
            </span>
          </Link>
          <Link
            href={`/posts/${post.slug}`}
            className="text-xs text-gray-500 hover:text-blue-600 inline-flex items-center gap-1"
          >
            <Newspaper size={16} />
            <span className="hidden sm:block">
              <pre>View</pre>
            </span>
          </Link>
          <button
            onClick={() => deletePost(post.id)}
            className="text-gray-500 hover:text-red-500 hover:cursor-pointer text-xs inline-flex items-center gap-1"
          >
            <Trash size={16} />
            <span className="hidden sm:block">
              <pre>Delete</pre>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

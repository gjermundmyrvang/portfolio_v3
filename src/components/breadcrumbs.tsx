import Link from "next/link";
import { Home, ChevronRight, Heart } from "lucide-react";
import { usePostLike } from "../hooks/usePostLikes";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
  postId: string;
};

export default function Breadcrumb({
  items,
  className = "",
  postId,
}: BreadcrumbProps) {
  const {
    liked,
    likeCount,
    loading: likesLoading,
    toggle,
  } = usePostLike(postId);

  if (!items?.length) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex-col sm:flex-row items-center justify-between ${className}`}
    >
      <ol className="inline-flex items-center gap-1 md:gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isFirst = index === 0;

          return (
            <li
              key={`${item.label}-${index}`}
              aria-current={isLast ? "page" : undefined}
            >
              <div className="flex items-center gap-1.5">
                {!isFirst && (
                  <ChevronRight
                    size={14}
                    className="text-body rtl:rotate-180"
                  />
                )}

                {isLast || !item.href ? (
                  <span
                    className={`inline-flex items-center gap-1.5 text-sm text-body-subtle ${isLast ? "font-bold" : "font-medium"}`}
                  >
                    {isFirst && <Home size={16} />}
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-body hover:text-fg-brand"
                  >
                    {isFirst && <Home size={16} />}
                    {item.label}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggle}
          disabled={likesLoading}
          className="inline-flex items-center gap-2 text-sm mt-2 hover:cursor-pointer font-bold"
        >
          <Heart className={liked ? "text-red-500" : "text-gray-500"} />
          <span>{liked ? "Thanks" : "Cool"}</span>
          <span>[{likeCount ?? 0}]</span>
        </button>
      </div>
    </nav>
  );
}

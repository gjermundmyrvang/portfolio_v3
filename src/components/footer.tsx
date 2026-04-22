"use client";
import Link from "next/link";
import { GitGraph, House, LinkIcon, UserKey } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const path = usePathname();
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 mt-auto py-6 text-sm text-neutral-500">
      <div className="flex flex-col items-center gap-4">
        <nav className="flex items-center gap-6">
          {/* Page Nav */}
          {path === "/admin" || path === "/login" ? (
            <Link
              href="/"
              className="flex items-center gap-2 hover:text-neutral-900 dark:hover:text-neutral-700 transition"
            >
              <House size={16} />
              <span>Home</span>
            </Link>
          ) : (
            <Link
              href="/admin"
              className="flex items-center gap-2 hover:text-neutral-900 dark:hover:text-neutral-700 transition"
            >
              <UserKey size={16} />
              <span>Admin</span>
            </Link>
          )}
          {/* Socials */}
          <a
            href="https://github.com/gjermundmyrvang"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-neutral-900 dark:hover:text-neutral-700 transition"
          >
            <GitGraph size={16} />
            <span>GitHub</span>
          </a>

          <a
            href="https://linkedin.com/in/gjermupm"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-neutral-900 transition"
          >
            <LinkIcon size={16} />
            <span>LinkedIn</span>
          </a>
        </nav>

        <p className="text-xs text-neutral-400">
          © gjermundmyrvang {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}

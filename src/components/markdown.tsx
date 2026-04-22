"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownProps {
  content: string;
}

export default function Markdown({ content }: MarkdownProps) {
  return (
    <div className="prose prose-neutral max-w-none mt-4 dark:prose-invert dark:prose-p:text-neutral-400 dark:prose-headings:text-neutral-300 dark:prose-a:text-neutral-300">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}

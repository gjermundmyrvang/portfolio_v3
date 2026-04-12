import { useRef } from "react";

export function useMarkdownShortcuts(onChange: (val: string) => void) {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  function wrap(before: string, after = before) {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e, value } = el;
    const selected = value.slice(s, e);
    const wrapped = `${before}${selected}${after}`;
    const next = value.slice(0, s) + wrapped + value.slice(e);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      if (selected) {
        el.setSelectionRange(
          s + before.length,
          s + before.length + selected.length,
        );
      } else {
        el.setSelectionRange(s + before.length, s + before.length);
      }
    });
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    const mod = e.metaKey || e.ctrlKey;

    if (e.key === "Tab") {
      e.preventDefault();
      const el = ref.current;
      if (!el) return;
      const { selectionStart: s, selectionEnd: e2, value } = el;
      const indent = "  ";
      const next = value.slice(0, s) + indent + value.slice(e2);
      onChange(next);
      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(s + indent.length, s + indent.length);
      });
    }
    if (!mod) return;

    if (e.key === "b") {
      e.preventDefault();
      wrap("**");
    }
    if (e.key === "i") {
      e.preventDefault();
      wrap("_");
    }
    if (e.key === "k") {
      e.preventDefault();
      const el = ref.current;
      if (!el) return;
      const selected = el.value.slice(el.selectionStart, el.selectionEnd);
      wrap(`[${selected}](`, ")");
    }
  }

  return { ref, onKeyDown };
}

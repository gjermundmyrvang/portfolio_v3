"use client";
import { supabase } from "@/src/supabase/client";
import { Post, PostField } from "@/src/types/posts";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMarkdownShortcuts } from "../hooks/use-md-shortcuts";
import DropZoneInput from "./drop-zone";
import Markdown from "./markdown";
import { FileCheck, FileType, ImageIcon, Pin, PinOff, X } from "lucide-react";

type PostFormProps = {
  post?: Post; // if provided = edit mode, if not = create mode
};

const MD_PLACEHOLDER = `Write content in markdown syntax

- Italic (CMD + I)
- Bold (CMD + B)
- Link (CMD + K)
`;

export default function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const isEditing = !!post;

  const [fields, setFields] = useState<PostField>({
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    summary: post?.summary ?? "",
    content_md: post?.content_md ?? "",
    featured: post?.featured ?? false,
    ongoing: post?.ongoing ?? false,
  });

  const { ref: contentRef, onKeyDown: handleMarkdownKeyDown } =
    useMarkdownShortcuts((val) =>
      setFields((prev) => ({ ...prev, content_md: val })),
    );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mdTab, setMdTab] = useState<"write" | "preview">("write");
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [uploadAlt, setUploadAlt] = useState("");
  const [folders, setFolders] = useState<string[]>([]);
  const [uploadFolder, setUploadFolder] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolder, setShowNewFolder] = useState(false);

  useEffect(() => {
    async function fetchFolders() {
      const { data, error } = await supabase
        .from("post_folders")
        .select("name")
        .order("name");
      if (!error && data) {
        const names = data.map((r) => r.name);
        setFolders(names);
        setUploadFolder(names[0] ?? "");
        console.log(names);
      }
    }
    fetchFolders();
  }, []);

  async function addFolder() {
    const name = newFolderName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "");
    if (!name || folders.includes(name)) {
      setError("Foldername can't be blank or reused");
      return null;
    }

    const { error } = await supabase.from("post_folders").insert({ name });
    if (error) {
      setError(error.message);
      return null;
    }

    setFolders((prev) => [...prev, name].sort());
    setUploadFolder(name);
    setNewFolderName("");
    setShowNewFolder(false);
    console.log(`Folder '${name}' successfully added`);
    return name;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setFields((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (!fields.title.trim() || !fields.slug.trim()) {
      setError("Title and slug are required.");
      return;
    }
    const {
      data: { session },
    } = await supabase.auth.getSession();
    console.log(session);
    setLoading(true);
    setError(null);

    const payload = {
      ...fields,
    };

    const { error } = isEditing
      ? await supabase.from("posts").update(payload).eq("id", post.id)
      : await supabase.from("posts").insert({ ...payload });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
  };

  function setContentMd(updater: (prev: string) => string) {
    setFields((prev) => ({ ...prev, content_md: updater(prev.content_md) }));
  }

  function insertIntoMarkdown(snippet: string) {
    const el = contentRef.current;
    if (!el) {
      setContentMd((prev) => prev + "\n" + snippet + "\n");
      return;
    }
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    setContentMd((prev) => prev.slice(0, start) + snippet + prev.slice(end));
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + snippet.length;
      el.setSelectionRange(pos, pos);
    });
  }

  async function uploadImage(file: File) {
    setUploading(true);
    setError(null);

    let folderName = uploadFolder;

    if (showNewFolder) {
      const createdFolder = await addFolder();
      if (!createdFolder) {
        setUploading(false);
        return;
      }
      folderName = createdFolder;
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "png";
    const safeExt = ext.replace(/[^a-z0-9]/g, "") || "png";
    const name = (
      globalThis.crypto?.randomUUID?.() ?? String(Date.now())
    ).slice(0, 16);

    const folder = isEditing ? post.id : "new";
    const path = `${folderName}/${folder}/${name}.${safeExt}`;

    const { error: upErr } = await supabase.storage
      .from("posts")
      .upload(path, file, { upsert: false });

    if (upErr) {
      setError(upErr.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("posts").getPublicUrl(path);
    insertIntoMarkdown(`\n![${uploadAlt || "image"}](${data.publicUrl})`);
    setUploading(false);
    setImageModalOpen(false);
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <h1 className="text-xl font-semibold">
        {isEditing ? "Edit Post" : "New Post"}
      </h1>

      <label className="text-lg text-neutral-600 dark:text-neutral-300">
        Add post details
      </label>
      <input
        name="title"
        placeholder="Title"
        value={fields.title}
        onChange={handleChange}
        className="border border-neutral-200 dark:border-neutral-700 px-3 py-2 rounded"
        required
      />
      <input
        name="slug"
        placeholder="Slug"
        value={fields.slug}
        onChange={handleChange}
        className="border border-neutral-200 dark:border-neutral-700 px-3 py-2 rounded"
        required
      />
      <input
        name="summary"
        placeholder="Summary (optional)"
        value={fields.summary}
        onChange={handleChange}
        className="border border-neutral-200 dark:border-neutral-700 px-3 py-2 rounded"
      />
      <div>
        <label className="text-lg text-neutral-600 dark:text-neutral-300">
          Add content
        </label>
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700 py-2">
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setMdTab("write")}
              className={`px-3 py-1 text-sm hover:cursor-pointer ${
                mdTab === "write"
                  ? "bg-neutral-900 text-white"
                  : "hover:bg-neutral-100 dark:hover:bg-neutral-700"
              }`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setMdTab("preview")}
              className={`px-3 py-1 text-sm hover:cursor-pointer ${
                mdTab === "preview"
                  ? "bg-neutral-900 text-white"
                  : "hover:bg-neutral-100 dark:hover:bg-neutral-700"
              }`}
            >
              Preview
            </button>
          </div>
          <p className="text-xs text-neutral-600">Markdown</p>
        </div>
        <button
          onClick={() => setImageModalOpen(true)}
          className="flex mt-2 items-center gap-2 border border-neutral-200 dark:border-neutral-700 px-3 py-2 rounded text-sm text-neutral-600 hover:bg-neutral-50 hover:cursor-pointer dark:hover:bg-neutral-700 dark:text-neutral-300"
        >
          <ImageIcon className="w-4 h-4" />
          Insert image
        </button>
        {mdTab === "write" ? (
          <textarea
            ref={contentRef}
            name="content_md"
            placeholder={MD_PLACEHOLDER}
            value={fields.content_md}
            onChange={handleChange}
            onKeyDown={handleMarkdownKeyDown}
            rows={12}
            className="mt-2 border border-neutral-200 dark:border-neutral-700 px-3 py-2 rounded font-mono text-sm w-full"
          />
        ) : (
          <div className="mt-2">
            <Markdown content={fields.content_md ?? "_(blank)_"} />
          </div>
        )}
      </div>
      {/* ONGOING */}
      <div
        className={`flex items-center ps-4 border rounded shadow-xs ${fields.ongoing ? "border-green-400 bg-green-300" : "bg-neutral-100 border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700"}`}
      >
        <input
          id="checkbox-ongoing"
          type="checkbox"
          name="ongoing"
          checked={fields.ongoing}
          onChange={handleChange}
          className="accent-green-800"
          disabled={fields.featured}
        />
        <label
          htmlFor="checkbox-ongoing"
          className={`inline-flex items-center gap-2 text-gray-500 select-none w-full py-4 ms-2 text-md font-medium hover:cursor-pointer ${fields.ongoing ? "text-green-800" : "text-gray-500"}`}
        >
          Ongoing
          <span>
            {fields.ongoing ? (
              <FileType className="size-4" />
            ) : (
              <FileCheck className="size-4" />
            )}
          </span>
        </label>
      </div>
      {/* FEATURED */}
      <div
        className={`flex items-center ps-4 border rounded shadow-xs ${fields.featured ? "border-green-400 bg-green-300" : "bg-neutral-100 border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700"}`}
      >
        <input
          id="checkbox"
          type="checkbox"
          name="featured"
          checked={fields.featured}
          onChange={handleChange}
          className="accent-green-800"
          disabled={fields.ongoing}
        />
        <label
          htmlFor="checkbox"
          className={`inline-flex items-center gap-2 text-gray-500 select-none w-full py-4 ms-2 text-md font-medium hover:cursor-pointer ${fields.featured ? "text-green-800" : "text-gray-500"}`}
        >
          Featured
          <span>
            {fields.featured ? (
              <Pin className="size-4" />
            ) : (
              <PinOff className="size-4" />
            )}
          </span>
        </label>
      </div>

      {imageModalOpen && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={(e) =>
            e.target === e.currentTarget && setImageModalOpen(false)
          }
        >
          <div className="bg-background rounded-xl border dark:border-neutral-700 w-full max-w-md mx-4 overflow-hidden shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b dark:border-neutral-700">
              <h2 className="text-sm font-medium">
                Insert image into markdown
              </h2>
              <button
                onClick={() => setImageModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 text-xl leading-none hover:cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-neutral-500">Alt text</label>
                <input
                  className="border dark:border-neutral-700 px-3 py-2 rounded text-sm"
                  required
                  value={uploadAlt}
                  onChange={(e) => setUploadAlt(e.target.value)}
                  placeholder="Describe the image"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-neutral-500">Folder</label>
                <select
                  className="border dark:border-neutral-700 px-3 py-2 rounded text-sm"
                  value={uploadFolder}
                  onChange={(e) => setUploadFolder(e.target.value)}
                >
                  {FOLDERS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              <DropZoneInput onFileDrop={uploadImage} uploading={uploading} />
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 px-4 py-3 border-t dark:border-neutral-700">
              <button
                onClick={() => setImageModalOpen(false)}
                className="border dark:border-neutral-700 px-3 py-2 rounded text-sm hover:cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={uploading}
                className="bg-neutral-900 dark:bg-green-900 text-white px-3 py-2 rounded text-sm disabled:opacity-50 hover:cursor-pointer"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-black text-white py-2 rounded hover:cursor-pointer dark:bg-transparent dark:border dark:border-neutral-700 dark:hover:bg-neutral-700 transition-colors"
      >
        {loading ? "Saving..." : isEditing ? "Update Post" : "Create Post"}
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}

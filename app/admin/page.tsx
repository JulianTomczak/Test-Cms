"use client";

import { useState } from "react";

interface ExistingPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  published: boolean;
}

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [existingPosts, setExistingPosts] = useState<ExistingPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          content,
          description,
          published,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error ?? "Error desconocido");
        return;
      }

      setMessage(`Post creado exitosamente: ${data.filePath}`);
      setTitle("");
      setSlug("");
      setContent("");
      setDescription("");
    } catch {
      setMessage("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  async function testConnection() {
    setConnectionStatus("Conectando...");
    setExistingPosts([]);

    try {
      const response = await fetch("/api/admin/posts");
      const data = await response.json();

      if (response.ok) {
        setConnectionStatus("Conectado a GitHub");
        setExistingPosts(data.posts ?? []);
      } else {
        setConnectionStatus(`Error: ${data.error ?? "Sin conexión"}`);
      }
    } catch {
      setConnectionStatus("Error de conexión");
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-zinc-50 p-8 dark:bg-black">
      <div className="w-full max-w-2xl">
        <h1 className="mb-8 text-2xl font-semibold text-black dark:text-zinc-50">
          Crear artículo
        </h1>

        <div className="mb-6 rounded-lg bg-white p-4 shadow-sm dark:bg-zinc-900">
          <button
            type="button"
            onClick={testConnection}
            className="rounded-full bg-foreground px-4 py-2 text-background text-sm transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Probar conexión con GitHub
          </button>

          {connectionStatus && (
            <p
              className={`mt-2 text-sm ${
                connectionStatus === "Conectado a GitHub"
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {connectionStatus}
            </p>
          )}
        </div>

        {existingPosts.length > 0 && (
          <div className="mb-6 rounded-lg bg-white p-4 shadow-sm dark:bg-zinc-900">
            <h2 className="mb-3 text-lg font-medium text-black dark:text-zinc-50">
              Posts existentes en GitHub
            </h2>
            <ul className="flex flex-col gap-2">
              {existingPosts.map((post) => (
                <li
                  key={post.slug}
                  className="text-sm text-zinc-600 dark:text-zinc-400"
                >
                  {post.title} — {post.date}
                </li>
              ))}
            </ul>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-900"
        >
          <div>
            <label
              htmlFor="title"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Título
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded border border-zinc-300 px-3 py-2 text-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div>
            <label
              htmlFor="slug"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Slug
            </label>
            <input
              id="slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              placeholder="mi-articulo"
              className="w-full rounded border border-zinc-300 px-3 py-2 text-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Descripción
            </label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded border border-zinc-300 px-3 py-2 text-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Contenido
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={12}
              className="w-full rounded border border-zinc-300 px-3 py-2 text-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="published"
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            <label
              htmlFor="published"
              className="text-sm text-zinc-700 dark:text-zinc-300"
            >
              Publicado
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-foreground px-5 py-2 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] disabled:opacity-50"
          >
            {loading ? "Publicando..." : "Publicar artículo"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-sm ${
              message.startsWith("Post creado")
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
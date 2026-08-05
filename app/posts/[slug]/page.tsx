import { getPost, getPosts } from "@/lib/posts";
import ReactMarkdown from "react-markdown";

export async function generateStaticParams() {
  const posts = getPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);

  if (!post) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="w-full max-w-2xl px-16 py-32">
          <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
            Post no encontrado
          </h1>
          <a
            href="/admin"
            className="mt-4 inline-block text-blue-600 underline dark:text-blue-400"
          >
            Volver al panel
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-2xl px-16 py-32">
        <a
          href="/admin"
          className="mb-8 inline-block text-sm text-blue-600 underline-offset-4 hover:underline dark:text-blue-400"
        >
          &larr; Volver al panel
        </a>

        <article>
          <h1 className="mb-2 text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            {post.title}
          </h1>

          {post.date && (
            <time className="mb-4 block text-sm text-zinc-500 dark:text-zinc-400">
              {post.date}
            </time>
          )}

          {post.description && (
            <p className="mb-6 text-lg text-zinc-600 dark:text-zinc-400">
              {post.description}
            </p>
          )}

          <div className="text-base leading-8 text-zinc-800 dark:text-zinc-200">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </article>
      </div>
    </main>
  );
}
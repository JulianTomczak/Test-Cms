import { getPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default function Home() {
  const posts = getPosts();

  return (
    <main className="flex min-h-screen flex-col items-center bg-zinc-50 dark:bg-black">
      <div className="w-full max-w-3xl px-16 py-32">
        <h1 className="mb-8 text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Posts
        </h1>

        {posts.length === 0 ? (
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            No posts yet.
          </p>
        ) : (
          <ul className="flex flex-col gap-6">
            {posts.map((post) => (
              <li
                key={post.slug}
                className="flex flex-col gap-1 rounded-lg bg-white px-5 py-4 shadow-sm dark:bg-zinc-900"
              >
                <a
                  href={`/posts/${post.slug}`}
                  className="text-lg font-medium text-zinc-950 underline-offset-4 hover:underline dark:text-zinc-50"
                >
                  {post.title}
                </a>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  {post.date}
                </span>
                {post.description && (
                  <p className="text-base text-zinc-600 dark:text-zinc-400">
                    {post.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

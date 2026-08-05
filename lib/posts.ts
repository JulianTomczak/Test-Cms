import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content", "posts");

export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  published: boolean;
  content: string;
}

export function getPost(slug: string): Post | null {
  if (!fs.existsSync(postsDirectory)) {
    return null;
  }

  const filePath = path.join(postsDirectory, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContents);

  const rawDate = data.date;
  const dateStr =
    rawDate instanceof Date
      ? rawDate.toISOString().split("T")[0]
      : typeof rawDate === "string"
        ? rawDate
        : String(rawDate ?? "");

  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    date: dateStr,
    published: data.published ?? true,
    content,
  };
}

export function getPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);

  const posts = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const post = getPost(slug);

      if (!post) return null;

      return {
        slug: post.slug,
        title: post.title,
        description: post.description,
        date: post.date,
        published: post.published,
        content: post.content,
      };
    })
    .filter((post): post is Post => post !== null)
    .filter((post) => post.published)
    .sort((a, b) => {
      if (a.date > b.date) return -1;
      if (a.date < b.date) return 1;
      return 0;
    });

  return posts;
}
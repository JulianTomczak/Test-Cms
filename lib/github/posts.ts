import { getGitHubClient } from "./client";
import matter from "gray-matter";

const contentDir = "content/posts";

interface PostFrontmatter {
  title: string;
  slug: string;
  description: string;
  date: string;
  published: boolean;
}

export function generateFrontmatter(frontmatter: PostFrontmatter): string {
  const lines = [
    "---",
    `title: ${frontmatter.title}`,
    `slug: ${frontmatter.slug}`,
    `description: ${frontmatter.description}`,
    `date: ${frontmatter.date}`,
    `published: ${frontmatter.published}`,
    "---",
    "",
  ];

  return lines.join("\n");
}

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  published: boolean;
}

export async function testConnection(): Promise<boolean> {
  const client = getGitHubClient();

  const owner = process.env.GITHUB_OWNER!;
  const repo = process.env.GITHUB_REPO!;

  await client.rest.repos.get({ owner, repo });

  return true;
}

export async function listPosts(): Promise<PostMeta[]> {
  const client = getGitHubClient();

  const owner = process.env.GITHUB_OWNER!;
  const repo = process.env.GITHUB_REPO!;

  let response;

  try {
    response = await client.rest.repos.getContent({
      owner,
      repo,
      path: contentDir,
    });
  } catch {
    return [];
  }

  if (!Array.isArray(response.data)) {
    return [];
  }

  const posts = await Promise.all(
    response.data
      .filter((file) => file.name?.endsWith(".md"))
      .map(async (file) => {
        const slug = file.name?.replace(/\.md$/, "") ?? "";
        const fileResponse = await client.rest.repos.getContent({
          owner,
          repo,
          path: `${contentDir}/${file.name}`,
        });

        if ("content" in fileResponse.data && fileResponse.data.content) {
          const content = Buffer.from(
            fileResponse.data.content as string,
            "base64"
          ).toString("utf-8");

          const matterResult = matter(content);

          const rawDate = (matterResult.data as Record<string, unknown>).date;
          const dateStr = rawDate instanceof Date ? rawDate.toISOString().split("T")[0] : String(rawDate ?? "");

          return {
            slug,
            title: (matterResult.data as Record<string, unknown>).title as string ?? slug,
            description: (matterResult.data as Record<string, unknown>).description as string ?? "",
            date: dateStr,
            published: (matterResult.data as Record<string, unknown>).published as boolean ?? true,
          };
        }

        return { slug, title: slug, description: "", date: "", published: true };
      })
  );

  return posts
    .filter((post) => post.published)
    .sort((a, b) => {
      if (a.date > b.date) return -1;
      if (a.date < b.date) return 1;
      return 0;
    });
}

export async function createPost(
  slug: string,
  frontmatter: PostFrontmatter,
  content: string
): Promise<{ commitSha: string; filePath: string }> {
  const client = getGitHubClient();

  const owner = process.env.GITHUB_OWNER!;
  const repo = process.env.GITHUB_REPO!;

  if (!owner || !repo) {
    throw new Error("GITHUB_OWNER and GITHUB_REPO must be defined in environment variables");
  }

  const filePath = `${contentDir}/${slug}.md`;
  const frontmatterStr = generateFrontmatter(frontmatter);
  const fileContent = frontmatterStr + content;

  const response = await client.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: filePath,
    message: `Add post: ${slug}`,
    content: Buffer.from(fileContent).toString("base64"),
  });

  return {
    commitSha: response.data.commit!.sha as string,
    filePath,
  };
}
import { NextRequest, NextResponse } from "next/server";
import { createPost, listPosts, testConnection } from "@/lib/github/posts";

export async function GET(): Promise<NextResponse> {
  try {
    const connection = await testConnection();
    const posts = await listPosts();

    return NextResponse.json({
      connected: connection,
      posts,
    });
  } catch (error) {
    console.error("Error testing connection:", error);

    return NextResponse.json(
      { error: "Failed to connect to GitHub" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    const { title, slug, content, description, date, published } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Missing required fields: title, slug, content" },
        { status: 400 }
      );
    }

    const frontmatter = {
      title,
      slug,
      description: description ?? "",
      date: date ?? new Date().toISOString().split("T")[0],
      published: published ?? true,
    };

    const result = await createPost(slug, frontmatter, content);

    return NextResponse.json({
      success: true,
      commitSha: result.commitSha,
      filePath: result.filePath,
    });
  } catch (error) {
    console.error("Error creating post:", error);

    const message =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: `Failed to create post: ${message}` },
      { status: 500 }
    );
  }
}
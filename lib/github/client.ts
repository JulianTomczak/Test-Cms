import { Octokit } from "@octokit/rest";

let _client: Octokit | null = null;

export function getGitHubClient(): Octokit {
  if (_client) return _client;

  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error("GITHUB_TOKEN is not defined in environment variables");
  }

  _client = new Octokit({ auth: token });
  return _client;
}
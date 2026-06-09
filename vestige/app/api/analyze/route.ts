import Anthropic from "@anthropic-ai/sdk";

function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const trimmed = url.trim().replace(/\.git$/, "");
  try {
    const u = new URL(trimmed);
    if (u.hostname === "github.com") {
      const parts = u.pathname.replace(/^\//, "").split("/").filter(Boolean);
      if (parts.length >= 2) return { owner: parts[0], repo: parts[1] };
    }
  } catch {}
  const match = trimmed.match(/^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)$/);
  if (match) return { owner: match[1], repo: match[2] };
  return null;
}

export async function POST(request: Request) {
  const body = await request.json();
  const { repoUrl } = body as { repoUrl: string };

  const parsed = parseGitHubUrl(repoUrl);
  if (!parsed) {
    return Response.json({ error: "Invalid GitHub URL" }, { status: 400 });
  }

  const { owner, repo } = parsed;
  const ghHeaders: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "Vestige/1.0",
  };
  if (process.env.GITHUB_TOKEN) {
    ghHeaders["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const gh = (path: string) =>
    fetch(`https://api.github.com${path}`, { headers: ghHeaders });

  const [repoRes, commitsRes, prsRes] = await Promise.all([
    gh(`/repos/${owner}/${repo}`),
    gh(`/repos/${owner}/${repo}/commits?per_page=100`),
    gh(`/repos/${owner}/${repo}/pulls?state=closed&per_page=50&sort=updated&direction=desc`),
  ]);

  if (!repoRes.ok) {
    const err = await repoRes.json().catch(() => ({})) as { message?: string };
    return Response.json(
      { error: err.message || "Repository not found or inaccessible" },
      { status: repoRes.status }
    );
  }

  const [repoData, rawCommits, rawPRs] = await Promise.all([
    repoRes.json(),
    commitsRes.ok ? commitsRes.json() : Promise.resolve([]),
    prsRes.ok ? prsRes.json() : Promise.resolve([]),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const commits: any[] = Array.isArray(rawCommits) ? rawCommits : [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const prs: any[] = Array.isArray(rawPRs) ? rawPRs : [];

  const commitLines = commits
    .slice(0, 100)
    .map((c) => {
      const msg = c.commit.message.split("\n")[0];
      const author = c.commit.author?.name || "Unknown";
      const date = (c.commit.author?.date || "").split("T")[0];
      return `- [${c.sha.substring(0, 7)}] ${date} ${author}: ${msg}`;
    })
    .join("\n");

  const prLines = prs
    .slice(0, 50)
    .map((pr) => {
      const body = pr.body ? pr.body.substring(0, 300).replace(/\r?\n/g, " ") : "(no description)";
      const status = pr.merged_at ? "merged" : "closed";
      return `PR #${pr.number} (${status}) "${pr.title}" by ${pr.user?.login}: ${body}`;
    })
    .join("\n\n");

  const prompt = `You are Vestige, a code historian. Analyze this repository's Git history and return a JSON object describing the full story of how and why this codebase evolved.

REPOSITORY: ${repoData.full_name}
Description: ${repoData.description || "(none)"}
Primary language: ${repoData.language || "unknown"}
Stars: ${repoData.stargazers_count} | Forks: ${repoData.forks_count}
Created: ${(repoData.created_at || "").split("T")[0]} | Last pushed: ${(repoData.pushed_at || "").split("T")[0]}

COMMIT HISTORY (${commits.length} commits, most recent first):
${commitLines || "(no commits found)"}

PULL REQUESTS (${prs.length} closed/merged PRs):
${prLines || "(no PRs found)"}

Write a detailed narrative history of this codebase. Structure your response as a story of the project's evolution, covering:

1. **Origin** — What problem was this built to solve? What does the early commit history suggest about the initial intent?

2. **Key turning points** — Identify the major inflection points: when did the project change direction, add significant features, undergo major refactors, or shift focus?

3. **Decision archaeology** — For commits with vague messages (like "fix", "update", "wip"), reason from the surrounding context. What was likely going on?

4. **Patterns and signals** — What does the rhythm of contributions tell us? Burst activity followed by silence? Steady maintenance? A pivot?

5. **What was left undocumented** — What decisions happened silently, without PR descriptions or clear commit messages? Name them.

Be specific and reference real commit messages and PR titles. When you're inferring rather than reading, say so clearly. Write for a senior developer who just inherited this codebase and needs to understand not just what it does, but why it exists the way it does.

Return a JSON object with this exact shape — no preamble, no markdown fences, valid JSON only:
{
  "narrative": "the full narrative as markdown",
  "findings": [
    {
      "title": "short finding title",
      "detail": "one paragraph explanation",
      "confidence": "High",
      "evidence": "commit sha or PR that supports this",
      "inferred": false,
      "flag": "optional risk or undocumented decision note"
    }
  ]
}`;

  const client = new Anthropic();
  const stream = client.messages.stream({
    model: "claude-opus-4-8",
    max_tokens: 6000,
    thinking: { type: "adaptive" },
    messages: [{ role: "user", content: prompt }],
  });

  const message = await stream.finalMessage();
  const raw = message.content
    .filter((block) => block.type === "text")
    .map((block) => (block as { type: "text"; text: string }).text)
    .join("");

  let narrative = raw;
  let findings: unknown[] = [];

  try {
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    narrative = parsed.narrative || raw;
    findings = parsed.findings || [];
  } catch {
    narrative = raw;
    findings = [];
  }

  return Response.json({
    narrative,
    findings,
    repo: {
      full_name: repoData.full_name,
      description: repoData.description,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      language: repoData.language,
      created_at: repoData.created_at,
      pushed_at: repoData.pushed_at,
      html_url: repoData.html_url,
    },
    commits: commits.slice(0, 100).map((c) => ({
      sha: c.sha,
      message: c.commit.message,
      author: c.commit.author?.name,
      date: c.commit.author?.date,
      url: c.html_url,
    })),
    prs: prs.slice(0, 50).map((pr) => ({
      number: pr.number,
      title: pr.title,
      body: pr.body,
      user: pr.user?.login,
      merged_at: pr.merged_at,
      closed_at: pr.closed_at,
      url: pr.html_url,
    })),
  });
}

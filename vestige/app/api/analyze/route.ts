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

  // Validate repo before opening the stream
  const repoCheck = await gh(`/repos/${owner}/${repo}`);
  if (!repoCheck.ok) {
    const err = await repoCheck.json().catch(() => ({})) as { message?: string };
    return Response.json(
      { error: err.message || "Repository not found or inaccessible" },
      { status: repoCheck.status }
    );
  }
  const repoData = await repoCheck.json();

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(encoder.encode(JSON.stringify(data) + "\n"));
      };

      try {
        // Stage 1 — fetch commits and PRs
        send({ stage: "fetching", message: `Fetching commit history for ${repoData.full_name}…` });

        const [commitsRes, prsRes] = await Promise.all([
          gh(`/repos/${owner}/${repo}/commits?per_page=100`),
          gh(`/repos/${owner}/${repo}/pulls?state=closed&per_page=50&sort=updated&direction=desc`),
        ]);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const commits: any[] = commitsRes.ok ? await commitsRes.json().then(d => Array.isArray(d) ? d : []) : [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const prs: any[] = prsRes.ok ? await prsRes.json().then(d => Array.isArray(d) ? d : []) : [];

        // Stage 2 — fetch diffs
        const diffTarget = commits.slice(0, 25);
        send({ stage: "diffs", message: `Reading diffs across ${diffTarget.length} commits…` });

        const commitDetails = await Promise.all(
          diffTarget.map((c) =>
            gh(`/repos/${owner}/${repo}/commits/${c.sha}`)
              .then((r) => (r.ok ? r.json() : null))
              .catch(() => null)
          )
        );

        const commitLines = commits
          .slice(0, 100)
          .map((c, i) => {
            const msg = c.commit.message.split("\n")[0];
            const author = c.commit.author?.name || "Unknown";
            const date = (c.commit.author?.date || "").split("T")[0];
            const header = `[${c.sha.substring(0, 7)}] ${date} ${author}: ${msg}`;

            const detail = commitDetails[i];
            if (!detail?.files?.length) return `- ${header}`;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const fileLines = (detail.files as any[]).slice(0, 5).map((f) => {
              const patch = f.patch
                ? `\n      ${f.patch.substring(0, 400).replace(/\n/g, "\n      ")}`
                : "";
              return `    ${f.status} ${f.filename} (+${f.additions}/-${f.deletions})${patch}`;
            });

            return `- ${header}\n${fileLines.join("\n")}`;
          })
          .join("\n\n");

        const prLines = prs
          .slice(0, 50)
          .map((pr) => {
            const prBody = pr.body ? pr.body.substring(0, 300).replace(/\r?\n/g, " ") : "(no description)";
            const status = pr.merged_at ? "merged" : "closed";
            return `PR #${pr.number} (${status}) "${pr.title}" by ${pr.user?.login}: ${prBody}`;
          })
          .join("\n\n");

        // Stage 3 — Claude analysis
        send({ stage: "analyzing", message: `Analyzing ${commits.length} commits with AI…` });

        const prompt = `You are Vestige, a code historian. Analyze this repository's Git history and return a JSON object describing the full story of how and why this codebase evolved.

REPOSITORY: ${repoData.full_name}
Description: ${repoData.description || "(none)"}
Primary language: ${repoData.language || "unknown"}
Stars: ${repoData.stargazers_count} | Forks: ${repoData.forks_count}
Created: ${(repoData.created_at || "").split("T")[0]} | Last pushed: ${(repoData.pushed_at || "").split("T")[0]}

COMMIT HISTORY (${commits.length} total commits, most recent first):
The 25 most recent commits include actual file diffs. Older commits show message only.
${commitLines || "(no commits found)"}

PULL REQUESTS (${prs.length} closed/merged PRs):
${prLines || "(no PRs found)"}

Write a detailed narrative history of this codebase. You have access to real code diffs — use them. When a commit message says "fix" but the diff shows auth middleware being bypassed, say so. When a diff shows a migration being half-applied, name it.

Structure your response as a story of the project's evolution, covering:

1. **Origin** — What problem was this built to solve? What does the early commit history suggest about the initial intent?

2. **Key turning points** — Identify the major inflection points: when did the project change direction, add significant features, undergo major refactors, or shift focus?

3. **Decision archaeology** — For commits with vague messages (like "fix", "update", "wip"), reason from the actual code changes. What changed in the files? What does that tell you about what broke or what decision was made silently?

4. **Patterns and signals** — What does the rhythm of contributions tell us? Burst activity followed by silence? Steady maintenance? A pivot?

5. **What was left undocumented** — What decisions happened silently, without PR descriptions or clear commit messages? Name them with specific evidence from the diffs.

Be specific. Reference real commit SHAs, file paths, and diff content. When you're inferring rather than reading directly from a diff, say so. Write for a senior developer who just inherited this codebase.

For each finding, assign two independent scores:
- confidence: how strongly the git artifacts support this finding (High = multiple clear commits/PRs, Medium = partial evidence, Low = inferred from sparse signals)
- riskLevel: how risky this finding is to the codebase's security, stability, or maintainability (High = auth/secrets/breaking changes/deleted tests, Medium = dependency drift/undocumented pivots/coupling, Low = style/docs/minor patterns)

Return a JSON object with this exact shape — no preamble, no markdown fences, valid JSON only:
{
  "narrative": "the full narrative as markdown",
  "findings": [
    {
      "title": "short finding title",
      "detail": "one paragraph explanation",
      "confidence": "High",
      "riskLevel": "Medium",
      "evidence": "commit sha or PR that supports this",
      "inferred": false,
      "flag": "optional risk or undocumented decision note"
    }
  ]
}`;

        const client = new Anthropic();
        const aiStream = client.messages.stream({
          model: "claude-opus-4-8",
          max_tokens: 12000,
          thinking: { type: "adaptive" },
          messages: [{ role: "user", content: prompt }],
        });

        const message = await aiStream.finalMessage();
        const raw = message.content
          .filter((block) => block.type === "text")
          .map((block) => (block as { type: "text"; text: string }).text)
          .join("");

        let narrative = raw;
        let findings: unknown[] = [];

        try {
          // Find the outermost JSON object — more robust than stripping fences
          const jsonMatch = raw.match(/\{[\s\S]*\}/);
          if (!jsonMatch) throw new Error("No JSON object found in response");
          const parsed = JSON.parse(jsonMatch[0]);
          narrative = parsed.narrative || raw;
          findings = Array.isArray(parsed.findings) ? parsed.findings : [];
          if (findings.length === 0) {
            console.warn("[Vestige] Claude returned 0 findings. Raw length:", raw.length);
          }
        } catch (parseErr) {
          console.error("[Vestige] JSON parse failed:", parseErr, "\nRaw (first 500):", raw.substring(0, 500));
          narrative = raw;
          findings = [];
        }

        send({
          stage: "complete",
          result: {
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
          },
        });
      } catch (err) {
        send({ stage: "error", message: err instanceof Error ? err.message : "Analysis failed" });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson" },
  });
}

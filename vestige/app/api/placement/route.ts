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
  const { repoUrl, filePath, changeDescription } = body as {
    repoUrl: string;
    filePath: string;
    changeDescription: string;
  };

  if (!repoUrl || !filePath || !changeDescription) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const parsed = parseGitHubUrl(repoUrl);
  if (!parsed) {
    return Response.json({ error: "Invalid GitHub URL" }, { status: 400 });
  }

  const { owner, repo } = parsed;
  const cleanPath = filePath.replace(/^\//, "");

  const ghHeaders: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "Vestige/1.0",
  };
  if (process.env.GITHUB_TOKEN) {
    ghHeaders["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const fileRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(cleanPath)}`,
    { headers: ghHeaders }
  );

  if (!fileRes.ok) {
    if (fileRes.status === 404) {
      return Response.json(
        { error: `File not found: ${cleanPath}` },
        { status: 404 }
      );
    }
    const err = await fileRes.json().catch(() => ({})) as { message?: string };
    return Response.json(
      { error: err.message || "Could not fetch file" },
      { status: fileRes.status }
    );
  }

  const fileData = await fileRes.json();

  if (fileData.type !== "file") {
    return Response.json(
      { error: `${cleanPath} is a directory, not a file` },
      { status: 400 }
    );
  }

  if (!fileData.content) {
    return Response.json({ error: "File has no content" }, { status: 400 });
  }

  const rawContent = Buffer.from(fileData.content, "base64").toString("utf-8");
  const lines = rawContent.split("\n");
  const totalLines = lines.length;

  // Annotate every line with its line number for Claude to reference
  const MAX_LINES = 800;
  let annotatedContent: string;
  let truncationNote = "";

  if (totalLines <= MAX_LINES) {
    annotatedContent = lines
      .map((line, i) => `${String(i + 1).padStart(4, " ")} | ${line}`)
      .join("\n");
  } else {
    // Show first 600 lines and last 200 lines with a break note
    const head = lines.slice(0, 600);
    const tail = lines.slice(totalLines - 200);
    const headAnnotated = head
      .map((line, i) => `${String(i + 1).padStart(4, " ")} | ${line}`)
      .join("\n");
    const tailAnnotated = tail
      .map((line, i) => `${String(totalLines - 200 + i + 1).padStart(4, " ")} | ${line}`)
      .join("\n");
    annotatedContent = `${headAnnotated}\n\n... [lines 601–${totalLines - 200} omitted] ...\n\n${tailAnnotated}`;
    truncationNote = `\nNote: The file has ${totalLines} lines. Lines 601–${totalLines - 200} were omitted to fit context. If the best insertion point is in the omitted range, say so and explain why.`;
  }

  const prompt = `You are Vestige's Placement Mode. Your job is to read a file's structure and tell the developer exactly where to make their change — and why that placement is safe.

REPOSITORY: ${owner}/${repo}
FILE: ${cleanPath} (${totalLines} lines)
${truncationNote}

CHANGE THE DEVELOPER WANTS TO MAKE:
${changeDescription}

FILE CONTENT (with line numbers):
\`\`\`
${annotatedContent}
\`\`\`

Analyze this file carefully. Look at:
- How the file is structured and organized (sections, blocks, patterns)
- What conventions the original author used
- What comes before and after potential insertion points and why
- What the developer's change is and how it fits the existing patterns

Then provide:

1. **Recommended line** — The exact line number where they should insert, with a one-line summary (e.g., "Insert after line 827 — between the component overrides block and the utility classes")

2. **Why this placement** — A clear explanation of why this specific location is correct based on the file's own logic and conventions. Reference what's above and below. Explain what would go wrong inserting somewhere else.

3. **What to watch** — Any specific things about the surrounding context they should be aware of (cascade implications, scope issues, naming patterns to follow, etc.)

Be precise. Reference real line numbers and real content from the file. If the change doesn't fit cleanly anywhere, say so and explain what structure is missing.`;

  const client = new Anthropic();
  const stream = client.messages.stream({
    model: "claude-opus-4-8",
    max_tokens: 3000,
    thinking: { type: "adaptive" },
    messages: [{ role: "user", content: prompt }],
  });

  const message = await stream.finalMessage();
  const recommendation = message.content
    .filter((block) => block.type === "text")
    .map((block) => (block as { type: "text"; text: string }).text)
    .join("");

  return Response.json({
    recommendation,
    file: {
      path: cleanPath,
      totalLines,
      repo: `${owner}/${repo}`,
      url: fileData.html_url,
    },
  });
}

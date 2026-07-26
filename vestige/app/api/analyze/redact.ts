// Strips likely secrets out of repo content (commit messages, diffs, PR bodies)
// before it reaches the LLM prompt or the rendered report. Leaked credentials
// in git history are one of the most common findings a tool like this surfaces —
// without this pass they'd get relayed to Anthropic and printed in the report.

const SECRET_PATTERNS: { name: string; pattern: RegExp }[] = [
  { name: "aws-access-key-id", pattern: /AKIA[0-9A-Z]{16}/g },
  { name: "github-token", pattern: /gh[pousr]_[A-Za-z0-9]{36,}/g },
  { name: "google-api-key", pattern: /AIza[0-9A-Za-z\-_]{35}/g },
  { name: "slack-token", pattern: /xox[baprs]-[0-9A-Za-z-]{10,}/g },
  { name: "stripe-key", pattern: /sk_live_[0-9a-zA-Z]{24,}/g },
  {
    name: "private-key-block",
    pattern: /-----BEGIN[ A-Z]*PRIVATE KEY-----[\s\S]*?-----END[ A-Z]*PRIVATE KEY-----/g,
  },
  { name: "jwt", pattern: /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g },
  {
    name: "assigned-secret",
    pattern:
      /(api[_-]?key|secret|token|password|passwd|pwd|access[_-]?key)\s*[:=]\s*['"]?[A-Za-z0-9_\-/+]{8,}['"]?/gi,
  },
];

export function redactSecrets(text: string): string {
  if (!text) return text;
  let out = text;
  for (const { name, pattern } of SECRET_PATTERNS) {
    out = out.replace(pattern, `[REDACTED:${name}]`);
  }
  return out;
}

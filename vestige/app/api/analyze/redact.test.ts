import { describe, it, expect } from "vitest";
import { redactSecrets } from "./redact";

// Each `it` is one case: call the function, assert what came back.
// These are the kinds of secrets git history commonly contains — if any of
// these regressed, a real commit diff would leak the actual value to the
// LLM prompt and into the rendered report.

describe("redactSecrets", () => {
  it("redacts an AWS access key id", () => {
    const input = "export AWS_KEY=AKIAIOSFODNN7EXAMPLE";
    expect(redactSecrets(input)).not.toContain("AKIAIOSFODNN7EXAMPLE");
    expect(redactSecrets(input)).toContain("[REDACTED:aws-access-key-id]");
  });

  it("redacts a GitHub personal access token", () => {
    const input = "curl -H 'Authorization: token ghp_abcdefghijklmnopqrstuvwxyz0123456789AB'";
    expect(redactSecrets(input)).not.toMatch(/ghp_[A-Za-z0-9]{36,}/);
    expect(redactSecrets(input)).toContain("[REDACTED:github-token]");
  });

  it("redacts a Google API key", () => {
    // Real Google API keys are "AIza" + exactly 35 more characters.
    const input = `GOOGLE_API_KEY=AIza${"A".repeat(35)}`;
    expect(redactSecrets(input)).toContain("[REDACTED:google-api-key]");
  });

  it("redacts a Slack token", () => {
    const input = "token: xoxb-1234567890-1234567890123-abcdefghijklmnopqrstuvwx";
    expect(redactSecrets(input)).toContain("[REDACTED:slack-token]");
  });

  it("redacts a live Stripe key", () => {
    const input = "STRIPE_SECRET_KEY=sk_live_4eC39HqLyjWDarjtT1zdp7dc";
    expect(redactSecrets(input)).toContain("[REDACTED:stripe-key]");
  });

  it("redacts a PEM private key block", () => {
    const input = [
      "-----BEGIN RSA PRIVATE KEY-----",
      "MIIEpAIBAAKCAQEA1c7+9z5Pad7OejecsQ0bu3aumsRAAA==",
      "-----END RSA PRIVATE KEY-----",
    ].join("\n");
    expect(redactSecrets(input)).toContain("[REDACTED:private-key-block]");
    expect(redactSecrets(input)).not.toContain("MIIEpAIBAAKCAQEA1c7+9z5Pad7OejecsQ0bu3aumsRAAA==");
  });

  it("redacts a JWT", () => {
    const input =
      "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U";
    expect(redactSecrets(input)).toContain("[REDACTED:jwt]");
  });

  it("redacts a generic key=value secret assignment", () => {
    const input = "password: hunter2fallback123";
    expect(redactSecrets(input)).toContain("[REDACTED:assigned-secret]");
  });

  it("leaves ordinary text and code untouched", () => {
    const input = "fix(auth): correct off-by-one error in pagination loop";
    expect(redactSecrets(input)).toBe(input);
  });

  it("returns falsy input unchanged instead of throwing", () => {
    expect(redactSecrets("")).toBe("");
  });
});

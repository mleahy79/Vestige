import { describe, it, expect } from "vitest";
import { parseGitHubUrl } from "./route";

// parseGitHubUrl is the only thing standing between user input and a GitHub
// API call — it decides what counts as a valid repo reference. These tests
// cover the shapes it should accept and, just as importantly, the shapes it
// should reject.

describe("parseGitHubUrl", () => {
  it("parses a full https URL", () => {
    expect(parseGitHubUrl("https://github.com/vercel/next.js")).toEqual({
      owner: "vercel",
      repo: "next.js",
    });
  });

  it("strips a trailing .git suffix", () => {
    expect(parseGitHubUrl("https://github.com/vercel/next.js.git")).toEqual({
      owner: "vercel",
      repo: "next.js",
    });
  });

  it("ignores extra path segments after owner/repo", () => {
    expect(parseGitHubUrl("https://github.com/vercel/next.js/tree/canary")).toEqual({
      owner: "vercel",
      repo: "next.js",
    });
  });

  it("ignores a query string", () => {
    expect(parseGitHubUrl("https://github.com/vercel/next.js?tab=readme")).toEqual({
      owner: "vercel",
      repo: "next.js",
    });
  });

  it("accepts owner/repo shorthand with no URL", () => {
    expect(parseGitHubUrl("vercel/next.js")).toEqual({ owner: "vercel", repo: "next.js" });
  });

  it("rejects a non-GitHub host", () => {
    expect(parseGitHubUrl("https://gitlab.com/vercel/next.js")).toBeNull();
  });

  it("rejects a URL with no repo path", () => {
    expect(parseGitHubUrl("https://github.com/vercel")).toBeNull();
  });

  it("rejects garbage input", () => {
    expect(parseGitHubUrl("not a repo url")).toBeNull();
  });

  it("rejects an empty string", () => {
    expect(parseGitHubUrl("")).toBeNull();
  });
});

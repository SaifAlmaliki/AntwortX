import fs from "fs";
import path from "path";

const SLUG_RE = /^[a-z0-9-]+$/;

function stripFrontmatter(raw: string): string {
  return raw.replace(/^---[\s\S]*?---\n/, "").trim();
}

/**
 * Load an agent prompt from `agents/<name>.md`.
 * Paths use string-literal directory segments so Next.js output file tracing
 * only bundles `./agents`, not the entire repo (which would pull `.git`, `.env`,
 * `.next/cache`, etc. into serverless deploys).
 */
export function loadAgent(name: string): string {
  if (!SLUG_RE.test(name)) {
    throw new Error(`Invalid agent name: ${name}`);
  }
  const filePath = path.join(process.cwd(), "agents", `${name}.md`);
  const raw = fs.readFileSync(filePath, "utf-8");
  return stripFrontmatter(raw);
}

/** Load a skill prompt from `skills/<name>/SKILL.md`. */
export function loadSkill(name: string): string {
  if (!SLUG_RE.test(name)) {
    throw new Error(`Invalid skill name: ${name}`);
  }
  const filePath = path.join(process.cwd(), "skills", name, "SKILL.md");
  const raw = fs.readFileSync(filePath, "utf-8");
  return stripFrontmatter(raw);
}

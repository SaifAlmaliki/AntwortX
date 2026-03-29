import fs from "fs";
import path from "path";

function loadMarkdown(dir: string, filename: string): string {
  const filePath = path.join(process.cwd(), dir, filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  // Strip YAML frontmatter (content between first two "---" delimiters)
  return raw.replace(/^---[\s\S]*?---\n/, "").trim();
}

/** Load an agent prompt from agents/<name>.md */
export function loadAgent(name: string): string {
  return loadMarkdown("agents", `${name}.md`);
}

/** Load a skill prompt from skills/<name>/SKILL.md */
export function loadSkill(name: string): string {
  return loadMarkdown(path.join("skills", name), "SKILL.md");
}

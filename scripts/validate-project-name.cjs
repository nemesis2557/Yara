#!/usr/bin/env node
const { readFile } = require("fs/promises");
const path = require("path");

const pkgPath = path.join(process.cwd(), "package.json");

async function main() {
  const pkgRaw = await readFile(pkgPath, "utf8");
  const pkg = JSON.parse(pkgRaw);

  const projectName = process.env.PROJECT_NAME || process.env.VERCEL_PROJECT_NAME || pkg.name;
  const validPattern = /^[a-z0-9._-]{1,100}$/;
  const hasTripleDash = projectName.includes("---");

  if (!validPattern.test(projectName) || hasTripleDash) {
    console.error(
      "Invalid project name. It must be lowercase, up to 100 characters, using letters, digits, '.', '_' or '-', and must not contain '---'.",
    );
    process.exit(1);
  }

  console.log(`Project name '${projectName}' is valid.`);
}

main().catch((err) => {
  console.error("Failed to validate project name:", err);
  process.exit(1);
});

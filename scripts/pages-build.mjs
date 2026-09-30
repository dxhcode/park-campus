import { execSync } from "node:child_process";
import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = resolve(root, "dist");

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

execSync("pnpm --filter @park/admin-app build", {
  cwd: root,
  stdio: "inherit",
});
execSync("pnpm --filter @park/screen-app build", {
  cwd: root,
  stdio: "inherit",
});

cpSync(resolve(root, "apps/admin-app/dist"), resolve(out, "admin"), {
  recursive: true,
});
cpSync(resolve(root, "apps/screen-app/dist"), resolve(out, "screen"), {
  recursive: true,
});
cpSync(resolve(root, "pages/index.html"), resolve(out, "index.html"));
cpSync(resolve(root, "pages/404.html"), resolve(out, "404.html"));
writeFileSync(resolve(out, ".nojekyll"), "");

console.log("GitHub Pages bundle ready: dist/{index.html,admin,screen}");

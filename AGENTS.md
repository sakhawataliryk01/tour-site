<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Agent workflow — build verification (required)

After **every** code change (feature, fix, refactor, or config), before considering the task done:

1. Run `npm run build` from the project root.
2. Fix any TypeScript / ESLint / syntax / Prisma / Next.js build errors that appear.
3. Re-run `npm run build` until it succeeds.
4. Do **not** report the task complete while the build is failing.

If `prisma generate` fails with `EPERM` on Windows (query engine DLL locked), stop the running `next dev` / Node process that holds the lock, then re-run the build.

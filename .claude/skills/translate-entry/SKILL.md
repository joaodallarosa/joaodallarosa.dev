---
name: translate-entry
description: Translate a published English content entry into FR and/or PT-BR draft entries, following this repo's locale-aware content routing convention. Use when Joao asks to translate a project/post/note/log entry.
---

# Translate an entry

Implements PROJECT.md §5's translation workflow: `input: entry → output: draft entry/entries`, manual/agent-triggered, never auto-published.

## Usage

`/translate-entry <collection> <filename> [locale...]`

- `<collection>`: one of `project`, `post`, `note`, `log`.
- `<filename>`: the source file's base name without extension, e.g. `seed` for `apps/site/content/post/seed.md`.
- `[locale...]`: optional, one or both of `fr`, `pt-BR`. Defaults to both if omitted.

## Routing convention (do not deviate)

Translated files live at `apps/site/content/<locale>/<collection>/<filename>.md` — **locale segment first**, then collection, then the **exact same base filename** as the English source. This isn't cosmetic: `apps/site/content.config.ts` derives each entry's route from the file's directory structure (`fr/post/foo.md` → `/fr/post/foo`), and the site's existing language switcher (`switchLocalePath` in `apps/site/app/layouts/default.vue`) reuses the current route's params verbatim when swapping locales — so if the filename doesn't match the English source exactly, the switcher will link to a URL that doesn't exist.

## Steps

1. Read the source file: `apps/site/content/<collection>/<filename>.md`.
2. For each target locale, check whether `apps/site/content/<locale>/<collection>/<filename>.md` already exists.
   - If it exists: **do not overwrite it.** Report that it already exists and stop for that locale — it may hold a human's in-progress edits.
3. Otherwise, write the new file with frontmatter + body derived from the source:
   - **Pass through unchanged** (do not translate): `date`, `updatedAt`, `tags`, `cover.src`, `links[].href`, `gallery[].src`, the kind literal, `category`, `materials[].quantity`, the `steps` array's length/order (only its text is translated — see below), `slug`.
   - **Translate** into the target locale, preserving meaning and tone (not literal word-for-word): `title`, `description`, `cover.alt`, `role`, `gallery[].alt`, `gallery[].caption`, `materials[].name`, `links[].label`, each `steps[]` string, and the markdown body — keep markdown structure, headings, code fences, and links (href) exactly as in the source; only translate the surrounding prose/link text.
   - **Always set** `status: draft` regardless of the source entry's status, and `locale: <target>`.
4. After writing, report which files were created and which were skipped (already existed), and remind the user: these are drafts. Review each one, then manually flip `status` to `published` (in Studio or directly in the file) when ready — never auto-publish a translation.

See `docs/translation-workflow.md` for the full written convention this skill implements.

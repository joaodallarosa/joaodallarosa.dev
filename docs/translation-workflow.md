# Translation workflow

Implements PROJECT.md §5: translation is manual/agent-triggered, produces **draft** entries, and is never auto-published. There's no Claude API key configured for automated server-side calls — translation happens by running Claude Code locally against the repo.

## How to translate an entry

Run the `/translate-entry` skill (`.claude/skills/translate-entry/SKILL.md`), e.g.:

```
/translate-entry post seed fr
/translate-entry project my-project        # both fr and pt-BR
```

It reads the English source file, writes one draft file per target locale, and never overwrites an existing translation.

## File location convention

Translated files live at:

```
apps/site/content/<locale>/<collection>/<filename>.md
```

— locale segment **first**, then collection, then the **same base filename** as the English source (`apps/site/content/<collection>/<filename>.md`). English content stays where it already is, unprefixed.

This convention is load-bearing, not stylistic: `apps/site/content.config.ts` derives each entry's route from its file location (`content/fr/post/foo.md` → `/fr/post/foo`), matching `@nuxtjs/i18n`'s `prefix_except_default` URL scheme (`en` unprefixed, `/fr/…`, `/pt-BR/…`). The site's language switcher (`switchLocalePath`, `apps/site/app/layouts/default.vue`) swaps locale prefixes while reusing the current route's params — so if a translated file's name doesn't match its English source exactly, the switcher will link to a URL with no content behind it.

## Frontmatter contract

| Field | Rule |
|---|---|
| `title`, `description`, `cover.alt`, `role`, `gallery[].alt`/`caption`, `materials[].name`, `links[].label`, `steps[]` text, markdown body | Translate |
| `date`, `updatedAt`, `tags`, `cover.src`, `links[].href`, `gallery[].src`, kind literal, `category`, `materials[].quantity`, `slug` | Pass through unchanged |
| `status` | Always `draft` on creation, regardless of the source entry's status |
| `locale` | Set to the target locale (`fr` or `pt-BR`) |

## Review and publish

Translations are drafts. Review each one (in Studio at `/_studio`, or by editing the file directly), then flip `status: published` yourself when it's ready — nothing publishes a translation automatically.

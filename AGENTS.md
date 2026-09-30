# harbik.com — Project Reference

Website of Harbers Bik LLC, the scientific consulting company of Elisabeth Bik
and Gerard Harbers. Built with Zola and hosted on GitHub Pages at
[www.harbik.com](https://www.harbik.com).

The design follows [gerardharbers.com](https://www.gerardharbers.com)
(local project: `../gerardharbers`): Cabin font, the same color tokens with
light and dark mode, and a "NAME ◆ NAME" wordmark.

---

## Stack

| Layer | Technology |
|---|---|
| Static site generator | [Zola](https://www.getzola.org/) 0.21.0 |
| Templating | Tera (Zola built-in) |
| Styling | SCSS → CSS (Zola built-in compiler) |
| Hosting | GitHub Pages, deployed by GitHub Actions on push to `master` |

---

## Directory Layout

```text
content/              # Markdown source
  _index.md           # Homepage: intro text, link groups and book groups (front matter)
  herman-schaap.md    # Book page for "When the Planes Brought Food"
templates/            # Tera HTML templates
  base.html           # Shared head, logo header and footer
  index.html          # Homepage
  page.html           # Regular page
  section.html        # Section: title, optional text, tiles linking its pages
  book.html           # Book page: cover, editions with price, ISBN and buy button
  404.html            # Not-found page
  teramacros/hb.html  # Logo, mail icon, copyright
sass/style.scss       # All styles, compiled to /style.css
static/               # Copied verbatim to the site root
  CNAME               # Custom domain for GitHub Pages
  img/books/          # Book covers, 800 px wide JPEG
  data/, img/         # Published assets — keep their paths stable, other sites link to them
.github/workflows/deploy.yml  # Build and deploy workflow
public/               # Build output — git-ignored, never edit directly
```

---

## Editing the Homepage

The homepage links are defined in `content/_index.md` front matter as
`[[extra.groups]]`, each with a `title` and a list of `links`
(`title`, `subtitle`, `url`). The intro text is the Markdown body of that file.
The contact email is set in `config.toml` under `[extra]`.

## Harbik Press Books

The "Harbik Press" group in `content/_index.md` lists books as covers. A book on
this site is referenced by its page (`{ page = "herman-schaap.md" }`); an external
book gives its own `title`, `subtitle`, `cover`, `cover_alt` and `url`.

A book page uses `template = "book.html"`. Each binding is an `[[extra.editions]]`
entry with `format`, `price` and `isbn`. Its buy button is greyed out until the
edition gets a `buy_url`; remove `buy_note` ("To be released soon.") at the same time.

**Do not rename `content/herman-schaap.md`.** Its URL, `harbik.com/herman-schaap`,
is printed on the book jacket.

## Adding Pages

- **Single page:** add `content/<slug>.md` with `title` and `description` in the
  front matter. It is served at `/<slug>/` using `page.html`.
- **Section with several pages:** add `content/<section>/_index.md` (with `title`)
  and one `.md` file per page. The section page lists its pages as tiles.

---

## Build & Publish

```bash
zola serve    # Local preview at http://127.0.0.1:1111
zola build    # Outputs to public/
```

Push to `master`. The workflow in `.github/workflows/deploy.yml` builds the site
with Zola (version pinned in the workflow) and deploys `public/` to GitHub Pages.
It can also be run manually from the Actions tab.

The repository's Pages setting must be **Source: GitHub Actions**
(Settings → Pages → Build and deployment).

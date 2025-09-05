# code-mess

## Static site build

This repository includes a small static site generator that turns the markdown in `lessons/` and `poems/` into a static site suitable for GitHub Pages.

### Lessons

Lessons are individual cards that when clicked should reveal a broader lesson.

### Poems

Poems are presentations where each line of the poem is a slide with bold text emphasized. 

### Build locally

```bash
npm run build
```

The output is written to `dist/`:

- `dist/index.html`
- `dist/lessons/index.html` and per-lesson pages
- `dist/poems/index.html` and per-poem slideshow pages

### Preview locally

```bash
npm run preview
```

Open http://localhost:5173 to view the site.

### GitHub Pages

The site can be published from the `dist/` folder using GitHub Pages. See the workflow in `.github/workflows/gh-pages.yml`.

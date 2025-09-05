#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');
const glob = require('fast-glob');

const ROOT_DIR = path.resolve(__dirname, '..');
const CONTENT_DIR_LESSONS = path.join(ROOT_DIR, 'lessons');
const CONTENT_DIR_POEMS = path.join(ROOT_DIR, 'poems');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

function ensureDir(dirPath) {
	fs.mkdirSync(dirPath, { recursive: true });
}

function writeFile(filePath, contents) {
	ensureDir(path.dirname(filePath));
	fs.writeFileSync(filePath, contents, 'utf8');
}

function loadMarkdownFiles(dir) {
	const mdFiles = glob.sync(['**/*.md', '**/*.markdown', '**/*.mdx'], { cwd: dir, onlyFiles: true });
	return mdFiles.map((rel) => {
		const abs = path.join(dir, rel);
		const raw = fs.readFileSync(abs, 'utf8');
		let data = {};
		let content = raw;
		try {
			const parsed = matter(raw);
			data = parsed.data || {};
			content = parsed.content || '';
		} catch (e) {
			// If no front matter, try to infer title from first heading
			const match = raw.match(/^#\s+(.+)$/m);
			if (match) data.title = match[1].trim();
			content = raw;
		}
		return { rel, abs, data, content };
	});
}

function slugify(input) {
	return String(input || '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)+/g, '');
}

function baseLayout({ title, body, extraHead = '', extraScript = '' }) {
	return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title ? String(title).replace(/</g, '&lt;') : 'Site'}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
  <style>
    :root { --bg: #0b1020; --panel:#111833; --text:#e7ecff; --muted:#98a2b3; --brand:#7c9aff; }
    * { box-sizing: border-box; }
    body { margin:0; font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; background: var(--bg); color: var(--text); }
    a { color: inherit; text-decoration: none; }
    .container { max-width: 1200px; margin: 0 auto; padding: 24px; }
    header { display:flex; align-items:center; justify-content:space-between; gap:16px; padding: 16px 0; }
    header .brand { font-weight: 800; letter-spacing: 0.3px; font-size: 20px; color: var(--brand); }
    nav a { margin-right: 16px; opacity: 0.9; }
    .grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
    .card { background: var(--panel); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 16px; transition: transform .15s ease, box-shadow .15s ease; }
    .card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.25); }
    .badge { display:inline-block; padding: 4px 10px; border-radius:999px; font-size:12px; opacity:0.95; background:#1f2a4d; color:#c9d6ff; border:1px solid rgba(255,255,255,0.06); }
    .title { font-weight: 700; margin: 6px 0 8px; font-size: 18px; }
    .muted { color: var(--muted); font-size: 13px; }
    .pill { display:inline-flex; align-items:center; gap:8px; font-size:12px; padding:4px 10px; border-radius:999px; border:1px solid rgba(255,255,255,0.06); background:#0f1733; color:#c6d0ff; }
    .toolbar { display:flex; gap:12px; align-items:center; margin: 12px 0 18px; }
    input[type="search"], select { background:#0e1530; color:#e7ecff; border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:10px 12px; width:100%; }
    .content { line-height: 1.75; }
    .content h1, .content h2, .content h3 { margin-top: 1.2em; }
    .content p { margin: 0.75em 0; }
    .btn { display:inline-flex; align-items:center; gap:8px; background:#1b254b; color:#dbe5ff; border:1px solid rgba(255,255,255,0.08); padding:10px 14px; border-radius:10px; }
    .center { text-align:center; }
    .back { margin: 8px 0 18px; display:inline-block; }
    .poem-line { font-size: 34px; font-weight: 800; letter-spacing: .3px; }
    .poem-em { color: #fff; text-shadow: 0 0 0 rgba(255,255,255,0.2); }
    .slide { min-height: 50vh; display:flex; align-items:center; justify-content:center; padding: 40px 16px; text-align:center; }
    .kbd { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; font-size: 12px; padding: 2px 6px; border:1px solid rgba(255,255,255,0.2); border-bottom-width:2px; border-radius:6px; background:#0b122b; }
  </style>
  ${extraHead}
</head>
<body>
  <div class="container">
    <header>
      <a class="brand" href="/index.html">Knowledge Garden</a>
      <nav>
        <a href="/lessons/index.html">Lessons</a>
        <a href="/poems/index.html">Poems</a>
      </nav>
    </header>
    ${body}
  </div>
  ${extraScript}
</body>
</html>`;
}

function renderCard({ href, title, phrase, category, color }) {
	return `<a class="card" href="${href}">
  <div class="badge" style="background:${color || '#1f2a4d'}">${category || 'General'}</div>
  <div class="title">${title || 'Untitled'}</div>
  <div class="muted">${phrase || ''}</div>
</a>`;
}

function indexPage({ title, items, filters = [] }) {
	const filterHtml = `<div class="toolbar">
  <input id="search" type="search" placeholder="Search..." />
  <select id="category">
    <option value="">All categories</option>
    ${filters.map((f) => `<option value="${f}">${f}</option>`).join('')}
  </select>
</div>`;
	const cards = `<div id="cards" class="grid">${items.map(renderCard).join('\n')}</div>`;
	const script = `<script>\n(function(){\n  const search = document.getElementById('search');\n  const category = document.getElementById('category');\n  const cards = Array.from(document.querySelectorAll('#cards .card'))\n    .map(card => ({\n      el: card,\n      title: card.querySelector('.title').textContent.toLowerCase(),\n      phrase: card.querySelector('.muted').textContent.toLowerCase(),\n      category: card.querySelector('.badge').textContent.toLowerCase()\n    }));\n  function apply(){\n    const q = (search.value||'').toLowerCase().trim();\n    const c = (category.value||'').toLowerCase().trim();\n    cards.forEach(({el,title,phrase,category})=>{\n      const matchQ = !q || title.includes(q) || phrase.includes(q);\n      const matchC = !c || category === c;\n      el.style.display = (matchQ && matchC) ? '' : 'none';\n    });\n  }\n  search.addEventListener('input', apply);\n  category.addEventListener('change', apply);\n})();\n</script>`;
	return baseLayout({ title, body: `${filterHtml}${cards}`, extraScript: script });
}

function lessonPage({ title, html, category }) {
	const body = `<a class="back" href="/lessons/index.html">← Back to lessons</a>
<div class="pill">Category: ${category || 'General'}</div>
<div class="content">${html}</div>`;
	return baseLayout({ title, body });
}

function poemsIndexPage({ items }) {
	const cards = `<div id="cards" class="grid">${items.map(renderCard).join('\n')}</div>`;
	return baseLayout({ title: 'Poems', body: cards });
}

function poemSlidePage({ title, lines }) {
	const body = `<a class="back" href="/poems/index.html">← Back to poems</a>
<div class="center muted">Press <span class="kbd">Space</span> or click to advance</div>
<div id="slide" class="slide"></div>`;
	const script = `<script>\n(function(){\n  const lines = ${JSON.stringify(lines)};\n  let i = 0;\n  const el = document.getElementById('slide');\n  function render(){\n    if(i >= lines.length){ el.innerHTML = '<div class=\"muted\">End</div>'; return; }\n    const raw = lines[i];\n    const html = raw.replace(/\*\*([^*]+)\*\*/g, '<span class=\"poem-em\"><b>$1<\/b><\/span>');\n    el.innerHTML = '<div class=\"poem-line\">' + html + '<\/div>';\n  }\n  function advance(){ i = Math.min(i+1, lines.length); render(); }\n  function back(){ i = Math.max(i-1, 0); render(); }\n  document.addEventListener('click', advance);\n  document.addEventListener('keydown', (e)=>{\n    if(e.code==='Space' || e.key==='ArrowRight'){ e.preventDefault(); advance(); }\n    if(e.key==='ArrowLeft'){ e.preventDefault(); back(); }\n  });\n  render();\n})();\n</script>`;
	return baseLayout({ title, body, extraScript: script });
}

function build() {
	// Prepare output dirs
	fs.rmSync(DIST_DIR, { recursive: true, force: true });
	ensureDir(path.join(DIST_DIR));
	ensureDir(path.join(DIST_DIR, 'lessons'));
	ensureDir(path.join(DIST_DIR, 'poems'));

	// Lessons
	const lessons = loadMarkdownFiles(CONTENT_DIR_LESSONS).map((f) => {
		const id = slugify(f.data.slug || f.data.title || f.rel.replace(/\.(md|mdx|markdown)$/i, ''));
		const title = f.data.title || id;
		const phrase = f.data.phrase || '';
		const category = f.data.category || 'General';
		const color = f.data.color || '#1f2a4d';
		const html = marked.parse(f.content);
		return { id, title, phrase, category, color, html };
	});
	const categories = Array.from(new Set(lessons.map((l) => l.category))).sort();
	const lessonCards = lessons.map((l) => ({
		href: `/lessons/${l.id}.html`,
		title: l.title,
		phrase: l.phrase,
		category: l.category,
		color: undefined
	}));
	writeFile(path.join(DIST_DIR, 'lessons', 'index.html'), indexPage({ title: 'Lessons', items: lessonCards, filters: categories }));
	lessons.forEach((l) => {
		writeFile(path.join(DIST_DIR, 'lessons', `${l.id}.html`), lessonPage({ title: l.title, html: l.html, category: l.category }));
	});

	// Poems
	const poems = loadMarkdownFiles(CONTENT_DIR_POEMS).map((f) => {
		const id = slugify(f.data.slug || f.data.title || f.rel.replace(/\.(md|mdx|markdown)$/i, ''));
		let title = f.data.title;
		if (!title) {
			const m = f.content.match(/^#\s+(.+)$/m);
			title = m ? m[1].trim() : id;
		}
		const lines = f.content
			.replace(/^#\s+.*$/m, '')
			.split(/\r?\n/)
			.map((s) => s.trim())
			.filter((s) => s.length > 0);
		return { id, title, lines };
	});
	const poemCards = poems.map((p) => ({
		href: `/poems/${p.id}.html`,
		title: p.title,
		phrase: `${p.lines.length} lines`,
		category: 'Poem',
		color: undefined
	}));
	writeFile(path.join(DIST_DIR, 'poems', 'index.html'), poemsIndexPage({ items: poemCards }));
	poems.forEach((p) => {
		writeFile(path.join(DIST_DIR, 'poems', `${p.id}.html`), poemSlidePage({ title: p.title, lines: p.lines }));
	});

	// Root index
	const home = baseLayout({
		title: 'Knowledge Garden',
		body: `<div class="grid">
  <a class="card" href="/lessons/index.html">
    <div class="badge">Browse</div>
    <div class="title">Lessons</div>
    <div class="muted">Learn with concise principles</div>
  </a>
  <a class="card" href="/poems/index.html">
    <div class="badge">Explore</div>
    <div class="title">Poems</div>
    <div class="muted">Dramatic line-by-line reading</div>
  </a>
</div>`
	});
	writeFile(path.join(DIST_DIR, 'index.html'), home);

	// Local preview server config (for `npx serve`): ensure /lessons and /poems resolve
	const serveConfig = {
		rewrites: [
			{ source: '/lessons', destination: '/lessons/index.html' },
			{ source: '/poems', destination: '/poems/index.html' }
		]
	};
	writeFile(path.join(DIST_DIR, 'serve.json'), JSON.stringify(serveConfig, null, 2));

	console.log('Built site to', DIST_DIR);
}

if (require.main === module) {
	build();
}

module.exports = { build };


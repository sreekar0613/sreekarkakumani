# sreekarkakumani

Personal portfolio of **Sreekar Kakumani** — Accounting & Finance @ Penn State Smeal, Enterprise Finance Intern @ Highmark Health, hackathon builder.

Single-page scrollable portfolio with a hybrid-professional aesthetic: NES.css pixel-art styling on a deep-navy/cream palette, with calibrated whimsical interactions (typewriter hero, floating pixel particles, scroll reveals, one celebratory PRESS START flash). Built to read credibly for both finance recruiters and technical audiences.

**Live site:** https://sreekar0613.github.io/sreekarkakumani

## Tech stack

Plain HTML + CSS + vanilla JS. No build pipeline, no npm — all libraries load from CDN.

| Library | Version | Purpose |
|---|---|---|
| [NES.css](https://nostalgic-css.github.io/NES.css/) | 2.3.0 | Pixel-art UI components |
| Press Start 2P + Inter | Google Fonts | Pixel headings / body text |
| [Typed.js](https://github.com/mattboldt/typed.js) | 2.1.0 | Hero typewriter effect |
| [AOS](https://michalsnik.github.io/aos/) | 2.3.4 | Scroll-triggered reveals |
| [tsParticles](https://particles.js.org/) | 2.12.0 | Pixel-dot hero background |
| [Anime.js](https://animejs.com/) | 3.2.2 | Skill-bar + button micro-animations |

All animations degrade gracefully: the page is fully readable with JavaScript disabled, any CDN blocked, or `prefers-reduced-motion` set.

## File structure

```
sreekarkakumani/
├── index.html      # all content & markup
├── css/
│   └── style.css   # design tokens, NES.css theming, layout, breakpoints
├── js/
│   └── script.js   # AOS / Typed / tsParticles / Anime init + nav logic
└── README.md
```

## Local preview

No tooling needed — open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
# → http://localhost:8000
```

## Deploy to GitHub Pages

1. Push this folder to `github.com/sreekar0613/sreekarkakumani` (branch `main`):

   ```bash
   git init
   git add .
   git commit -m "initial portfolio build"
   gh repo create sreekar0613/sreekarkakumani --public --source=. --push
   ```

   Without the `gh` CLI: create an empty public repo named `sreekarkakumani` at github.com/new, then:

   ```bash
   git remote add origin https://github.com/sreekar0613/sreekarkakumani.git
   git push -u origin main
   ```

2. Enable Pages (one-time, in the browser):
   - Go to **github.com/sreekar0613/sreekarkakumani → Settings → Pages**
   - Source: **Deploy from a branch**
   - Branch: **main**, folder: **/ (root)** → Save

3. Site is live at **https://sreekar0613.github.io/sreekarkakumani** in ~2 minutes.

No custom domain, Cloudflare, or DNS config needed.

## TODO

- [ ] Replace the hero `RESUME` button's placeholder `href="#"` with a link to a resume PDF (drop the PDF in the repo root and point the button at it).

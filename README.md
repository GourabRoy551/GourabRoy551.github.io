# Gourab Roy Portfolio

Personal academic homepage of Gourab Roy, Erasmus Mundus IPCVAI master's student (AI for Image Processing and Computer Vision) at Université de Bordeaux. It presents research, publications, projects, education, skills, experience, a blog, and contact details.

Live site: https://gourabroy551.github.io/

The site is fully static: plain HTML, CSS, and JavaScript, with no build step and no dependencies to install.

## Pages

The main site is a single page, `index.html`, with these sections in order:

Hero, About (with "Right now" and News), Education, Research, Publications, Experience, Projects, Skills, Milestones, Writing, Contact.

Projects open as case-study modals (deep links such as `index.html#project-siteguard`). Each publication has Cite (IEEE or BibTeX) and BibTeX download buttons. The CV opens in a preview modal on wide screens.

| File | Contents |
| --- | --- |
| `index.html` | The whole portfolio |
| `Blog/index.html` | Blog index: posts, short notes, topics |
| `Blog/*.html` | Blog posts with photos and slides |
| `404.html` | Shown by GitHub Pages for unknown URLs |

The old sub-pages (`research.html`, `education.html`, `publications.html`, `projects.html`, `skills.html`, `background.html`, `contact.html`, `about.html`, `experience.html`, and the three `project-*.html` case studies) are now small redirect pages to the matching section or case study, so older links (including the one in the CV) keep working.

## Project structure

```text
Portfolio/
|-- index.html                       single-page portfolio
|-- *.html (other)                   redirects to index.html sections
|-- 404.html
|-- Blog/                            blog index, posts, photos, slides
|-- CV/Roy_Gourab_CV.pdf             current CV, linked across the site
|-- css/                             ordered stylesheets 01-08
|-- js/                              small vanilla JS modules
|-- Photo.webp, og-image.png        portrait, 1200x630 share image
|-- favicon.svg, apple-touch-icon.png  logo (tab icon and home-screen icon)
|-- sitemap.xml, robots.txt, .nojekyll
`-- README.md
```

## Running locally

```powershell
python -m http.server 8000
```

Then open http://localhost:8000. A local server is better than opening files directly, because the language selector loads Google Translate.

## Editing guide

### Publications

All papers live in `js/publications-data.js`. Each entry has:

- `title`, `authors`, `venue`, `year`, `type` (`Journal` or `Conference`), `domain`, `link`
- `selected: true` to mark it with a star
- `citations` (optional) to show a citation count

`G. Roy` is shown in bold automatically. Domain filters are generated from the `domain` field. Rendering, citations, and BibTeX export are in `js/publications.js`.

### Projects

Projects live in `js/projects-data.js` (card text, metrics, case-study sections, links, and the schematic SVG illustrations in `projectArt`). `featured: true` makes the wide first card, `wide: true` the full-width closing card. Rendering and the modal are in `js/projects.js`.

### Navigation and footer

On `index.html`, the nav links point to section anchors and the active link follows the scroll position. Blog pages and `404.html` share the same header and footer, with links back to `index.html#...` (`../` paths under `Blog/`).

### CV

The current CV is `CV/Roy_Gourab_CV.pdf`. If it is renamed, search the project for `Roy_Gourab_CV.pdf` and update every link.

### Contact details

Email, phone, and profile links appear in the Contact section and hero of `index.html`, the footer, and the JSON-LD block in `index.html`.

## Design notes

- "Research notebook" style: warm paper light theme by default, deep ink-green dark theme. Colours are CSS variables in `css/01-tokens-base.css`.
- Fonts: Fraunces (headings, italic accent words), Instrument Sans (body), IBM Plex Mono (labels and metadata).
- Sections are numbered with a section-sign kicker, and figures carry "Fig." captions.
- Logo: a "G" drawn as a small neural network whose centre node is the salient (attribution) node. Source is `favicon.svg`; the same mark is inlined as `.brand-mark` in the header. `apple-touch-icon.png` is a 180px render of it.
- The background canvas (`js/neural-canvas.js`) runs a small feed-forward network on a loop: a forward pass from an input pixel patch to three class outputs, then LRP relevance flowing back from the predicted class, ending with the input patch shown as a saliency map. Hovering a node shows its activation and relevance. Colours come from the `--heat-*` and accent tokens. It pauses when the tab is hidden and shows the finished explanation as a still frame when the visitor prefers reduced motion.

Stylesheets load in order:

1. `01-tokens-base.css` - design tokens, reset, base styles, background canvas, blog variable aliases
2. `02-nav-layout.css` - header, navigation, theme and language controls, buttons, section headings, cards, chips, badges
3. `03-hero-about.css` - hero, portrait, stats, About
4. `04-education-research-experience.css` - timelines, semesters, research feature, focus areas
5. `05-publications-projects.css` - publication list and filters, project cards, illustration colours
6. `06-skills-contact-footer.css` - Skills, Milestones, Writing, Contact, footer
7. `07-modals-motion-responsive.css` - modals, toast, scroll reveals, breakpoints
8. `08-blog.css` - blog index, page headers, blog post type adjustments

Blog and 404 pages load 01, 02, 06, 07, and 08.

JavaScript files:

- `state.js` - shared state (publication filter, reduced motion)
- `theme.js` - light/dark theme switch, saved in `localStorage` as `portfolio-theme`
- `publications-data.js`, `publications.js` - publication data, list, citation modal, BibTeX
- `projects-data.js`, `projects.js` - project data, cards, case-study modal
- `ui.js` - reveals, header state, scroll spy, mobile menu, modals, clipboard and toast, local time, counters
- `neural-canvas.js` - background animation
- `analytics.js` - Plausible analytics (live site only)
- `i18n.js` - English, Bangla, Spanish, and French via Google Translate, saved as `portfolio-language`
- `main.js`, `blog-main.js` - page initialisation

## Deployment (GitHub Pages)

1. Push the repository to GitHub.
2. In the repository settings, open **Pages** and set the source to the `main` branch, root folder.
3. The site is published at `https://gourabroy551.github.io/` (for a repository named `GourabRoy551.github.io`).

`.nojekyll` tells GitHub Pages to serve the files as they are. `404.html` is used for unknown URLs. `og-image.png`, the Open Graph tags, and the JSON-LD block point to the live URL, so update them if the domain changes.

## Pre-publish checklist

- All section links, CV links, and case-study modals work
- Publication links and DOIs open correctly
- Light and dark themes both look right
- Mobile layout at about 390px width
- Language selector works on the live site
- Browser console shows no errors

## Contact

- Email: gourabroysec553@gmail.com
- Google Scholar: https://scholar.google.com/citations?hl=en&user=_9tL56YAAAAJ
- LinkedIn: https://www.linkedin.com/in/gourab-roy-5b52921a3/
- GitHub: https://github.com/GourabRoy551

## License

This is a personal website. The source code, written content, portrait, CV, and research summaries belong to Gourab Roy. Please do not reuse or present this personal content as your own.

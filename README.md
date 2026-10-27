# Gourab Roy Portfolio

Personal academic homepage of Gourab Roy, Erasmus Mundus IPCVAI master's student (AI for Image Processing and Computer Vision) at Université de Bordeaux. It presents research, publications, projects, education, skills, experience, a blog, and contact details.

Live site: https://gourabroy551.github.io/

The site is fully static: plain HTML, CSS, and JavaScript, with no build step and no dependencies to install.

## Pages

| Page | File | Contents |
| --- | --- | --- |
| Home | `index.html` | Bio, profile links, news, selected publications, current research, featured projects, latest writing |
| Research | `research.html` | Current research project (attention vs Partition SHAP for BERT and CLIP), focus areas, way of working |
| Publications | `publications.html` | All papers with author lists, grouped into journal articles and conference papers, with list/card views and domain filters |
| Projects | `projects.html` | Six projects with results, pipelines, and repository links |
| Case studies | `project-bert-clip.html`, `project-siteguard.html`, `project-banglacaption.html` | Overview, problem, approach, and results for the three main projects |
| Education | `education.html` | IPCVAI path across Budapest, Madrid, and Bordeaux, plus the B.Sc. |
| Skills | `skills.html` | Core competencies, tech stack by layer, achievements, keyword index |
| About | `background.html` | Profile, academic journey, research interests, and experience |
| Contact | `contact.html` | Email, phone, location, CV, and profile links |
| Blog | `Blog/` | Blog index and posts |
| Not found | `404.html` | Shown by GitHub Pages for unknown URLs |

`about.html` and `experience.html` are small redirect pages to the matching sections of `background.html`, so older links keep working.

## Project structure

```text
Portfolio/
|-- index.html, research.html, publications.html, projects.html
|-- project-bert-clip.html, project-siteguard.html, project-banglacaption.html
|-- education.html, skills.html, background.html, contact.html
|-- about.html, experience.html      redirects to background.html
|-- 404.html
|-- Blog/
|   |-- index.html
|   |-- ipcv-days-france-2026.html       + IPCV Days France/ (photos, video, programme)
|   `-- seminar-sec-erasmus-mundus-2026.html + Seminar_SEC/ (photos, slides)
|-- CV/
|   `-- Roy_Gourab_CV.pdf            current CV, linked across the site
|-- css/                             ordered stylesheets 01-08
|-- js/                              small vanilla JS modules
|-- Photo.webp                       portrait used on the pages
|-- Photo.png                        original portrait (source, not loaded by the site)
|-- og-image.png                     1200x630 social share preview
|-- favicon.svg                      GR viewfinder logo
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
- `selected: true` to show it under "Selected publications" on the home page
- `summary`, `tags`, `logo`, `visualClass`, `visualSteps` for the card view

`G. Roy` is shown in bold automatically. Domain filters are generated from the `domain` field. Rendering is in `js/publications.js`.

### Navigation and footer

Every page has the same header navigation and footer. If a page is added or renamed, update the `<nav class="nav-links">` block and the footer "Explore" column on all pages, plus `sitemap.xml`. Pages under `Blog/` use `../` paths.

Case-study pages and blog posts set `data-nav-section` on `<body>` so their parent menu item (Projects or Blog) is highlighted.

### CV

The current CV is `CV/Roy_Gourab_CV.pdf`. If it is renamed, search the project for `Roy_Gourab_CV.pdf` and update every link.

### Contact details

Email, phone, and profile links appear in `contact.html`, the home page link row, the footer of every page, and the JSON-LD block in `index.html`.

## Design notes

- Light theme by default with an optional dark theme. Colours are CSS variables in `css/01-base.css`, refined by the academic layer at the end of `css/08-polish-overrides.css`.
- Headings use Source Serif 4, body text uses Inter.
- The background canvas (`js/neural-canvas.js`) draws a soft saliency-map animation. It pauses when the tab is hidden and shows a still frame when the visitor prefers reduced motion.

Stylesheets load in order:

1. `01-base.css` - design tokens, base styles, background canvas
2. `02-header-layout.css` - header, navigation, buttons, cards, shared components
3. `03-hero.css` - home page and About layouts
4. `04-research-education.css` - Research and Education pages
5. `05-publications-projects.css` - Publications and Projects pages
6. `06-experience-skills-writing-contact.css` - Experience, Skills, Blog, Contact
7. `07-animations-responsive.css` - scroll reveals, page transitions, breakpoints
8. `08-polish-overrides.css` - footer, Skills page layout, case studies, academic theme layer

JavaScript files:

- `state.js` - shared state (publication filter and view, reduced motion)
- `theme.js` - light/dark theme switch, saved in `localStorage` as `portfolio-theme`
- `publications-data.js`, `publications.js` - publication data and rendering
- `ui.js` - scroll reveals, counters, active navigation, sticky section menus, page transitions, copy email, mobile menu
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

- All navigation links, CV links, and case-study links work
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

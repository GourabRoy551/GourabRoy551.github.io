# Gourab Roy Portfolio

A polished, static personal portfolio for **Gourab Roy**, an Erasmus Mundus IPCVAI master's student and AI engineer focused on trustworthy computer vision, biomedical imaging, explainable AI, multimodal learning, inspection systems, and applied deep learning.

The site is built as a multi-page HTML/CSS/JavaScript portfolio with no build step. It can be opened directly in a browser or served from any static hosting platform such as GitHub Pages, Netlify, Vercel, Cloudflare Pages, or a simple web server.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Pages](#pages)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Running Locally](#running-locally)
- [Content Editing Guide](#content-editing-guide)
- [Styling Architecture](#styling-architecture)
- [JavaScript Architecture](#javascript-architecture)
- [Assets](#assets)
- [SEO and Metadata](#seo-and-metadata)
- [Accessibility](#accessibility)
- [Performance Notes](#performance-notes)
- [Deployment](#deployment)
- [License](#license)
- [Maintenance Checklist](#maintenance-checklist)
- [Troubleshooting](#troubleshooting)
- [Contact Links](#contact-links)

## Overview

This portfolio presents Gourab Roy's profile for academic reviewers, research collaborators, AI/ML recruiters, and applied AI teams. The content emphasizes:

- Erasmus Mundus IPCVAI graduate study across image processing, computer vision, deep learning, multimodal AI, and medical imaging.
- Research interests in trustworthy vision AI, explainable AI, CLIP/ViT interpretability, biomedical imaging, document AI, OCR, NLP, and inspection workflows.
- Publications across medical AI, low-resource OCR, document AI, structural safety, multilingual summarization, agriculture, and aviation inspection.
- Projects that demonstrate Python research engineering, MATLAB 3D reconstruction, data visualization, Java/MySQL software work, and frontend practice.
- Teaching, mentoring, and research assistant experience.
- Contact paths for collaboration, supervision conversations, internships, and Europe-based AI roles.

The site is intentionally static and lightweight: each page is a standalone `.html` file that loads shared CSS and JavaScript modules.

## Key Features

- **Multi-page portfolio navigation** with dedicated pages for About, Research, Education, Publications, Experience, Projects, Skills, Blog, and Contact.
- **Dark and bright themes** with persistence through `localStorage`.
- **Animated neural background canvas** with reduced-motion support.
- **Scroll progress indicator** across pages.
- **Reveal-on-scroll animations** using `IntersectionObserver`.
- **Animated counters** for hero metrics.
- **Publication filtering** by research domain.
- **Page transition overlay** for internal page navigation.
- **Responsive layouts** for desktop, tablet, and mobile screens.
- **Accessible skip links**, focus states, semantic section structure, and reduced-motion handling.
- **Copy-email button** on the contact page with Clipboard API fallback.
- **External research and profile links** for Google Scholar, LinkedIn, GitHub, IEEE, Elsevier, Facebook, and Instagram.

## Pages

### `index.html`

The homepage and primary entry point. It contains:

- Hero introduction for Gourab Roy.
- Current profile summary: UAM Madrid, IPCVAI master's program, medical computer vision, XAI, and multimodal vision.
- Profile links to Google Scholar, LinkedIn, GitHub, IEEE papers, and Elsevier paper.
- Primary actions for About, Research Fit, and CV download.
- Portrait panel using `Photo.png`.
- Research metrics for publications, Scholar citations, and coding practice.

### `about.html`

A narrative profile page covering:

- Current IPCVAI status at UAM Madrid.
- Background as an Adjunct Lecturer and Research Assistant.
- Mentoring and thesis supervision experience.
- Reviewer experience for Informatics in Medicine Unlocked.
- Research focus areas: Vision Transformers, CLIP-style interpretability, and healthcare AI.
- Availability for research collaboration and summer internship opportunities in Europe.

### `research.html`

Research positioning page focused on:

- Trustworthy vision AI for medical, document, and inspection workflows.
- Current TRDP work on CLIP interpretability using a Cross-Modal Attention Bridge.
- Biomedical AI with CT/MRI, segmentation, classification, and few-shot learning.
- Explainable and multimodal vision using ViT, CLIP, and attention mechanisms.
- Applied inspection tasks using YOLO and transfer learning.
- Low-resource document intelligence, Bangla OCR/font detection, and script recognition.

### `education.html`

Education timeline page covering:

- Erasmus Mundus IPCVAI master's mobility path.
- PPKE Budapest first semester.
- UAM Madrid current second semester.
- Planned University of Bordeaux semester.
- Final thesis/research semester.
- B.Sc. foundation in Computer Science and Engineering.
- Coursework in deep learning, visual signal processing, moving-camera vision, biomedical signal processing, sensor fusion, and research development.

### `publications.html`

Publication showcase page with:

- Featured biomedical AI research thread.
- Summary metrics for published papers and IEEE conference papers.
- Dynamic publication filters rendered from `js/publications-data.js`.
- Dynamic publication cards rendered by `js/publications.js`.
- Thesis thread for CerebralNet and CT/MRI abnormality detection.

Publication data currently includes eight research works:

- CovidExpert: Triplet Siamese Neural Network for COVID-19 CT detection.
- Syloti Nagri OCR using deep learning.
- Bang-laFont45 Bangla font detection and classification.
- Concrete tensile strength prediction and classification.
- CrackClassification4 for structural surface cracks.
- Multilingual summarization corpus creation and filtering.
- DateFNet for date fruit classification.
- Aircraft crack and dent detection using YOLOv11 and YOLOv12.

### `experience.html`

Experience page covering:

- Research Assistant work at Sylhet Engineering College.
- Adjunct Lecturer role.
- Undergraduate teaching and consultation.
- Thesis mentoring and research support.
- Course areas including data science, distributed computing, computer architecture, peripheral interfacing, and microprocessor/microcontroller topics.

### `projects.html`

Project portfolio page using a bento-style grid. Current project cards include:

- Cardiac Autonomic Assessment via PPG-Derived HRV.
- Statistically Filtered Cross-Modal Attention for CLIP Interpretability.
- Calibrated Multi-View 3D Reconstruction.
- Exploratory Analysis and Visualization Portfolio.
- Python utilities and programming exercises.
- Billing System Application.
- Pioneer Bank Website.

### `skills.html`

Skills and achievements page covering:

- Programming languages: C, C++, Python, Java, JavaScript.
- ML frameworks: PyTorch, TensorFlow, Scikit-learn.
- Scientific Python: NumPy, Pandas, Matplotlib, Jupyter.
- Developer workflow: Git, MySQL, SQLite, Linux, LaTeX.
- Vision AI concepts: CNNs, ViT, YOLO, CLIP, segmentation, evaluation metrics.
- Proof points including 350+ coding problems solved, HackerRank badges, research courses, and reviewer experience.

### `blog.html`

Static blog-style page with:

- Research notes.
- Learning logs.
- Biomedical AI reflections.
- Interpretability questions.
- Dataset notes.
- Erasmus Mundus study reflections.

The blog content is currently embedded directly in `blog.html`; there is no CMS or Markdown-to-HTML build system.

### `contact.html`

Contact page with:

- Email, phone, and location information.
- Mail, phone, CV, Google Scholar, LinkedIn, GitHub, Facebook, and Instagram actions.
- Copy-email button using `data-copy-email`.
- Positioning for research collaboration, supervision conversations, internships, and AI roles.

## Tech Stack

This project uses standard frontend technologies:

- **HTML5** for page structure.
- **CSS3** with custom properties, responsive grids, media queries, and theme variables.
- **Vanilla JavaScript** for interactivity.
- **Canvas 2D API** for the animated neural background.
- **Google Fonts** for the Inter typeface.
- **External icon CDNs**:
  - Simple Icons through `cdn.simpleicons.org`.
  - Devicon through `cdn.jsdelivr.net`.
  - University and publication platform logos from their public sources.

There are no local package dependencies, no bundler, and no required Node.js workflow.

## Project Structure

```text
Portfolio/
├── index.html
├── about.html
├── research.html
├── education.html
├── publications.html
├── experience.html
├── projects.html
├── skills.html
├── blog.html
├── contact.html
├── README.md
├── favicon.svg
├── Photo.png
├── Gourab_Roy_CV (2).pdf
├── css/
│   ├── 01-base.css
│   ├── 02-header-layout.css
│   ├── 03-hero.css
│   ├── 04-research-education.css
│   ├── 05-publications-projects.css
│   ├── 06-experience-skills-writing-contact.css
│   ├── 07-animations-responsive.css
│   └── 08-polish-overrides.css
└── js/
    ├── state.js
    ├── theme.js
    ├── publications-data.js
    ├── publications.js
    ├── ui.js
    ├── neural-canvas.js
    ├── main.js
    └── blog-main.js
```

Additional local planning/reference files may exist in the working folder:

- `papers.md`
- `portfolio-brief-and-plan.md`
- `script.js`
- `styles.css`
- `.claude/`

These are listed in `.gitignore` and are not part of the active shipped site. The current pages load the modular files from `/css` and `/js` directly.

## Running Locally

Because this is a static website, the simplest option is to open `index.html` directly in a browser.

Recommended local server option:

```powershell
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

You can also use any static server:

```powershell
npx serve .
```

or:

```powershell
npx http-server .
```

The site does not require a build command.

## Content Editing Guide

### Update Name, Role, or Hero Text

Edit `index.html`.

Important sections:

- `<title>` and meta tags in the `<head>`.
- `.brand-text` and `.brand-role` in the header.
- `.hero-copy` for the homepage introduction.
- `.profile-strip` for current profile details.
- `.hero-actions` for main call-to-action links.
- `.hero-metrics` for homepage counters.

### Update Navigation

Each HTML file contains its own header navigation. If you add, rename, or remove a page, update the `<nav class="nav-links">` block in every page.

The active page state is handled in two ways:

- Many pages include `class="is-active"` on the matching link.
- `setupActiveNavigation()` in `js/ui.js` also checks the current pathname and applies the active state.

### Update the CV

The current CV file is:

```text
Gourab_Roy_CV (2).pdf
```

If the file name changes, update all CV links in:

- `index.html`
- `contact.html`
- Any other page where a CV button is added.

For cleaner URLs, consider renaming the file to:

```text
Gourab_Roy_CV.pdf
```

Then update the links accordingly.

### Update Publications

Publication data lives in:

```text
js/publications-data.js
```

Each publication object supports:

- `year`
- `type`
- `domain`
- `title`
- `venue`
- `citations`
- `summary`
- `tags`
- `logo`
- `visualClass`
- `visualSteps`
- `link`

The filter buttons are generated automatically from the unique `domain` values. To add a new filter category, set a new `domain` value in a publication object.

The rendering logic lives in:

```text
js/publications.js
```

### Update Projects

Project cards are written directly in:

```text
projects.html
```

Each card usually includes:

- Project number.
- Context or institution/date label.
- Title.
- Description.
- Optional repository link.
- Tags.

Use existing `bento-card` classes for consistent layout and color treatment.

### Update Blog Posts

Blog posts are static HTML cards inside:

```text
blog.html
```

To add a new post, duplicate an existing `.writing-card`, update the metadata, title, summary, date, and tags.

There is currently no separate post page system. If longer posts are needed later, create a `/blog/` folder or individual `post-name.html` pages and add links from `blog.html`.

### Update Contact Information

Edit:

```text
contact.html
```

Update:

- `mailto:` links.
- Displayed email.
- `data-email` on the copy button.
- Phone number text.
- `tel:` link.
- Social profile URLs.
- Location text.

### Update Photo

The main portrait asset is:

```text
Photo.png
```

It is used by `index.html` and `about.html`. If replacing it, keep the same file name or update all references.

Recommended future optimization:

- Create compressed WebP versions for faster loading.
- Add a separate Open Graph preview image at `1200x630`.
- Keep meaningful `alt` text for profile images.

## Styling Architecture

CSS is split into ordered files. Every page loads them in cascade order:

1. `css/01-base.css`
   - Theme variables.
   - Global resets.
   - Body background.
   - Skip link.
   - Neural canvas layer.
   - Scroll progress bar.
   - Shared base styles.

2. `css/02-header-layout.css`
   - Header.
   - Brand lockup.
   - Navigation.
   - Theme toggle.
   - Shared section width and layout primitives.

3. `css/03-hero.css`
   - Homepage hero.
   - Portrait panel.
   - Hero actions.
   - Hero metrics.
   - Shared card treatments.

4. `css/04-research-education.css`
   - Research page sections.
   - Education timeline and university logos.
   - Related academic layouts.

5. `css/05-publications-projects.css`
   - Publication cards.
   - Publication filters.
   - Publication visual flows.
   - Bento project grid.
   - Project cards and tags.

6. `css/06-experience-skills-writing-contact.css`
   - Experience cards.
   - Skills panels.
   - Blog/writing layouts.
   - Contact page.

7. `css/07-animations-responsive.css`
   - Reveal animations.
   - Page transitions.
   - Responsive breakpoints.
   - Reduced-motion rules.

8. `css/08-polish-overrides.css`
   - Final responsive refinements.
   - Visual polish.
   - Cross-page corrections.
   - Bright theme refinements.

Theme colors are defined with CSS custom properties in `01-base.css`:

- Default dark theme: `:root`.
- Bright theme: `html[data-theme="bright"]`.

To adjust the visual identity, begin with the variables in `01-base.css` before editing individual component styles.

## JavaScript Architecture

Scripts are split by responsibility and loaded with `defer`.

### `js/state.js`

Defines shared state:

- `activePublicationFilter`
- `prefersReducedMotion`

This file must load before modules that use these variables.

### `js/theme.js`

Handles:

- Applying dark or bright theme.
- Saving selected theme to `localStorage`.
- Updating theme toggle labels and ARIA attributes.
- Updating the browser theme color meta tag.

The initial inline script in each HTML `<head>` applies a saved theme before CSS rendering completes, helping avoid a theme flash.

### `js/publications-data.js`

Stores the publication array used by the publications page.

This file must load before `js/publications.js`.

### `js/publications.js`

Handles:

- Building publication filter buttons.
- Rendering publication cards.
- Filtering cards by domain.
- Adding reveal behavior to dynamically inserted cards.

### `js/ui.js`

Handles shared UI behavior:

- Reveal-on-scroll elements.
- Animated counters.
- Active navigation.
- Scroll progress.
- Page transition overlay.
- Copy-email behavior.
- Footer year.

### `js/neural-canvas.js`

Creates the animated neural-network-style background using the Canvas 2D API.

Features:

- Responsive point density.
- Pointer interaction.
- Theme-aware colors through CSS variables.
- Reduced-motion fallback.
- Visibility pause/resume handling.

### `js/main.js`

Main initializer for most pages. On `DOMContentLoaded`, it calls:

- `setupThemeControls()`
- `setupFooterYear()`
- `renderPublicationFilters()`
- `renderPublications()`
- `setupPageTransitions()`
- `observeRevealElements()`
- `animateCounters()`
- `setupActiveNavigation()`
- `setupScrollProgress()`
- `setupCopyEmail()`
- `setupNeuralCanvas()`

### `js/blog-main.js`

Blog-specific initializer. It excludes publication rendering because `blog.html` does not load publication data.

## Assets

### Local Assets

- `Photo.png` - main profile portrait.
- `favicon.svg` - browser tab icon.
- `Gourab_Roy_CV (2).pdf` - downloadable CV.

### Remote Assets

The site loads several remote assets:

- Google Font: Inter.
- Simple Icons for Google Scholar, GitHub, IEEE, Elsevier, LaTeX, Facebook, Instagram, and other logos.
- Devicon icons for programming tools and platforms.
- University logos from public URLs.

Because some icons are remote, an internet connection is needed for the full visual presentation. The core content still loads without these icons.

## SEO and Metadata

Each page includes:

- `meta name="description"`
- `meta name="keywords"` on most portfolio pages.
- `meta name="theme-color"`
- Open Graph title and description.
- Open Graph type.
- Open Graph image on most pages.
- Page-specific `<title>`.
- Favicon link.
- Application name metadata.

Recommended future improvements:

- Add a canonical URL after the deployment URL is known.
- Add a dedicated `og-image.png` or `og-image.webp` at `1200x630`.
- Add `robots.txt`.
- Add `sitemap.xml`.
- Use page-specific Open Graph images for major pages if desired.
- Recheck citation counts before publishing important updates.

## Accessibility

The site includes several accessibility-oriented details:

- Skip links at the top of pages.
- Semantic landmark structure with `header`, `nav`, `main`, `section`, `article`, `aside`, and `footer`.
- Meaningful image `alt` text for the portrait.
- Decorative icons marked with `alt=""` or `aria-hidden="true"`.
- Buttons with ARIA labels and pressed states where relevant.
- `aria-live="polite"` for the publication grid.
- `prefers-reduced-motion` support for animations and the canvas background.
- Visible focus styles through `:focus-visible`.

Recommended checks before production:

- Test keyboard navigation across all pages.
- Confirm color contrast in both dark and bright themes.
- Confirm that external logo images do not carry redundant screen-reader text.
- Test the copy-email button in secure and non-secure contexts.

## Performance Notes

The site is lightweight because it uses static files and no JavaScript framework.

Potential performance improvements:

- Convert `Photo.png` to WebP or AVIF.
- Keep the original PNG only as a fallback if needed.
- Add responsive image variants with `srcset`.
- Host critical external icons locally if CDN dependency becomes a concern.
- Minify CSS and JS only when the site is stable.
- Consider preloading the hero portrait after image optimization.

The canvas animation already respects reduced-motion preferences and pauses when the page is hidden.

## Deployment

The site can be deployed anywhere that serves static files.

### GitHub Pages

1. Push the repository to GitHub.
2. Open the repository settings.
3. Go to **Pages**.
4. Choose the branch and root folder.
5. Save.
6. Visit the generated GitHub Pages URL.

Make sure `index.html` remains in the repository root.

### Netlify

1. Create a new site from the repository.
2. Use no build command.
3. Set publish directory to:

```text
.
```

### Vercel

1. Import the repository.
2. Use the default static project settings.
3. Leave the build command empty.
4. Use the project root as the output directory.

### Any Static Server

Upload the full folder contents to the server root:

- HTML pages.
- `css/`
- `js/`
- `Photo.png`
- `favicon.svg`
- CV PDF.

## License

This portfolio is a personal website for Gourab Roy. Unless a separate `LICENSE` file states otherwise, all source code, written content, images, CV files, branding, and other assets in this repository are copyright © Gourab Roy. All rights reserved.

You may view the site and use the repository structure as a learning reference, but you may not reuse, republish, or present the personal content, portrait, CV, research summaries, or profile materials as your own. For reuse, adaptation, or collaboration requests, contact Gourab Roy directly.

## Maintenance Checklist

Before publishing a new version:

- Confirm all navigation links work.
- Confirm the CV opens correctly.
- Confirm the email and phone links are current.
- Check Google Scholar citation numbers.
- Check publication links and DOI links.
- Confirm social links point to the intended profiles.
- Test dark and bright themes.
- Test the site on mobile width.
- Test reduced-motion mode if possible.
- Check browser console for missing assets or JavaScript errors.
- Compress large image assets when possible.
- Update the footer year if JavaScript is disabled support is important. JavaScript currently updates it automatically.

## Troubleshooting

### The theme does not persist

Theme preference is stored in `localStorage` under:

```text
portfolio-theme
```

If it behaves unexpectedly, clear site data in the browser and reload.

### Publication cards do not appear

Check that these files are loaded in this order on `publications.html`:

```html
<script src="js/publications-data.js" defer></script>
<script src="js/state.js" defer></script>
<script src="js/theme.js" defer></script>
<script src="js/publications.js" defer></script>
<script src="js/ui.js" defer></script>
<script src="js/neural-canvas.js" defer></script>
<script src="js/main.js" defer></script>
```

`publications-data.js` must define `publications` before `publications.js` renders the cards.

### Some logos do not load

Many icons are loaded from external CDNs. Check internet access and browser console network errors.

### Copy email fails

The Clipboard API requires a secure context in many browsers. The code falls back to a temporary text area and `document.execCommand("copy")`, but some browsers may still block clipboard access depending on permissions.

### Page transitions feel too slow

Transition timing is controlled in:

```text
js/ui.js
css/07-animations-responsive.css
```

Users with reduced-motion enabled skip the transition.

## Contact Links

Current contact and profile links used by the site:

- Email: `gourab.roy@estudiante.uam.es`
- Google Scholar: `https://scholar.google.com/citations?hl=en&user=_9tL56YAAAAJ`
- LinkedIn: `https://www.linkedin.com/in/gourab-roy-5b52921a3/`
- GitHub: `https://github.com/GourabRoy551`
- Facebook: `https://www.facebook.com/bdgourab5184`
- Instagram: `https://www.instagram.com/gourab.roy__/`

## Notes for Future Development

Useful next improvements:

- Rename the CV file to a cleaner URL-safe name.
- Optimize `Photo.png` into WebP/AVIF variants.
- Add a dedicated social preview image.
- Add a real blog post system if long-form writing grows.
- Add `sitemap.xml` and `robots.txt`.
- Consolidate the repeated header into a template if the project later adopts a static site generator.
- Consider local copies of external icons for fully offline rendering.

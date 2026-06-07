# Gourab Roy Portfolio

This is my personal portfolio website. I use it to present my academic background, research interests, publications, projects, skills, blog posts, and contact information in one place.

I am an Erasmus Mundus IPCVAI master's student and AI engineer working around computer vision, biomedical imaging, explainable AI, multimodal learning, document AI, inspection systems, and applied deep learning.

The site is fully static. There is no build step, no framework, and no package installation needed. It can be opened directly in a browser or deployed to any static hosting platform.

## What This Site Includes

- Homepage with my profile, research focus, CV link, and main profile links.
- About page with my background, research direction, and current academic status.
- Research page focused on trustworthy vision AI, medical imaging, CLIP/XAI, document AI, and inspection workflows.
- Education page for my IPCVAI mobility path across Budapest, Madrid, and Bordeaux.
- Publications page with dynamic filtering by research domain.
- Experience page for my teaching, mentoring, and research assistant work.
- Projects page with selected research and software projects.
- Skills page with my programming, ML, data, and research-writing stack.
- Blog section for research notes, learning logs, and personal updates.
- Contact page with email, phone, CV, and social links.
- Dark and bright theme support.
- Language selector for English, Bangla, Spanish, and French.

## Languages

The portfolio supports:

- English
- Bangla
- Spanish
- French

The custom language selector is added by:

```text
js/i18n.js
```

It uses Google Translate behind the scenes, but keeps the selector styled like the rest of the portfolio. The selected language is saved in `localStorage` as:

```text
portfolio-language
```

Google Translate also uses the `googtrans` cookie.

You can open a page directly in a language with:

```text
index.html?lang=bn
index.html?lang=es
index.html?lang=fr
```

For best testing, run the site with a local server instead of opening it through `file://`, because the translation script loads from Google.

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Canvas 2D API for the neural background animation
- Google Fonts: Inter and Noto Sans Bengali
- Google Translate Element for multilingual support
- Simple Icons and Devicon for external logos

There is no Node.js build process required for this project.

## Project Structure

```text
Portfolio/
|-- index.html
|-- about.html
|-- research.html
|-- education.html
|-- publications.html
|-- experience.html
|-- projects.html
|-- skills.html
|-- contact.html
|-- README.md
|-- favicon.svg
|-- Photo.png
|-- Gourab_Roy_CV (2).pdf
|-- Blog/
|   |-- index.html
|   |-- ipcv-days-france-2026.html
|   `-- IPCV Days France/
|-- css/
|   |-- 01-base.css
|   |-- 02-header-layout.css
|   |-- 03-hero.css
|   |-- 04-research-education.css
|   |-- 05-publications-projects.css
|   |-- 06-experience-skills-writing-contact.css
|   |-- 07-animations-responsive.css
|   `-- 08-polish-overrides.css
`-- js/
    |-- state.js
    |-- theme.js
    |-- publications-data.js
    |-- publications.js
    |-- ui.js
    |-- neural-canvas.js
    |-- main.js
    |-- blog-main.js
    `-- i18n.js
```

## Running Locally

The simple way is to open `index.html` in a browser.

For better testing, especially for the language selector, run a local server:

```powershell
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

Other static servers also work:

```powershell
npx serve .
```

or:

```powershell
npx http-server .
```

## Editing Notes

### Main Profile Content

Most homepage content is in:

```text
index.html
```

This includes the hero text, profile strip, main buttons, portrait section, and homepage metrics.

### Navigation

Each page has its own header navigation. If I add, rename, or remove a page, I need to update the `<nav class="nav-links">` block in all HTML pages.

The active nav state is handled by:

```text
js/ui.js
```

### Publications

Publication data is stored in:

```text
js/publications-data.js
```

The cards and filters are rendered by:

```text
js/publications.js
```

To add a new publication, I add a new object to the `publications` array. The domain filter is generated automatically from the `domain` field.

### Projects

Project cards are written directly in:

```text
projects.html
```

### Blog

The blog index is:

```text
Blog/index.html
```

The longer Bordeaux post is:

```text
Blog/ipcv-days-france-2026.html
```

There is no CMS or Markdown system here. Blog posts are written as normal HTML.

### Contact Info

Contact links are in:

```text
contact.html
```

If my email, phone number, CV, or social links change, this is the main file to update.

### CV

The current CV file is:

```text
Gourab_Roy_CV (2).pdf
```

If I rename it, I need to update all CV links across the site.

## CSS Notes

The CSS is split into ordered files:

1. `css/01-base.css` - theme variables, base styles, fonts, background, skip link, canvas layer.
2. `css/02-header-layout.css` - header, brand, navigation, theme toggle, shared layout.
3. `css/03-hero.css` - homepage hero and portrait section.
4. `css/04-research-education.css` - research and education layouts.
5. `css/05-publications-projects.css` - publication cards, filters, and project grid.
6. `css/06-experience-skills-writing-contact.css` - experience, skills, blog, and contact sections.
7. `css/07-animations-responsive.css` - animations, page transitions, responsive rules.
8. `css/08-polish-overrides.css` - final polish, mobile fixes, language selector, and Google Translate hiding.

Theme colors are controlled mainly in:

```text
css/01-base.css
```

The dark theme is defined in `:root`, and the bright theme is defined in:

```css
html[data-theme="bright"]
```

## JavaScript Notes

- `js/state.js` stores shared state like publication filter and reduced-motion preference.
- `js/theme.js` handles dark/bright theme switching and persistence.
- `js/publications-data.js` stores publication data.
- `js/publications.js` renders publication filters and cards.
- `js/ui.js` handles shared UI behavior like reveal animations, counters, active nav, scroll progress, page transitions, copy email, and footer year.
- `js/neural-canvas.js` creates the animated neural background.
- `js/main.js` initializes normal portfolio pages.
- `js/blog-main.js` initializes blog pages.
- `js/i18n.js` adds the language selector and connects it to Google Translate.

## Accessibility

The site includes:

- Skip links.
- Semantic HTML structure.
- Keyboard focus styles.
- ARIA labels for important controls.
- Reduced-motion support.
- Decorative icons hidden from screen readers.
- Accessible language selector label.

Before publishing major updates, I should test keyboard navigation and both themes.

## Performance Notes

The site is lightweight because it uses static files and no framework.

Future improvements I may do:

- Convert `Photo.png` to WebP or AVIF.
- Add responsive image sizes.
- Add a dedicated Open Graph preview image.
- Host important remote icons locally.
- Add `sitemap.xml` and `robots.txt`.

## Deployment

This site can be deployed anywhere that serves static files.

Good options:

- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages
- Any normal static web server

There is no build command. The publish directory is the project root.

## Maintenance Checklist

Before publishing a new version, I should check:

- All navigation links.
- CV download link.
- Email and phone links.
- Publication links and DOI links.
- Google Scholar citation numbers.
- Social profile links.
- Dark and bright themes.
- English, Bangla, Spanish, and French language selector.
- Mobile layout.
- Browser console for JavaScript or missing asset errors.
- Large image size, especially `Photo.png`.

## Troubleshooting

### Theme Does Not Persist

Theme preference is stored in:

```text
portfolio-theme
```

Clear browser site data if the theme behaves unexpectedly.

### Publications Do Not Show

On `publications.html`, these scripts need to load in the right order:

```html
<script src="js/publications-data.js" defer></script>
<script src="js/state.js" defer></script>
<script src="js/theme.js" defer></script>
<script src="js/publications.js" defer></script>
<script src="js/ui.js" defer></script>
<script src="js/neural-canvas.js" defer></script>
<script src="js/main.js" defer></script>
<script src="js/i18n.js" defer></script>
```

### Language Selector Does Not Translate

Check that the page loads:

```html
<script src="js/i18n.js" defer></script>
```

Blog pages use:

```html
<script src="../js/i18n.js" defer></script>
```

Also check that:

- The browser can load `https://translate.google.com/`.
- The site is served from `localhost` or a static host.
- Browser extensions are not blocking Google Translate.
- Old site data or the `googtrans` cookie is cleared.

### Copy Email Does Not Work

Clipboard access can be blocked by browser permissions or insecure contexts. The code has a fallback, but some browsers may still block it.

## Contact Links

- Email: `gourab.roy@estudiante.uam.es`
- Google Scholar: `https://scholar.google.com/citations?hl=en&user=_9tL56YAAAAJ`
- LinkedIn: `https://www.linkedin.com/in/gourab-roy-5b52921a3/`
- GitHub: `https://github.com/GourabRoy551`
- Facebook: `https://www.facebook.com/bdgourab5184`
- Instagram: `https://www.instagram.com/gourab.roy__/`

## License

This is my personal portfolio website. Unless a separate license file says otherwise, the source code, written content, portrait, CV, research summaries, and other personal materials are mine.

Please do not reuse or present my personal content as your own.

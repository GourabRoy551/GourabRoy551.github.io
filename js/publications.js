// Publication list (grouped like the CV), domain filters, and the citation modal.

function formatAuthors(authors) {
  if (!authors) return "";
  return authors.replace(/G\. Roy/g, "<strong>G. Roy</strong>");
}

function splitAuthors(authors) {
  if (!authors) return [];
  return authors
    .split(/,\s*(?:and\s+)?|\s+and\s+/)
    .map((name) => name.trim())
    .filter(Boolean);
}

function splitVenue(publication) {
  const [venue, doiPart] = publication.venue.split(/\.?\s*DOI:\s*/);
  let doi = doiPart ? doiPart.trim() : "";
  if (!doi && publication.link && publication.link.includes("doi.org/")) {
    doi = publication.link.split("doi.org/")[1];
  }
  return { venue: venue.trim(), doi };
}

function citationKey(publication) {
  const first = splitAuthors(publication.authors)[0] || "roy";
  const surname = first.split(/\s+/).pop().replace(/[^A-Za-z]/g, "").toLowerCase();
  const word = publication.title.split(/\s+/)[0].replace(/[^A-Za-z0-9]/g, "").toLowerCase();
  return `${surname}${publication.year}${word}`;
}

function toBibTeX(publication) {
  const { venue, doi } = splitVenue(publication);
  const isJournal = publication.type === "Journal";
  const fields = [
    ["title", `{${publication.title}}`],
    publication.authors ? ["author", splitAuthors(publication.authors).join(" and ")] : null,
    [isJournal ? "journal" : "booktitle", venue],
    ["year", publication.year],
    doi ? ["doi", doi] : null,
    ["url", publication.link],
  ].filter(Boolean);

  const body = fields.map(([key, value]) => `  ${key.padEnd(9)} = {${value}}`).join(",\n");
  return `@${isJournal ? "article" : "inproceedings"}{${citationKey(publication)},\n${body}\n}`;
}

function toPlainCitation(publication) {
  const { venue, doi } = splitVenue(publication);
  const authors = splitAuthors(publication.authors);
  const authorText =
    authors.length > 1 ? `${authors.slice(0, -1).join(", ")}, and ${authors[authors.length - 1]}, ` : authors[0] ? `${authors[0]}, ` : "";
  return `${authorText}"${publication.title}," ${venue}, ${publication.year}.${doi ? ` doi: ${doi}.` : ""}`;
}

function downloadBibTeX(publication) {
  const blob = new Blob([toBibTeX(publication) + "\n"], { type: "application/x-bibtex" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${citationKey(publication)}.bib`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function renderPublicationFilters() {
  const container = document.querySelector("#publication-filters");
  if (!container) return;

  const counts = publications.reduce((map, publication) => {
    map[publication.domain] = (map[publication.domain] || 0) + 1;
    return map;
  }, {});
  const filters = ["All", ...Object.keys(counts)];

  container.innerHTML = "";
  filters.forEach((filter) => {
    const button = document.createElement("button");
    button.type = "button";
    button.innerHTML = `${filter}<span class="count">${filter === "All" ? publications.length : counts[filter]}</span>`;
    button.setAttribute("aria-pressed", String(filter === activePublicationFilter));
    button.addEventListener("click", () => {
      activePublicationFilter = filter;
      renderPublicationFilters();
      renderPublications();
    });
    container.appendChild(button);
  });
}

function renderPublication(publication) {
  const index = publications.indexOf(publication);
  const { venue, doi } = splitVenue(publication);
  const article = document.createElement("article");
  article.className = "pub";
  article.setAttribute("data-reveal", "");
  article.innerHTML = `
    <span class="pub-year">${publication.year}</span>
    <div class="pub-main">
      <h4 class="pub-title">
        <a href="${publication.link}" target="_blank" rel="noreferrer">${publication.title}</a>${
          publication.selected ? '<span class="pub-star" title="Selected publication">★</span>' : ""
        }
      </h4>
      ${publication.authors ? `<div class="pub-authors">${formatAuthors(publication.authors)}</div>` : ""}
      <div class="pub-venue">${venue}</div>
      <div class="pub-actions">
        <a href="${publication.link}" target="_blank" rel="noreferrer">${doi ? "DOI ↗" : "Paper ↗"}</a>
        <button type="button" data-cite="${index}">Cite</button>
        <button type="button" data-bib="${index}">BibTeX ↓</button>
      </div>
    </div>
    <div class="pub-side">
      <span class="chip">${publication.domain}</span>
      ${publication.citations ? `<span class="pub-cites">${publication.citations} citation${publication.citations > 1 ? "s" : ""}</span>` : ""}
    </div>
  `;
  return article;
}

function renderPublications() {
  const container = document.querySelector("#publication-list");
  if (!container) return;

  const visible =
    activePublicationFilter === "All"
      ? publications
      : publications.filter((publication) => publication.domain === activePublicationFilter);

  const summary = document.querySelector("#publication-summary");
  if (summary) {
    const journals = visible.filter((publication) => publication.type === "Journal").length;
    summary.textContent = `${visible.length} shown · ${journals} journal · ${visible.length - journals} conference`;
  }

  container.innerHTML = "";

  [
    ["Journal", "Journal articles"],
    ["Conference", "Conference papers"],
  ].forEach(([type, label]) => {
    const group = visible
      .filter((publication) => publication.type === type)
      .sort((a, b) => Number(b.year) - Number(a.year));
    if (!group.length) return;

    const section = document.createElement("div");
    section.className = "pub-group";
    section.innerHTML = `<h3 class="pub-group-title">${label} <span>${group.length}</span></h3>`;
    group.forEach((publication) => section.appendChild(renderPublication(publication)));
    container.appendChild(section);
  });

  if (!visible.length) container.innerHTML = '<p class="pub-empty">No publications in this area yet.</p>';
  observeRevealElements(container.querySelectorAll("[data-reveal]"));
}

function setupCitations() {
  const list = document.querySelector("#publication-list");
  const modal = document.querySelector("#cite-modal");
  if (!list || !modal) return;

  const title = modal.querySelector("[data-cite-title]");
  const text = modal.querySelector("[data-cite-text]");
  const tabs = modal.querySelectorAll("[data-cite-format]");
  const copy = modal.querySelector("[data-cite-copy]");
  const download = modal.querySelector("[data-cite-download]");
  let current = null;
  let format = "plain";

  function render() {
    if (!current) return;
    text.textContent = format === "bibtex" ? toBibTeX(current) : toPlainCitation(current);
    tabs.forEach((tab) => tab.setAttribute("aria-selected", String(tab.dataset.citeFormat === format)));
  }

  tabs.forEach((tab) =>
    tab.addEventListener("click", () => {
      format = tab.dataset.citeFormat;
      render();
    })
  );

  copy.addEventListener("click", async () => {
    const copied = await copyTextToClipboard(text.textContent);
    showToast(copied ? "Citation copied" : "Copy failed: please copy it manually");
  });

  download.addEventListener("click", () => current && downloadBibTeX(current));

  list.addEventListener("click", (event) => {
    const citeButton = event.target.closest("[data-cite]");
    const bibButton = event.target.closest("[data-bib]");

    if (bibButton) {
      downloadBibTeX(publications[Number(bibButton.dataset.bib)]);
      return;
    }
    if (!citeButton) return;

    current = publications[Number(citeButton.dataset.cite)];
    title.textContent = current.title;
    render();
    openModal(modal, citeButton);
  });
}

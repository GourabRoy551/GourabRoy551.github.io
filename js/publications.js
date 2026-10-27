function formatAuthors(authors) {
  if (!authors) return "";
  return authors.replace(/G\. Roy/g, "<strong>G. Roy</strong>");
}

function publicationFilters() {
  return ["All", ...Array.from(new Set(publications.map((publication) => publication.domain)))];
}

function renderPublicationFilters() {
  const filterContainer = document.querySelector("#publication-filters");
  if (!filterContainer) return;

  filterContainer.innerHTML = "";

  publicationFilters().forEach((filter) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = filter;
    button.setAttribute("aria-pressed", String(filter === activePublicationFilter));
    button.addEventListener("click", () => {
      activePublicationFilter = filter;
      renderPublicationFilters();
      renderPublications();
    });
    filterContainer.appendChild(button);
  });
}

function renderPublicationViewToggle() {
  const container = document.querySelector("#publication-view");
  if (!container) return;

  container.innerHTML = "";

  [
    ["list", "List"],
    ["cards", "Cards"],
  ].forEach(([view, label]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.setAttribute("aria-pressed", String(view === publicationView));
    button.addEventListener("click", () => {
      publicationView = view;
      renderPublicationViewToggle();
      renderPublications();
    });
    container.appendChild(button);
  });
}

function renderPublicationRow(publication) {
  const row = document.createElement("article");
  row.className = `publication-row ${publication.visualClass}`;
  row.setAttribute("data-reveal", "");

  const title = publication.link
    ? `<a href="${publication.link}" target="_blank" rel="noreferrer">${publication.title}</a>`
    : publication.title;

  row.innerHTML = `
    <span class="publication-row-year">${publication.year}</span>
    <div class="publication-row-main">
      <h3>${title}</h3>
      ${publication.authors ? `<div class="publication-authors">${formatAuthors(publication.authors)}</div>` : ""}
      <div class="publication-venue">${publication.venue}</div>
    </div>
    <span class="publication-row-type">${publication.type} &middot; ${publication.domain}</span>
  `;
  return row;
}

function renderPublications() {
  const grid = document.querySelector("#publication-grid");
  if (!grid) return;

  const visiblePublications =
    activePublicationFilter === "All"
      ? publications
      : publications.filter((publication) => publication.domain === activePublicationFilter);

  grid.innerHTML = "";
  grid.classList.toggle("is-list", publicationView === "list");

  if (publicationView === "list") {
    // Grouped like the CV: journal articles first, then conference papers, newest first.
    ["Journal", "Conference"].forEach((type) => {
      const group = visiblePublications
        .filter((publication) => publication.type === type)
        .sort((a, b) => Number(b.year) - Number(a.year));
      if (!group.length) return;

      const heading = document.createElement("h3");
      heading.className = "pub-group-title";
      heading.textContent = type === "Journal" ? "Journal articles" : "Conference papers";
      grid.appendChild(heading);
      group.forEach((publication) => grid.appendChild(renderPublicationRow(publication)));
    });
    observeRevealElements(grid.querySelectorAll("[data-reveal]"));
    return;
  }

  visiblePublications.forEach((publication) => {
    const article = document.createElement("article");
    article.className = "publication-card";
    if (publication.featured) {
      article.classList.add("is-featured");
    }
    article.setAttribute("data-reveal", "");

    article.innerHTML = `
      <div class="publication-visual ${publication.visualClass}" aria-hidden="true">
        <div class="publication-logo-lockup">
          <img src="${publication.logo}" alt="" loading="lazy" decoding="async">
          <span>${publication.domain}</span>
        </div>
        <div class="paper-flow">
          ${publication.visualSteps.map((step) => `<span>${step}</span>`).join("")}
        </div>
      </div>
      <span class="publication-meta">${publication.year} / ${publication.type} / ${publication.domain}</span>
      <h3>${publication.title}</h3>
      ${publication.authors ? `<div class="publication-authors">${formatAuthors(publication.authors)}</div>` : ""}
      <div class="publication-venue">${publication.venue}</div>
      <p>${publication.summary}</p>
      ${publication.link ? `<a class="project-link" href="${publication.link}" target="_blank" rel="noreferrer">View paper</a>` : ""}
      <div class="tag-row" aria-label="Publication tags">
        ${publication.tags.map((tag) => `<span>${tag}</span>`).join("")}
      </div>
    `;

    grid.appendChild(article);
  });

  observeRevealElements(grid.querySelectorAll("[data-reveal]"));
}

function renderSelectedPublications() {
  const list = document.querySelector("#selected-publications-list");
  if (!list) return;

  list.innerHTML = publications
    .filter((publication) => publication.selected)
    .sort((a, b) => Number(b.year) - Number(a.year))
    .map(
      (publication) => `
        <li class="pub-entry">
          <span class="pub-entry-year">${publication.year}</span>
          <div class="pub-entry-body">
            <a class="pub-entry-title" href="${publication.link}" target="_blank" rel="noreferrer">${publication.title}</a>
            <div class="publication-authors">${formatAuthors(publication.authors)}</div>
            <div class="publication-venue">${publication.venue}</div>
          </div>
        </li>`
    )
    .join("");
}

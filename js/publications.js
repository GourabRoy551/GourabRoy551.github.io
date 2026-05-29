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

function renderPublications() {
  const grid = document.querySelector("#publication-grid");
  if (!grid) return;

  const visiblePublications =
    activePublicationFilter === "All"
      ? publications
      : publications.filter((publication) => publication.domain === activePublicationFilter);

  grid.innerHTML = "";

  visiblePublications.forEach((publication) => {
    const article = document.createElement("article");
    article.className = "publication-card";
    if (publication.citations >= 20) {
      article.classList.add("is-featured");
    }
    article.setAttribute("data-reveal", "");

    const citationText = publication.citations
      ? ` / ${publication.citations} Scholar citations`
      : "";

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
      <span class="publication-meta">${publication.year} / ${publication.type} / ${publication.domain}${citationText}</span>
      <h3>${publication.title}</h3>
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

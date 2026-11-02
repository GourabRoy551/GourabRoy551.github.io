// Project cards and the case-study modal (deep-linkable as #project-<id>).

function statusBadge(status) {
  const kind = status.kind === "live" ? "badge-live" : "badge-done";
  return `<span class="badge ${kind}">${status.text}</span>`;
}

function githubIcon() {
  return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"/></svg>';
}

function renderProjects() {
  const grid = document.querySelector("#project-grid");
  if (!grid) return;

  grid.innerHTML = projects
    .map((project, index) => {
      const repo = project.links.find(([, url]) => url.includes("github.com"));
      return `
        <article class="card project-card${project.featured ? " is-featured" : ""}${project.wide ? " is-wide" : ""}" data-reveal
          style="--reveal-delay:${(index % 3) * 0.06}s" data-project="${project.id}">
          <div class="project-art">
            ${projectArt[project.art]}
            <span class="fig-caption"><b>Fig. ${index + 1}</b> · schematic</span>
          </div>
          <div class="project-body">
            <div class="project-meta">
              ${statusBadge(project.status)}
              <span class="label">${project.context.split(" · ").pop()}</span>
            </div>
            <h3>${project.title}</h3>
            <p>${project.summary}</p>
            <div class="project-metric"><b>${project.metric.value}</b><span>${project.metric.label}</span></div>
            <div class="project-foot">
              <a class="project-open" href="#project-${project.id}" data-project-open="${project.id}">Read case study</a>
              ${
                repo
                  ? `<a class="icon-button" href="${repo[1]}" target="_blank" rel="noreferrer" aria-label="${project.title} on GitHub">${githubIcon()}</a>`
                  : ""
              }
            </div>
          </div>
        </article>`;
    })
    .join("");

  observeRevealElements(grid.querySelectorAll("[data-reveal]"));
}

function renderCaseStudy(project) {
  const list = (items) => `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
  return `
    <article class="case">
      <div class="case-art">${projectArt[project.art]}</div>
      <p class="fig-caption case-note">Schematic illustration of the method, not an experimental result.</p>
      <div class="project-meta">${statusBadge(project.status)}<span class="label">${project.context}</span></div>
      <h2 id="project-modal-title">${project.title}</h2>
      <p class="case-lead">${project.summary}</p>
      <div class="case-metrics">
        ${project.metrics.map(([value, label]) => `<div><b>${value}</b><span>${label}</span></div>`).join("")}
      </div>
      <section class="case-section">
        <h3>Overview</h3>
        <dl class="case-facts">
          ${project.facts.map(([term, value]) => `<div><dt class="label">${term}</dt><dd>${value}</dd></div>`).join("")}
        </dl>
      </section>
      <section class="case-section"><h3>Problem</h3><p>${project.problem}</p></section>
      <section class="case-section"><h3>Approach</h3>${list(project.approach)}</section>
      <section class="case-section"><h3>Results</h3>${list(project.results)}</section>
      <section class="case-section">
        <h3>Stack</h3>
        <div class="chips">${project.tags.map((tag) => `<span class="chip">${tag}</span>`).join("")}</div>
      </section>
      ${
        project.links.length
          ? `<div class="case-links">${project.links
              .map(
                ([label, url]) =>
                  `<a class="btn btn-ghost btn-sm" href="${url}" target="_blank" rel="noreferrer">${githubIcon()} ${label}</a>`
              )
              .join("")}</div>`
          : ""
      }
    </article>`;
}

function setupProjectModal() {
  const modal = document.querySelector("#project-modal");
  const grid = document.querySelector("#project-grid");
  if (!modal || !grid) return;

  const body = modal.querySelector("[data-project-body]");
  const position = modal.querySelector("[data-project-position]");
  const prev = modal.querySelector("[data-project-prev]");
  const next = modal.querySelector("[data-project-next]");
  let currentIndex = 0;

  function show(index, trigger) {
    currentIndex = (index + projects.length) % projects.length;
    const project = projects[currentIndex];
    body.innerHTML = renderCaseStudy(project);
    body.scrollTop = 0;
    position.textContent = `Case study ${currentIndex + 1} / ${projects.length}`;
    if (location.hash !== `#project-${project.id}`) history.replaceState(null, "", `#project-${project.id}`);
    if (!modal.classList.contains("is-open")) openModal(modal, trigger);
  }

  function openFromHash() {
    const match = location.hash.match(/^#project-(.+)$/);
    if (!match) return;
    const index = projects.findIndex((project) => project.id === match[1]);
    if (index >= 0) show(index);
  }

  grid.addEventListener("click", (event) => {
    if (event.target.closest(".icon-button")) return;
    const card = event.target.closest("[data-project]");
    if (!card) return;
    event.preventDefault();
    show(
      projects.findIndex((project) => project.id === card.dataset.project),
      card.querySelector("[data-project-open]")
    );
  });

  prev.addEventListener("click", () => show(currentIndex - 1));
  next.addEventListener("click", () => show(currentIndex + 1));

  modal.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") show(currentIndex - 1);
    if (event.key === "ArrowRight") show(currentIndex + 1);
  });

  modal.addEventListener("modal:close", () => {
    if (location.hash.startsWith("#project-")) history.replaceState(null, "", "#projects");
  });

  window.addEventListener("hashchange", openFromHash);
  openFromHash();
}

function observeRevealElements(elements = document.querySelectorAll("[data-reveal]")) {
  const revealItems = Array.from(elements).filter((item) => item.dataset.revealObserved !== "true");

  if (!revealItems.length) return;

  if (!("IntersectionObserver" in window) || prefersReducedMotion) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  revealItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    if (rect.top < viewportHeight * 0.92 && rect.bottom > 0) {
      item.classList.add("is-visible");
    }
  });

  const observer = new IntersectionObserver(
    (entries, localObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          localObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.filter((item) => !item.classList.contains("is-visible")).forEach((item) => {
    item.dataset.revealObserved = "true";
    observer.observe(item);
  });
}

function animateCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  if (prefersReducedMotion) {
    counters.forEach((counter) => {
      counter.textContent = `${counter.dataset.count}${counter.dataset.suffix || ""}`;
    });
    return;
  }

  counters.forEach((counter) => {
    const target = parseInt(counter.dataset.count, 10);
    const suffix = counter.dataset.suffix || "";
    const duration = 1400;
    const startTime = performance.now();

    function tick(now) {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      counter.textContent = `${Math.round(eased * target)}${suffix}`;
      if (t < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  });
}

function setupActiveNavigation() {
  const links = Array.from(document.querySelectorAll(".nav-links a"));
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  links.forEach((link) => {
    const href = link.getAttribute("href") || "";
    if (!href || href.startsWith("#")) return;

    const linkUrl = new URL(href, window.location.href);
    const linkPage = linkUrl.pathname.split("/").pop() || "index.html";
    link.classList.toggle("is-active", linkPage === currentPage);
  });

  const sectionLinks = links.filter((link) => (link.getAttribute("href") || "").startsWith("#"));
  const sections = sectionLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!sections.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        sectionLinks.forEach((link) => {
          const isActive = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("is-active", isActive);
        });
      });
    },
    { rootMargin: "-30% 0px -58% 0px", threshold: 0.01 }
  );

  sections.forEach((section) => observer.observe(section));
}

function setupScrollProgress() {
  const progress = document.querySelector("#scroll-progress");
  if (!progress) return;

  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? Math.min(scrollTop / scrollable, 1) : 0;
    progress.style.transform = `scaleX(${ratio})`;
  }

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
}

function setupPageTransitions() {
  if (prefersReducedMotion) return;

  const transition = document.createElement("div");
  transition.className = "page-transition";
  transition.setAttribute("aria-hidden", "true");
  transition.innerHTML = `
    <div class="page-transition-content">
      <span class="page-transition-kicker">Opening</span>
      <span class="page-transition-title">Gourab Roy</span>
      <span class="page-transition-line" aria-hidden="true"></span>
    </div>
  `;
  document.body.appendChild(transition);

  const transitionTitle = transition.querySelector(".page-transition-title");
  let storedTitle = "";
  try {
    storedTitle = sessionStorage.getItem("portfolio-transition-title");
    sessionStorage.removeItem("portfolio-transition-title");
  } catch (error) {
    storedTitle = "";
  }

  if (storedTitle && transitionTitle) {
    transitionTitle.textContent = storedTitle;
  }

  document.body.classList.add("is-page-entering");
  window.setTimeout(() => {
    document.body.classList.remove("is-page-entering");
  }, 820);

  window.addEventListener("pageshow", () => {
    document.body.classList.remove("is-page-entering", "is-page-exiting");
  });

  let isTransitioning = false;

  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const link = target ? target.closest("a") : null;
    if (!link || isTransitioning) return;
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.target && link.target !== "_self") return;
    if (link.hasAttribute("download")) return;

    const href = link.getAttribute("href");
    if (!href || href.startsWith("#")) return;

    const url = new URL(href, window.location.href);
    if (!["http:", "https:", "file:"].includes(url.protocol)) return;
    if (url.origin !== window.location.origin) return;

    const currentPath = window.location.pathname.replace(/\/$/, "/index.html");
    const nextPath = url.pathname.replace(/\/$/, "/index.html");
    if (currentPath === nextPath) return;

    const isPageLink = nextPath.endsWith(".html") || nextPath.endsWith("/index.html");
    if (!isPageLink) return;

    event.preventDefault();
    isTransitioning = true;

    const label = link.dataset.transitionTitle || link.textContent.trim() || "Next page";
    if (transitionTitle) transitionTitle.textContent = label;
    try {
      sessionStorage.setItem("portfolio-transition-title", label);
    } catch (error) {
      // Page transitions should still work if storage is blocked.
    }

    document.body.classList.remove("is-page-entering");
    document.body.classList.add("is-page-exiting");

    window.setTimeout(() => {
      window.location.href = url.href;
    }, 760);
  });
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.top = "-1000px";
  textArea.style.left = "-1000px";
  document.body.appendChild(textArea);
  textArea.select();

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } finally {
    textArea.remove();
  }

  return copied;
}

function setupCopyEmail() {
  const copyButton = document.querySelector("[data-copy-email]");
  if (!copyButton) return;

  const label = copyButton.querySelector("[data-copy-label]");
  const originalLabel = label ? label.textContent : "Copy email";
  const email = copyButton.dataset.email;
  if (!email) return;

  copyButton.addEventListener("click", async () => {
    copyButton.disabled = true;

    try {
      const copied = await copyTextToClipboard(email);
      if (label) label.textContent = copied ? "Copied" : "Copy failed";
      copyButton.classList.toggle("is-copied", copied);
    } catch (error) {
      if (label) label.textContent = "Copy failed";
      copyButton.classList.remove("is-copied");
    }

    window.setTimeout(() => {
      if (label) label.textContent = originalLabel;
      copyButton.classList.remove("is-copied");
      copyButton.disabled = false;
    }, 1800);
  });
}

function setupFooterYear() {
  const year = document.querySelector("[data-current-year]");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
}

function setupMobileNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const header = document.querySelector(".site-header");
  if (!toggle || !header) return;

  function openNav() {
    header.classList.add("is-nav-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close navigation");
    document.addEventListener("click", handleOutsideClick, { once: false, capture: false });
  }

  function closeNav() {
    header.classList.remove("is-nav-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
    document.removeEventListener("click", handleOutsideClick, false);
  }

  function handleOutsideClick(event) {
    if (!header.contains(event.target)) {
      closeNav();
    }
  }

  toggle.addEventListener("click", () => {
    if (header.classList.contains("is-nav-open")) {
      closeNav();
    } else {
      openNav();
    }
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      closeNav();
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeNav();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && header.classList.contains("is-nav-open")) {
      closeNav();
      toggle.focus();
    }
  });
}

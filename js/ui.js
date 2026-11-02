// Shared UI behaviour: reveal-on-scroll, header state, scroll spy, mobile nav,
// modals, clipboard + toast, live local time, and counters.

function observeRevealElements(elements = document.querySelectorAll("[data-reveal]")) {
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  if (!window.revealObserver) {
    window.revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          window.revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
  }

  elements.forEach((element) => {
    if (!element.classList.contains("is-visible")) window.revealObserver.observe(element);
  });
}

function setupHeader() {
  const header = document.querySelector(".site-header");
  const progress = document.querySelector(".scroll-progress");

  function update() {
    const scrollTop = window.scrollY || 0;
    if (header) header.classList.toggle("is-scrolled", scrollTop > 8);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.setProperty("--progress", max > 0 ? Math.min(scrollTop / max, 1) : 0);
    }
  }

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

function setupScrollSpy() {
  const links = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  if (!links.length || !("IntersectionObserver" in window)) return;

  const byId = new Map();
  links.forEach((link) => {
    const section = document.querySelector(link.getAttribute("href"));
    if (section) byId.set(section.id, link);
  });

  const visible = new Map();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0));
      let bestId = null;
      let bestRatio = 0;
      visible.forEach((ratio, id) => {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestId = id;
        }
      });
      links.forEach((link) => link.classList.remove("is-active"));
      if (bestId && byId.get(bestId)) byId.get(bestId).classList.add("is-active");
    },
    { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.01, 0.25, 0.5, 1] }
  );

  byId.forEach((_, id) => observer.observe(document.getElementById(id)));
}

function setupMobileNav() {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector(".nav-links");
  if (!header || !toggle || !nav) return;

  function setOpen(open) {
    header.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  toggle.addEventListener("click", () => setOpen(!header.classList.contains("is-open")));
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });
  document.addEventListener("click", (event) => {
    if (header.classList.contains("is-open") && !header.contains(event.target)) setOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1100) setOpen(false);
  });
}

// ── Modals ──
var activeModal = null;
var modalReturnFocus = null;

function openModal(modal, trigger) {
  if (!modal) return;
  if (activeModal && activeModal !== modal) closeModal(activeModal, { keepFocus: true });

  modalReturnFocus = trigger || document.activeElement;
  activeModal = modal;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  const focusTarget = modal.querySelector("[data-modal-close]");
  window.setTimeout(() => focusTarget && focusTarget.focus({ preventScroll: true }), 40);
  modal.dispatchEvent(new CustomEvent("modal:open"));
}

function closeModal(modal = activeModal, options = {}) {
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  if (activeModal === modal) activeModal = null;
  modal.dispatchEvent(new CustomEvent("modal:close"));

  if (!options.keepFocus && modalReturnFocus && modalReturnFocus.focus) {
    modalReturnFocus.focus({ preventScroll: true });
  }
}

function setupModals() {
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.setAttribute("aria-hidden", "true");
    modal.addEventListener("click", (event) => {
      if (event.target.closest("[data-modal-close]") || event.target.classList.contains("modal-backdrop")) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (!activeModal) return;

    if (event.key === "Escape") {
      closeModal();
      return;
    }

    if (event.key !== "Tab") return;
    const focusable = Array.from(
      activeModal.querySelectorAll('a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])')
    ).filter((element) => element.offsetParent !== null);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}

function setupCvModal() {
  const modal = document.querySelector("#cv-modal");
  if (!modal) return;
  const frame = modal.querySelector("iframe");

  document.querySelectorAll("[data-cv-open]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      // Small screens rarely render inline PDFs well: let the link open the file.
      if (window.innerWidth < 720) return;
      event.preventDefault();
      if (frame && !frame.getAttribute("src")) frame.setAttribute("src", frame.dataset.src);
      openModal(modal, trigger);
    });
  });
}

// ── Clipboard + toast ──
async function copyTextToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (error) {
    // Fall through to the textarea fallback.
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch (error) {
    copied = false;
  }
  textarea.remove();
  return copied;
}

function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

function setupCopyButtons() {
  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const copied = await copyTextToClipboard(button.dataset.copy);
      showToast(copied ? "Copied to clipboard" : "Copy failed: please copy it manually");
    });
  });
}

// ── Small details ──
function setupLocalTime() {
  const targets = document.querySelectorAll("[data-local-time]");
  if (!targets.length) return;

  const formatter = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Paris",
  });

  function update() {
    const time = formatter.format(new Date());
    targets.forEach((target) => (target.textContent = time));
  }

  update();
  window.setInterval(update, 30000);
}

function setupFooterYear() {
  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
}

function animateCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  function run(counter) {
    const target = Number(counter.dataset.count);
    if (prefersReducedMotion || !Number.isFinite(target)) {
      counter.textContent = counter.dataset.count;
      return;
    }
    const start = performance.now();
    const duration = 1100;
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (!("IntersectionObserver" in window)) {
    counters.forEach(run);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      run(entry.target);
      observer.unobserve(entry.target);
    });
  });
  counters.forEach((counter) => observer.observe(counter));
}

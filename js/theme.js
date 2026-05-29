function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("portfolio-theme", theme);

  const isDark = theme === "dark";
  const toggle = document.querySelector("[data-theme-toggle]");
  if (toggle) {
    toggle.setAttribute("aria-pressed", String(isDark));
    toggle.setAttribute("aria-label", `Switch to ${isDark ? "bright" : "dark"} theme`);

    const label = toggle.querySelector("[data-theme-label]");
    const action = toggle.querySelector("[data-theme-action]");
    if (label) label.textContent = isDark ? "Dark" : "Bright";
    if (action) action.textContent = isDark ? "Switch to bright" : "Switch to dark";
  }

  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute("content", theme === "dark" ? "#090d0f" : "#f4f7f3");
  }
}

function setupThemeControls() {
  const currentTheme = document.documentElement.dataset.theme || "dark";
  setTheme(currentTheme);

  const toggle = document.querySelector("[data-theme-toggle]");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "bright" : "dark";
    setTheme(nextTheme);
  });
}

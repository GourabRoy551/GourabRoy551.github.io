(function () {
  const STORAGE_KEY = "portfolio-language";
  const COOKIE_NAME = "googtrans";
  const languages = {
    en: { label: "EN", name: "English", htmlLang: "en" },
    bn: { label: "বাংলা", name: "Bangla", htmlLang: "bn" },
    es: { label: "ES", name: "Spanish", htmlLang: "es" },
    fr: { label: "FR", name: "French", htmlLang: "fr" },
  };
  const supportedLanguages = Object.keys(languages);

  let activeLanguage = "en";
  let widgetReady = false;

  function isSupportedLanguage(language) {
    return supportedLanguages.includes(language);
  }

  function getRequestedLanguage() {
    const requestedLanguage = new URLSearchParams(window.location.search).get("lang");
    if (isSupportedLanguage(requestedLanguage)) return requestedLanguage;

    try {
      const savedLanguage = localStorage.getItem(STORAGE_KEY);
      if (isSupportedLanguage(savedLanguage)) return savedLanguage;
    } catch (error) {
      return "en";
    }

    return "en";
  }

  function saveLanguage(language) {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch (error) {
      // The selector still works for the current page if storage is blocked.
    }
  }

  function cookieDomainCandidates() {
    const hostname = window.location.hostname;
    if (!hostname || hostname === "localhost" || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
      return [""];
    }

    return ["", hostname, `.${hostname}`];
  }

  function writeGoogleTranslateCookie(language) {
    const maxAge = language === "en" ? "0" : String(60 * 60 * 24 * 365);
    const value = language === "en" ? "" : `/en/${language}`;

    cookieDomainCandidates().forEach((domain) => {
      const domainPart = domain ? `;domain=${domain}` : "";
      document.cookie = `${COOKIE_NAME}=${value};path=/${domainPart};max-age=${maxAge};SameSite=Lax`;
    });
  }

  function updateNativeControls(language) {
    document.documentElement.lang = languages[language].htmlLang;
    document.documentElement.dataset.language = language;

    document.querySelectorAll("[data-language-select]").forEach((select) => {
      select.value = language;
      select.setAttribute("aria-label", `Language: ${languages[language].name}`);
    });
  }

  function dispatchGoogleSelect(language) {
    const combo = document.querySelector(".goog-te-combo");
    if (!combo || language === "en") return false;

    combo.value = language;
    combo.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }

  function setLanguage(language, options = {}) {
    const nextLanguage = isSupportedLanguage(language) ? language : "en";
    const previousLanguage = activeLanguage;
    activeLanguage = nextLanguage;

    saveLanguage(activeLanguage);
    updateNativeControls(activeLanguage);
    writeGoogleTranslateCookie(activeLanguage);

    if (activeLanguage === "en") {
      if (options.fromUser || previousLanguage !== "en") {
        window.location.reload();
      }
      return;
    }

    if (widgetReady && !dispatchGoogleSelect(activeLanguage) && options.fromUser) {
      window.location.reload();
    }
  }

  function installLanguageControl() {
    const headerShell = document.querySelector(".header-shell");
    if (!headerShell || document.querySelector("[data-language-switcher]")) return;

    const wrapper = document.createElement("label");
    wrapper.className = "language-switcher notranslate";
    wrapper.dataset.languageSwitcher = "";
    wrapper.setAttribute("translate", "no");

    const label = document.createElement("span");
    label.className = "language-label-text";
    label.textContent = "Language";

    const select = document.createElement("select");
    select.className = "language-select notranslate";
    select.dataset.languageSelect = "";
    select.setAttribute("aria-label", "Language");
    select.setAttribute("translate", "no");

    supportedLanguages.forEach((language) => {
      const option = document.createElement("option");
      option.value = language;
      option.textContent = languages[language].label;
      option.title = languages[language].name;
      select.appendChild(option);
    });

    select.addEventListener("change", () => {
      setLanguage(select.value, { fromUser: true });
    });

    wrapper.append(label, select);

    const themeToggle = headerShell.querySelector("[data-theme-toggle]");
    const navToggle = headerShell.querySelector("[data-nav-toggle]");
    headerShell.insertBefore(wrapper, themeToggle || navToggle || null);
  }

  function installGoogleMount() {
    if (document.querySelector("#google-translate-mount")) return;

    const mount = document.createElement("div");
    mount.id = "google-translate-mount";
    mount.setAttribute("aria-hidden", "true");
    document.body.appendChild(mount);
  }

  function loadGoogleTranslate() {
    window.googleTranslateElementInit = function () {
      widgetReady = true;
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "bn,es,fr",
          autoDisplay: false,
        },
        "google-translate-mount"
      );

      window.setTimeout(() => dispatchGoogleSelect(activeLanguage), 250);
    };

    if (window.google && window.google.translate) {
      window.googleTranslateElementInit();
      return;
    }

    if (document.querySelector("script[data-google-translate-script]")) return;

    const script = document.createElement("script");
    script.dataset.googleTranslateScript = "";
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.head.appendChild(script);
  }

  document.addEventListener("DOMContentLoaded", () => {
    activeLanguage = getRequestedLanguage();
    writeGoogleTranslateCookie(activeLanguage);
    installLanguageControl();
    installGoogleMount();
    updateNativeControls(activeLanguage);
    loadGoogleTranslate();
  });

  window.setPortfolioLanguage = (language) => setLanguage(language, { fromUser: true });
})();

(() => {
  const localHosts = new Set(["localhost", "127.0.0.1", "::1"]);

  if (window.location.protocol === "file:" || localHosts.has(window.location.hostname)) return;

  window.plausible =
    window.plausible ||
    function () {
      (window.plausible.q = window.plausible.q || []).push(arguments);
    };
  window.plausible.init =
    window.plausible.init ||
    function (options) {
      window.plausible.o = options || {};
    };
  window.plausible.init();

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://plausible.io/js/pa-a-5FpKEsjdwzckellU5PQ.js";
  document.head.appendChild(script);
})();

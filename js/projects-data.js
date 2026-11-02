// Project cards and case-study modals. Content follows the CV and the
// earlier case-study pages. Figures are drawn from the reported numbers
// (charts) or from the method steps (method index); nothing is invented.

var projectFigures = (() => {
  const W = 400;
  const H = 250;
  const svg = (body) =>
    `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">${body}</svg>`;
  const title = (text, sub) =>
    `<text class="fig-title" x="28" y="34">${text}</text>` +
    (sub ? `<text class="fig-sub" x="28" y="50">${sub}</text>` : "");

  // Horizontal bars on a 0–1 scale with labelled values.
  function bars({ heading, sub, rows }) {
    const x0 = 128;
    const span = 236;
    const top = 76;
    const gap = 46;
    let body = title(heading, sub);
    [0, 0.25, 0.5, 0.75, 1].forEach((tick) => {
      const x = x0 + span * tick;
      body += `<line class="fig-rule" x1="${x}" y1="${top - 10}" x2="${x}" y2="${top + gap * rows.length - 14}"/>`;
      body += `<text class="fig-tick" x="${x}" y="${top + gap * rows.length}" text-anchor="middle">${tick}</text>`;
    });
    rows.forEach(([label, value, strong, shown], i) => {
      const y = top + i * gap;
      body += `<text class="fig-label" x="28" y="${y + 15}">${label}</text>`;
      body += `<rect class="${strong ? "fig-bar-strong" : "fig-bar"}" x="${x0}" y="${y + 2}" width="${span * value}" height="18"/>`;
      body += `<text class="fig-value" x="${x0 + span * value - 6}" y="${y + 15}" text-anchor="end">${shown || value.toFixed(3)}</text>`;
    });
    return svg(body);
  }

  // Lollipops on a zoomed scale, so close metrics stay readable.
  function lollipops({ heading, sub, rows, min, max }) {
    const x0 = 128;
    const span = 236;
    const top = 84;
    const gap = 40;
    const at = (value) => x0 + ((value - min) / (max - min)) * span;
    let body = title(heading, sub);
    for (let tick = min; tick <= max + 1e-9; tick += 0.1) {
      const x = at(tick);
      body += `<line class="fig-rule" x1="${x}" y1="${top - 14}" x2="${x}" y2="${top + gap * (rows.length - 1) + 12}"/>`;
      body += `<text class="fig-tick" x="${x}" y="${top + gap * (rows.length - 1) + 30}" text-anchor="middle">${tick.toFixed(1)}</text>`;
    }
    rows.forEach(([label, value, strong], i) => {
      const y = top + i * gap;
      body += `<text class="fig-label" x="28" y="${y + 4}">${label}</text>`;
      body += `<line class="fig-stem" x1="${x0}" y1="${y}" x2="${at(value)}" y2="${y}"/>`;
      body += `<circle class="${strong ? "fig-dot-strong" : "fig-dot"}" cx="${at(value)}" cy="${y}" r="${strong ? 7 : 5.5}"/>`;
      body += `<text class="fig-value" x="${at(value) + 12}" y="${y + 4}">${value.toFixed(3)}</text>`;
    });
    return svg(body);
  }

  // Before/after slope chart.
  function slope({ heading, sub, left, right, rows, max }) {
    const xl = 120;
    const xr = 300;
    const top = 70;
    const bottom = 214;
    const at = (value) => bottom - (value / max) * (bottom - top);
    let body = title(heading, sub);
    body += `<line class="fig-axis" x1="${xl}" y1="${top - 6}" x2="${xl}" y2="${bottom}"/>`;
    body += `<line class="fig-axis" x1="${xr}" y1="${top - 6}" x2="${xr}" y2="${bottom}"/>`;
    body += `<text class="fig-tick" x="${xl}" y="${bottom + 18}" text-anchor="middle">${left}</text>`;
    body += `<text class="fig-tick" x="${xr}" y="${bottom + 18}" text-anchor="middle">${right}</text>`;
    rows.forEach(([label, from, to, strong]) => {
      const cls = strong ? "strong" : "soft";
      body += `<line class="fig-slope-${cls}" x1="${xl}" y1="${at(from)}" x2="${xr}" y2="${at(to)}"/>`;
      body += `<circle class="fig-dot${strong ? "-strong" : ""}" cx="${xl}" cy="${at(from)}" r="4.5"/>`;
      body += `<circle class="fig-dot${strong ? "-strong" : ""}" cx="${xr}" cy="${at(to)}" r="5.5"/>`;
      body += `<text class="fig-value" x="${xl - 10}" y="${at(from) + 4}" text-anchor="end">${from}</text>`;
      body += `<text class="fig-value" x="${xr + 10}" y="${at(to) + 4}">${to}</text>`;
      body += `<text class="fig-label" x="${xr + 50}" y="${at(to) + 4}">${label}</text>`;
    });
    return svg(body);
  }

  // Method index: numbered steps with dotted leaders, like a notebook contents page.
  function methodIndex({ heading, sub, steps, result }) {
    const top = 72;
    const gap = steps.length > 5 ? 22 : 25;
    let body = title(heading, sub);
    steps.forEach(([step, note], i) => {
      const y = top + i * gap;
      body += `<text class="fig-num" x="28" y="${y}">${String(i + 1).padStart(2, "0")}</text>`;
      body += `<text class="fig-step" x="56" y="${y}">${step}</text>`;
      body += `<line class="fig-leader" x1="${70 + step.length * 6.4}" y1="${y - 3}" x2="${364 - note.length * 6.1}" y2="${y - 3}"/>`;
      body += `<text class="fig-note" x="372" y="${y}" text-anchor="end">${note}</text>`;
    });
    const y = top + steps.length * gap + 8;
    body += `<line class="fig-axis" x1="28" y1="${y}" x2="372" y2="${y}"/>`;
    body += `<text class="fig-result" x="28" y="${y + 26}">${result}</text>`;
    return svg(body);
  }

  return {
    "bert-clip": {
      note: "reported results",
      svg: bars({
        heading: "MACRO-F1 · 500 SST-2 SENTENCES",
        sub: "whole-word Partition SHAP on both models",
        rows: [
          ["BERT (tuned)", 0.936, true],
          ["CLIP (0-shot)", 0.702, false],
          ["additivity", 1, false, "100%"],
        ],
      }),
    },
    siteguard: {
      note: "reported results",
      svg: lollipops({
        heading: "YOLO26n · HELD-OUT TEST SET",
        sub: "five PPE classes, worker-to-PPE matching",
        min: 0.7,
        max: 1,
        rows: [
          ["precision", 0.906, false],
          ["recall", 0.835, false],
          ["mAP50", 0.878, true],
        ],
      }),
    },
    banglacaption: {
      note: "reported results",
      svg: slope({
        heading: "RECALL@1 · BANGLACAPTION40K",
        sub: "tuning 0.33% of CLIP parameters",
        left: "baseline",
        right: "fine-tuned",
        max: 20,
        rows: [
          ["I→T", 6.17, 17.64, true],
          ["T→I", 1.59, 11.26, false],
        ],
      }),
    },
    reconstruction: {
      note: "method outline",
      svg: methodIndex({
        heading: "MULTI-VIEW PIPELINE · MATLAB",
        steps: [
          ["Calibrate cameras", "intrinsics"],
          ["Match features", "SIFT · SURF · ORB"],
          ["Verify matches", "RANSAC"],
          ["Two-view geometry", "F-matrix · pose"],
          ["Refine structure", "bundle adjust"],
        ],
        result: "672 tracks · 4.47 px reprojection",
      }),
    },
    "ppg-hrv": {
      note: "method outline",
      svg: methodIndex({
        heading: "PPG → HRV PIPELINE · PYTHON",
        steps: [
          ["Filter signal", "Butterworth"],
          ["Detect peaks", "adaptive"],
          ["Clean intervals", "IBI"],
          ["HRV features", "time · freq"],
          ["Test conditions", "Friedman · Wilcoxon"],
        ],
        result: "10 participants · baseline vs music",
      }),
    },
    "data-analysis": {
      note: "method outline",
      svg: methodIndex({
        heading: "NOTEBOOK STUDIES · PANDAS",
        steps: [
          ["Housing", "EDA"],
          ["Global COVID-19 outcomes", "EDA"],
          ["Mobile-app ratings", "EDA"],
          ["Clean, explore, plot", "each study"],
        ],
        result: "8 notebooks · written interpretation",
      }),
    },
  };
})();

var projects = [
  {
    id: "bert-clip",
    featured: true,
    status: { text: "Ongoing research", kind: "live" },
    context: "TRDP · Université de Bordeaux & UAM · 2026",
    title: "BERT vs CLIP with Whole-Word Partition SHAP",
    summary:
      "Do a fine-tuned BERT and a zero-shot CLIP text encoder rely on the same words? A reproducible SHAP comparison on 500 balanced SST-2 sentences.",
    metric: { value: "0.936", label: "BERT macro-F1, vs 0.702 for zero-shot CLIP" },
    tags: ["Python", "PyTorch", "BERT", "CLIP", "SHAP", "Bootstrap CI"],
    metrics: [
      ["0.936", "BERT macro-F1"],
      ["0.702", "CLIP macro-F1"],
      ["1,000", "explanation records"],
      ["100%", "additivity checks passed"],
    ],
    facts: [
      ["Context", "Tutored Research and Development Project (TRDP), Erasmus Mundus IPCVAI"],
      ["Supervisors", "Prof. Jenny Benois-Pineau (Université de Bordeaux) and Prof. Marcos Escudero-Viñolo (UAM)"],
      ["Data", "500 balanced sentences from SST-2"],
      ["Stack", "Python, PyTorch, BERT, CLIP, SHAP"],
    ],
    problem:
      "Attention maps are often read as explanations, but it is not clear that they show what a transformer actually relies on. The project asks whether attention-based explanations such as RFEM (Ayyar et al., 2025) stay faithful beyond Vision Transformers, and how they compare with perturbation-based Partition SHAP on the same inputs.",
    approach: [
      "Evaluated a fine-tuned BERT classifier and a frozen zero-shot CLIP text encoder on the same 500 balanced SST-2 sentences.",
      "Generated whole-word Partition SHAP explanations for NEG, POS, and decision-margin outputs: 1,000 explanation records.",
      "Checked the explanations with additivity, deletion-based faithfulness, rationale proxies, cross-model agreement, bootstrap confidence intervals, and runtime.",
    ],
    results: [
      "BERT reached 0.936 macro-F1 versus 0.702 for zero-shot CLIP.",
      "Both models passed every additivity check.",
      "Key finding: attention-sink tokens can hide the words that actually drive BERT and CLIP predictions.",
    ],
    links: [["Related BERT SHAP repository", "https://github.com/GourabRoy551/bert_shap"]],
  },
  {
    id: "siteguard",
    status: { text: "In development", kind: "live" },
    context: "Team project · Bordeaux · Sep 2026 – Present",
    title: "SiteGuard AI: PPE Detection for Construction Safety",
    summary:
      "Five-class PPE detection with worker-to-PPE matching, comparing YOLO26n/s and YOLOv8n, served through FastAPI and Docker.",
    metric: { value: "0.878", label: "mAP50 on the held-out test set" },
    tags: ["YOLO26n/s", "YOLOv8n", "PyTorch", "OpenCV", "FastAPI", "Docker", "pytest"],
    metrics: [
      ["0.878", "mAP50"],
      ["0.906", "precision"],
      ["0.835", "recall"],
      ["27", "automated tests"],
    ],
    facts: [
      ["Role", "Leading the machine-learning part of a team project"],
      ["Classes", "Person, helmet, vest, no-helmet, no-vest"],
      ["Models", "YOLO26n, YOLO26s, and YOLOv8n"],
      ["Stack", "PyTorch, OpenCV, FastAPI, Docker, pytest"],
    ],
    problem:
      "Construction sites need a reliable way to check whether each worker wears the required protective equipment. SiteGuard detects workers, helmets, and vests in images and video, then decides for each worker whether the required PPE is present.",
    approach: [
      "Trained and compared YOLO26n/s and YOLOv8n detectors for the five classes.",
      "Worker-to-PPE association turns per-object detections into per-worker compliance.",
      "Packaged local inference with image and video runners, structured JSON outputs, model checksums, and a model card, served through FastAPI and Docker.",
      "Covered the package with 27 automated pytest tests.",
    ],
    results: ["The YOLO26n model reached 0.906 precision, 0.835 recall, and 0.878 mAP50 on the held-out test set."],
    links: [["AI package on GitHub", "https://github.com/zunaaaaayed/SiteGuard-AI/tree/AI-Model/AI"]],
  },
  {
    id: "banglacaption",
    status: { text: "Completed", kind: "done" },
    context: "Multimodal retrieval · 2026",
    title: "BanglaCaption40K: Bengali Image-Text Retrieval",
    summary:
      "A Bengali image-text benchmark of 43,868 images and 217,526 captions, with parameter-efficient CLIP fine-tuning.",
    metric: { value: "17.64", label: "image-to-text R@1, up from 6.17" },
    tags: ["CLIP", "PyTorch", "Image-text retrieval", "Parameter-efficient tuning"],
    metrics: [
      ["43,868", "images"],
      ["217,526", "Bengali captions"],
      ["6.17 → 17.64", "image-to-text R@1"],
      ["1.59 → 11.26", "text-to-image R@1"],
    ],
    facts: [
      ["Task", "Image-text retrieval in Bengali"],
      ["Model", "CLIP with lightweight fine-tuning (0.33% of the parameters)"],
      ["Analysis", "Token ablation, patch perturbation, and error analysis"],
      ["Stack", "Python, PyTorch, CLIP"],
    ],
    problem:
      "Vision-language retrieval is far less studied for Bengali than for English. BanglaCaption40K provides a benchmark to measure it and a baseline to improve on.",
    approach: [
      "Built a benchmark of 43,868 images with 217,526 Bengali captions.",
      "Fine-tuned CLIP lightly, updating 0.33% of its parameters.",
      "Analysed model behaviour with token ablation, patch perturbation, and error analysis.",
    ],
    results: ["Image-to-text R@1 rose from 6.17 to 17.64.", "Text-to-image R@1 rose from 1.59 to 11.26."],
    links: [],
  },
  {
    id: "reconstruction",
    status: { text: "Code available", kind: "done" },
    context: "3DVMMC Lab · UAM Madrid · 2026",
    title: "Calibrated Multi-View 3D Reconstruction",
    summary: "A MATLAB pipeline from camera calibration to bundle adjustment for sparse multi-view 3D reconstruction.",
    metric: { value: "4.47 px", label: "reprojection error over 672 tracks" },
    tags: ["MATLAB", "RANSAC", "Bundle adjustment", "Epipolar geometry"],
    metrics: [
      ["4.47 px", "reprojection error"],
      ["672", "multi-view tracks"],
    ],
    facts: [
      ["Course", "Vision for Multiple or Moving Cameras (3DVMMC), UAM Madrid"],
      ["Stack", "MATLAB"],
    ],
    problem:
      "Recover sparse 3D structure and camera poses from several calibrated views of the same scene.",
    approach: [
      "Camera calibration, then SIFT, SURF, and ORB feature matching with RANSAC verification.",
      "Fundamental-matrix estimation, epipolar geometry, and pose estimation.",
      "Sparse reconstruction refined with bundle adjustment.",
    ],
    results: ["The final reconstruction retained 672 tracks with 4.47 px reprojection error."],
    links: [["Repository", "https://github.com/GourabRoy551/Calibrated-Multi-View-3D-Reconstruction"]],
  },
  {
    id: "ppg-hrv",
    status: { text: "Code available", kind: "done" },
    context: "BMSP · PPKE Budapest · Dec 2025",
    title: "Cardiac Autonomic Assessment via PPG-Derived HRV",
    summary: "PPG-derived heart-rate variability under personalised music for 10 participants, with statistical testing.",
    metric: { value: "10", label: "participants, baseline vs music conditions" },
    tags: ["Python", "NumPy", "SciPy", "Signal processing", "Statistical testing"],
    metrics: [["10", "participants"]],
    facts: [
      ["Course", "Biomedical Signal Processing (BMSP), PPKE Budapest"],
      ["Stack", "Python, NumPy, SciPy"],
    ],
    problem:
      "Measure how heart-rate variability derived from PPG changes between a baseline condition and personalised music conditions.",
    approach: [
      "Modular Python pipeline with Butterworth filtering, adaptive peak detection, and IBI cleaning.",
      "Time- and frequency-domain HRV features.",
      "Friedman and Wilcoxon tests, plus an individual responsiveness classifier.",
    ],
    results: ["A repeatable pipeline from raw PPG to per-participant HRV statistics across conditions."],
    links: [["Repository", "https://github.com/GourabRoy551/cardiac-autonomic-ppg-hrv"]],
  },
  {
    id: "data-analysis",
    wide: true,
    status: { text: "Code available", kind: "done" },
    context: "Data analysis portfolio",
    title: "Exploratory Analysis and Visualization",
    summary:
      "Eight notebook studies covering housing, global COVID-19 outcomes, and mobile-app ratings, with repeatable cleaning and written interpretation.",
    metric: { value: "8", label: "notebook-based studies" },
    tags: ["Python", "Pandas", "Matplotlib", "Jupyter"],
    metrics: [["8", "notebook studies"]],
    facts: [
      ["Topics", "Housing, global COVID-19 outcomes, mobile-app ratings"],
      ["Stack", "Python, Pandas, Matplotlib, Jupyter"],
    ],
    problem: "Turn raw public datasets into clear, defensible findings.",
    approach: [
      "Repeatable cleaning for each dataset.",
      "Exploratory analysis and visualization.",
      "Written interpretation of each result.",
    ],
    results: ["Eight self-contained notebooks, each from raw data to written conclusions."],
    links: [["Repository", "https://github.com/GourabRoy551/DataVisualization"]],
  },
];

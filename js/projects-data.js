// Project cards and case-study modals. Content follows the CV and the
// earlier case-study pages; illustrations are schematic, not results.

var projectArt = {
  shap: `
    <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <text class="art-text" x="40" y="46">BERT · fine-tuned</text>
      <text class="art-text" x="226" y="46">CLIP · zero-shot</text>
      <g>
        <text class="art-text" x="40" y="80">a</text>
        <rect class="art-fill-soft" x="92" y="71" width="14" height="12" rx="2"/>
        <text class="art-text" x="40" y="104">deeply</text>
        <rect class="art-fill-accent" x="92" y="95" width="62" height="12" rx="2"/>
        <text class="art-text" x="40" y="128">moving</text>
        <rect class="art-fill-accent" x="92" y="119" width="88" height="12" rx="2"/>
        <text class="art-text" x="40" y="152">but</text>
        <rect class="art-fill-warm" x="92" y="143" width="26" height="12" rx="2"/>
        <text class="art-text" x="40" y="176">slow</text>
        <rect class="art-fill-warm" x="92" y="167" width="44" height="12" rx="2"/>
        <text class="art-text" x="40" y="200">film</text>
        <rect class="art-fill-soft" x="92" y="191" width="10" height="12" rx="2"/>
      </g>
      <g>
        <text class="art-text" x="226" y="80">a</text>
        <rect class="art-fill-soft" x="278" y="71" width="40" height="12" rx="2"/>
        <text class="art-text" x="226" y="104">deeply</text>
        <rect class="art-fill-accent" x="278" y="95" width="30" height="12" rx="2"/>
        <text class="art-text" x="226" y="128">moving</text>
        <rect class="art-fill-accent" x="278" y="119" width="52" height="12" rx="2"/>
        <text class="art-text" x="226" y="152">but</text>
        <rect class="art-fill-warm-soft" x="278" y="143" width="12" height="12" rx="2"/>
        <text class="art-text" x="226" y="176">slow</text>
        <rect class="art-fill-warm" x="278" y="167" width="20" height="12" rx="2"/>
        <text class="art-text" x="226" y="200">film</text>
        <rect class="art-fill-soft" x="278" y="191" width="34" height="12" rx="2"/>
      </g>
      <line class="art-line" x1="200" y1="60" x2="200" y2="212" stroke-dasharray="3 4"/>
    </svg>`,
  ppe: `
    <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <line class="art-line" x1="20" y1="214" x2="380" y2="214"/>
      <g fill="none" stroke-width="2" class="art-ink">
        <circle cx="128" cy="92" r="13"/>
        <path d="M128 105 L128 160 M128 118 L106 142 M128 118 L150 142 M128 160 L112 208 M128 160 L144 208"/>
        <circle cx="268" cy="96" r="13"/>
        <path d="M268 109 L268 164 M268 122 L246 146 M268 122 L290 146 M268 164 L252 208 M268 164 L284 208"/>
      </g>
      <path class="art-fill-warm" d="M113 88 Q128 66 143 88 Z"/>
      <rect class="art-fill-warm-soft" x="117" y="114" width="22" height="34" rx="3"/>
      <g fill="none" stroke-width="1.5">
        <rect class="art-accent" x="92" y="62" width="72" height="152" rx="2"/>
        <rect class="art-warm" x="108" y="70" width="40" height="24" rx="2"/>
        <rect class="art-accent" x="232" y="66" width="72" height="148" rx="2"/>
        <rect class="art-warm" x="250" y="78" width="36" height="32" rx="2" stroke-dasharray="4 3"/>
      </g>
      <rect class="art-fill-accent" x="92" y="48" width="86" height="14"/>
      <text x="96" y="58" style="fill:var(--bg);font:10px var(--font-mono)">person ✓ PPE</text>
      <rect class="art-fill-warm" x="232" y="52" width="70" height="14"/>
      <text x="236" y="62" style="fill:#fff;font:10px var(--font-mono)">no-helmet</text>
    </svg>`,
  retrieval: `
    <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <rect class="art-fill-surface art-ink" x="34" y="56" width="120" height="96" rx="4" fill-opacity="1" stroke-width="1.5"/>
      <path class="art-fill-soft" d="M34 152 L74 104 L100 130 L120 112 L154 152 Z"/>
      <circle class="art-fill-warm" cx="128" cy="80" r="10"/>
      <g class="art-line" stroke-width="6" stroke-linecap="round">
        <line x1="34" y1="176" x2="150" y2="176"/>
        <line x1="34" y1="194" x2="118" y2="194"/>
      </g>
      <text class="art-text" x="34" y="44">image ↔ বাংলা caption</text>
      <path class="art-accent" fill="none" stroke-width="1.5" d="M166 120 C190 120 196 120 214 120" marker-end="url(#arrowR)"/>
      <defs>
        <marker id="arrowR" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" class="art-fill-accent"/></marker>
      </defs>
      <g transform="translate(226 52)">
        <rect class="art-fill-soft" width="140" height="140"/>
        <g class="art-fill-accent">
          <rect x="0" y="0" width="28" height="28"/>
          <rect x="28" y="28" width="28" height="28"/>
          <rect x="56" y="56" width="28" height="28" opacity="0.7"/>
          <rect x="84" y="84" width="28" height="28"/>
          <rect x="112" y="112" width="28" height="28" opacity="0.8"/>
        </g>
        <rect class="art-fill-warm" x="84" y="28" width="28" height="28" opacity="0.6"/>
        <rect class="art-line" fill="none" width="140" height="140"/>
      </g>
      <text class="art-text" x="226" y="210">similarity matrix · R@1</text>
    </svg>`,
  geometry: `
    <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <g class="art-line" stroke-width="1">
        <line x1="70" y1="196" x2="200" y2="96"/><line x1="70" y1="196" x2="230" y2="120"/><line x1="70" y1="196" x2="182" y2="132"/>
        <line x1="330" y1="196" x2="200" y2="96"/><line x1="330" y1="196" x2="230" y2="120"/><line x1="330" y1="196" x2="182" y2="132"/>
        <line x1="200" y1="226" x2="200" y2="96"/><line x1="200" y1="226" x2="230" y2="120"/><line x1="200" y1="226" x2="182" y2="132"/>
      </g>
      <g class="art-ink" fill="none" stroke-width="1.6">
        <path d="M56 186 L84 186 L70 206 Z"/>
        <path d="M316 186 L344 186 L330 206 Z"/>
        <path d="M188 214 L212 214 L200 234 Z"/>
      </g>
      <g class="art-fill-accent">
        <circle cx="200" cy="96" r="4"/><circle cx="230" cy="120" r="4"/><circle cx="182" cy="132" r="4"/>
        <circle cx="214" cy="80" r="2.5"/><circle cx="246" cy="98" r="2.5"/><circle cx="168" cy="108" r="2.5"/>
        <circle cx="190" cy="70" r="2"/><circle cx="222" cy="142" r="2.5"/><circle cx="160" cy="88" r="2"/>
        <circle cx="252" cy="130" r="2"/><circle cx="236" cy="66" r="2"/>
      </g>
      <circle class="art-warm" cx="230" cy="120" r="9" fill="none" stroke-width="1.5"/>
      <text class="art-text" x="244" y="152">reprojected track</text>
      <text class="art-text" x="34" y="44">calibrate → match → RANSAC → bundle adjust</text>
    </svg>`,
  signal: `
    <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <line class="art-line" x1="24" y1="150" x2="376" y2="150"/>
      <path class="art-accent" fill="none" stroke-width="2" stroke-linejoin="round"
        d="M24 150 C40 150 44 148 52 140 C60 92 66 92 72 140 C78 168 92 160 104 150 C118 142 122 140 130 132 C138 86 144 86 150 132 C156 164 170 158 182 150 C196 142 200 140 210 130 C218 80 224 80 230 130 C236 164 250 158 262 150 C276 142 280 140 288 134 C296 90 302 90 308 134 C314 164 328 158 340 150 C352 144 362 150 376 150"/>
      <g class="art-fill-warm">
        <circle cx="62" cy="104" r="4"/><circle cx="140" cy="98" r="4"/><circle cx="220" cy="92" r="4"/><circle cx="298" cy="100" r="4"/>
      </g>
      <g class="art-ink" stroke-width="1" fill="none">
        <path d="M62 190 L140 190 M62 184 L62 196 M140 184 L140 196"/>
        <path d="M140 210 L220 210 M140 204 L140 216 M220 204 L220 216"/>
        <path d="M220 190 L298 190 M220 184 L220 196 M298 184 L298 196"/>
      </g>
      <text class="art-text" x="88" y="184">IBI</text>
      <text class="art-text" x="168" y="226">IBI</text>
      <text class="art-text" x="248" y="184">IBI</text>
      <text class="art-text" x="24" y="44">PPG → peaks → inter-beat intervals → HRV</text>
    </svg>`,
  charts: `
    <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <line class="art-line" x1="40" y1="200" x2="190" y2="200"/>
      <line class="art-line" x1="40" y1="60" x2="40" y2="200"/>
      <g class="art-fill-accent">
        <rect x="54" y="140" width="20" height="60"/><rect x="84" y="104" width="20" height="96"/>
        <rect x="114" y="122" width="20" height="78" opacity="0.7"/><rect x="144" y="78" width="20" height="122"/>
      </g>
      <line class="art-line" x1="220" y1="200" x2="370" y2="200"/>
      <line class="art-line" x1="220" y1="60" x2="220" y2="200"/>
      <g class="art-fill-ink" opacity="0.7">
        <circle cx="236" cy="182" r="3"/><circle cx="252" cy="170" r="3"/><circle cx="262" cy="176" r="3"/>
        <circle cx="280" cy="150" r="3"/><circle cx="296" cy="140" r="3"/><circle cx="306" cy="148" r="3"/>
        <circle cx="322" cy="118" r="3"/><circle cx="338" cy="110" r="3"/><circle cx="352" cy="92" r="3"/>
        <circle cx="270" cy="160" r="3"/><circle cx="330" cy="126" r="3"/>
      </g>
      <line class="art-warm" x1="228" y1="190" x2="364" y2="88" stroke-width="2"/>
      <text class="art-text" x="40" y="44">clean → explore → visualise</text>
    </svg>`,
};

var projects = [
  {
    id: "bert-clip",
    art: "shap",
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
    art: "ppe",
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
    art: "retrieval",
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
    art: "geometry",
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
    art: "signal",
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
    art: "charts",
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

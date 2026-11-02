// Neural network + XAI background. A small feed-forward network runs a loop:
//   1. forward pass: activations travel from an input "image" patch to the outputs;
//   2. explanation: relevance (LRP, z+ rule) flows back from the predicted class,
//      lighting edges and nodes by how much they contributed;
//   3. the input patch turns into a saliency map, and a bracket marks its peak.
// Hovering a node shows its activation and relevance. Calmer as the reader scrolls.
class NeuralCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.mouse = { x: null, y: null };
    this.frame = null;
    this.isRunning = false;
    this.tick = 0;
    this.palette = null;
    this.cycle = 10000;
    this.cycleStart = null;
    this.cycleIndex = 0;
    this.isHome = !!document.querySelector("main#home");
    this.resize = this.resize.bind(this);
    this.draw = this.draw.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.clearPointer = this.clearPointer.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
  }

  start() {
    if (!this.context) return;

    this.resize();
    window.addEventListener("resize", this.resize);
    window.addEventListener("mousemove", this.handlePointerMove);
    window.addEventListener("mouseleave", this.clearPointer);
    window.addEventListener("touchend", this.clearPointer);
    document.addEventListener("visibilitychange", this.handleVisibilityChange);

    // Rebuild the colours when the theme changes.
    new MutationObserver(() => {
      this.palette = null;
      if (prefersReducedMotion) this.drawStatic();
    }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    if (prefersReducedMotion) {
      this.drawStatic();
    } else {
      this.resume();
    }
  }

  // ── Colours ──
  parseColor(value, fallback) {
    const probe = this.probe || (this.probe = document.createElement("canvas").getContext("2d"));
    probe.fillStyle = fallback;
    probe.fillStyle = value || fallback;
    const normalized = probe.fillStyle;
    if (normalized.startsWith("#")) {
      const hex = normalized.slice(1);
      return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
    }
    const parts = normalized.match(/[\d.]+/g) || [0, 0, 0];
    return parts.slice(0, 3).map(Number);
  }

  colors() {
    if (this.palette) return this.palette;

    const styles = getComputedStyle(document.documentElement);
    const read = (name, fallback) => this.parseColor(styles.getPropertyValue(name).trim(), fallback);
    const rgb = (c) => `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
    const stops = [
      [0, read("--heat-cold", "#5a6b8c")],
      [0.38, read("--heat-low", "#67e0f5")],
      [0.7, read("--heat-mid", "#a594ff")],
      [1, read("--heat-high", "#f6c870")],
    ];

    // 33-step lookup table: heat value -> colour.
    const lut = [];
    for (let i = 0; i <= 32; i += 1) {
      const h = i / 32;
      let k = 0;
      while (k < stops.length - 2 && h > stops[k + 1][0]) k += 1;
      const [h0, c0] = stops[k];
      const [h1, c1] = stops[k + 1];
      const f = Math.min(Math.max((h - h0) / (h1 - h0), 0), 1);
      lut.push(rgb(c0.map((v, j) => Math.round(v + (c1[j] - v) * f))));
    }

    this.palette = {
      lut,
      accent: rgb(read("--accent", "#1d6a5b")),
      warm: rgb(read("--accent-2", "#a95a24")),
      ink: rgb(read("--ink-3", "#6f7873")),
      text: rgb(read("--ink-2", "#47524e")),
      surface: rgb(read("--surface", "#fbf8f1")),
      alphaScale: document.documentElement.dataset.theme === "dark" ? 1 : 0.9,
    };
    return this.palette;
  }

  // ── Network ──
  random(seed) {
    // mulberry32: the same layout on every visit and resize.
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  build(width, height) {
    const rand = this.random(551);
    const compact = this.isCompact;
    const grid = compact ? 4 : 5;
    const hidden = compact ? [5, 5] : [7, 7, 5];
    const outputs = 3;

    // Desktop: the input patch sits top-left of the network, in the open space
    // above the hero name, so the hero text stays clear of the busiest drawing.
    const x0 = width * (compact ? 0.08 : 0.44);
    const x1 = width * (compact ? 0.9 : 0.93);
    const y0 = height * (compact ? 0.1 : 0.15);
    const y1 = height * (compact ? 0.56 : 0.88);
    const midY = (y0 + y1) / 2;

    const tile = Math.min((y1 - y0) / (grid * 1.9), compact ? 20 : 24);
    const gap = Math.max(2, tile * 0.12);
    const patch = grid * tile + (grid - 1) * gap;

    this.patch = { x: x0, y: compact ? midY - patch / 2 : y0, size: patch, tile, gap, grid };
    this.layers = [];

    // Layer 0: one node per pixel tile of the input patch.
    const inputs = [];
    for (let r = 0; r < grid; r += 1) {
      for (let c = 0; c < grid; c += 1) {
        inputs.push({
          x: x0 + c * (tile + gap) + tile / 2,
          y: this.patch.y + r * (tile + gap) + tile / 2,
          r: 0,
          c,
          row: r,
          act: 0,
          rel: 0,
        });
      }
    }
    this.layers.push(inputs);

    const sizes = [...hidden, outputs];
    const first = x0 + patch + (x1 - x0 - patch) / (sizes.length + 0.2);
    const step = (x1 - first) / (sizes.length - 1);
    sizes.forEach((count, index) => {
      const x = first + step * index;
      const span = Math.min(y1 - y0, count * (compact ? 44 : 78));
      const layer = [];
      for (let i = 0; i < count; i += 1) {
        const y = midY - span / 2 + (count === 1 ? span / 2 : (span * i) / (count - 1));
        layer.push({ x: x + (rand() - 0.5) * 14, y: y + (rand() - 0.5) * 10, r: index === sizes.length - 1 ? 5 : 3.4, act: 0, rel: 0 });
      }
      this.layers.push(layer);
    });

    // Fully connected edges between consecutive layers.
    this.edges = [];
    for (let l = 0; l < this.layers.length - 1; l += 1) {
      const pair = [];
      this.layers[l].forEach((from, i) => {
        this.layers[l + 1].forEach((to, j) => {
          pair.push({ from, to, i, j, w: rand() * 2 - 1, rel: 0, hot: false });
        });
      });
      this.edges.push(pair);
    }
    this.biases = this.layers.map((layer) => layer.map(() => (rand() - 0.5) * 0.6));
    this.runPass();
  }

  runPass() {
    const rand = this.random(1000 + this.cycleIndex * 17);
    const grid = this.patch.grid;

    // A new input "image": two soft objects somewhere in the patch.
    const objects = [0, 1].map((k) => ({
      u: 0.15 + rand() * 0.7,
      v: 0.15 + rand() * 0.7,
      s: 0.16 + rand() * 0.1,
      a: k === 0 ? 1 : 0.65,
    }));
    this.layers[0].forEach((node) => {
      const u = (node.c + 0.5) / grid;
      const v = (node.row + 0.5) / grid;
      let value = 0.06 + rand() * 0.06;
      objects.forEach((o) => {
        value += o.a * Math.exp(-((u - o.u) ** 2 + (v - o.v) ** 2) / (2 * o.s * o.s));
      });
      node.act = Math.min(1, value);
    });

    // Forward pass with sigmoid units; softmax at the output.
    for (let l = 1; l < this.layers.length; l += 1) {
      const fanIn = this.layers[l - 1].length;
      const z = this.layers[l].map((_, j) => this.biases[l][j]);
      this.edges[l - 1].forEach((edge) => {
        z[edge.j] += edge.from.act * edge.w;
      });
      if (l === this.layers.length - 1) {
        const scaled = z.map((value) => (value * 3) / Math.sqrt(fanIn));
        const max = Math.max(...scaled);
        const exp = scaled.map((value) => Math.exp(value - max));
        const sum = exp.reduce((a, b) => a + b, 0);
        this.layers[l].forEach((node, j) => (node.act = exp[j] / sum));
      } else {
        this.layers[l].forEach((node, j) => (node.act = 1 / (1 + Math.exp((-z[j] * 3.2) / Math.sqrt(fanIn)))));
      }
    }

    const outputs = this.layers[this.layers.length - 1];
    this.prediction = outputs.reduce((best, node, j) => (node.act > outputs[best].act ? j : best), 0);

    // Relevance: LRP z+ rule from the predicted output back to the pixels.
    this.layers.forEach((layer) => layer.forEach((node) => (node.rel = 0)));
    outputs[this.prediction].rel = 1;
    for (let l = this.edges.length - 1; l >= 0; l -= 1) {
      const pair = this.edges[l];
      const denom = new Array(this.layers[l + 1].length).fill(1e-6);
      pair.forEach((edge) => {
        if (edge.w > 0) denom[edge.j] += edge.from.act * edge.w;
      });
      pair.forEach((edge) => {
        edge.rel = edge.w > 0 ? ((edge.from.act * edge.w) / denom[edge.j]) * edge.to.rel : 0;
        edge.from.rel += edge.rel;
        edge.hot = edge.w > 0.3 && edge.from.act > 0.5;
      });
    }

    // Normalise for display: per layer for nodes, per layer pair for edges.
    const total = this.layers[0].reduce((sum, node) => sum + node.rel, 0) || 1;
    this.layers[0].forEach((node) => (node.share = node.rel / total));
    this.layers.forEach((layer) => {
      const max = Math.max(...layer.map((node) => node.rel)) || 1;
      layer.forEach((node) => (node.relN = Math.sqrt(node.rel / max)));
    });
    this.edges.forEach((pair) => {
      const max = Math.max(...pair.map((edge) => edge.rel)) || 1;
      pair.forEach((edge) => (edge.relN = Math.sqrt(edge.rel / max)));
    });
    this.peak = this.layers[0].reduce((best, node) => (node.rel > best.rel ? node : best), this.layers[0][0]);
  }

  resize() {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.canvas.width = Math.floor(width * pixelRatio);
    this.canvas.height = Math.floor(height * pixelRatio);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    this.isCompact = width < 760;
    this.build(width, height);

    if (prefersReducedMotion) {
      this.drawStatic();
    }
  }

  // ── Input ──
  handlePointerMove(event) {
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;
  }

  clearPointer() {
    this.mouse.x = null;
    this.mouse.y = null;
  }

  handleVisibilityChange() {
    if (document.hidden) {
      this.pause();
    } else {
      this.resume();
    }
  }

  pause() {
    this.isRunning = false;
    if (this.frame) {
      cancelAnimationFrame(this.frame);
      this.frame = null;
    }
  }

  resume() {
    if (prefersReducedMotion || this.isRunning || document.hidden) return;
    this.isRunning = true;
    this.cycleStart = null;
    this.draw();
  }

  intensity() {
    // Strongest behind the hero; fades as the reader scrolls into text.
    const base = this.isHome ? 1 : 0.7;
    const scroll = window.scrollY || 0;
    const fade = Math.max(0.38, 1 - scroll / (window.innerHeight * 1.4));
    return base * fade * (this.isCompact ? 0.7 : 1);
  }

  // ── Drawing ──
  paint(now, { staticFrame = false } = {}) {
    const ctx = this.context;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const colors = this.colors();
    const { lut } = colors;
    const I = this.intensity() * colors.alphaScale;
    const clamp = (value) => Math.min(Math.max(value, 0), 1);

    let t;
    if (staticFrame) {
      t = 8800; // explanation complete, before the fade
    } else {
      if (this.cycleStart === null) this.cycleStart = now;
      if (now - this.cycleStart >= this.cycle) {
        this.cycleStart = now;
        this.cycleIndex += 1;
        this.runPass();
      }
      t = now - this.cycleStart;
    }

    const depth = this.layers.length - 1;
    const forward = clamp(t / 4200) * depth; // layer index the forward front has reached
    const explaining = t >= 5000;
    const back = explaining ? depth * (1 - clamp((t - 5000) / 3600)) : depth + 1; // backward front
    const fade = t > 9200 ? 1 - (t - 9200) / 800 : 1;
    const forwardDim = explaining ? Math.max(0.3, 1 - (t - 5000) / 700) : 1;

    ctx.clearRect(0, 0, width, height);
    ctx.lineCap = "round";

    // 1. Wiring: every connection, faint.
    ctx.globalAlpha = 0.2 * I;
    ctx.strokeStyle = colors.ink;
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    this.edges.forEach((pair) =>
      pair.forEach((edge) => {
        ctx.moveTo(edge.from.x, edge.from.y);
        ctx.lineTo(edge.to.x, edge.to.y);
      })
    );
    ctx.stroke();

    // 2. Forward pass: strong connections carry pulses to the right.
    ctx.strokeStyle = colors.accent;
    ctx.fillStyle = colors.accent;
    this.edges.forEach((pair, l) => {
      const progress = forward - l;
      if (progress <= 0) return;
      const reach = Math.min(1, progress);
      pair.forEach((edge) => {
        if (!edge.hot) return;
        const x = edge.from.x + (edge.to.x - edge.from.x) * reach;
        const y = edge.from.y + (edge.to.y - edge.from.y) * reach;
        ctx.globalAlpha = 0.5 * edge.from.act * edge.w * I * forwardDim * fade;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(edge.from.x, edge.from.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        if (reach < 1) {
          ctx.globalAlpha = 0.9 * I;
          ctx.beginPath();
          ctx.arc(x, y, 1.9, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    });

    // 3. Explanation: relevance flows back along the edges that mattered.
    if (explaining) {
      this.edges.forEach((pair, l) => {
        const reach = clamp(l + 1 - back);
        if (reach <= 0) return;
        pair.forEach((edge) => {
          if (edge.relN < 0.12) return;
          const x = edge.to.x + (edge.from.x - edge.to.x) * reach;
          const y = edge.to.y + (edge.from.y - edge.to.y) * reach;
          ctx.strokeStyle = lut[Math.round(edge.relN * 32)];
          ctx.globalAlpha = (0.2 + 0.65 * edge.relN) * I * fade;
          ctx.lineWidth = 0.6 + 2.6 * edge.relN;
          ctx.beginPath();
          ctx.moveTo(edge.to.x, edge.to.y);
          ctx.lineTo(x, y);
          ctx.stroke();
          if (reach < 1 && edge.relN > 0.45) {
            ctx.fillStyle = lut[32];
            ctx.globalAlpha = 0.9 * I * fade;
            ctx.beginPath();
            ctx.arc(x, y, 2.2, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      });
    }

    // 4. Neurons: activation fill on the way forward, relevance halo on the way back.
    for (let l = 1; l <= depth; l += 1) {
      this.layers[l].forEach((node) => {
        ctx.globalAlpha = 0.95 * I;
        ctx.fillStyle = colors.surface;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.55 * I;
        ctx.strokeStyle = colors.ink;
        ctx.lineWidth = 1;
        ctx.stroke();

        if (forward >= l) {
          ctx.globalAlpha = node.act * 0.85 * I * forwardDim * fade;
          ctx.fillStyle = colors.accent;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.r * 0.72, 0, Math.PI * 2);
          ctx.fill();
        }

        if (explaining && back <= l && node.relN > 0.05) {
          const color = lut[Math.round(node.relN * 32)];
          ctx.globalAlpha = node.relN * 0.85 * I * fade;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.r * 0.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = node.relN * 0.5 * I * fade;
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.r + 3 + node.relN * 10, 0, Math.PI * 2);
          ctx.stroke();
        }
      });
    }

    // 5. Input patch: the image while predicting, the saliency map once explained.
    const { tile } = this.patch;
    const saliency = explaining ? clamp((0.7 - back) / 0.7) * fade : 0;
    this.layers[0].forEach((node) => {
      const left = node.x - tile / 2;
      const top = node.y - tile / 2;
      ctx.globalAlpha = (0.14 + 0.5 * node.act) * I * (1 - saliency * 0.7);
      ctx.fillStyle = lut[Math.round(node.act * 13)];
      ctx.fillRect(left, top, tile, tile);
      if (saliency > 0) {
        ctx.globalAlpha = saliency * (0.15 + 0.8 * node.relN) * I;
        ctx.fillStyle = lut[Math.round(node.relN * 32)];
        ctx.fillRect(left, top, tile, tile);
      }
      ctx.globalAlpha = 0.28 * I;
      ctx.strokeStyle = colors.ink;
      ctx.lineWidth = 0.6;
      ctx.strokeRect(left + 0.5, top + 0.5, tile - 1, tile - 1);
    });

    ctx.font = '500 10px "IBM Plex Mono", ui-monospace, monospace';
    ctx.textBaseline = "middle";

    if (saliency > 0.4) this.paintBracket(ctx, this.peak, colors, I * saliency);

    // 6. Output probabilities once the forward pass arrives.
    if (forward >= depth) {
      const outputs = this.layers[depth];
      outputs.forEach((node, j) => {
        const isPred = j === this.prediction;
        ctx.globalAlpha = (isPred ? 0.95 : 0.55) * I * fade;
        ctx.fillStyle = isPred ? colors.warm : colors.text;
        ctx.fillText(`${isPred ? "pred " : "p "}${node.act.toFixed(2)}`, node.x + node.r + 8, node.y);
      });
    }

    // 7. Captions.
    ctx.globalAlpha = 0.75 * I;
    ctx.fillStyle = colors.text;
    const caption = explaining ? "← relevance propagation · LRP" : "forward pass →";
    ctx.fillText(caption, this.patch.x, this.patch.y - 16);
    ctx.globalAlpha = 0.5 * I;
    ctx.fillText(saliency > 0.4 ? "saliency map" : "input", this.patch.x, this.patch.y + this.patch.size + 16);

    if (!staticFrame) this.paintProbe(ctx, colors, I);
    ctx.globalAlpha = 1;
  }

  paintBracket(ctx, node, colors, alpha) {
    const span = this.patch.tile + 10;
    const left = node.x - span / 2;
    const top = node.y - span / 2;
    const arm = 6;

    ctx.globalAlpha = 0.9 * alpha;
    ctx.strokeStyle = colors.warm;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(left, top + arm);
    ctx.lineTo(left, top);
    ctx.lineTo(left + arm, top);
    ctx.moveTo(left + span - arm, top);
    ctx.lineTo(left + span, top);
    ctx.lineTo(left + span, top + arm);
    ctx.moveTo(left + span, top + span - arm);
    ctx.lineTo(left + span, top + span);
    ctx.lineTo(left + span - arm, top + span);
    ctx.moveTo(left + arm, top + span);
    ctx.lineTo(left, top + span);
    ctx.lineTo(left, top + span - arm);
    ctx.stroke();

    const label = `R ${node.share.toFixed(2)}`;
    // Label sits beside the bracket so it never collides with the caption above.
    const labelWidth = ctx.measureText(label).width + 10;
    const labelX = left + span + 6;
    const labelY = top + span / 2;
    ctx.fillStyle = colors.warm;
    ctx.fillRect(labelX, labelY - 7, labelWidth, 14);
    ctx.fillStyle = "#fff";
    ctx.fillText(label, labelX + 5, labelY);
  }

  paintProbe(ctx, colors, I) {
    if (this.mouse.x === null || this.isCompact) return;

    let nearest = null;
    let best = 30 * 30;
    this.layers.forEach((layer, l) =>
      layer.forEach((node) => {
        const d = (node.x - this.mouse.x) ** 2 + (node.y - this.mouse.y) ** 2;
        if (d < best) {
          best = d;
          nearest = { node, l };
        }
      })
    );
    if (!nearest) return;

    const { node, l } = nearest;
    ctx.strokeStyle = colors.accent;
    ctx.lineWidth = 1.2;
    ctx.globalAlpha = 0.7 * I;
    ctx.beginPath();
    [this.edges[l - 1], this.edges[l]].forEach((pair) => {
      if (!pair) return;
      pair.forEach((edge) => {
        if (edge.from !== node && edge.to !== node) return;
        ctx.moveTo(edge.from.x, edge.from.y);
        ctx.lineTo(edge.to.x, edge.to.y);
      });
    });
    ctx.stroke();

    ctx.globalAlpha = 0.95 * I;
    ctx.beginPath();
    ctx.arc(node.x, node.y, (node.r || 4) + 6, 0, Math.PI * 2);
    ctx.stroke();

    const label = `a ${node.act.toFixed(2)} · R ${node.relN.toFixed(2)}`;
    ctx.fillStyle = colors.text;
    ctx.fillText(label, node.x + 14, node.y - 14);
  }

  drawStatic() {
    this.paint(0, { staticFrame: true });
  }

  draw() {
    if (!this.isRunning && !prefersReducedMotion) return;

    // 30fps is plenty for this pace and halves the work.
    this.tick += 1;
    if (this.tick % 2 === 0) {
      this.paint(performance.now());
    }

    if (!prefersReducedMotion && this.isRunning) {
      this.frame = requestAnimationFrame(this.draw);
    }
  }
}

function setupNeuralCanvas() {
  const canvas = document.querySelector("#neural-canvas");
  if (!canvas) return;

  const neuralCanvas = new NeuralCanvas(canvas);
  neuralCanvas.start();
}

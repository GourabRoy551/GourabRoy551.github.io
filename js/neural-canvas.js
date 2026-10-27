// Saliency-map background: a lattice of pixel tiles whose size and colour follow
// a slowly drifting "attention" field, like an XAI heatmap laid over an image.
// The pointer adds its own attention spot, and a bracket box tracks the most
// salient region. Calmer on inner pages and as the reader scrolls.
class NeuralCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.blobs = [];
    this.mouse = { x: null, y: null };
    this.attention = { x: 0, y: 0, strength: 0 };
    this.focus = { x: null, y: null, heat: 0 };
    this.frame = null;
    this.isRunning = false;
    this.tick = 0;
    this.palette = null;
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
    window.addEventListener("touchstart", this.handlePointerMove, { passive: true });
    window.addEventListener("touchmove", this.handlePointerMove, { passive: true });
    window.addEventListener("touchend", this.clearPointer);
    document.addEventListener("visibilitychange", this.handleVisibilityChange);

    // Rebuild the colour map when the theme changes.
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
    const stops = [
      [0, read("--heat-cold", "#5a6b8c")],
      [0.38, read("--heat-low", "#67e0f5")],
      [0.7, read("--heat-mid", "#a594ff")],
      [1, read("--heat-high", "#f6c870")],
    ];

    // 33-step lookup table so per-tile colour is a cheap index.
    const lut = [];
    for (let i = 0; i <= 32; i += 1) {
      const h = i / 32;
      let k = 0;
      while (k < stops.length - 2 && h > stops[k + 1][0]) k += 1;
      const [h0, c0] = stops[k];
      const [h1, c1] = stops[k + 1];
      const f = Math.min(Math.max((h - h0) / (h1 - h0), 0), 1);
      const rgb = c0.map((v, j) => Math.round(v + (c1[j] - v) * f));
      lut.push(`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
    }

    const isBright = document.documentElement.dataset.theme === "bright";
    this.palette = {
      lut,
      accent: lut[32],
      alphaScale: isBright ? 0.75 : 1,
    };
    return this.palette;
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
    this.cell = this.isCompact ? 30 : 26;
    this.cols = Math.ceil(width / this.cell) + 1;
    this.rows = Math.ceil(height / this.cell) + 1;
    this.blobs = this.createBlobs();
    this.focus = { x: null, y: null, heat: 0 };

    if (prefersReducedMotion) {
      this.drawStatic();
    }
  }

  createBlobs() {
    // Positions and radii are relative to the viewport; motion is slow Lissajous drift.
    const seed = () => Math.random() * Math.PI * 2;
    return [
      { cx: 0.72, cy: 0.3, ax: 0.14, ay: 0.1, fx: 0.00011, fy: 0.00009, r: 0.2, s: 0.85, px: seed(), py: seed() },
      { cx: 0.88, cy: 0.7, ax: 0.08, ay: 0.12, fx: 0.00008, fy: 0.00012, r: 0.17, s: 0.7, px: seed(), py: seed() },
      { cx: 0.42, cy: 0.82, ax: 0.16, ay: 0.08, fx: 0.0001, fy: 0.00007, r: 0.19, s: 0.65, px: seed(), py: seed() },
      { cx: 0.12, cy: 0.5, ax: 0.08, ay: 0.2, fx: 0.00013, fy: 0.0001, r: 0.14, s: 0.5, px: seed(), py: seed() },
    ];
  }

  handlePointerMove(event) {
    const touch = event.touches ? event.touches[0] : event;
    if (!touch) return;

    this.mouse.x = touch.clientX;
    this.mouse.y = touch.clientY;
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
    this.draw();
  }

  intensity() {
    // Strongest behind the home hero; fades as the reader scrolls into text.
    const base = this.isHome ? 0.85 : 0.55;
    const scroll = window.scrollY || 0;
    const fade = Math.max(0.5, 1 - scroll / (window.innerHeight * 1.6));
    return base * fade;
  }

  updateAttention(width, height) {
    const target = this.mouse.x !== null;
    if (target) {
      if (this.attention.strength < 0.02) {
        this.attention.x = this.mouse.x;
        this.attention.y = this.mouse.y;
      }
      this.attention.x += (this.mouse.x - this.attention.x) * 0.08;
      this.attention.y += (this.mouse.y - this.attention.y) * 0.08;
      this.attention.strength += (0.9 - this.attention.strength) * 0.05;
    } else {
      this.attention.strength *= 0.95;
    }
  }

  paint(time, { staticFrame = false } = {}) {
    const ctx = this.context;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const { lut, accent, alphaScale } = this.colors();
    const cell = this.cell;
    const base = Math.min(width, height);
    const intensity = this.intensity() * alphaScale;

    ctx.clearRect(0, 0, width, height);

    const blobs = this.blobs.map((b) => {
      const radius = b.r * base * (this.isCompact ? 1.3 : 1);
      return {
        x: (b.cx + Math.sin(time * b.fx + b.px) * b.ax) * width,
        y: (b.cy + Math.cos(time * b.fy + b.py) * b.ay) * height,
        inv: 1 / (2 * radius * radius),
        s: b.s,
      };
    });

    if (!staticFrame) this.updateAttention(width, height);
    const attn = this.attention;
    const attnInv = 1 / (2 * 120 * 120);

    let maxHeat = 0;
    let maxX = 0;
    let maxY = 0;

    for (let row = 0; row < this.rows; row += 1) {
      const y = row * cell + cell / 2;
      for (let col = 0; col < this.cols; col += 1) {
        const x = col * cell + cell / 2;

        // Soft union of the attention blobs: 1 - prod(1 - g_i).
        let keep = 1;
        for (let i = 0; i < blobs.length; i += 1) {
          const b = blobs[i];
          const dx = x - b.x;
          const dy = y - b.y;
          keep *= 1 - b.s * Math.exp(-(dx * dx + dy * dy) * b.inv);
        }
        if (attn.strength > 0.01) {
          const dx = x - attn.x;
          const dy = y - attn.y;
          keep *= 1 - attn.strength * 0.8 * Math.exp(-(dx * dx + dy * dy) * attnInv);
        }

        // A faint per-tile shimmer keeps the map feeling computed, not painted.
        const shimmer = staticFrame ? 1 : 0.94 + 0.06 * Math.sin(time * 0.0014 + col * 0.9 + row * 1.7);
        const heat = Math.min(1, (1 - keep) * shimmer);

        if (heat > maxHeat) {
          maxHeat = heat;
          maxX = x;
          maxY = y;
        }

        const size = Math.max(1.3, cell * (0.06 + heat * heat * 0.4));
        ctx.globalAlpha = (0.12 + heat * heat * 0.5) * intensity;
        // sqrt lifts mid-heat tiles into colour sooner, so warm regions read as a heatmap.
        ctx.fillStyle = lut[Math.round(Math.sqrt(heat) * 32)];
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
      }
    }

    this.paintFocus(ctx, maxX, maxY, maxHeat, accent, intensity, staticFrame);
    ctx.globalAlpha = 1;
  }

  paintFocus(ctx, x, y, heat, color, intensity, staticFrame) {
    if (this.isCompact || heat < 0.5) return;

    // Ease the box toward the hottest tile so it glides instead of jumping.
    if (this.focus.x === null || staticFrame) {
      this.focus.x = x;
      this.focus.y = y;
    } else {
      this.focus.x += (x - this.focus.x) * 0.04;
      this.focus.y += (y - this.focus.y) * 0.04;
    }
    this.focus.heat += (heat - this.focus.heat) * 0.08;

    const span = this.cell * 3.4;
    const left = this.focus.x - span / 2;
    const top = this.focus.y - span / 2;
    const arm = 10;
    const alpha = 0.6 * intensity;

    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
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

    ctx.font = '600 10px "JetBrains Mono", ui-monospace, monospace';
    ctx.textBaseline = "middle";
    const label = `salient ${this.focus.heat.toFixed(2)}`;
    const labelWidth = ctx.measureText(label).width + 12;
    ctx.globalAlpha = alpha * 0.22;
    ctx.fillStyle = color;
    ctx.fillRect(left, top - 19, labelWidth, 16);
    ctx.globalAlpha = alpha;
    ctx.fillText(label, left + 6, top - 11);
  }

  drawStatic() {
    this.paint(24000, { staticFrame: true });
  }

  draw() {
    if (!this.isRunning && !prefersReducedMotion) return;

    // 30fps is plenty for slow drift and halves the work.
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

class NeuralCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.points = [];
    this.mouse = { x: null, y: null };
    this.frame = null;
    this.isRunning = false;
    this.time = 0;
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

    if (prefersReducedMotion) {
      this.drawStatic();
    } else {
      this.resume();
    }
  }

  colors() {
    const styles = getComputedStyle(document.documentElement);
    return {
      dot: styles.getPropertyValue("--effect-dot").trim(),
      line: styles.getPropertyValue("--effect-line").trim(),
      active: styles.getPropertyValue("--effect-active").trim(),
    };
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

    const isCompact = width < 760;
    const pointDensity = isCompact ? 22000 : 16000;
    const minPoints = isCompact ? 34 : 48;
    const maxPoints = isCompact ? 72 : 118;
    const pointCount = Math.round(Math.min(maxPoints, Math.max(minPoints, (width * height) / pointDensity)));
    this.points = Array.from({ length: pointCount }, () => this.createPoint(width, height));

    if (prefersReducedMotion) {
      this.drawStatic();
    }
  }

  createPoint(width, height) {
    const depth = Math.random() * 0.65 + 0.35;
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.22 * depth,
      vy: (Math.random() - 0.5) * 0.22 * depth,
      size: (Math.random() * 1.4 + 0.9) * depth,
      phase: Math.random() * Math.PI * 2,
      pulse: Math.random() * 0.8 + 0.5,
      depth,
    };
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

  updatePoint(point, width, height) {
    if (this.mouse.x !== null && this.mouse.y !== null) {
      const dx = this.mouse.x - point.x;
      const dy = this.mouse.y - point.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 200 && distance > 0) {
        const force = (200 - distance) / 2200 * point.depth;
        point.vx += (dx / distance) * force;
        point.vy += (dy / distance) * force;
      }
    }

    point.vx += Math.cos(this.time * 0.007 + point.phase) * 0.002 * point.depth;
    point.vy += Math.sin(this.time * 0.006 + point.phase) * 0.002 * point.depth;
    point.vx *= 0.993;
    point.vy *= 0.993;
    point.x += point.vx;
    point.y += point.vy;

    if (point.x < -20) point.x = width + 20;
    if (point.x > width + 20) point.x = -20;
    if (point.y < -20) point.y = height + 20;
    if (point.y > height + 20) point.y = -20;
  }

  paint({ staticFrame = false } = {}) {
    const ctx = this.context;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const colors = this.colors();
    const maxDistance = width < 700 ? 112 : 165;

    ctx.clearRect(0, 0, width, height);

    // Primary sweep line
    const sweep = ((this.time * 0.82) % (width + 360)) - 180;
    const sweepGradient = ctx.createLinearGradient(sweep - 80, 0, sweep + 80, height);
    sweepGradient.addColorStop(0, "transparent");
    sweepGradient.addColorStop(0.48, colors.active);
    sweepGradient.addColorStop(1, "transparent");
    ctx.globalAlpha = staticFrame ? 0.045 : 0.09;
    ctx.strokeStyle = sweepGradient;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(sweep, 0);
    ctx.lineTo(sweep - 240, height);
    ctx.stroke();

    // Secondary sweep line - slower, opposite diagonal
    const sweep2 = width - ((this.time * 0.46 + width * 0.6) % (width + 400)) + 200;
    const sweepGradient2 = ctx.createLinearGradient(sweep2 - 60, 0, sweep2 + 60, height);
    sweepGradient2.addColorStop(0, "transparent");
    sweepGradient2.addColorStop(0.5, colors.line);
    sweepGradient2.addColorStop(1, "transparent");
    ctx.globalAlpha = staticFrame ? 0.025 : 0.055;
    ctx.strokeStyle = sweepGradient2;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(sweep2, 0);
    ctx.lineTo(sweep2 + 180, height);
    ctx.stroke();

    this.points.forEach((point) => {
      if (!staticFrame) {
        this.updatePoint(point, width, height);
      }
    });

    // Draw connection lines with variable thickness
    for (let i = 0; i < this.points.length; i += 1) {
      for (let j = i + 1; j < this.points.length; j += 1) {
        const first = this.points[i];
        const second = this.points[j];
        const dx = first.x - second.x;
        const dy = first.y - second.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const proximity = 1 - distance / maxDistance;
          ctx.globalAlpha = proximity * 0.62;
          ctx.strokeStyle = colors.line;
          ctx.lineWidth = 0.6 + proximity * 0.8;
          ctx.beginPath();
          ctx.moveTo(first.x, first.y);
          ctx.lineTo(second.x, second.y);
          ctx.stroke();
        }
      }
    }

    // Mouse ring halo
    if (!staticFrame && this.mouse.x !== null) {
      const ringRadius = 48 + Math.sin(this.time * 0.04) * 6;
      const ringGradient = ctx.createRadialGradient(
        this.mouse.x, this.mouse.y, ringRadius * 0.6,
        this.mouse.x, this.mouse.y, ringRadius
      );
      ringGradient.addColorStop(0, "transparent");
      ringGradient.addColorStop(0.7, colors.active);
      ringGradient.addColorStop(1, "transparent");
      ctx.globalAlpha = 0.12;
      ctx.strokeStyle = ringGradient;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(this.mouse.x, this.mouse.y, ringRadius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw nodes
    this.points.forEach((point) => {
      const dx = this.mouse.x === null ? 9999 : this.mouse.x - point.x;
      const dy = this.mouse.y === null ? 9999 : this.mouse.y - point.y;
      const pointerDistance = Math.sqrt(dx * dx + dy * dy);
      const nearPointer = pointerDistance < 150;
      const pulse = 1 + Math.sin(this.time * 0.032 + point.phase) * 0.22 * point.pulse;
      const radius = point.size * pulse;

      if (nearPointer) {
        ctx.globalAlpha = (1 - pointerDistance / 150) * 0.38;
        ctx.strokeStyle = colors.active;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(this.mouse.x, this.mouse.y);
        ctx.stroke();
      }

      ctx.globalAlpha = nearPointer ? 0.95 : 0.55 + point.depth * 0.2;
      ctx.fillStyle = nearPointer ? colors.active : colors.dot;
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
  }

  drawStatic() {
    this.paint({ staticFrame: true });
  }

  draw() {
    if (!this.isRunning && !prefersReducedMotion) return;

    this.time += 1;
    this.paint();

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

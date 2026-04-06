(function () {
    const canvas = document.getElementById("particle-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let points = [];
    const count = prefersReducedMotion ? 70 : 180;
    const connectionDistance = prefersReducedMotion ? 170 : 250;
    const lineAlphaMax = prefersReducedMotion ? 0.12 : 0.22;
    const mouse = {
        x: -9999,
        y: -9999,
        active: false
    };

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * DPR;
        canvas.height = height * DPR;
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        points = Array.from({ length: count }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * (prefersReducedMotion ? 0.06 : 0.18),
            vy: (Math.random() - 0.5) * (prefersReducedMotion ? 0.06 : 0.18)
        }));
    }

    function step() {
        ctx.clearRect(0, 0, width, height);

        for (const point of points) {
            if (mouse.active) {
                const dx = point.x - mouse.x;
                const dy = point.y - mouse.y;
                const dist = Math.hypot(dx, dy);
                const influenceRadius = 220;

                if (dist > 0 && dist < influenceRadius) {
                    const force = (1 - dist / influenceRadius) * 0.8;
                    point.vx += (dx / dist) * force;
                    point.vy += (dy / dist) * force;
                }
            }

            point.vx *= 0.985;
            point.vy *= 0.985;
            point.vx = Math.max(Math.min(point.vx, 1.35), -1.35);
            point.vy = Math.max(Math.min(point.vy, 1.35), -1.35);
            point.x += point.vx;
            point.y += point.vy;

            if (point.x < -20) point.x = width + 20;
            if (point.x > width + 20) point.x = -20;
            if (point.y < -20) point.y = height + 20;
            if (point.y > height + 20) point.y = -20;
        }

        for (let i = 0; i < points.length; i += 1) {
            const a = points[i];
            for (let j = i + 1; j < points.length; j += 1) {
                const b = points[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.hypot(dx, dy);
                if (dist < connectionDistance) {
                    const alpha = (1 - dist / connectionDistance) * lineAlphaMax;
                    ctx.strokeStyle = `rgba(223, 185, 229, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }

        for (const point of points) {
            ctx.fillStyle = "rgba(223, 185, 229, 0.86)";
            ctx.beginPath();
            ctx.moveTo(point.x, point.y - 4.8);
            ctx.lineTo(point.x - 4.2, point.y + 3.2);
            ctx.lineTo(point.x + 4.2, point.y + 3.2);
            ctx.closePath();
            ctx.fill();
        }

        if (!prefersReducedMotion) {
            window.requestAnimationFrame(step);
        }
    }

    resize();
    if (prefersReducedMotion) {
        step();
    } else {
        window.requestAnimationFrame(step);
    }
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", (event) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
        mouse.active = true;
    });
    window.addEventListener("pointerleave", () => {
        mouse.active = false;
    });
    window.addEventListener("pointercancel", () => {
        mouse.active = false;
    });
})();

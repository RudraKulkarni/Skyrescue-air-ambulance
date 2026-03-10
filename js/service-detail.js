/* =========================
   SkyRescue Services (Clean + Smooth)
   - Single Reveal System (uses .reveal-up + .is-in)
   - Hero Motion (light)
   - Process fill (proc2)
   - Quarter drawer (uc-more)
   - Cloud benefits mobile tap (cbd2)
========================= */

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // -------- Reveal (ONE system) --------
  function initReveal() {
    const els = document.querySelectorAll('.reveal-up');
    if (!els.length) return;

    if (reduceMotion) {
      els.forEach(el => el.classList.add('is-in'));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const d = parseInt(el.getAttribute('data-delay') || '0', 10);
        if (d) el.style.transitionDelay = `${d}ms`;
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { threshold: 0.18 });

    els.forEach(el => io.observe(el));
  }

  // -------- Hero background motion (light) --------
  function initHeroMotion() {
    const hero = document.querySelector('.svc-hero');
    if (!hero || reduceMotion) return;

    const bg = hero.querySelector('.svc-hero__bg');
    if (!bg) return;

    let mx = 0.5, my = 0.5;
    let raf = null;

    function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

    function render() {
      raf = null;

      const rect = hero.getBoundingClientRect();
      const inView = rect.bottom > 0 && rect.top < window.innerHeight;
      if (!inView) return;

      // tiny drift only (no heavy math)
      const dx = (mx - 0.5) * 10;
      const dy = (my - 0.5) * 8;

      bg.style.transform = `translate3d(${clamp(dx, -10, 10)}px, ${clamp(dy, -10, 10)}px, 0) scale(1.10)`;
    }

    function schedule() {
      if (raf) return;
      raf = requestAnimationFrame(render);
    }

    hero.addEventListener('mousemove', (e) => {
      const r = hero.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width;
      my = (e.clientY - r.top) / r.height;
      schedule();
    }, { passive: true });

    window.addEventListener('resize', schedule, { passive: true });
    schedule();
  }

// Process spine progress fill (proc2) - smooth transform fill
function initProc2Fill() {
  const tl = document.querySelector("[data-proc2]");
  if (!tl) return;

  const fill = tl.querySelector(".proc2__fill");
  if (!fill) return;

  let raf = null;

  function update() {
    raf = null;
    const rect = tl.getBoundingClientRect();
    const vh = window.innerHeight;

    // skip work when offscreen (big performance win)
    if (rect.bottom <= 0 || rect.top >= vh) return;

    const start = vh * 0.25;
    const end = vh * 0.70;

    const p = (start - rect.top) / (rect.height - (end - start));
    const clamped = Math.max(0, Math.min(1, p));

    fill.style.transform = `scaleY(${clamped.toFixed(4)})`;
  }

  function schedule() {
    if (raf) return;
    raf = requestAnimationFrame(update);
  }

  schedule();
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
}

  // -------- Quarter drawer (uc-more) --------
  function initQuarterDrawer() {
    const qd = document.getElementById("qd");
    if (!qd) return;

    const panel = qd.querySelector(".qd__panel");
    const titleEl = qd.querySelector("#qdTitle");
    const textEl  = qd.querySelector("#qdText");
    const listEl  = qd.querySelector("#qdList");

    function openDrawer(btn){
      const t = btn.dataset.drawerTitle || "Details";
      const tx = btn.dataset.drawerText || "";
      const pts = (btn.dataset.drawerPoints || "").split("|").filter(Boolean);

      titleEl.textContent = t;
      textEl.textContent = tx;
      listEl.innerHTML = pts.map(p => `<li>${p}</li>`).join("");

      const side = btn.dataset.drawerSide || "right";
      panel.classList.toggle("qd__panel--left", side === "left");

      qd.classList.add("is-open");
      qd.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function closeDrawer(){
      qd.classList.remove("is-open");
      qd.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".uc-more");
      if (btn) return openDrawer(btn);

      if (e.target.closest("[data-qd-close]") || e.target.classList.contains("qd__backdrop")) {
        return closeDrawer();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && qd.classList.contains("is-open")) closeDrawer();
    });
  }

 /* =========================
   CBD2 CLICK ACCORDION
========================= */
(function () {
  const groups = document.querySelectorAll('[data-cbd2]');
  if (!groups.length) return;

  groups.forEach((group) => {
    const rows = [...group.querySelectorAll('.cbd2__row')];

    rows.forEach((row) => {
      const btn = row.querySelector('.cbd2__icon');
      if (!btn) return;

      btn.setAttribute('type', 'button');
      btn.setAttribute('aria-expanded', 'false');

      btn.addEventListener('click', () => {
        const isOpen = row.classList.contains('is-open');

        rows.forEach((r) => {
          r.classList.remove('is-open');
          const b = r.querySelector('.cbd2__icon');
          if (b) b.setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          row.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  });
})();
  document.addEventListener('DOMContentLoaded', () => {
    initReveal();
    initHeroMotion();
    initProc2Fill();
    initQuarterDrawer();
    initCBD2MobileTap();
  });
})();
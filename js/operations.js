const steps = document.querySelectorAll(".step");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, { threshold: 0.2 });

steps.forEach(step => {
  step.style.opacity = "0";
  step.style.transform = "translateY(60px)";
  step.style.transition = "0.6s ease";
  observer.observe(step);
});

// ===== WORKFLOW EXPAND (RESPONSIVE + AUTO SCROLL) =====
// ===== WORKFLOW EXPAND (STABLE) =====
document.querySelectorAll('.step-card[data-step]').forEach((card) => {
  const btn = card.querySelector('.step-toggle');
  const more = card.querySelector('.step-more');

  if (!btn || !more) return;

  btn.addEventListener('click', () => {
    const open = card.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    more.hidden = !open;

    // On mobile, ensure opened card is visible
    if (open) card.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  });
});
// ===== DRAG TO SCROLL (WORKFLOW RAIL) =====
const rail = document.querySelector('.step-rail');
if (rail) {
  let down = false, sx = 0, sl = 0;

  rail.addEventListener('mousedown', (e) => {
    down = true;
    rail.classList.add('is-dragging');
    sx = e.pageX - rail.offsetLeft;
    sl = rail.scrollLeft;
  });

  window.addEventListener('mouseup', () => {
    down = false;
    rail.classList.remove('is-dragging');
  });

  rail.addEventListener('mousemove', (e) => {
    if (!down) return;
    e.preventDefault();
    const x = e.pageX - rail.offsetLeft;
    rail.scrollLeft = sl - (x - sx);
  });
}

// ===== SAFETY CHECKLIST REVEAL =====
const list = document.querySelector('[data-checklist]');
if (list) {
  const items = [...list.querySelectorAll('.safety-item')];

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      items.forEach((it, i) => {
        setTimeout(() => {
          it.style.transition = 'opacity .35s ease, transform .35s ease';
          it.style.opacity = '1';
          it.style.transform = 'translateY(0)';
        }, i * 120);
      });
      io.disconnect();
    });
  }, { threshold: 0.25 });

  io.observe(list);
}

// ===== PROTOCOL DRAWER =====
const drawer = document.querySelector('[data-protocol-drawer]');
const openBtn = document.querySelector('[data-protocol-open]');
const closeBtns = document.querySelectorAll('[data-protocol-close]');

function openDrawer(){
  if (!drawer) return;
  drawer.classList.add('is-open');
  drawer.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
}
function closeDrawer(){
  if (!drawer) return;
  drawer.classList.remove('is-open');
  drawer.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
}

if (openBtn) openBtn.addEventListener('click', openDrawer);
closeBtns.forEach(b => b.addEventListener('click', closeDrawer));

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeDrawer();
});
// ===== COORDINATION ARCH: AUTO POSITION + AUTO LINES =====
(function () {
  const stage = document.querySelector('[data-arch]');
  if (!stage) return;

  const svg = stage.querySelector('[data-arch-svg]');
  const core = stage.querySelector('[data-core]');
  const nodes = Array.from(stage.querySelectorAll('.arch-node'));

  // Place nodes in a ring (no overlap, consistent spacing)
  function layoutNodes() {
    const r = stage.getBoundingClientRect();
    const cx = r.width / 2;
    const cy = r.height / 2;

    // radius: safe distance from edges
    const radius = Math.min(r.width, r.height) * 0.36;

    // order around ring (feels balanced)
    const order = ["family", "referring", "crew", "receiving", "ground", "medical"];
    const ordered = order.map(k => nodes.find(n => n.dataset.node === k)).filter(Boolean);

    ordered.forEach((node, i) => {
      const a = (-90 + i * (360 / ordered.length)) * Math.PI / 180;
      const x = cx + radius * Math.cos(a);
      const y = cy + radius * Math.sin(a);

      node.style.left = x + "px";
      node.style.top = y + "px";
    });
  }

  // Build SVG paths from core center to each node center
  function drawLines() {
    const sr = stage.getBoundingClientRect();
    const cr = core.getBoundingClientRect();

    const cX = (cr.left + cr.width / 2) - sr.left;
    const cY = (cr.top + cr.height / 2) - sr.top;

    // size svg to stage
    svg.setAttribute("viewBox", `0 0 ${sr.width} ${sr.height}`);
    svg.setAttribute("width", sr.width);
    svg.setAttribute("height", sr.height);

    // clear
    svg.innerHTML = "";

    // defs (soft glow)
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.innerHTML = `
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    `;
    svg.appendChild(defs);

    nodes.forEach((node) => {
      const nr = node.getBoundingClientRect();
      const nX = (nr.left + nr.width / 2) - sr.left;
      const nY = (nr.top + nr.height / 2) - sr.top;

      // curved line for a more premium feel
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      const midX = (cX + nX) / 2;
      const midY = (cY + nY) / 2;

      // curve amount
      const curve = 0.18;
      const qX = midX + (nX - cX) * curve;
      const qY = midY + (nY - cY) * curve;

      const d = `M ${cX} ${cY} Q ${qX} ${qY} ${nX} ${nY}`;
      path.setAttribute("d", d);
      path.classList.add("arch-line");
      path.dataset.line = node.dataset.node;

      svg.appendChild(path);

      // draw animation
      const len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
      path.style.transition = "stroke-dashoffset .9s ease";
      requestAnimationFrame(() => (path.style.strokeDashoffset = "0"));
    });
  }

  function rebuild() {
    layoutNodes();
    // wait a frame so node positions apply, then draw correct lines
    requestAnimationFrame(drawLines);
  }

  // Hover/click interaction
  function clearActive() {
    stage.classList.remove("is-focus");
    nodes.forEach(n => n.classList.remove("is-active"));
    svg.querySelectorAll(".arch-line").forEach(l => l.classList.remove("is-on"));
  }

  nodes.forEach((node) => {
    const key = node.dataset.node;

    function activate() {
      clearActive();
      stage.classList.add("is-focus");
      node.classList.add("is-active");
      const line = svg.querySelector(`[data-line="${key}"]`);
      if (line) line.classList.add("is-on");
    }

    node.addEventListener("mouseenter", activate);
    node.addEventListener("mouseleave", clearActive);
    node.addEventListener("click", (e) => {
      e.preventDefault();
      const already = node.classList.contains("is-active");
      clearActive();
      if (!already) activate();
    });
  });

  // rebuild on resize
  window.addEventListener("resize", () => rebuild());

  // initial
  rebuild();
})();

// ===== INSIDE OPS: desktop hover expand only while hovering =====
document.addEventListener('DOMContentLoaded', () => {
  const row = document.querySelector('#inside [data-inside]');
  if (!row) return;

  const cards = Array.from(row.querySelectorAll('.inside-card'));
  if (!cards.length) return;

  const isDesktop = () => window.matchMedia('(min-width: 992px)').matches;

  function clearActive(){
    cards.forEach(c => c.classList.remove('is-active'));
    row.classList.remove('is-hovering');
  }

  function activate(card){
    cards.forEach(c => c.classList.remove('is-active'));
    card.classList.add('is-active');
    row.classList.add('is-hovering');
  }

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => { if (isDesktop()) activate(card); });
  });

  row.addEventListener('mouseleave', () => { if (isDesktop()) clearActive(); });

  // If you resize from desktop to mobile, reset states
  window.addEventListener('resize', () => { if (!isDesktop()) clearActive(); });
});// =
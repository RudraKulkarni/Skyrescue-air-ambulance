document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".about-slide");
  if (!slides.length) return;

  let i = 0;
  setInterval(() => {
    slides[i].classList.remove("active");
    i = (i + 1) % slides.length;
    slides[i].classList.add("active");
  }, 4000);
});

// about.js (Read More - reliable init with retry)

(function () {
  document.addEventListener("DOMContentLoaded", function () {
  const btn = document.querySelector(".wwa-more-btn");
  const panel = document.querySelector(".wwa-more-panel");

  if (!btn || !panel) return;

  btn.addEventListener("click", function () {
    const isOpen = panel.classList.contains("open");

    if (!isOpen) {
      panel.style.maxHeight = panel.scrollHeight + "px";
      panel.classList.add("open");
      btn.textContent = "Read Less";
    } else {
      panel.style.maxHeight = null;
      panel.classList.remove("open");
      btn.textContent = "Read More";
    }
  });
});

  // Run now (if DOM is ready)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      if (initReadMore()) return;

      // Retry a few times if content appears late
      let tries = 0;
      const t = setInterval(() => {
        tries++;
        if (initReadMore() || tries > 10) clearInterval(t);
      }, 200);
    });
  } else {
    // DOM already ready
    if (initReadMore()) return;

    let tries = 0;
    const t = setInterval(() => {
      tries++;
      if (initReadMore() || tries > 10) clearInterval(t);
    }, 200);
  }
})();

// ----- JOURNEY TIMELINE (PLANE DOWN SPINE + EXACT BRANCH TO CARD EDGE) -----
document.addEventListener("DOMContentLoaded", () => {
  const timeline = document.getElementById("journeyTimeline");
  const fill = document.getElementById("journeyFill");
  const plane = document.getElementById("journeyPlane");
  const items = Array.from(document.querySelectorAll(".j-item"));

  if (!timeline || !fill || !plane || !items.length) return;

  function spineX() {
    // spine is controlled by CSS var --spineX, but we can compute actual x via the line position
    const line = timeline.querySelector(".journey-line");
    const r = line.getBoundingClientRect();
    return r.left + (r.width / 2);
  }

  function setFillToItem(el) {
    const tRect = timeline.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    const target = (eRect.top - tRect.top) + (eRect.height / 2);
    fill.style.height = Math.max(0, target) + "px";
  }

  function movePlaneToItem(el) {
    const tRect = timeline.getBoundingClientRect();
    const node = el.querySelector(".j-node");
    const nRect = node.getBoundingClientRect();
    const y = (nRect.top - tRect.top) + (nRect.height / 2);

    plane.style.opacity = "1";
    plane.style.top = y + "px";
  }

  // Compute branch length so it stops exactly at the card edge (minus gap)
  function setBranchLength(el) {
    const card = el.querySelector(".j-card");
    const tRect = timeline.getBoundingClientRect();

    const xSpine = spineX();
    const cRect = card.getBoundingClientRect();

    // gap is CSS var, but we'll safely assume 16-26px based on layout; we can read computed style too
    const cs = getComputedStyle(timeline);
    const gap = parseFloat(cs.getPropertyValue("--gap")) || 20;

    let len;

    // Desktop alternates: left branch ends at card right edge, right branch ends at card left edge
    if (el.classList.contains("left")) {
      const cardRight = cRect.right;
      len = (xSpine - cardRight) - gap;
    } else {
      const cardLeft = cRect.left;
      len = (cardLeft - xSpine) - gap;
    }

    // Clamp for safety (avoid negatives on edge cases)
    len = Math.max(60, Math.min(len, 420));
    el.style.setProperty("--b", len + "px");
  }

  function activate(el) {
    if (el.classList.contains("is-active")) return;

    // compute geometry first so animation is clean
    setBranchLength(el);

    el.classList.add("is-active");
    setFillToItem(el);
    movePlaneToItem(el);
  }

  // Intersection observer activates items as you scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const step = Number(el.getAttribute("data-step")) || 1;

      // tiny stagger to feel "one by one"
      setTimeout(() => activate(el), step * 90);
    });
  }, { threshold: 0.45 });

  items.forEach(el => io.observe(el));

  // On resize, recompute branch lengths + keep plane/fill on the last active item
  function refreshActive() {
    const active = [...items].filter(x => x.classList.contains("is-active"));
    active.forEach(setBranchLength);

    const last = active[active.length - 1];
    if (last) {
      setFillToItem(last);
      movePlaneToItem(last);
    }
  }

  window.addEventListener("resize", refreshActive);

  // If user loads mid-scroll, sync to first visible item
  setTimeout(() => {
    const firstInView = items.find(el => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight * 0.65 && r.bottom > window.innerHeight * 0.25;
    });
    if (firstInView) activate(firstInView);
  }, 120);
});

// ===== AWARDS: STAGGER REVEAL + DRAWER DETAILS =====
document.addEventListener("DOMContentLoaded", () => {
  const awardEls = Array.from(document.querySelectorAll("[data-award]"));
  const drawer = document.getElementById("awardDrawer");
  const grid = document.getElementById("awardsGrid");

  if (!awardEls.length) return;

  // Reveal (stagger)
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;

      // stagger based on index in the grid/section
      const i = awardEls.indexOf(el);
      setTimeout(() => el.classList.add("is-revealed"), Math.max(0, i) * 90);

      revealIO.unobserve(el);
    });
  }, { threshold: 0.20 });

  awardEls.forEach(el => revealIO.observe(el));

  // Drawer bindings
  if (!drawer) return;

  const adIcon = document.getElementById("adIcon");
  const adTitle = document.getElementById("adTitle");
  const adYear = document.getElementById("adYear");
  const adOrg = document.getElementById("adOrg");
  const adDesc = document.getElementById("adDesc");
  const adTag = document.getElementById("adTag");

  function openDrawer(fromEl) {
    const title = fromEl.getAttribute("data-title") || "Award";
    const year = fromEl.getAttribute("data-year") || "";
    const org  = fromEl.getAttribute("data-org")  || "";
    const desc = fromEl.getAttribute("data-desc") || "";
    const tag  = fromEl.getAttribute("data-tag")  || "Recognition";

    // pick icon from card if present
    const iconEl = fromEl.querySelector(".award-icon");
    const icon = iconEl ? iconEl.textContent.trim() : "🏆";

    adIcon.textContent = icon;
    adTitle.textContent = title;
    adYear.textContent = year;
    adOrg.textContent = org;
    adDesc.textContent = desc;
    adTag.textContent = tag;

    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
document.querySelectorAll(".award-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    const feature = btn.closest("[data-award]");
    if (feature) openDrawer(feature);
  });
});
  function closeDrawer() {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // Click to open (cards + featured button)
  awardEls.forEach(el => {
    el.addEventListener("click", (e) => {
      // If user clicks inside a button or element, still open
      openDrawer(el);
    });

    // Keyboard accessibility
    el.setAttribute("tabindex", "0");
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openDrawer(el);
      }
    });
  });

  // Close handlers
  drawer.addEventListener("click", (e) => {
    if (e.target && e.target.hasAttribute("data-drawer-close")) closeDrawer();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("open")) closeDrawer();
  });
});

// ===== PURPOSE & PRINCIPLES (ORB REVEAL + MINI CAROUSEL) =====
document.addEventListener("DOMContentLoaded", () => {
  const orb = document.querySelector(".purpose-orb");
  const slideEl = document.getElementById("pSlide");
  const dotsEl = document.getElementById("pDots");
  const prev = document.getElementById("pPrev");
  const next = document.getElementById("pNext");

  if (!orb || !slideEl || !dotsEl || !prev || !next) return;

  const items = [
    { icon:"🧠", title:"Patient-First Decisions", text:"Every decision prioritizes patient stability, safety, and continuity of care." },
    { icon:"✅", title:"Safety Discipline", text:"Standard checks, readiness steps, and documentation before every transfer." },
    { icon:"🩺", title:"Clinical Preparedness", text:"Equipment, monitoring, staffing, and planning aligned to patient condition." },
    { icon:"📣", title:"Transparent Communication", text:"Clear updates for families, hospitals, and teams — no ambiguity." },
    { icon:"🤝", title:"Coordinated Execution", text:"Bedside-to-bedside handovers with smooth collaboration across stakeholders." },
    { icon:"📈", title:"Continuous Improvement", text:"We learn, refine protocols, and raise reliability through feedback and review." }
  ];

  let idx = 0;

  function renderDots() {
    dotsEl.innerHTML = items.map((it, i) =>
      `<button class="p-dot ${i===idx ? "active" : ""}" type="button" data-i="${i}">${it.title}</button>`
    ).join("");
  }

  function renderSlide() {
    const n = String(idx + 1).padStart(2, "0");
    const it = items[idx];

    slideEl.classList.remove("show");
    // small delay for smooth transition
    setTimeout(() => {
      slideEl.innerHTML = `
        <div class="p-kicker">
          <span class="p-num">${n}</span>
          <span class="p-ico">${it.icon}</span>
        </div>
        <h4>${it.title}</h4>
        <p>${it.text}</p>
      `;
      slideEl.classList.add("show");
      renderDots();
    }, 120);
  }

  function go(d) {
    idx = (idx + d + items.length) % items.length;
    renderSlide();
  }

  prev.addEventListener("click", () => go(-1));
  next.addEventListener("click", () => go(1));

  dotsEl.addEventListener("click", (e) => {
    const b = e.target.closest(".p-dot");
    if (!b) return;
    const i = Number(b.getAttribute("data-i"));
    if (!Number.isFinite(i)) return;
    idx = i;
    renderSlide();
  });

  // keyboard support
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  });

  // reveal orb on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      orb.classList.add("is-revealed");
      io.disconnect();
    });
  }, { threshold: 0.25 });

  io.observe(orb);

  renderDots();
  renderSlide();
});
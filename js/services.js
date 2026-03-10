document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.classList.add("js-on");

  /* =========================
     REVEAL SYSTEM
     ========================= */
  const els = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right, .img-slide, .img-scale, .motion-pop, .step-glass, .cap-flip"
  );

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("active");
          e.target.classList.add("visible");

          // hero text motion
          if (e.target.classList.contains("motion-pop")) {
            requestAnimationFrame(() => e.target.classList.add("on"));
          }

          // how it works spotlight
          if (e.target.classList.contains("step-glass")) {
            e.target.classList.add("step-sweep");
          }

          io.unobserve(e.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -60px 0px"
    }
  );

  els.forEach((el) => io.observe(el));

  /* =========================
     SERVICE CARD STAGGER
     ========================= */
  const serviceCards = document.querySelectorAll(".services-grid .service-card");
  serviceCards.forEach((c, i) => {
    c.style.transitionDelay = `${Math.min(i * 90, 360)}ms`;
  });

  /* =========================
     BED-TO-BED TRANSFER FLOW
     ========================= */
  const flowSection = document.querySelector(".transfer-flow");
  if (flowSection) {
    let played = false;

    const flowObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || played) return;
        played = true;
        flowSection.classList.add("flow-on");
      });
    }, { threshold: 0.22 });

    flowObserver.observe(flowSection);
  }

  /* =========================
     CAPABILITIES FLIP CARDS
     ========================= */

  // optional stagger feel for flip cards
  const capCards = document.querySelectorAll(".cap-flip-grid .cap-flip");
  capCards.forEach((c, i) => {
    c.style.transitionDelay = `${Math.min(i * 100, 400)}ms`;
  });

  // tap to flip on mobile/touch
  capCards.forEach((c) => {
    c.addEventListener("click", () => {
      c.classList.toggle("is-flipped");
    });
  });
});
// main.js (SAFE for all pages)

// -------------------- HOME HERO SLIDER (.slide) --------------------
$(document).ready(function () {
  let current = 0;
  const slides = $(".slide");
  const total = slides.length;

  if (!total) return; // ✅ if home slider not on this page, do nothing

  function nextSlide() {
    slides.eq(current).removeClass("active");
    current = (current + 1) % total;
    slides.eq(current).addClass("active");
  }

  setInterval(nextSlide, 5000);
});


// -------------------- MEDICAL LEADERSHIP COUNTERS --------------------
(function () {
  const counters = document.querySelectorAll(".counter");
  const section = document.querySelector(".medical-leadership");

  if (!counters.length || !section) return; // ✅ page doesn't have this section

  let hasAnimated = false;

  function animateCounters() {
    counters.forEach(counter => {
      const target = Number(counter.getAttribute("data-count")) || 0;
      let count = 0;

      // avoid too slow / too fast
      const step = Math.max(1, Math.floor(target / 100));

      const update = () => {
        count += step;
        if (count < target) {
          counter.innerText = count;
          requestAnimationFrame(update);
        } else {
          counter.innerText = target + "+";
        }
      };

      update();
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        animateCounters();
        hasAnimated = true;
      }
      // If you DON'T want it to reset when leaving, remove this block:
      if (!entry.isIntersecting) {
        counters.forEach(counter => (counter.innerText = "0"));
        hasAnimated = false;
      }
    });
  }, { threshold: 0.5 });

  observer.observe(section);
})();


// -------------------- FOUNDERS REVEAL (.founder-card) --------------------
(function () {
  const founderCards = document.querySelectorAll(".founder-card");
  if (!founderCards.length) return;

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, { threshold: 0.3 });

  founderCards.forEach(card => cardObserver.observe(card));
})();


// -------------------- OBJECTIVES REVEAL (.objective-card) --------------------
document.addEventListener("DOMContentLoaded", function () {
  const objectiveCards = document.querySelectorAll(".objective-card");
  const section = document.querySelector(".objectives");

  if (!objectiveCards.length || !section) return; // ✅ not on this page

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        objectiveCards.forEach((card, index) => {
          setTimeout(() => card.classList.add("show"), index * 200);
        });
      }
    });
  }, { threshold: 0.2 });

  observer.observe(section);
});


// -------------------- FAQ SLIDER (only if FAQ exists) --------------------
$(document).ready(function () {
  const cards = $(".faq-card");
  const track = $(".faq-track");
  const dotsContainer = $(".faq-dots");

  if (!cards.length || !track.length || !dotsContainer.length) return; // ✅ not on this page

  dotsContainer.empty(); // ✅ prevents duplicate dots if page reloads/partials

  const total = cards.length;
  let current = 0;

  // create dots
  cards.each(function (i) {
    dotsContainer.append(`<span data-index="${i}"></span>`);
  });

  const dots = $(".faq-dots span");
  dots.eq(0).addClass("active");

  function showSlide(index) {
    track.css("transform", `translateX(-${index * 100}%)`);
    dots.removeClass("active");
    dots.eq(index).addClass("active");
    current = index;
  }

  dots.on("click", function () {
    showSlide($(this).data("index"));
  });

  setInterval(function () {
    showSlide((current + 1) % total);
  }, 5000);
});


// -------------------- ABOUT HERO SLIDER (.about-slide) --------------------
document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".about-slide");
  if (!slides.length) return; // ✅ not on this page

  let current = 0;

  setInterval(function () {
    slides[current].classList.remove("active");
    current = (current + 1) % slides.length;
    slides[current].classList.add("active");
  }, 4000);
});
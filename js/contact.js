document.addEventListener("DOMContentLoaded", function () {
  const revealItems = document.querySelectorAll(".reveal-up");

  if (revealItems.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealItems.forEach((item) => io.observe(item));
  }

  const form = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const popup = document.getElementById("contactPopup");
  const popupClose = document.getElementById("contactPopupClose");
  const popupOk = document.getElementById("contactPopupOk");

  function openPopup() {
    if (!popup) return;
    popup.classList.add("is-open");
    popup.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closePopup() {
    if (!popup) return;
    popup.classList.remove("is-open");
    popup.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  if (popupClose) popupClose.addEventListener("click", closePopup);
  if (popupOk) popupOk.addEventListener("click", closePopup);

  if (popup) {
    popup.addEventListener("click", function (e) {
      if (e.target === popup) closePopup();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && popup && popup.classList.contains("is-open")) {
      closePopup();
    }
  });

  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name");
    const phone = document.getElementById("phone");
    const email = document.getElementById("email");
    const subject = document.getElementById("subject");
    const message = document.getElementById("message");

    let valid = true;

    [name, phone, email, subject, message].forEach((field) => {
      if (!field.value.trim()) {
        field.style.borderColor = "rgba(220, 38, 38, 0.45)";
        valid = false;
      } else {
        field.style.borderColor = "";
      }
    });

    if (!valid) {
      formStatus.textContent = "Please fill in all required fields.";
      formStatus.style.color = "#c0392b";
      return;
    }

    formStatus.textContent = "Your enquiry has been received.";
    formStatus.style.color = "#0a7a52";

    form.reset();
    openPopup();
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const thumbs = Array.from(document.querySelectorAll(".gallery-thumb"));
  const viewer = document.getElementById("galleryViewer");
  const viewerImg = document.getElementById("galleryViewerImg");
  const closeBtn = document.querySelector(".gallery-viewer-close");
  const prevBtn = document.querySelector(".gallery-viewer-nav.prev");
  const nextBtn = document.querySelector(".gallery-viewer-nav.next");

  if (!thumbs.length || !viewer || !viewerImg || !closeBtn || !prevBtn || !nextBtn) return;

  let currentIndex = 0;

  function openViewer(index) {
    const thumb = thumbs[index];
    const img = thumb.querySelector("img");
    const fullSrc = thumb.getAttribute("data-full") || img.src;

    viewerImg.src = fullSrc;
    viewerImg.alt = img ? img.alt : "Expanded gallery image";
    viewer.classList.add("active");
    viewer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    currentIndex = index;
  }

  function closeViewer() {
    viewer.classList.remove("active");
    viewer.setAttribute("aria-hidden", "true");
    viewerImg.src = "";
    document.body.style.overflow = "";
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % thumbs.length;
    openViewer(currentIndex);
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + thumbs.length) % thumbs.length;
    openViewer(currentIndex);
  }

  thumbs.forEach((thumb, index) => {
    thumb.addEventListener("click", function () {
      openViewer(index);
    });
  });

  closeBtn.addEventListener("click", closeViewer);
  nextBtn.addEventListener("click", showNext);
  prevBtn.addEventListener("click", showPrev);

  viewer.addEventListener("click", function (e) {
    if (e.target === viewer) closeViewer();
  });

  document.addEventListener("keydown", function (e) {
    if (!viewer.classList.contains("active")) return;

    if (e.key === "Escape") closeViewer();
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft") showPrev();
  });
});
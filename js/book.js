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

  const hospitalOptions = {
    domestic: [
      { value: "apollo-delhi", label: "Apollo Hospital, Delhi" },
      { value: "fortis-mumbai", label: "Fortis Hospital, Mumbai" },
      { value: "medicover-hyderabad", label: "Medicover Hospital, Hyderabad" },
      { value: "manipal-bengaluru", label: "Manipal Hospital, Bengaluru" },
      { value: "max-saket", label: "Max Super Speciality, Saket" },
      { value: "other", label: "Other Hospital" }
    ],
    international: [
      { value: "cleveland-abu-dhabi", label: "Cleveland Clinic Abu Dhabi" },
      { value: "mount-elizabeth", label: "Mount Elizabeth Hospital, Singapore" },
      { value: "bangkok-hospital", label: "Bangkok Hospital, Bangkok" },
      { value: "mediclinic-dubai", label: "Mediclinic City Hospital, Dubai" },
      { value: "bumrungrad", label: "Bumrungrad International Hospital, Bangkok" },
      { value: "other", label: "Other Hospital" }
    ]
  };

  const transferType = document.getElementById("transferType");
  const fromHospital = document.getElementById("fromHospital");
  const toHospital = document.getElementById("toHospital");
  const fromHospitalOtherWrap = document.getElementById("fromHospitalOtherWrap");
  const toHospitalOtherWrap = document.getElementById("toHospitalOtherWrap");
  const fromHospitalOther = document.getElementById("fromHospitalOther");
  const toHospitalOther = document.getElementById("toHospitalOther");

  function setHospitalOptions(selectEl, type, placeholderText) {
    if (!selectEl) return;

    const list = hospitalOptions[type] || [];
    selectEl.innerHTML = `<option value="">${placeholderText}</option>`;

    list.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.value;
      option.textContent = item.label;
      selectEl.appendChild(option);
    });
  }

  function updateHospitalLists() {
    if (!transferType) return;

    if (transferType.value === "domestic") {
      setHospitalOptions(fromHospital, "domestic", "Select origin hospital");
      setHospitalOptions(toHospital, "domestic", "Select destination hospital");
    } else if (transferType.value === "international") {
      setHospitalOptions(fromHospital, "domestic", "Select origin hospital");
      setHospitalOptions(toHospital, "international", "Select destination hospital");
    } else {
      if (fromHospital) fromHospital.innerHTML = `<option value="">Select transfer type first</option>`;
      if (toHospital) toHospital.innerHTML = `<option value="">Select transfer type first</option>`;
    }

    toggleOtherField(fromHospital, fromHospitalOtherWrap, fromHospitalOther);
    toggleOtherField(toHospital, toHospitalOtherWrap, toHospitalOther);
  }

  function toggleOtherField(selectEl, wrapEl, inputEl) {
    if (!selectEl || !wrapEl || !inputEl) return;

    if (selectEl.value === "other") {
      wrapEl.classList.add("is-visible");
      inputEl.setAttribute("required", "required");
    } else {
      wrapEl.classList.remove("is-visible");
      inputEl.removeAttribute("required");
      inputEl.value = "";
      inputEl.style.borderColor = "";
    }
  }

  if (transferType) {
    transferType.addEventListener("change", updateHospitalLists);
  }

  if (fromHospital) {
    fromHospital.addEventListener("change", function () {
      toggleOtherField(fromHospital, fromHospitalOtherWrap, fromHospitalOther);
    });
  }

  if (toHospital) {
    toHospital.addEventListener("change", function () {
      toggleOtherField(toHospital, toHospitalOtherWrap, toHospitalOther);
    });
  }

  updateHospitalLists();

  const form = document.getElementById("bookingForm");
  const formStatus = document.getElementById("bookingFormStatus");
  const popup = document.getElementById("bookingPopup");
  const popupClose = document.getElementById("bookingPopupClose");
  const popupOk = document.getElementById("bookingPopupOk");
  const summary = document.getElementById("bookingSummary");
  const summaryGrid = document.getElementById("bookingSummaryGrid");

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

  function getResponseTime(urgency) {
    if (urgency === "emergency") return "Estimated review response: within 15–30 minutes";
    if (urgency === "within-24") return "Estimated review response: within 30–60 minutes";
    return "Estimated review response: within 1–2 hours";
  }

  function formatDate(dateValue) {
    if (!dateValue) return "Not provided";
    const date = new Date(dateValue + "T00:00:00");
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }

  function formatTime(timeValue) {
    if (!timeValue) return "Not specified";
    const [hour, minute] = timeValue.split(":");
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit"
    });
  }

  function createRequestNumber() {
    const now = new Date();
    const year = now.getFullYear();
    const code = Math.floor(10000 + Math.random() * 90000);
    return `SR-${year}-${code}`;
  }

  function getSelectedText(selectId) {
    const select = document.getElementById(selectId);
    if (!select) return "";
    return select.options[select.selectedIndex] ? select.options[select.selectedIndex].text : "";
  }

  function renderSummary(data) {
    if (!summary || !summaryGrid) return;

    summaryGrid.innerHTML = `
      <div class="summary-item"><span>Request No.</span><strong>${data.requestNo}</strong></div>
      <div class="summary-item"><span>Submitted On</span><strong>${data.submittedOn}</strong></div>
      <div class="summary-item"><span>Transfer Type</span><strong>${data.transferType}</strong></div>
      <div class="summary-item"><span>Status</span><strong>Pending Confirmation</strong></div>
      <div class="summary-item"><span>Preferred Date</span><strong>${data.transferDate}</strong></div>
      <div class="summary-item"><span>Preferred Time</span><strong>${data.transferTime}</strong></div>
      <div class="summary-item"><span>Urgency</span><strong>${data.urgency}</strong></div>
      <div class="summary-item"><span>Response Time</span><strong>${data.responseTime}</strong></div>
      <div class="summary-item"><span>Route</span><strong>${data.route}</strong></div>
      <div class="summary-item"><span>Service</span><strong>${data.serviceType}</strong></div>
      <div class="summary-item"><span>Treatment Type</span><strong>${data.treatmentType}</strong></div>
      <div class="summary-item"><span>Fleet Preference</span><strong>${data.fleetType}</strong></div>
      <div class="summary-item"><span>Pricing</span><strong>Under Review</strong></div>
      <div class="summary-item"><span>Contact Person</span><strong>${data.fullName}</strong></div>
      <div class="summary-item"><span>Hospital / Organisation</span><strong>${data.organisation || "Not specified"}</strong></div>
    `;

    summary.hidden = false;
    summary.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const requiredFields = form.querySelectorAll("[required]");
    let valid = true;

    requiredFields.forEach((field) => {
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

    const data = {
      requestNo: createRequestNumber(),
      submittedOn: new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
      }),
      transferType: getSelectedText("transferType"),
      urgency: getSelectedText("urgencyLevel"),
      transferDate: formatDate(document.getElementById("transferDate").value),
      transferTime: formatTime(document.getElementById("transferTime").value),
      route: `${document.getElementById("fromCity").value} → ${document.getElementById("toCity").value}`,
      serviceType: getSelectedText("serviceType"),
      treatmentType: getSelectedText("treatmentType"),
      fleetType: getSelectedText("fleetType"),
      fullName: document.getElementById("fullName").value,
      organisation: document.getElementById("organisation").value,
      responseTime: getResponseTime(document.getElementById("urgencyLevel").value)
    };

    formStatus.textContent = "Your transfer request has been received.";
    formStatus.style.color = "#0a7a52";

    renderSummary(data);

    form.reset();
    updateHospitalLists();
    if (fromHospitalOtherWrap) fromHospitalOtherWrap.classList.remove("is-visible");
    if (toHospitalOtherWrap) toHospitalOtherWrap.classList.remove("is-visible");

    openPopup();
  });
});
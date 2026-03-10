document.addEventListener("DOMContentLoaded", () => {
    // Include navbar
    const navbar = document.getElementById("navbar");
    if (navbar) {
        fetch("navbar.html")
            .then(response => response.text())
            .then(data => {
                navbar.innerHTML = data;
                // Re-initialize navbar-related events if needed
            })
            .catch(error => console.error("Error loading navbar:", error));
    }

    // Include footer
    const footer = document.getElementById("site-footer");
    if (footer) {
        fetch("footer.html")
            .then(response => response.text())
            .then(data => {
                footer.innerHTML = data;
            })
            .catch(error => console.error("Error loading footer:", error));
    }
});
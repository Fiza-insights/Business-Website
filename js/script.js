// Gallery filter
const buttons = document.querySelectorAll(".filter-btn");
const items = document.querySelectorAll(".gallery-item");

buttons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    // active button badalna
    buttons.forEach(function (b) { b.classList.remove("active"); });
    btn.classList.add("active");

    // items dikhana ya chhupana
    const filter = btn.getAttribute("data-filter");
    items.forEach(function (item) {
      if (filter === "all" || item.getAttribute("data-category") === filter) {
        item.classList.remove("hide");
      } else {
        item.classList.add("hide");
      }
    });
  });
});
// Contact form validation
const form = document.getElementById("contactForm");

if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    const status = document.getElementById("formStatus");

    let valid = true;

    document.getElementById("nameError").textContent = "";
    document.getElementById("emailError").textContent = "";
    document.getElementById("messageError").textContent = "";
    status.textContent = "";
    status.className = "form-status";

    if (name.length < 2) {
      document.getElementById("nameError").textContent = "Please enter your name (at least 2 letters).";
      valid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      document.getElementById("emailError").textContent = "Please enter a valid email address.";
      valid = false;
    }

    if (message.length < 10) {
      document.getElementById("messageError").textContent = "Message should be at least 10 characters.";
      valid = false;
    }

    if (!valid) return;

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      });

      if (response.ok) {
        status.textContent = "Thank you! Your message has been sent.";
        status.classList.add("ok");
        form.reset();
      } else {
        status.textContent = "Something went wrong. Please try again.";
        status.classList.add("fail");
      }
    } catch (error) {
      status.textContent = "Network error. Please try again.";
      status.classList.add("fail");
    }
  });
}
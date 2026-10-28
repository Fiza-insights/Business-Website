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
// Scroll par cheezein dikhana
const revealItems = document.querySelectorAll(
  ".card, .menu-section, .about-home, .hours, .gallery-item, .contact-form, .contact-info"
);

revealItems.forEach(function (el) { el.classList.add("reveal"); });

const observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealItems.forEach(function (el) { observer.observe(el); });
// ADVANCED ANIMATIONS
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// 1. Scroll progress, navbar shrink, hero parallax
const progress = document.createElement("div");
progress.className = "scroll-progress";
document.body.appendChild(progress);

const siteHeader = document.querySelector(".site-header");
const heroText = document.querySelector(".hero-text");

window.addEventListener("scroll", function () {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";

  if (siteHeader) siteHeader.classList.toggle("scrolled", y > 40);

  if (heroText && !reduceMotion && y < 700) {
    heroText.style.transform = "translateY(" + y * 0.25 + "px)";
    heroText.style.opacity = Math.max(0, 1 - y / 600);
  }
});

// 2. Floating particles in hero
const heroSection = document.querySelector(".hero");
if (heroSection && !reduceMotion) {
  for (let n = 0; n < 18; n++) {
    const p = document.createElement("span");
    p.className = "particle";
    const size = 3 + Math.random() * 6;
    p.style.width = size + "px";
    p.style.height = size + "px";
    p.style.left = Math.random() * 100 + "%";
    p.style.animationDuration = 8 + Math.random() * 10 + "s";
    p.style.animationDelay = Math.random() * 8 + "s";
    heroSection.appendChild(p);
  }
}

// 3. Typing effect
const typeEl = document.querySelector(".hero-text .script");
if (typeEl && !reduceMotion) {
  const fullText = typeEl.textContent;
  let charIndex = 0;
  typeEl.textContent = "";
  typeEl.classList.add("typing");

  function typeNext() {
    typeEl.textContent = fullText.slice(0, charIndex);
    charIndex++;
    if (charIndex <= fullText.length) {
      setTimeout(typeNext, 80);
    } else {
      typeEl.classList.remove("typing");
    }
  }
  setTimeout(typeNext, 900);
}

// 4. 3D tilt on cards
if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
  document.querySelectorAll(".card").forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transition = "transform 0.1s ease";
      card.style.transform =
        "perspective(700px) rotateX(" + (-y * 10) + "deg) rotateY(" + (x * 10) + "deg) translateY(-6px)";
    });
    card.addEventListener("mouseleave", function () {
      card.style.transition = "";
      card.style.transform = "";
    });
  });
}

// 5. Gallery filter pop
document.querySelectorAll(".filter-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    document.querySelectorAll(".gallery-item:not(.hide)").forEach(function (item) {
      item.classList.remove("pop");
      void item.offsetWidth;
      item.classList.add("pop");
    });
  });
});
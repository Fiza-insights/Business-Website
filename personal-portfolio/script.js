const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canHover = window.matchMedia("(hover: hover)").matches;

// 1. Scroll progress, navbar, active link, leaf parallax
const bar = document.querySelector(".scroll-progress");
const header = document.querySelector(".site-header");
const sections = document.querySelectorAll("main section[id]");
const links = document.querySelectorAll(".nav-links a");
const parallaxEls = document.querySelectorAll("[data-speed]");

function onScroll() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  bar.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
  header.classList.toggle("scrolled", y > 40);

  let current = "";
  sections.forEach(function (s) {
    if (y >= s.offsetTop - 160) current = s.id;
  });
  links.forEach(function (a) {
    a.classList.toggle("active", a.getAttribute("href") === "#" + current);
  });

  if (!reduceMotion) {
    parallaxEls.forEach(function (el) {
      const rot = el.dataset.rot || 0;
      el.style.transform = "translateY(" + y * el.dataset.speed + "px) rotate(" + rot + "deg)";
    });
  }
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// 2. Cursor glow
const glow = document.querySelector(".cursor-glow");
if (glow && canHover && !reduceMotion) {
  window.addEventListener("mousemove", function (e) {
    glow.style.transform = "translate(" + (e.clientX - 150) + "px," + (e.clientY - 150) + "px)";
    glow.style.opacity = 1;
  });
}

// 3. Scroll reveal
const revealEls = document.querySelectorAll(
  ".section-head, .about-photo, .about-text, .mission-card, .service-card, .work-tile, .step, .faq-item, .cta-box"
);

revealEls.forEach(function (el, i) {
  el.classList.add("reveal");
  el.style.transitionDelay = (i % 4) * 0.1 + "s";
});

const revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.classList.add("in");
    revealObserver.unobserve(el);
    // animation ke baad class hata dein taake hover aur tilt normal chalein
    setTimeout(function () {
      el.classList.remove("reveal", "in");
      el.style.transitionDelay = "";
    }, 1500);
  });
}, { threshold: 0.15 });

revealEls.forEach(function (el) { revealObserver.observe(el); });

// 4. Number counters
const counters = document.querySelectorAll("[data-count]");

counters.forEach(function (el) {
  el.dataset.final = el.dataset.count;
  el.textContent = "0";
});

const countObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.final);
    countObserver.unobserve(el);

    if (reduceMotion) {
      el.textContent = target;
      return;
    }

    const duration = 1600;
    const startTime = performance.now();

    function tick(now) {
      const p = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}, { threshold: 0.6 });

counters.forEach(function (el) { countObserver.observe(el); });

// 5. Magnetic buttons
if (canHover && !reduceMotion) {
  document.querySelectorAll(".magnetic").forEach(function (btn) {
    btn.addEventListener("mousemove", function (e) {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * 0.25;
      const y = (e.clientY - (r.top + r.height / 2)) * 0.35;
      btn.style.transform = "translate(" + x + "px," + y + "px)";
    });
    btn.addEventListener("mouseleave", function () {
      btn.style.transform = "";
    });
  });
}

// 6. 3D tilt and spotlight on cards
if (canHover) {
  document.querySelectorAll(".tilt").forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      card.style.setProperty("--mx", x + "px");
      card.style.setProperty("--my", y + "px");

      if (!reduceMotion) {
        const px = x / r.width - 0.5;
        const py = y / r.height - 0.5;
        card.style.transition = "transform 0.1s ease";
        card.style.transform =
          "perspective(800px) rotateX(" + (-py * 8) + "deg) rotateY(" + (px * 8) + "deg) translateY(-6px)";
      }
    });
    card.addEventListener("mouseleave", function () {
      card.style.transition = "";
      card.style.transform = "";
    });
  });
}

// 7. Process line animation
const steps = document.querySelector(".steps");
if (steps) {
  const stepsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        steps.classList.add("go");
        stepsObserver.unobserve(steps);
      }
    });
  }, { threshold: 0.4 });
  stepsObserver.observe(steps);
}

// 8. FAQ accordion
const faqItems = document.querySelectorAll(".faq-item");
faqItems.forEach(function (item) {
  item.querySelector(".faq-q").addEventListener("click", function () {
    const wasOpen = item.classList.contains("open");
    faqItems.forEach(function (i) {
      i.classList.remove("open");
      i.querySelector(".faq-q").setAttribute("aria-expanded", "false");
    });
    if (!wasOpen) {
      item.classList.add("open");
      item.querySelector(".faq-q").setAttribute("aria-expanded", "true");
    }
  });
});

// 9. Mobile menu
const menuBtn = document.querySelector(".menu-btn");
const navBox = document.querySelector(".nav-links");
menuBtn.addEventListener("click", function () {
  navBox.classList.toggle("open");
});
navBox.querySelectorAll("a").forEach(function (a) {
  a.addEventListener("click", function () {
    navBox.classList.remove("open");
  });
});
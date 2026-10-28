const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// 1. Scroll progress, navbar shadow, active link
const progress = document.createElement("div");
progress.className = "scroll-progress";
document.body.appendChild(progress);

const header = document.querySelector("header");
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("nav .links a");

window.addEventListener("scroll", function () {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";

  header.classList.toggle("scrolled", y > 40);

  let current = "";
  sections.forEach(function (sec) {
    if (y >= sec.offsetTop - 140) current = sec.id;
  });
  navLinks.forEach(function (a) {
    a.classList.toggle("active", a.getAttribute("href") === "#" + current);
  });
});

// 2. Floating particles in hero
const hero = document.querySelector(".hero");
if (hero && !reduceMotion) {
  for (let n = 0; n < 18; n++) {
    const p = document.createElement("span");
    p.className = "particle";
    const size = 3 + Math.random() * 6;
    p.style.width = size + "px";
    p.style.height = size + "px";
    p.style.left = Math.random() * 100 + "%";
    p.style.animationDuration = 8 + Math.random() * 10 + "s";
    p.style.animationDelay = Math.random() * 8 + "s";
    hero.appendChild(p);
  }
}

// 3. Typing effect
const typeEl = document.querySelector(".hero .script");
if (typeEl && !reduceMotion) {
  const fullText = typeEl.textContent;
  let charIndex = 0;
  typeEl.textContent = "";
  typeEl.classList.add("typing");

  function typeNext() {
    typeEl.textContent = fullText.slice(0, charIndex);
    charIndex++;
    if (charIndex <= fullText.length) {
      setTimeout(typeNext, 90);
    } else {
      typeEl.classList.remove("typing");
    }
  }
  setTimeout(typeNext, 800);
}

// 4. Scroll reveal
const revealItems = document.querySelectorAll(".about-text, .skill, .project, .contact > *");

revealItems.forEach(function (el, i) {
  el.classList.add("reveal");
  el.style.transitionDelay = (i % 6) * 0.08 + "s";
});

const observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      const el = entry.target;
      el.classList.add("show");
      observer.unobserve(el);
      // animation ke baad class hata dein taake hover normal chale
      setTimeout(function () {
        el.classList.remove("reveal", "show");
        el.style.transitionDelay = "";
      }, 1400);
    }
  });
}, { threshold: 0.15 });

revealItems.forEach(function (el) { observer.observe(el); });

// 5. 3D tilt on project cards
if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
  document.querySelectorAll(".project").forEach(function (card) {
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
// Yil
document.getElementById("year").textContent = new Date().getFullYear();

// ===== Mobil menyu =====
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
  document.querySelectorAll(".mobile-link").forEach((link) => {
    link.addEventListener("click", () => mobileMenu.classList.add("hidden"));
  });
}

// ===== Custom cursor ring =====
const ring = document.getElementById("cursorRing");
const isTouch = window.matchMedia("(max-width: 768px)").matches;

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ringX = mouseX;
let ringY = mouseY;

if (!isTouch && ring) {
  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document
    .querySelectorAll(
      "a, button, .project-card, .skill-chip, input, textarea, .icon-orb",
    )
    .forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("hovering"));
      el.addEventListener("mouseleave", () =>
        ring.classList.remove("hovering"),
      );
    });
}

// ===== Liquid blob follows cursor, settles near hovered card =====
const blob = document.getElementById("liquidBlob");
let blobTargetX = mouseX;
let blobTargetY = mouseY;
let blobX = mouseX;
let blobY = mouseY;
let lockedCard = null;

if (!isTouch) {
  window.addEventListener("mousemove", (e) => {
    if (!lockedCard) {
      blobTargetX = e.clientX;
      blobTargetY = e.clientY;
    }
  });
} else {
  blobTargetX = window.innerWidth / 2;
  blobTargetY = window.innerHeight * 0.3;
}

function animateBlob() {
  blobX += (blobTargetX - blobX) * 0.07;
  blobY += (blobTargetY - blobY) * 0.07;
  if (blob) blob.style.transform = `translate(${blobX}px, ${blobY}px)`;
  requestAnimationFrame(animateBlob);
}
animateBlob();

// Morph blob shape gently over time
const morphStates = [
  "42% 58% 65% 35% / 45% 40% 60% 55%",
  "58% 42% 38% 62% / 55% 65% 35% 45%",
  "35% 65% 55% 45% / 40% 50% 50% 60%",
  "60% 40% 45% 55% / 50% 35% 65% 50%",
];
let morphIdx = 0;
setInterval(() => {
  morphIdx = (morphIdx + 1) % morphStates.length;
  if (blob) blob.style.borderRadius = morphStates[morphIdx];
}, 3200);

// Project cards: lock blob position behind the card + push neighbors away
const cards = document.querySelectorAll(".project-card");
cards.forEach((card) => {
  card.addEventListener("mouseenter", () => {
    const rect = card.getBoundingClientRect();
    lockedCard = card;
    blobTargetX = rect.left + rect.width / 2;
    blobTargetY = rect.top + rect.height / 2;
    cards.forEach((other) => {
      if (other !== card) {
        other.style.transform = "translateY(-2px) scale(0.97)";
        other.style.opacity = "0.72";
      }
    });
  });
  card.addEventListener("mouseleave", () => {
    lockedCard = null;
    cards.forEach((other) => {
      other.style.transform = "";
      other.style.opacity = "";
    });
  });
});

// ===== Reveal-on-scroll =====
const revealEls = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.12 },
);
revealEls.forEach((el) => revealObserver.observe(el));

// ===== Slow parallax on scroll =====
const parallaxEls = document.querySelectorAll(".parallax");
function updateParallax() {
  const y = window.scrollY;
  parallaxEls.forEach((el) => {
    const speed = parseFloat(el.dataset.speed || "0.08");
    el.style.transform = `translateY(${y * speed}px)`;
  });
}

// ===== Active nav link highlight =====
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");
function updateActiveNav() {
  const scrollPos = window.scrollY + window.innerHeight / 3;
  let currentId = "";
  sections.forEach((sec) => {
    if (sec.offsetTop <= scrollPos) currentId = sec.id;
  });
  navLinks.forEach((link) => {
    link.classList.toggle(
      "active",
      link.getAttribute("href") === "#" + currentId,
    );
  });
}

let ticking = false;
function onScroll() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateParallax();
      updateActiveNav();
      ticking = false;
    });
    ticking = true;
  }
}
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("load", () => {
  updateParallax();
  updateActiveNav();
  revealEls.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) el.classList.add("visible");
  });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    if (targetId.length > 1) {
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 60, behavior: "smooth" });
      }
    }
  });
});

const TELEGRAM_BOT_TOKEN = "8660942777:AAHhgUzXXVHvLVjHax4yP8OyD3DBtIyqLdg";
const TELEGRAM_CHAT_ID = "1283078130";
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const submitButton = document.getElementById("contactSubmit");

function setFormStatus(message, type = "info") {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.className = `form-status ${type}`;
}

async function sendTelegramMessage({ name, email, subject, message }) {
  const text =
    `📩 Yangi bog'lanish so'rovi:%0A%0A` +
    `Ism: ${encodeURIComponent(name)}%0A` +
    `Email: ${encodeURIComponent(email)}%0A` +
    `Mavzu: ${encodeURIComponent(subject)}%0A%0A` +
    `Xabar:%0A${encodeURIComponent(message)}`;

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${text}&parse_mode=HTML`;

  const response = await fetch(url, { method: "GET" });
  return response.json();
}

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!submitButton) return;

    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const subject = document.getElementById("contactSubject").value.trim();
    const message = document.getElementById("contactMessage").value.trim();

    if (!name || !email || !subject || !message) {
      setFormStatus("Iltimos, barcha maydonlarni to‘ldiring.", "error");
      return;
    }

    setFormStatus("Xabar yuborilmoqda… Iltimos kuting.", "pending");
    submitButton.disabled = true;
    submitButton.classList.add("opacity-70", "cursor-not-allowed");

    try {
      const result = await sendTelegramMessage({
        name,
        email,
        subject,
        message,
      });
      if (result.ok) {
        setFormStatus(
          "Xabaringiz muvaffaqiyatli yuborildi — tez orada javob beraman!",
          "success",
        );
        contactForm.reset();
      } else {
        console.error("Telegram response error:", result);
        setFormStatus(
          "Xabar yuborishda xatolik yuz berdi. Iltimos qayta urinib ko‘ring.",
          "error",
        );
      }
    } catch (err) {
      console.error("Telegram fetch failed:", err);
      setFormStatus(
        "Tarmoq xatosi yuz berdi. Internet aloqangizni tekshiring.",
        "error",
      );
    } finally {
      submitButton.disabled = false;
      submitButton.classList.remove("opacity-70", "cursor-not-allowed");
    }
  });
}

// "Tez kunda" tooltip click feedback for coming-soon links
document.querySelectorAll(".coming-soon").forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
  });
});

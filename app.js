/* PULSE EMS Studio — app.js (no build tools, 100% free) */
/* Booking link: replace with your Setmore URL (free plan works) */
const BOOKING_URL = "https://YOUR-SETMORE-LINK.setmore.com";

const SELECTORS = {
  transition: "#transition",
  transitionPath: "#transitionPath",
  heroBlob: "#heroBlobPath",
  toast: "#toast",
  mobileBtn: "#mobileBtn",
  mobileMenu: "#mobileMenu",
};

const PATHS = {
  rect: "M0,0H1000V1000H0Z",
  blobA:
    "M0,160 C180,40 320,10 500,80 C690,155 820,30 1000,120 V1000 C820,900 620,1030 430,970 C240,910 120,1040 0,920 Z",
  blobB:
    "M0,120 C160,0 360,80 520,70 C720,55 840,10 1000,160 V1000 C820,940 680,860 520,940 C340,1030 160,940 0,1000 Z",
  blobC:
    "M0,220 C160,60 300,120 460,90 C660,55 860,70 1000,210 V1000 C880,960 720,900 540,960 C330,1030 180,950 0,980 Z",
};

function qs(sel) {
  return document.querySelector(sel);
}

function setActiveNav() {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("a[data-nav]").forEach((a) => {
    const href = (a.getAttribute("href") || "").split("/").pop();
    if (href === path) a.classList.add("active");
  });
}

function wireBookingLinks() {
  document.querySelectorAll("a.js-book").forEach((a) => {
    a.setAttribute("href", BOOKING_URL);
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener");
  });
}

function showToast(text) {
  const el = qs(SELECTORS.toast);
  if (!el) return;
  el.textContent = text;
  el.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => el.classList.remove("show"), 2200);
}

/* ---------- Morph helpers (flubber) ---------- */
function morphPath(pathEl, fromD, toD, duration = 650, easing = (t) => t) {
  if (!window.flubber || !pathEl) return Promise.resolve();
  const interp = window.flubber.interpolate(fromD, toD, { maxSegmentLength: 8 });
  const start = performance.now();
  return new Promise((resolve) => {
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const et = easing(t);
      pathEl.setAttribute("d", interp(et));
      if (t < 1) requestAnimationFrame(tick);
      else resolve();
    }
    requestAnimationFrame(tick);
  });
}

const easeInOut = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

async function transitionOut() {
  const wrap = qs(SELECTORS.transition);
  const path = qs(SELECTORS.transitionPath);
  if (!wrap || !path) {
    document.body.classList.remove("is-loading");
    return;
  }

  // Start covered
  wrap.style.transform = "translateY(0%)";
  wrap.style.opacity = "1";
  path.setAttribute("d", PATHS.rect);

  // Reveal: morph + slide out
  const slide = wrap.animate(
    [{ transform: "translateY(0%)" }, { transform: "translateY(-110%)" }],
    { duration: 720, easing: "cubic-bezier(.2,.9,.2,1)", fill: "forwards" }
  );

  // small morphs while sliding
  await morphPath(path, PATHS.rect, PATHS.blobA, 520, easeInOut);
  await morphPath(path, PATHS.blobA, PATHS.blobB, 420, easeInOut);

  await slide.finished.catch(() => {});
  document.body.classList.remove("is-loading");
  wrap.style.transform = "translateY(-110%)";
}

async function transitionIn(url) {
  const wrap = qs(SELECTORS.transition);
  const path = qs(SELECTORS.transitionPath);
  if (!wrap || !path) return (location.href = url);

  wrap.style.opacity = "1";
  wrap.style.transform = "translateY(-110%)";
  path.setAttribute("d", PATHS.blobB);

  // Cover: slide in + morph to a crisp rectangle (luxury “snap”)
  const slide = wrap.animate(
    [{ transform: "translateY(-110%)" }, { transform: "translateY(0%)" }],
    { duration: 520, easing: "cubic-bezier(.2,.9,.2,1)", fill: "forwards" }
  );

  await morphPath(path, PATHS.blobB, PATHS.blobC, 260, easeInOut);
  await morphPath(path, PATHS.blobC, PATHS.rect, 260, easeInOut);

  await slide.finished.catch(() => {});
  location.href = url;
}

function wirePageTransitions() {
  // Only internal navigation links (multi-page)
  document.querySelectorAll("a[data-transition]").forEach((a) => {
    a.addEventListener("click", (e) => {
      const url = a.getAttribute("href");
      if (!url) return;

      // Ignore booking/external links
      const isExternal =
        url.startsWith("http") ||
        url.startsWith("mailto:") ||
        a.classList.contains("js-book") ||
        a.getAttribute("target") === "_blank";
      if (isExternal) return;

      // Ignore same-page hashes
      if (url.startsWith("#")) return;

      e.preventDefault();
      transitionIn(url);
    });
  });
}

/* ---------- Hero blob loop ---------- */
function loopHeroBlob() {
  const path = qs(SELECTORS.heroBlob);
  if (!path || !window.flubber) return;

  let current = PATHS.blobA;
  const seq = [PATHS.blobB, PATHS.blobC, PATHS.blobA];

  async function run() {
    for (const next of seq) {
      await morphPath(path, current, next, 2400, easeInOut);
      current = next;
    }
    run();
  }
  run();
}

/* ---------- Mobile menu ---------- */
function wireMobileMenu() {
  const btn = qs(SELECTORS.mobileBtn);
  const menu = qs(SELECTORS.mobileMenu);
  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });

  menu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => menu.classList.remove("open"));
  });
}

/* ---------- Contact “free form” (mailto) ---------- */
function wireMailtoForm() {
  const form = document.querySelector("form[data-mailto]");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.querySelector("[name=name]")?.value?.trim() || "";
    const email = form.querySelector("[name=email]")?.value?.trim() || "";
    const msg = form.querySelector("[name=message]")?.value?.trim() || "";
    const subject = encodeURIComponent("Richiesta informazioni — PULSE EMS Studio");
    const body = encodeURIComponent(
      `Nome: ${name}\nEmail: ${email}\n\nMessaggio:\n${msg}\n`
    );

    const to = form.getAttribute("data-mailto") || "info@pulseems.it";
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    showToast("Apro la tua email con il messaggio pronto ✅");
  });
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  setActiveNav();
  wireBookingLinks();
  wirePageTransitions();
  wireMobileMenu();
  wireMailtoForm();
  loopHeroBlob();
  // Reveal transition after fonts paint
  requestAnimationFrame(() => transitionOut());
});

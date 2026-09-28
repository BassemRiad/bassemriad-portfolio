/* ---------- Footer year ---------- */
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- Mobile nav toggle ---------- */
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
navToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", open ? "true" : "false");
});
navLinks.querySelectorAll("a").forEach(a =>
  a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  })
);

/* ---------- Hero mouse-tracking glow (home page only) ---------- */
const hero = document.querySelector(".hero");
const heroGlow = document.getElementById("heroGlow");
if (hero && heroGlow && window.matchMedia("(hover: hover)").matches) {
  hero.addEventListener("pointermove", e => {
    const rect = hero.getBoundingClientRect();
    heroGlow.style.setProperty("--mx", ((e.clientX - rect.left) / rect.width) * 100 + "%");
    heroGlow.style.setProperty("--my", ((e.clientY - rect.top) / rect.height) * 100 + "%");
  });
}

/* ---------- Live GitHub feed (home page only) ---------- */
const githubFeed = document.getElementById("githubFeed");
if (githubFeed) {
  const escapeHtml = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const timeAgo = iso => {
    const days = Math.floor((Date.now() - new Date(iso)) / 86400000);
    if (days < 1) return "today";
    if (days === 1) return "yesterday";
    if (days < 30) return `${days}d ago`;
    if (days < 365) return `${Math.floor(days / 30)}mo ago`;
    return `${Math.floor(days / 365)}y ago`;
  };

  fetch("https://api.github.com/users/BassemRiad/repos?sort=updated&per_page=6")
    .then(res => {
      if (!res.ok) throw new Error("GitHub API error");
      return res.json();
    })
    .then(repos => {
      const own = repos.filter(r => !r.fork);
      if (!own.length) {
        githubFeed.innerHTML = '<p class="github-feed-status">No public repos yet.</p>';
        return;
      }
      githubFeed.innerHTML = own.map(r => `
        <a class="github-repo" href="${r.html_url}" target="_blank" rel="noopener">
          <div class="github-repo-head">
            <h3>${escapeHtml(r.name)}</h3>
            ${r.language ? `<span class="github-lang">${escapeHtml(r.language)}</span>` : ""}
          </div>
          <p>${r.description ? escapeHtml(r.description) : "No description yet."}</p>
          <span class="github-repo-meta">★ ${r.stargazers_count} · updated ${timeAgo(r.updated_at)}</span>
        </a>
      `).join("");
    })
    .catch(() => {
      githubFeed.innerHTML = '<p class="github-feed-status">Couldn’t load live data right now — <a href="https://github.com/BassemRiad" target="_blank" rel="noopener">view on GitHub →</a></p>';
    });
}

/* ---------- Scroll-reveal for page content ---------- */
const revealTargets = document.querySelectorAll(
  ".hub-grid, .github-feed, .about-grid, .skills-grid, .cert-grid, .roadmap-list, .project-card-featured, .project-grid-minor, .timeline, .contact-wrap"
);
revealTargets.forEach(el => el.classList.add("reveal"));

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (prefersReducedMotion) {
  revealTargets.forEach(el => el.classList.add("in"));
} else {
  const reveal = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          reveal.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealTargets.forEach(el => reveal.observe(el));
}

/* ---------- Contact form (front-end only, no backend — contact.html only) ---------- */
const contactForm = document.getElementById("contactForm");
const contactStatus = document.getElementById("contactStatus");

if (contactForm) {
  contactForm.addEventListener("submit", e => {
    e.preventDefault();
    if (!contactForm.checkValidity()) {
      contactStatus.textContent = "Please fill in every field with a valid email.";
      contactStatus.style.color = "var(--accent-2)";
      return;
    }
    contactStatus.style.color = "var(--accent)";
    contactStatus.textContent = "Message ready — this demo form doesn't send anywhere yet.";
    contactForm.reset();
  });
}

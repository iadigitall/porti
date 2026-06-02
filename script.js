// ===== Modal Logic =====
function openModal(imgSrc) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');
  modalImg.src = imgSrc;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('imageModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

document.addEventListener("DOMContentLoaded", () => {
  if (typeof lucide !== "undefined") lucide.createIcons();

  // ===== Scroll progress =====
  const setProgress = () => {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const p = scrollHeight > 0 ? (scrollTop / scrollHeight) : 0;
    document.documentElement.style.setProperty("--prog", (p * 100).toFixed(2) + "%");
  };

  // ===== Background Parallax =====
  const setParallax = () => {
    const doc = document.documentElement;
    const y = doc.scrollTop || document.body.scrollTop;
    const p1y = (y * -0.03).toFixed(2) + "px";
    const p2y = (y * -0.05).toFixed(2) + "px";
    const p3y = (y * -0.02).toFixed(2) + "px";
    doc.style.setProperty("--p1y", p1y);
    doc.style.setProperty("--p2y", p2y);
    doc.style.setProperty("--p3y", p3y);
  };

  // ===== Topbar Scroll Class =====
  const topbar = document.getElementById("topbar");
  const toggleTopbar = () => {
    if (window.scrollY > 50) {
      topbar.classList.add("scrolled");
    } else {
      topbar.classList.remove("scrolled");
    }
  };
  toggleTopbar();

  // ===== Mouse Movement Effect (Hero Shine) =====
  let mx = 0, my = 0;
  const onMove = (e) => {
    const w = window.innerWidth || 1;
    const h = window.innerHeight || 1;
    mx = ((e.clientX / w) - 0.5) * 2;
    my = ((e.clientY / h) - 0.5) * 2;
    document.documentElement.style.setProperty("--mx", mx.toFixed(3));
    document.documentElement.style.setProperty("--my", my.toFixed(3));
  };
  window.addEventListener("mousemove", onMove, { passive: true });

  // ===== Cinematographic Reveal on Scroll =====
  const reveals = document.querySelectorAll(".reveal");
  const enableExit = true;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        e.target.classList.remove("out");
      } else if (enableExit && e.target.classList.contains("visible")) {
        // Only apply exit state when scrolled above viewport
        const rect = e.target.getBoundingClientRect();
        if (rect.bottom < 0) {
          e.target.classList.add("out");
        }
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" });

  reveals.forEach((el) => obs.observe(el));

  // ===== Stagger items layout auto-delay =====
  document.querySelectorAll(".stagger").forEach((wrap) => {
    const kids = wrap.querySelectorAll(".reveal");
    kids.forEach((k, idx) => {
      if (!k.style.getPropertyValue("--i")) k.style.setProperty("--i", String(idx));
    });
  });

  // ===== To Top Button =====
  const toTop = document.getElementById("toTop");
  const toggleTop = () => {
    if (window.scrollY > 900) toTop.classList.add("show");
    else toTop.classList.remove("show");
  };
  toggleTop();
  window.addEventListener("scroll", toggleTop, { passive: true });

  toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ===== Card Hover Tilt Effect =====
  const tiltItems = document.querySelectorAll("[data-tilt]");
  const supportsHover = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
  const tiltMax = 5;
  const tiltScale = 1.01;

  if (supportsHover) {
    tiltItems.forEach((card) => {
      let raf = null;
      const rectOf = () => card.getBoundingClientRect();
      const onEnter = () => card.classList.add("tilt");
      const onLeave = () => {
        if (raf) cancelAnimationFrame(raf);
        card.style.transform = "";
        card.classList.remove("tilt");
      };
      const onMoveTilt = (e) => {
        const r = rectOf();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const ry = (px - 0.5) * (tiltMax * 2);
        const rx = (0.5 - py) * (tiltMax * 2);
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.transform = `perspective(800px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(${tiltScale})`;
        });
      };
      card.addEventListener("mouseenter", onEnter);
      card.addEventListener("mouseleave", onLeave);
      card.addEventListener("mousemove", onMoveTilt, { passive: true });
    });
  }


  // ===== Projects Category Filtering =====
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectItems = document.querySelectorAll(".project-item");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      // Toggle active class on buttons
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const filter = button.getAttribute("data-filter");

      projectItems.forEach(item => {
        const category = item.getAttribute("data-category");
        if (filter === "all" || category === filter) {
          item.style.display = "block";
          // Re-trigger visual reveal if needed
          setTimeout(() => {
            item.classList.add("visible");
            item.classList.remove("out");
          }, 50);
        } else {
          item.style.display = "none";
        }
      });
    });
  });

  // ===== Combined scroll handlers =====
  const onScroll = () => {
    setProgress();
    setParallax();
    toggleTopbar();
    toggleTop();
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
});
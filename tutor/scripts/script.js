document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  /* ---------- Reveal on scroll ---------- */
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -8% 0px"
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ---------- Mobile menu ---------- */
  const menuButton = document.querySelector(".menu-button");
  const mobileMenu = document.querySelector(".mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-menu a");

  function closeMenu() {
    menuButton.classList.remove("active");
    menuButton.setAttribute("aria-expanded", "false");
    mobileMenu.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", "true");
    body.classList.remove("menu-open");
  }

  menuButton?.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("open");
    menuButton.classList.toggle("active", open);
    menuButton.setAttribute("aria-expanded", String(open));
    mobileMenu.setAttribute("aria-hidden", String(!open));
    body.classList.toggle("menu-open", open);
  });

  mobileLinks.forEach(link => link.addEventListener("click", closeMenu));

  /* ---------- Current year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Custom cursor ---------- */
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");

  if (dot && ring && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener("mousemove", event => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    });

    function animateCursor() {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;

      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;

      requestAnimationFrame(animateCursor);
    }

    animateCursor();

    document.querySelectorAll("a, button, .service, .method-card, .photo-frame").forEach(el => {
      el.addEventListener("mouseenter", () => body.classList.add("cursor-hover"));
      el.addEventListener("mouseleave", () => body.classList.remove("cursor-hover"));
    });
  }

  /* ---------- Magnetic buttons ---------- */
  const magneticItems = document.querySelectorAll(".magnetic");

  magneticItems.forEach(item => {
    item.addEventListener("mousemove", event => {
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

      const rect = item.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      item.style.transform = `translate(${x * 0.10}px, ${y * 0.10}px)`;
    });

    item.addEventListener("mouseleave", () => {
      item.style.transform = "";
    });
  });

  /* ---------- Hide/show header on scroll ---------- */
  let previousScroll = window.scrollY;

  window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;
    const header = document.querySelector(".header");

    if (!header || body.classList.contains("menu-open")) return;

    if (currentScroll > previousScroll && currentScroll > 120) {
      header.style.transform = "translateY(-100%)";
    } else {
      header.style.transform = "translateY(0)";
    }

    previousScroll = currentScroll;
  }, { passive: true });

/* ---------- Offer gate modal ---------- */
const offerModal = document.getElementById("offer-modal");
const offerAccept = document.getElementById("offer-modal-accept");
const offerGates = document.querySelectorAll(".js-offer-gate");
let pendingHref = null;
let pendingTarget = null;

function openOfferModal(href, target) {
  if (!offerModal) return;
  pendingHref = href;
  pendingTarget = target || "_self";
  offerModal.classList.add("is-open");
  offerModal.setAttribute("aria-hidden", "false");
  body.classList.add("offer-modal-open");
}

function closeOfferModal() {
  if (!offerModal) return;
  offerModal.classList.remove("is-open");
  offerModal.setAttribute("aria-hidden", "true");
  body.classList.remove("offer-modal-open");
  pendingHref = null;
  pendingTarget = null;
}

offerGates.forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    openOfferModal(link.href, link.getAttribute("target") || "_self");
  });
});

offerAccept?.addEventListener("click", () => {
  if (!pendingHref) {
    closeOfferModal();
    return;
  }
  const href = pendingHref;
  const target = pendingTarget;
  closeOfferModal();
  if (target === "_blank") {
    window.open(href, "_blank", "noopener,noreferrer");
  } else {
    window.location.href = href;
  }
});

offerModal?.querySelectorAll("[data-close-modal]").forEach(el => {
  el.addEventListener("click", closeOfferModal);
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && offerModal?.classList.contains("is-open")) {
    closeOfferModal();
  }
});

});

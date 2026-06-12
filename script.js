(function () {
  var CTA_LINK = "https://sndflw.com/l/E7eypbb6aDkGzLgosCHE";
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll(".js-cta").forEach(function (link) {
    link.href = CTA_LINK;
    link.addEventListener("click", function () {
      link.classList.add("tapped");
      window.setTimeout(function () { link.classList.remove("tapped"); }, 220);
    });
  });

  var revealItems = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window && !reducedMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });

    revealItems.forEach(function (item) { revealObserver.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add("in"); });
  }

  function formatCount(value) {
    if (value >= 1000) {
      return (value / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 }).replace(",0", "") + "k";
    }
    return value.toLocaleString("pt-BR");
  }

  function animateCounter(el) {
    var target = Number(el.getAttribute("data-count") || 0);
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    var start = null;
    var duration = 1150;

    function tick(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(target * eased);
      el.textContent = prefix + formatCount(value) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  var counters = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
  if ("IntersectionObserver" in window && !reducedMotion) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (counter) { counterObserver.observe(counter); });
  } else {
    counters.forEach(function (counter) {
      var prefix = counter.getAttribute("data-prefix") || "";
      var suffix = counter.getAttribute("data-suffix") || "";
      counter.textContent = prefix + formatCount(Number(counter.getAttribute("data-count") || 0)) + suffix;
    });
  }

  function setupCarousel(name) {
    var carousel = document.querySelector('[data-carousel="' + name + '"]');
    var dotsBox = document.querySelector('[data-dots="' + name + '"]');
    if (!carousel || !dotsBox) return;

    var cards = Array.prototype.slice.call(carousel.children);
    cards.forEach(function (_, index) {
      var dot = document.createElement("i");
      if (index === 0) dot.classList.add("on");
      dotsBox.appendChild(dot);
    });

    var dots = Array.prototype.slice.call(dotsBox.children);

    function syncDots() {
      var cardWidth = cards[0].getBoundingClientRect().width + 14;
      var current = Math.round(carousel.scrollLeft / cardWidth);
      dots.forEach(function (dot, index) {
        dot.classList.toggle("on", index === current);
      });
    }

    carousel.addEventListener("scroll", function () {
      window.requestAnimationFrame(syncDots);
    }, { passive: true });
  }

  setupCarousel("results");

  var timeline = document.getElementById("timeline");
  var timelineFill = document.getElementById("timelineFill");
  function updateTimeline() {
    if (!timeline || !timelineFill) return;
    var box = timeline.getBoundingClientRect();
    var trigger = window.innerHeight * 0.72;
    var progress = Math.max(0, Math.min(1, (trigger - box.top) / Math.max(box.height, 1)));
    timelineFill.style.transform = "scaleY(" + progress + ")";
  }

  if (!reducedMotion) {
    window.addEventListener("scroll", updateTimeline, { passive: true });
    window.addEventListener("resize", updateTimeline);
    updateTimeline();
  } else if (timelineFill) {
    timelineFill.style.transform = "scaleY(1)";
  }

  var heroMedia = document.querySelector(".hero-media img");
  function updateParallax() {
    if (!heroMedia || reducedMotion) return;
    var y = Math.min(window.scrollY * 0.08, 34);
    heroMedia.style.transform = "translateY(" + y + "px)";
  }
  window.addEventListener("scroll", updateParallax, { passive: true });

  var lightbox = document.getElementById("lightbox");
  var lightboxImg = lightbox ? lightbox.querySelector("img") : null;
  var lightboxText = lightbox ? lightbox.querySelector("p") : null;
  var closeLightbox = lightbox ? lightbox.querySelector(".lightbox-close") : null;

  function openLightbox(src, caption, alt) {
    if (!lightbox || !lightboxImg || !lightboxText) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || caption || "Imagem ampliada";
    lightboxText.textContent = caption || "";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function hideLightbox() {
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    window.setTimeout(function () { lightboxImg.src = ""; }, 180);
  }

  document.querySelectorAll(".zoomable").forEach(function (button) {
    button.addEventListener("click", function () {
      var img = button.querySelector("img");
      openLightbox(button.getAttribute("data-full"), button.getAttribute("data-caption"), img ? img.alt : "");
    });
  });

  if (closeLightbox) closeLightbox.addEventListener("click", hideLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) hideLightbox();
    });
  }
  window.addEventListener("keydown", function (event) {
    if (event.key === "Escape") hideLightbox();
  });
})();

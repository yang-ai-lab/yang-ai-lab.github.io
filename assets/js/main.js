(function () {
  var menuButton = document.querySelector("[data-menu-toggle]");
  var navLinks = document.querySelector(".nav-links");

  if (menuButton && navLinks) {
    menuButton.addEventListener("click", function () {
      navLinks.classList.toggle("open");
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll(".teaser-slide"));
  var teaserTitle = document.querySelector("[data-teaser-title]");
  var teaserMeta = document.querySelector("[data-teaser-meta]");
  var teaserLink = document.querySelector("[data-teaser-link]");
  var carouselDots = document.querySelector(".carousel-dots");
  var activeSlide = 0;
  var carouselDelay = 5200;
  var carouselTimer = null;

  if (slides.length && carouselDots) {
    slides.forEach(function (_slide, slideIndex) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "Show highlight " + (slideIndex + 1));
      dot.addEventListener("click", function () {
        showSlide(slideIndex);
        resetCarouselTimer();
      });
      carouselDots.appendChild(dot);
    });
  }

  function showSlide(index) {
    if (!slides.length) return;
    activeSlide = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle("active", slideIndex === activeSlide);
    });
    if (carouselDots) {
      Array.prototype.slice.call(carouselDots.querySelectorAll("button")).forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === activeSlide);
      });
    }

    var slide = slides[activeSlide];
    if (teaserTitle) teaserTitle.textContent = slide.getAttribute("data-title") || "";
    if (teaserMeta) teaserMeta.textContent = slide.getAttribute("data-meta") || "";
    if (teaserLink) teaserLink.href = slide.getAttribute("data-href") || "#";
  }

  document.querySelectorAll("[data-teaser-step]").forEach(function (button) {
    button.addEventListener("click", function () {
      showSlide(activeSlide + Number(button.getAttribute("data-teaser-step")));
      resetCarouselTimer();
    });
  });

  function resetCarouselTimer() {
    if (!slides.length) return;
    window.clearTimeout(carouselTimer);
    carouselTimer = window.setTimeout(function () {
      showSlide(activeSlide + 1);
      resetCarouselTimer();
    }, carouselDelay);
  }

  if (slides.length) {
    showSlide(0);
    resetCarouselTimer();
  }

  var newsList = document.querySelector("[data-news-list]");
  var newsMoreButton = document.querySelector("[data-news-more]");

  if (newsList && newsMoreButton) {
    var newsItems = Array.prototype.slice.call(newsList.querySelectorAll("li"));
    var visibleNewsCount = 6;

    function updateNewsList() {
      newsItems.forEach(function (item, index) {
        item.classList.toggle("is-hidden", index >= visibleNewsCount);
      });

      if (visibleNewsCount >= newsItems.length) {
        newsMoreButton.hidden = true;
      }
    }

    newsMoreButton.addEventListener("click", function () {
      visibleNewsCount += 10;
      updateNewsList();
    });

    updateNewsList();
  }

  var filterButtons = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var filter = button.getAttribute("data-filter");
      filterButtons.forEach(function (item) {
        item.classList.toggle("active", item === button);
      });

      document.querySelectorAll(".pub-card").forEach(function (card) {
        var topics = card.getAttribute("data-topics") || "";
        card.style.display = filter === "all" || topics.indexOf(filter) !== -1 ? "" : "none";
      });

      document.querySelectorAll(".year-block").forEach(function (block) {
        var visible = block.querySelectorAll('.pub-card:not([style*="display: none"])').length;
        block.style.display = visible ? "" : "none";
      });
    });
  });
})();

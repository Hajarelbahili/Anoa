"use strict";

/* =========================================================
   DOM ELEMENTS
========================================================= */

const elements = {
  // Product options
  productOptions: document.querySelectorAll(".product-option"),

  // Order form
  orderForm: document.querySelectorAll(".order-form"),

  // Success modal
  successModal: document.getElementById("successModal"),
  popupName: document.getElementById("popupName"),
  popupProduct: document.getElementById("popupProduct"),
  popupPrice: document.getElementById("popupPrice"),
  closeSuccessModal: document.getElementById("closeSuccessModal"),
  popupContinue: document.getElementById("popupContinue"),
  modalOverlay: document.querySelector(".success-modal__overlay"),

  // Navigation
  stickyOrderButton: document.getElementById("stickyOrderButton"),
  scrollTopButton: document.getElementById("scrollTop"),

  // Phone
  phoneInput: document.getElementById("telephone"),

  // Comparison
  comparisonButton: document.getElementById("comparisonButton"),

  // Testimonials slider
  slider: document.querySelector(".slider"),
  testimonials: document.querySelector(".testimonials"),
  sliderDots: document.querySelectorAll(".slider-dots button"),

  // Order section
  orderSection: document.getElementById("commande"),
};

/* =========================================================
   PRODUCT OPTIONS
========================================================= */

function initProductOptions() {
  const orderForms = document.querySelectorAll(".order-form");

  orderForms.forEach((form) => {
    const productOptions = form.querySelectorAll(".product-option");

    productOptions.forEach((option) => {
      option.addEventListener("click", () => {
        productOptions.forEach((item) => {
          item.classList.remove("active");
        });

        option.classList.add("active");

        const radio = option.querySelector('input[type="radio"]');

        if (radio) {
          radio.checked = true;
        }
      });
    });
  });
}

/* =========================================================
   ORDER DATA
========================================================= */

function getOrderData(form) {
  if (!form) {
    return null;
  }

  const formData = new FormData(form);

  const selectedProduct = form.querySelector('input[name="product"]:checked');

  if (!selectedProduct) {
    return null;
  }

  return {
    nom: formData.get("nom"),
    telephone: formData.get("telephone"),
    ville: formData.get("ville"),

    produit: selectedProduct.dataset.product,

    prix: `${selectedProduct.dataset.price} DH`,
  };
}

/* =========================================================
   SUCCESS MODAL
========================================================= */

function showSuccessModal(order) {
  if (!elements.successModal) {
    return;
  }

  if (elements.popupName) {
    elements.popupName.textContent = ` ${order.nom}`;
  }

  if (elements.popupProduct) {
    elements.popupProduct.textContent = order.produit;
  }

  if (elements.popupPrice) {
    elements.popupPrice.textContent = order.prix;
  }

  elements.successModal.classList.add("show");
}

function resetOrderForm(form) {
  if (!form) {
    return;
  }

  form.reset();

  const productOptions = form.querySelectorAll(".product-option");

  productOptions.forEach((option) => {
    option.classList.remove("active");
  });

  const firstProduct = form.querySelector('input[name="product"][value="1"]');

  if (firstProduct) {
    firstProduct.checked = true;

    firstProduct.closest(".product-option")?.classList.add("active");
  }
}

function closeSuccessModal() {
  elements.successModal?.classList.remove("show");

  if (activeOrderForm) {
    resetOrderForm(activeOrderForm);

    activeOrderForm = null;
  }
}

/* =========================================================
   ORDER FORM
========================================================= */
let activeOrderForm = null;

function initOrderForm() {
  const orderForms = document.querySelectorAll(".order-form");

  if (!orderForms.length) {
    return;
  }

  orderForms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const order = getOrderData(form);

      if (!order) {
        alert("Veuillez choisir une offre.");
        return;
      }

      // Mémorise LE formulaire qui vient d'être envoyé
      activeOrderForm = form;

      console.log("Commande :", order);

      showSuccessModal(order);
    });
  });
}

/* =========================================================
   SUCCESS MODAL EVENTS
========================================================= */

function initSuccessModal() {
  if (!elements.successModal) {
    return;
  }

  // Close button
  elements.closeSuccessModal?.addEventListener("click", closeSuccessModal);

  // Continue button
  elements.popupContinue?.addEventListener("click", closeSuccessModal);

  // Overlay
  elements.modalOverlay?.addEventListener("click", closeSuccessModal);

  // Escape key
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      elements.successModal.classList.contains("show")
    ) {
      closeSuccessModal();
    }
  });
}

/* =========================================================
   STICKY ORDER CTA
========================================================= */

function initStickyOrderButton() {
  elements.stickyOrderButton?.addEventListener("click", () => {
    elements.orderSection?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

/* =========================================================
   SCROLL TOP
========================================================= */

function initScrollTop() {
  elements.scrollTopButton?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

/* =========================================================
   COUNTDOWN
========================================================= */

function initCountdown() {
  if (!elements.hours || !elements.minutes || !elements.seconds) {
    return;
  }

  /*
   * Exemple actuel :
   * 2 heures 45 minutes 32 secondes
   *
   * Pour une vraie offre commerciale,
   * il vaut mieux utiliser une deadline réelle.
   */

  let countdownTime = {
    hours: 2,
    minutes: 45,
    seconds: 32,
  };

  function updateCountdown() {
    let { hours, minutes, seconds } = countdownTime;

    // Countdown terminé
    if (hours === 0 && minutes === 0 && seconds === 0) {
      return;
    }

    // Seconds
    if (seconds > 0) {
      seconds--;
    } else {
      seconds = 59;

      // Minutes
      if (minutes > 0) {
        minutes--;
      } else {
        minutes = 59;

        // Hours
        if (hours > 0) {
          hours--;
        }
      }
    }

    countdownTime = {
      hours,
      minutes,
      seconds,
    };

    // Update DOM
    elements.hours.textContent = String(hours).padStart(2, "0");

    elements.minutes.textContent = String(minutes).padStart(2, "0");

    elements.seconds.textContent = String(seconds).padStart(2, "0");
  }

  // Initial display
  elements.hours.textContent = String(countdownTime.hours).padStart(2, "0");

  elements.minutes.textContent = String(countdownTime.minutes).padStart(2, "0");

  elements.seconds.textContent = String(countdownTime.seconds).padStart(2, "0");

  setInterval(updateCountdown, 1000);
}

/* =========================================================
   PHONE NUMBER
========================================================= */

function initPhoneInput() {
  elements.phoneInput?.addEventListener("input", () => {
    elements.phoneInput.value = elements.phoneInput.value.replace(
      /[^\d\s+]/g,
      "",
    );
  });
}

/* =========================================================
   COMPARISON BUTTON
========================================================= */

function initComparisonButton() {
  elements.comparisonButton?.addEventListener("click", () => {
    elements.comparisonButton.classList.toggle("rotated");
  });
}

/* =========================================================
   LAZY LOADING
========================================================= */

function initLazyLoading() {
  document.querySelectorAll("img").forEach((image) => {
    if (!image.hasAttribute("loading")) {
      image.setAttribute("loading", "lazy");
    }
  });
}

/* =========================================================
   TESTIMONIAL SLIDER
========================================================= */

function initTestimonialsSlider() {
  /*
   * Vérification :
   * Si le slider n'existe pas,
   * on ne fait rien.
   */

  if (
    !elements.slider ||
    !elements.testimonials ||
    !elements.sliderDots.length
  ) {
    return;
  }

  const images = Array.from(elements.testimonials.querySelectorAll("img"));

  if (images.length < 2) {
    return;
  }

  const totalSlides = images.length;

  let currentIndex = 0;

  let isAnimating = false;

  let autoplay = null;

  /* =======================================================
     CLONES
  ======================================================= */

  const firstClone = images[0].cloneNode(true);

  const secondClone = images[1].cloneNode(true);

  elements.testimonials.appendChild(firstClone);

  elements.testimonials.appendChild(secondClone);

  /* =======================================================
     SLIDER WIDTH
  ======================================================= */

  function updateSliderWidth() {
    const sliderWidth = elements.slider.clientWidth;

    elements.testimonials.style.setProperty(
      "--slider-width",
      `${sliderWidth}px`,
    );
  }

  /* =======================================================
     SLIDE STEP
  ======================================================= */

  function getStep() {
    const image = elements.testimonials.querySelector("img");

    if (!image) {
      return 0;
    }

    const gap = parseFloat(getComputedStyle(elements.testimonials).gap);

    return image.getBoundingClientRect().width + gap;
  }

  /* =======================================================
     DOTS
  ======================================================= */

  function updateDots(index) {
    elements.sliderDots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === index);
    });
  }

  /* =======================================================
     GO TO SLIDE
  ======================================================= */

  function goToSlide(index, animate = true) {
    const step = getStep();

    elements.testimonials.style.transition = animate
      ? "transform 0.65s cubic-bezier(.4, 0, .2, 1)"
      : "none";

    elements.testimonials.style.transform = `translateX(-${step * index}px)`;

    updateDots(index % totalSlides);
  }

  /* =======================================================
     NEXT SLIDE
  ======================================================= */

  function nextSlide() {
    if (isAnimating) {
      return;
    }

    isAnimating = true;

    currentIndex++;

    goToSlide(currentIndex, true);

    /*
     * Arrivée sur les clones :
     *
     * 1 2 3 4 5 1 2
     *
     * Quand currentIndex = 5,
     * on revient silencieusement à 0.
     */

    if (currentIndex === totalSlides) {
      setTimeout(() => {
        currentIndex = 0;

        goToSlide(currentIndex, false);

        isAnimating = false;
      }, 650);
    } else {
      setTimeout(() => {
        isAnimating = false;
      }, 650);
    }
  }

  /* =======================================================
     AUTOPLAY
  ======================================================= */

  function startAutoplay() {
    stopAutoplay();

    autoplay = setInterval(nextSlide, 3500);
  }

  function stopAutoplay() {
    if (autoplay) {
      clearInterval(autoplay);

      autoplay = null;
    }
  }

  /* =======================================================
     DOT NAVIGATION
  ======================================================= */

  elements.sliderDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      stopAutoplay();

      currentIndex = index;

      goToSlide(currentIndex, true);

      startAutoplay();
    });
  });

  /* =======================================================
     RESIZE
  ======================================================= */

  window.addEventListener("resize", () => {
    updateSliderWidth();

    goToSlide(currentIndex, false);
  });

  /* =======================================================
     INITIALIZATION
  ======================================================= */

  updateSliderWidth();

  goToSlide(currentIndex, false);

  startAutoplay();
}

/* =========================================================
   ORDER SECTION HEARTBEAT
========================================================= */

function initOrderHeartbeat() {
  if (!elements.orderSection) {
    return;
  }

  let wasOutside = true;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        /*
         * Section enters viewport
         */

        if (entry.isIntersecting && wasOutside) {
          // Reset animation
          elements.orderSection.classList.remove("is-visible");

          // Force browser reflow
          void elements.orderSection.offsetWidth;

          // Start heartbeat
          elements.orderSection.classList.add("is-visible");

          wasOutside = false;
        }

        /*
         * Section leaves viewport
         */

        if (!entry.isIntersecting) {
          wasOutside = true;
        }
      });
    },
    {
      threshold: 0.25,
    },
  );

  observer.observe(elements.orderSection);
}

/* =========================================================
   INITIALIZATION
========================================================= */

function init() {
  initProductOptions();

  initOrderForm();

  initSuccessModal();

  initStickyOrderButton();

  initScrollTop();

  initCountdown();

  initPhoneInput();

  initComparisonButton();

  initLazyLoading();

  initTestimonialsSlider();

  initOrderHeartbeat();
}
/* =========================================================
   FIRST LOAD → FIRST ORDER FORM
========================================================= */

function scrollToFirstOrderForm() {
  const firstOrderForm = document.querySelector(".order-section");

  if (!firstOrderForm) {
    return;
  }

  window.scrollTo({
    top: firstOrderForm.offsetTop,
    behavior: "smooth",
  });
}

window.addEventListener("load", () => {
  scrollToFirstOrderForm();
});
/* =========================================================
   START APPLICATION
========================================================= */

init();

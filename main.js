document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================================================
     1. Mobile Menu Toggle Logic
     ========================================================================== */
  const burgerBtn = document.getElementById("burgerBtn");
  const mobileOverlay = document.getElementById("mobileOverlay");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileLinks = document.querySelectorAll(".mobile-link, .mobile-sign-in");

  function openMenu() {
    document.body.classList.add("menu-open");
    if (burgerBtn) burgerBtn.setAttribute("aria-expanded", "true");
    if (mobileOverlay) mobileOverlay.removeAttribute("hidden");
    if (mobileMenu) mobileMenu.removeAttribute("hidden");
  }

  function closeMenu() {
    document.body.classList.remove("menu-open");
    if (burgerBtn) burgerBtn.setAttribute("aria-expanded", "false");
    if (mobileOverlay) mobileOverlay.setAttribute("hidden", "");
    if (mobileMenu) mobileMenu.setAttribute("hidden", "");
  }

  function toggleMenu() {
    if (document.body.classList.contains("menu-open")) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (burgerBtn) {
    burgerBtn.addEventListener("click", toggleMenu);
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener("click", closeMenu);
  }

  mobileLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("menu-open")) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 720 && document.body.classList.contains("menu-open")) {
      closeMenu();
    }
  });


  /* ==========================================================================
     2. Count-up Stats Animation Logic
     ========================================================================== */
  const statValues = document.querySelectorAll(".stat-val");

  // Ease-out cubic easing function
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateStat(el, index) {
    const target = parseFloat(el.getAttribute("data-target"));
    const suffix = el.getAttribute("data-suffix") || "";
    const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);

    const duration = 1500 + index * 80;
    const startDelay = 480 + index * 90;

    setTimeout(() => {
      let startTime = null;

      function step(currentTime) {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        const currentVal = target * easedProgress;

        el.textContent = currentVal.toFixed(decimals) + suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target.toFixed(decimals) + suffix;
        }
      }

      requestAnimationFrame(step);
    }, startDelay);
  }

  let hasAnimated = false;
  const observerOptions = {
    threshold: 0.25
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statValues.forEach((el, index) => {
          animateStat(el, index);
        });
        observer.disconnect();
      }
    });
  }, observerOptions);

  const statsFooter = document.querySelector(".stats-footer");
  if (statsFooter) {
    observer.observe(statsFooter);
  }

  /* ==========================================================================
     3. Sign In Modal & Toast Handlers
     ========================================================================== */
  const authModal = document.getElementById("authModal");
  const closeAuthModal = document.getElementById("closeAuthModal");
  const signInBtns = document.querySelectorAll(".sign-in-btn, .mobile-sign-in");
  const authForm = document.getElementById("authForm");
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toastMsg");

  function openAuthModal(e) {
    if (e) e.preventDefault();
    closeMenu();
    if (authModal) {
      authModal.removeAttribute("hidden");
      authModal.setAttribute("aria-hidden", "false");
      const emailInput = document.getElementById("authEmail");
      if (emailInput) setTimeout(() => emailInput.focus(), 100);
    }
  }

  function closeAuthModalFunc() {
    if (authModal) {
      authModal.setAttribute("hidden", "");
      authModal.setAttribute("aria-hidden", "true");
    }
  }

  signInBtns.forEach((btn) => {
    btn.addEventListener("click", openAuthModal);
  });

  if (closeAuthModal) {
    closeAuthModal.addEventListener("click", closeAuthModalFunc);
  }

  if (authModal) {
    authModal.addEventListener("click", (e) => {
      if (e.target === authModal) {
        closeAuthModalFunc();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && authModal && !authModal.hasAttribute("hidden")) {
      closeAuthModalFunc();
    }
  });

  if (authForm) {
    authForm.addEventListener("submit", (e) => {
      e.preventDefault();
      closeAuthModalFunc();
      showToast("Signed in successfully! Launching EchoOps Workspace...");
      
      // Store auth state for workspace
      localStorage.setItem("echoops_logged_in", "true");
      localStorage.setItem("echoops_user_email", document.getElementById("authEmail")?.value || "admin@acme.io");
      localStorage.setItem("echoops_user_name", "Rahul Sharma");
      localStorage.setItem("echoops_role", "Super Admin");
      localStorage.setItem("echoops_onboarding_completed", "true");

      setTimeout(() => {
        window.location.href = "http://localhost:3000/dashboard";
      }, 800);
    });
  }

  const oauthButtons = document.querySelectorAll(".oauth-btn");
  oauthButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      closeAuthModalFunc();
      showToast("Signed in with OAuth! Launching EchoOps Workspace...");

      localStorage.setItem("echoops_logged_in", "true");
      localStorage.setItem("echoops_user_email", "admin@acme.io");
      localStorage.setItem("echoops_user_name", "Rahul Sharma");
      localStorage.setItem("echoops_role", "Super Admin");
      localStorage.setItem("echoops_onboarding_completed", "true");

      setTimeout(() => {
        window.location.href = "http://localhost:3000/dashboard";
      }, 800);
    });
  });

  function showToast(message) {
    if (!toast) return;
    if (toastMsg) toastMsg.textContent = message;
    toast.removeAttribute("hidden");
    setTimeout(() => {
      toast.setAttribute("hidden", "");
    }, 3500);
  }
});


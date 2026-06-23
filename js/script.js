document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = themeToggle ? themeToggle.querySelector(".theme-icon") : null;
  const savedTheme = localStorage.getItem("portfolio-theme");
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  const initialLight = savedTheme ? savedTheme === "light" : prefersLight;

  if (initialLight) {
    document.body.classList.add("light-theme");
  }

  const syncThemeIcon = () => {
    if (themeIcon) {
      themeIcon.textContent = document.body.classList.contains("light-theme") ? "☾" : "☀";
    }
  };

  syncThemeIcon();

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("light-theme");
      localStorage.setItem(
        "portfolio-theme",
        document.body.classList.contains("light-theme") ? "light" : "dark"
      );
      syncThemeIcon();
    });
  }

  document.querySelectorAll("[data-nav]").forEach((link) => {
    if (link.dataset.nav === page) {
      link.classList.add("active");
    }
  });

  const revealItems = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  const counters = document.querySelectorAll(".counter");
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.target || "0");
        const isDecimal = `${target}`.includes(".");
        const duration = 1200;
        const start = performance.now();

        const updateCounter = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const value = target * progress;
          el.textContent = isDecimal ? value.toFixed(2) : Math.floor(value).toString();
          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = isDecimal ? target.toFixed(2) : target.toString();
          }
        };

        requestAnimationFrame(updateCounter);
        counterObserver.unobserve(el);
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));

  const typingElement = document.getElementById("typingText");
  if (typingElement) {
    const roles = [
      "Frontend Developer",
      "AI Enthusiast",
      "Quantum Computing Researcher",
      "Aspiring Software Engineer"
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const typeLoop = () => {
      const current = roles[roleIndex];
      typingElement.textContent = current.slice(0, charIndex);

      if (!deleting && charIndex < current.length) {
        charIndex += 1;
        setTimeout(typeLoop, 85);
        return;
      }

      if (!deleting && charIndex === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1200);
        return;
      }

      if (deleting && charIndex > 0) {
        charIndex -= 1;
        setTimeout(typeLoop, 40);
        return;
      }

      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(typeLoop, 180);
    };

    typeLoop();
  }

  const backToTop = document.getElementById("backToTop");
  const updateBackToTop = () => {
    if (!backToTop) return;
    if (window.scrollY > 300) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  };

  window.addEventListener("scroll", updateBackToTop, { passive: true });
  updateBackToTop();

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const loader = document.getElementById("pageLoader");
  window.addEventListener("load", () => {
    if (loader) {
      loader.classList.add("hidden");
    }
  });

  setTimeout(() => {
    if (loader) {
      loader.classList.add("hidden");
    }
  }, 1500);

  const form = document.getElementById("contactForm");
  if (form) {
    const status = document.getElementById("formStatus");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.getElementById("name");
      const email = document.getElementById("email");
      const message = document.getElementById("message");

      let valid = true;

      [name, email, message].forEach((field) => field.classList.remove("is-invalid"));

      if (!name.value.trim()) {
        name.classList.add("is-invalid");
        valid = false;
      }

      if (!emailPattern.test(email.value.trim())) {
        email.classList.add("is-invalid");
        valid = false;
      }

      if (!message.value.trim()) {
        message.classList.add("is-invalid");
        valid = false;
      }

      if (!valid) {
        status.textContent = "Please complete the required fields correctly.";
        status.style.color = "#f87171";
        return;
      }

      status.textContent = "Thanks for reaching out. This frontend demo is ready for backend integration.";
      status.style.color = "#38bdf8";
      form.reset();
    });
  }
});

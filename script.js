/* =========================================================
   CHELIMALA HEMANTH — ULTRA-PREMIUM PORTFOLIO ENGINE
   ---------------------------------------------------------
   Interactive Systems:
   • Neural Constellation Particle Canvas (60fps)
   • Fluid Trailing Cyber Cursor with Magnetic Glow
   • Live Typewriter Role Engine
   • Intersection Stats Counter Engine
   • Interactive macOS Code Inspector / Tab Switcher
   • 3D Mouse Tilt & Dynamic Light Reflection Physics
   • Category Project Filter System
   • 1-Click Clipboard Engine with Toast Notifications
   • Multi-Accent Dynamic Theme Switcher with LocalStorage
   • Circular SVG Scroll Progress & Back-to-Top Button
   • Project Modal Popup Workflow Engine
   • Intro Screen Seamless Transitions
========================================================= */

"use strict";

/* =========================================================
   01. DOM HELPERS & UTILITIES
========================================================= */

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* =========================================================
   02. TOAST NOTIFICATION ENGINE
========================================================= */

function showToast(message, duration = 3200) {
  const container = $("#toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast-message";
  toast.innerHTML = message;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("toast-show");
  });

  setTimeout(() => {
    toast.classList.remove("toast-show");
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

/* =========================================================
   03. NEURAL PARTICLE CANVAS ENGINE
========================================================= */

function initParticleCanvas() {
  const canvas = $("#particleCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 140 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener("resize", resize);
  resize();

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 1.8 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.5;
          this.y -= (dy / dist) * force * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(128, 103, 255, 0.45)";
      ctx.fill();
    }
  }

  const count = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 18000), 65);
  particles = Array.from({ length: count }, () => new Particle());

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(69, 226, 208, ${0.2 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* =========================================================
   04. FLUID TRAILING CUSTOM CURSOR
========================================================= */

function initCustomCursor() {
  const cursor = $("#customCursor");
  if (!cursor || window.matchMedia("(pointer: coarse)").matches) return;

  const dot = $(".cursor-dot", cursor);
  const ring = $(".cursor-ring", cursor);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function renderRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(renderRing);
  }
  renderRing();

  const hoverTargets = "a, button, input, textarea, .project-card, .skill-card, .theme-dot, .terminal-tab";
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.add("hovering");
    }
  });

  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.remove("hovering");
    }
  });
}

/* =========================================================
   05. LIVE TYPEWRITER ROLE ENGINE
========================================================= */

function initTypewriter() {
  const target = $("#typewriter");
  if (!target) return;

  const roles = [
    "Java Full Stack Developer",
    "AI & Data Science Specialist",
    "Database & SQL Architect",
    "Computer Vision & ML Engineer",
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function tick() {
    const current = roles[roleIdx];

    if (isDeleting) {
      target.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 40;
    } else {
      target.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIdx === current.length) {
      isDeleting = true;
      typingSpeed = 1800; // Pause at end of text
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 400; // Pause before typing next
    }

    setTimeout(tick, typingSpeed);
  }

  tick();
}

/* =========================================================
   06. INTERSECTION STATS COUNTERS
========================================================= */

function initStatsCounter() {
  const counters = $$(".counter");
  if (!counters.length) return;

  let animated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          counters.forEach((counter) => {
            const target = parseFloat(counter.dataset.target);
            const isFloat = String(target).includes(".");
            const duration = 1800;
            const startTime = performance.now();

            function update(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease out quad
              const currentVal = target * (1 - Math.pow(1 - progress, 2));

              counter.textContent = isFloat
                ? currentVal.toFixed(1)
                : Math.floor(currentVal);

              if (progress < 1) {
                requestAnimationFrame(update);
              } else {
                counter.textContent = target;
              }
            }

            requestAnimationFrame(update);
          });
        }
      });
    },
    { threshold: 0.2 },
  );

  const heroStats = $(".hero-stats");
  if (heroStats) observer.observe(heroStats);
}

/* =========================================================
   07. 3D CARD TILT & SHINE PHYSICS
========================================================= */

function initCardTilt() {
  const cards = [$("#heroTiltCard"), ...$$(".project-card")].filter(Boolean);

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      card.style.setProperty("--mouse-x", `${(x / rect.width) * 100}%`);
      card.style.setProperty("--mouse-y", `${(y / rect.height) * 100}%`);
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
    });
  });
}

/* =========================================================
   08. INTERACTIVE CODE TERMINAL TABS & COPY
========================================================= */

function initTerminalTabs() {
  const tabs = $$(".terminal-tab");
  const panes = {
    profile: $("#codeProfile"),
    java: $("#codeJava"),
    python: $("#codePython"),
  };
  const langLabel = $("#terminalLang");
  const copyBtn = $("#terminalCopyBtn");

  const langMap = {
    profile: "JSON",
    java: "Java",
    python: "Python 3.10",
  };

  let activeFile = "profile";

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const file = tab.dataset.file;
      activeFile = file;

      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      Object.values(panes).forEach((pane) => {
        if (pane) pane.classList.remove("active");
      });

      if (panes[file]) {
        panes[file].classList.add("active");
      }

      if (langLabel && langMap[file]) {
        langLabel.textContent = langMap[file];
      }
    });
  });

  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const activePane = panes[activeFile];
      if (!activePane) return;

      const codeElement = $("code", activePane);
      if (!codeElement) return;

      const codeText = codeElement.innerText || codeElement.textContent;
      navigator.clipboard.writeText(codeText).then(() => {
        showToast(`📋 Copied <strong>${tabName(activeFile)}</strong> to clipboard!`);
      }).catch(() => {
        showToast("Code copied to clipboard!");
      });
    });
  }

  function tabName(file) {
    if (file === "profile") return "hemanth.json";
    if (file === "java") return "TastyTap.java";
    if (file === "python") return "rice_classifier.py";
    return file;
  }
}

/* =========================================================
   09. PROJECT FILTER SYSTEM
========================================================= */

function initProjectFilters() {
  const filterButtons = $$(".filter-btn");
  const projectCards = $$(".project-card");

  if (!filterButtons.length || !projectCards.length) return;

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      projectCards.forEach((card) => {
        const category = card.dataset.category;
        if (filter === "all" || category === filter) {
          card.classList.remove("filter-hide");
          card.style.opacity = "0";
          requestAnimationFrame(() => {
            card.style.opacity = "1";
          });
        } else {
          card.classList.add("filter-hide");
        }
      });
    });
  });
}

/* =========================================================
   10. MULTI-THEME ENGINE
========================================================= */

function initThemePicker() {
  const dots = $$(".theme-dot");
  if (!dots.length) return;

  const savedTheme = localStorage.getItem("hemanth_theme") || "violet";
  document.body.setAttribute("data-theme", savedTheme);

  dots.forEach((dot) => {
    if (dot.dataset.theme === savedTheme) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }

    dot.addEventListener("click", () => {
      const theme = dot.dataset.theme;
      document.body.setAttribute("data-theme", theme);
      localStorage.setItem("hemanth_theme", theme);

      dots.forEach((d) => d.classList.remove("active"));
      dot.classList.add("active");

      showToast(`Palette switched to <strong>${theme.toUpperCase()}</strong> ✨`);
    });
  });
}

/* =========================================================
   11. 1-CLICK CLIPBOARD & QUICK FORM
========================================================= */

function initClipboardAndForm() {
  const email = "hemanth2662n@gmail.com";
  const copyHero = $("#copyEmailBtnHero");
  const copyContact = $("#copyEmailBtn");

  function copyAction() {
    navigator.clipboard.writeText(email).then(() => {
      showToast("🚀 <strong>Email copied!</strong> hemanth2662n@gmail.com");
    }).catch(() => {
      showToast("Email: hemanth2662n@gmail.com");
    });
  }

  if (copyHero) copyHero.addEventListener("click", copyAction);
  if (copyContact) copyContact.addEventListener("click", copyAction);

  const resumeBtn = $("#downloadResumeBtn");
  if (resumeBtn) {
    resumeBtn.addEventListener("click", () => {
      showToast("📄 <strong>Downloading Resume...</strong>");
    });
  }

  const quickForm = $("#quickForm");
  if (quickForm) {
    quickForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = $("#senderName").value.trim();
      const senderEmail = $("#senderEmail").value.trim();
      const msg = $("#senderMsg").value.trim();

      if (!name || !senderEmail || !msg) {
        showToast("⚠️ Please fill in all fields.");
        return;
      }

      // Open email client with pre-filled content
      const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${senderEmail}\n\nMessage:\n${msg}`);
      window.location.href = `mailto:hemanth2662n@gmail.com?subject=${subject}&body=${body}`;

      showToast(`✨ Thanks <strong>${escapeHTML(name)}</strong>! Launching email client...`);
      quickForm.reset();
    });
  }
}

/* =========================================================
   12. CIRCULAR SCROLL PROGRESS & BACK TO TOP
========================================================= */

function initScrollProgress() {
  const backToTop = $("#backToTop");
  const circle = $("#scrollProgressCircle");
  if (!backToTop || !circle) return;

  const circumference = 2 * Math.PI * 20; // r=20
  circle.style.strokeDasharray = circumference;

  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(scrollTop / docHeight, 1);

    const offset = circumference - progress * circumference;
    circle.style.strokeDashoffset = offset;

    if (scrollTop > 350) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  }

  window.addEventListener("scroll", update, { passive: true });
  update();

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* =========================================================
   13. PROJECT DATABASE & MODAL POPUP
========================================================= */

const projects = {
  tastytap: {
    number: "01",
    category: "FULL STACK / WEB APPLICATION",
    title: "TastyTap",
    intro:
      "A responsive online food delivery application with authentication, restaurant browsing, menu management, shopping cart functionality and order placement.",
    overview:
      "TastyTap is a Java-based food delivery application that demonstrates full-stack web development using Java, Servlets, JDBC and MySQL. The application follows a practical restaurant-to-order workflow designed for real-world user interaction.",
    objective:
      "The objective is to create a practical online food ordering experience where users can browse restaurants, explore menus, manage their cart and place orders through a structured database-driven application.",
    technologies: [
      "Java",
      "Advanced Java",
      "HTML5",
      "CSS3",
      "JavaScript",
      "Servlets",
      "JDBC",
      "MySQL",
    ],
    features: [
      "User registration and authentication",
      "Restaurant browsing & search",
      "Restaurant menu management",
      "Food item selection & customization",
      "Shopping cart management",
      "Order placement workflow",
      "Database integration & persistence",
      "Fully responsive modern UI",
    ],
    workflow: [
      "Login / Register",
      "Browse Restaurants",
      "Explore Menu",
      "Add to Cart",
      "Place Order",
    ],
    result:
      "The application demonstrates a complete database-driven food ordering workflow and practical Java full-stack development skills.",
    github: "https://github.com/heman2662777",
    live: "",
  },

  rice: {
    number: "02",
    category: "AI / MACHINE LEARNING",
    title: "Rice Classification AI",
    intro:
      "An AI-powered rice grain classification system using computer vision and deep learning to identify different rice varieties from images.",
    overview:
      "Rice Classification AI is a deep learning-based computer vision application designed to automatically classify rice grain images into their respective categories (Arborio, Basmati, Ipsala, Jasmine, and Karacadag).",
    objective:
      "The main objective is to reduce manual inspection time and provide a fast, consistent and intelligent approach for identifying rice varieties using deep convolutional neural networks.",
    technologies: [
      "Python",
      "TensorFlow",
      "Keras",
      "CNN",
      "OpenCV",
      "Flask",
      "HTML5",
      "CSS3",
      "JavaScript",
    ],
    features: [
      "Upload rice grain images for instant analysis",
      "AI-based deep learning image classification",
      "Convolutional Neural Network (CNN) architecture",
      "Prediction results with confidence percentages",
      "Clean, modern responsive web interface",
      "User authentication and classification history",
      "Real-time prediction workflow",
    ],
    workflow: [
      "Upload Image",
      "Preprocessing",
      "CNN Feature Extraction",
      "Softmax Prediction",
      "Results Dashboard",
    ],
    result:
      "The trained model is deployed into a web application, allowing users to interact with the AI classification system directly through any browser.",
    github: "https://github.com/hemanth2662777/Rice-Classification-AI-Model",
    live: "https://rice-classification-ai-model.onrender.com/login",
  },

  credit: {
    number: "03",
    category: "DATA SCIENCE / MACHINE LEARNING",
    title: "Credit Score Predictor",
    intro:
      "A machine learning-based credit risk assessment system designed to analyze financial information and predict customer creditworthiness.",
    overview:
      "Credit Score Predictor is a machine learning application designed to evaluate financial and credit-related metrics and predict a customer's creditworthiness. The system combines data preprocessing, feature engineering and machine learning prediction into a web-based workflow.",
    objective:
      "The main objective is to provide an automated, data-driven approach for assessing credit risk. The system processes customer financial profiles and generates actionable insights regarding loan approvals.",
    technologies: [
      "Python",
      "Pandas",
      "NumPy",
      "Scikit-learn",
      "Logistic Regression",
      "StandardScaler",
      "FastAPI",
      "Uvicorn",
      "HTML5",
      "CSS3",
      "JavaScript",
    ],
    features: [
      "Customer financial profile data intake",
      "Automated feature scaling and preprocessing",
      "Debt-to-Income and risk ratio analysis",
      "Machine learning creditworthiness prediction",
      "Comprehensive credit risk assessment",
      "FastAPI high-speed prediction backend",
      "Interactive data input dashboard",
      "Real-time scoring workflow",
    ],
    workflow: [
      "Financial Data Input",
      "Preprocessing & Scaling",
      "Feature Engineering",
      "ML Model Evaluation",
      "Risk Score Output",
    ],
    result:
      "The final system integrates a trained machine learning pipeline with an intuitive web interface, allowing instant creditworthiness predictions.",
    github: "https://github.com/hemanth2662777/Credit_Loan_Rise_Assessment",
    live: "https://credit-loan-rise-assessment.onrender.com",
  },
};

function initProjectPopup() {
  const popup = $("#projectPopup");
  if (!popup) return;

  const panel = $(".popup-panel", popup);
  const closeButton = $("#popupClose");
  const bottomCloseButton = $("#popupCloseBottom");
  const backdrop = $("#popupBackdrop");

  const popupNumber = $("#popupNumber");
  const popupCategory = $("#popupCategory");
  const popupTitle = $("#popupTitle");
  const popupIntro = $("#popupIntro");
  const popupOverview = $("#popupOverview");
  const popupObjective = $("#popupObjective");
  const popupTechnologies = $("#popupTech");
  const popupFeatures = $("#popupFeatures");
  const popupWorkflow = $("#popupWorkflow");
  const popupResult = $("#popupResult");
  const launchButton = $("#popupLaunch");
  const githubButton = $("#popupGithub");

  let lastFocusedElement = null;

  function populateProject(project) {
    if (popupNumber) popupNumber.textContent = project.number;
    if (popupCategory) popupCategory.textContent = project.category;
    if (popupTitle) popupTitle.textContent = project.title;
    if (popupIntro) popupIntro.textContent = project.intro;
    if (popupOverview) popupOverview.textContent = project.overview;
    if (popupObjective) popupObjective.textContent = project.objective;
    if (popupResult) popupResult.textContent = project.result;

    if (popupTechnologies) {
      popupTechnologies.innerHTML = project.technologies
        .map((tech) => `<span>${escapeHTML(tech)}</span>`)
        .join("");
    }

    if (popupFeatures) {
      popupFeatures.innerHTML = project.features
        .map((feat) => `<li>${escapeHTML(feat)}</li>`)
        .join("");
    }

    if (popupWorkflow) {
      popupWorkflow.innerHTML = project.workflow
        .map((step, idx) => {
          const stepHtml = `<span class="workflow-step">${escapeHTML(step)}</span>`;
          const arrowHtml =
            idx < project.workflow.length - 1
              ? `<span class="workflow-arrow" aria-hidden="true">→</span>`
              : "";
          return stepHtml + arrowHtml;
        })
        .join("");
    }

    if (githubButton) {
      if (project.github) {
        githubButton.href = project.github;
        githubButton.classList.remove("disabled");
        githubButton.removeAttribute("aria-disabled");
      } else {
        githubButton.href = "#";
        githubButton.classList.add("disabled");
        githubButton.setAttribute("aria-disabled", "true");
      }
    }

    if (launchButton) {
      if (project.live) {
        launchButton.href = project.live;
        launchButton.classList.remove("disabled");
        launchButton.removeAttribute("aria-disabled");
        launchButton.removeAttribute("title");
      } else {
        launchButton.href = "#";
        launchButton.classList.add("disabled");
        launchButton.setAttribute("aria-disabled", "true");
        launchButton.setAttribute("title", "Live deployment is not configured yet");
      }
    }
  }

  function openProject(projectId, clickedButton) {
    const project = projects[projectId];
    if (!project) return;

    lastFocusedElement = clickedButton;
    populateProject(project);

    popup.classList.add("active");
    popup.setAttribute("aria-hidden", "false");
    document.body.classList.add("popup-open");

    if (panel) panel.scrollTop = 0;

    requestAnimationFrame(() => {
      closeButton?.focus();
    });
  }

  function closeProject() {
    popup.classList.remove("active");
    popup.setAttribute("aria-hidden", "true");
    document.body.classList.remove("popup-open");

    if (lastFocusedElement) {
      try { lastFocusedElement.focus(); } catch (e) {}
    }
  }

  $$(".details-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const projectId = button.dataset.project;
      openProject(projectId, button);
    });
  });

  closeButton?.addEventListener("click", closeProject);
  bottomCloseButton?.addEventListener("click", closeProject);
  backdrop?.addEventListener("click", closeProject);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && popup.classList.contains("active")) {
      closeProject();
    }
  });

  launchButton?.addEventListener("click", (e) => {
    if (launchButton.classList.contains("disabled")) e.preventDefault();
  });

  githubButton?.addEventListener("click", (e) => {
    if (githubButton.classList.contains("disabled")) e.preventDefault();
  });
}

/* =========================================================
   14. INTRO SCREEN & GENERAL NAVIGATION
========================================================= */

function initIntro() {
  const intro = $("#introScreen");
  const enterButton = $("#enterBtn");
  const introScrollBtn = $("#introScrollBtn");

  if (!intro) return;
  let hasEntered = false;

  function enterPortfolio() {
    if (hasEntered) return;
    hasEntered = true;

    intro.classList.add("hidden");
    document.body.classList.remove("intro-active");
    window.dispatchEvent(new CustomEvent("portfolioEntered"));

    setTimeout(() => {
      intro.style.display = "none";
    }, 850);
  }

  if (enterButton) enterButton.addEventListener("click", enterPortfolio);
  if (introScrollBtn) introScrollBtn.addEventListener("click", enterPortfolio);

  document.addEventListener("keydown", (e) => {
    if (!hasEntered && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      enterPortfolio();
    }
  });

  window.addEventListener("wheel", (e) => {
    if (!hasEntered && e.deltaY > 15) enterPortfolio();
  }, { passive: true });

  let touchStartY = 0;
  window.addEventListener("touchstart", (e) => {
    if (e.touches.length) touchStartY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener("touchend", (e) => {
    if (!hasEntered && e.changedTouches.length) {
      if (touchStartY - e.changedTouches[0].clientY > 30) enterPortfolio();
    }
  }, { passive: true });
}

function initNavigation() {
  const menuButton = $("#menuBtn");
  const navigation = $("#navLinks");
  if (!menuButton || !navigation) return;

  function closeMenu() {
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  }

  menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  $$("a", navigation).forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("click", (e) => {
    if (
      navigation.classList.contains("open") &&
      !navigation.contains(e.target) &&
      !menuButton.contains(e.target)
    ) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) closeMenu();
  });
}

function initHeader() {
  const header = $("#siteHeader");
  if (!header) return;

  function update() {
    header.classList.toggle("scrolled", window.scrollY > 25);
  }
  update();
  window.addEventListener("scroll", update, { passive: true });
}

function initReveal() {
  const elements = $$(".reveal");
  if (!elements.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    elements.forEach((el) => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
  );

  elements.forEach((el) => observer.observe(el));
}

function initActiveNavigation() {
  const sections = $$("main section[id]");
  const links = $$(".nav-links a");
  if (!sections.length || !links.length) return;

  const linkMap = new Map();
  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (href && href.startsWith("#")) linkMap.set(href.substring(1), link);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((link) => link.classList.remove("active"));
          const activeLink = linkMap.get(entry.target.id);
          if (activeLink) activeLink.classList.add("active");
        }
      });
    },
    { rootMargin: "-25% 0px -55% 0px" },
  );

  sections.forEach((section) => observer.observe(section));
}

function initYear() {
  const yearElement = $("#year");
  if (yearElement) yearElement.textContent = new Date().getFullYear();
}

function initExternalLinks() {
  $$('a[target="_blank"]').forEach((link) => {
    const rel = link.getAttribute("rel") || "";
    if (!rel.includes("noopener")) {
      link.setAttribute("rel", `${rel} noopener noreferrer`.trim());
    }
  });
}

/* =========================================================
   15. INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initParticleCanvas();
  initCustomCursor();
  initTypewriter();
  initStatsCounter();
  initCardTilt();
  initTerminalTabs();
  initProjectFilters();
  initThemePicker();
  initClipboardAndForm();
  initScrollProgress();
  initIntro();
  initNavigation();
  initHeader();
  initReveal();
  initActiveNavigation();
  initProjectPopup();
  initYear();
  initExternalLinks();

  console.log(
    "%c CHELIMALA HEMANTH — PORTFOLIO 2026 %c ULTRA-PREMIUM ACTIVE ",
    "background:#8067ff;color:#ffffff;padding:6px 10px;border-radius:4px 0 0 4px;font-weight:bold;",
    "background:#45e2d0;color:#05070d;padding:6px 10px;border-radius:0 4px 4px 0;font-weight:bold;",
  );
});

window.addEventListener("portfolioEntered", () => {
  document.body.classList.add("portfolio-ready");
  window.dispatchEvent(new Event("resize"));
});

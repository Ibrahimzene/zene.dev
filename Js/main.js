// Main JavaScript file for personal website
// Author: Ibrahim Mahamat Zene

;(function () {
  "use strict"

  // DOM Elements
  const themeToggle = document.getElementById("theme-toggle")
  const themeIcon = document.getElementById("theme-icon")
  const navMenu = document.getElementById("nav-menu")
  const backToTop = document.getElementById("back-to-top")

  // Initialize the website
  function init() {
    setupThemeToggle()
    setupMobileNavigation()
    setupTabs()
    setupBackToTop()
    setupSmoothScrolling()
    setupAnimations()

    // Load saved theme
    loadTheme()

    console.log("Website initialized successfully")
  }

  // Theme Management
  function setupThemeToggle() {
    if (!themeToggle || !themeIcon) return

    themeToggle.addEventListener("click", toggleTheme)
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme")
    const newTheme = currentTheme === "dark" ? "light" : "dark"

    setTheme(newTheme)
    saveTheme(newTheme)
  }

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme)

    if (themeIcon) {
      themeIcon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon"
    }

    // Update theme toggle aria-label
    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        theme === "dark"
          ? "Zu hellem Modus wechseln"
          : "Zu dunklem Modus wechseln"
      )
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem("preferred-theme", theme)
    } catch (e) {
      console.warn("Could not save theme preference:", e)
    }
  }

  function loadTheme() {
    try {
      const savedTheme = localStorage.getItem("preferred-theme")
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches
      const defaultTheme = savedTheme || (systemPrefersDark ? "dark" : "light")

      setTheme(defaultTheme)
    } catch (e) {
      console.warn("Could not load theme preference:", e)
      setTheme("light")
    }
  }

  // Mobile Navigation
  function setupMobileNavigation() {
    // Add event listeners for mobile menu
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
    const closeBtn = document.querySelector(".close-btn")
    const navLinks = document.querySelectorAll(".nav-menu a")

    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener("click", openMenu)
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", closeMenu)
    }

    // Close menu when clicking on nav links
    navLinks.forEach((link) => {
      link.addEventListener("click", closeMenu)
    })

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (
        navMenu &&
        navMenu.classList.contains("active") &&
        !navMenu.contains(e.target) &&
        !e.target.closest(".mobile-menu-btn")
      ) {
        closeMenu()
      }
    })

    // Handle escape key
    document.addEventListener("keydown", (e) => {
      if (
        e.key === "Escape" &&
        navMenu &&
        navMenu.classList.contains("active")
      ) {
        closeMenu()
      }
    })
  }

  // Global functions for mobile menu (called from HTML)
  window.openMenu = function () {
    if (navMenu) {
      navMenu.classList.add("active")
      document.body.style.overflow = "hidden"

      // Focus management
      const firstLink = navMenu.querySelector("a")
      if (firstLink) firstLink.focus()
    }
  }

  window.closeMenu = function () {
    if (navMenu) {
      navMenu.classList.remove("active")
      document.body.style.overflow = ""

      // Return focus to menu button
      const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
      if (mobileMenuBtn) mobileMenuBtn.focus()
    }
  }

  // Tab Functionality
  function setupTabs() {
    const tabButtons = document.querySelectorAll(".tab-btn")
    const tabPanels = document.querySelectorAll(".tab-panel")

    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const targetTab = button.getAttribute("data-tab")
        switchTab(targetTab, tabButtons, tabPanels)
      })

      // Keyboard navigation
      button.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          e.preventDefault()
          const currentIndex = Array.from(tabButtons).indexOf(button)
          const nextIndex =
            e.key === "ArrowRight"
              ? (currentIndex + 1) % tabButtons.length
              : (currentIndex - 1 + tabButtons.length) % tabButtons.length

          tabButtons[nextIndex].focus()
          tabButtons[nextIndex].click()
        }
      })
    })
  }

  function switchTab(targetTab, tabButtons, tabPanels) {
    // Remove active class from all tabs and panels
    tabButtons.forEach((btn) => {
      btn.classList.remove("active")
      btn.setAttribute("aria-selected", "false")
    })

    tabPanels.forEach((panel) => {
      panel.classList.remove("active")
    })

    // Add active class to target tab and panel
    const activeButton = document.querySelector(`[data-tab="${targetTab}"]`)
    const activePanel = document.getElementById(`${targetTab}-panel`)

    if (activeButton && activePanel) {
      activeButton.classList.add("active")
      activeButton.setAttribute("aria-selected", "true")
      activePanel.classList.add("active")
    }
  }

  // Back to Top Button
  function setupBackToTop() {
    if (!backToTop) return

    // Show/hide button based on scroll position
    window.addEventListener(
      "scroll",
      throttle(() => {
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop

        if (scrollTop > 300) {
          backToTop.classList.add("visible")
        } else {
          backToTop.classList.remove("visible")
        }
      }, 100)
    )

    // Scroll to top when clicked
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  }

  // Smooth Scrolling for Navigation Links
  function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]')

    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href")

        // Skip if it's just "#"
        if (href === "#") return

        e.preventDefault()

        const targetId = href.substring(1)
        const targetElement = document.getElementById(targetId)

        if (targetElement) {
          const headerHeight = document.querySelector(".navbar").offsetHeight
          const targetPosition = targetElement.offsetTop - headerHeight - 20

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          })

          // Close mobile menu if open
          closeMenu()
        }
      })
    })
  }

  // Animations and Scroll Effects
  function setupAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1"
          entry.target.style.transform = "translateY(0)"
        }
      })
    }, observerOptions)

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
      ".service-card, .portfolio-item, .timeline-item, .language-item"
    )

    animatedElements.forEach((el, index) => {
      // Set initial state
      el.style.opacity = "0"
      el.style.transform = "translateY(30px)"
      el.style.transition = `opacity 0.6s ease ${
        index * 0.1
      }s, transform 0.6s ease ${index * 0.1}s`

      observer.observe(el)
    })

    // Animate language level bars when they come into view
    const languageBars = document.querySelectorAll(".level-bar")
    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target
          const width = bar.style.width
          bar.style.width = "0%"
          setTimeout(() => {
            bar.style.width = width
          }, 200)
        }
      })
    }, observerOptions)

    languageBars.forEach((bar) => barObserver.observe(bar))
  }

  // Utility Functions
  function throttle(func, limit) {
    let inThrottle
    return function () {
      const args = arguments
      const context = this
      if (!inThrottle) {
        func.apply(context, args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  }

  function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  // Handle window resize
  window.addEventListener(
    "resize",
    debounce(() => {
      // Close mobile menu on resize to desktop
      if (
        window.innerWidth > 768 &&
        navMenu &&
        navMenu.classList.contains("active")
      ) {
        closeMenu()
      }
    }, 250)
  )

  // Handle system theme changes
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    mediaQuery.addEventListener("change", (e) => {
      // Only update if user hasn't manually set a preference
      if (!localStorage.getItem("preferred-theme")) {
        setTheme(e.matches ? "dark" : "light")
      }
    })
  }

  // Keyboard navigation improvements
  document.addEventListener("keydown", (e) => {
    // Skip to main content with Tab key
    if (
      e.key === "Tab" &&
      !e.shiftKey &&
      document.activeElement === document.body
    ) {
      const mainContent =
        document.querySelector("main") || document.querySelector("#about")
      if (mainContent) {
        e.preventDefault()
        mainContent.focus()
      }
    }
  })

  // Error handling for missing elements
  window.addEventListener("error", (e) => {
    console.error("JavaScript error:", e.error)
  })

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init)
  } else {
    init()
  }

  // Expose some functions globally for debugging
  if (typeof window !== "undefined") {
    window.websiteDebug = {
      toggleTheme,
      openMenu,
      closeMenu,
    }
  }
})()

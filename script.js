// Wait for DOM
document.addEventListener("DOMContentLoaded", () => {
    
    // --- Loader ---
    const loader = document.getElementById("loader");
    setTimeout(() => {
        loader.style.opacity = "0";
        setTimeout(() => {
            loader.style.display = "none";
            document.body.classList.remove("no-scroll");
        }, 500);
    }, 1500); // Loader displays for 1.5s
    
    document.body.classList.add("no-scroll");

    // --- Typing Animation ---
    const roles = ["Software Developer", "AI/ML Enthusiast", "Creative Thinker", "Problem Solver"];
    const typedTextSpan = document.querySelector(".typed-text");
    const cursorSpan = document.querySelector(".cursor");
    
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000;
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < roles[textArrayIndex].length) {
            if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
            typedTextSpan.textContent += roles[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } 
        else {
            cursorSpan.classList.remove("typing");
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
            typedTextSpan.textContent = roles[textArrayIndex].substring(0, charIndex-1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } 
        else {
            cursorSpan.classList.remove("typing");
            textArrayIndex++;
            if(textArrayIndex >= roles.length) textArrayIndex = 0;
            setTimeout(type, typingDelay + 1100);
        }
    }

    // Start typing animation after loader
    setTimeout(() => {
        if(roles.length) setTimeout(type, newTextDelay + 250);
    }, 1500);

    // --- Sticky Navbar & Active Link ---
    const navbar = document.getElementById("navbar");
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");

    window.addEventListener("scroll", () => {
        // Navbar styling
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

        // Active link highlighting
        let current = "";
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 150) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href").includes(current)) {
                link.classList.add("active");
            }
        });
    });

    // --- Mobile Menu Toggle ---
    const mobileMenu = document.getElementById("mobile-menu");
    const navLinksContainer = document.querySelector(".nav-links");

    mobileMenu.addEventListener("click", () => {
        navLinksContainer.classList.toggle("active");
        const icon = mobileMenu.querySelector("i");
        if (navLinksContainer.classList.contains("active")) {
            icon.classList.remove("fa-bars");
            icon.classList.add("fa-times");
        } else {
            icon.classList.remove("fa-times");
            icon.classList.add("fa-bars");
        }
    });

    // Close mobile menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            navLinksContainer.classList.remove("active");
            mobileMenu.querySelector("i").classList.remove("fa-times");
            mobileMenu.querySelector("i").classList.add("fa-bars");
        });
    });

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll(".reveal");
    const progressBars = document.querySelectorAll(".progress");

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                
                // If it's a skill section, animate progress bars
                if (entry.target.classList.contains("skill-category")) {
                    const bars = entry.target.querySelectorAll(".progress");
                    bars.forEach(bar => {
                        const width = bar.getAttribute("data-width");
                        bar.style.width = width;
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Form Submission ---
    const contactForm = document.getElementById("contactForm");
    if(contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector("button");
            const originalText = btn.innerHTML;
            
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            btn.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                btn.style.background = "#10b981"; // Success green
                contactForm.reset();
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = "";
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    // --- Layered Background Motion ---
    const root = document.documentElement;
    const allowDepthMotion =
        window.matchMedia("(prefers-reduced-motion: no-preference)").matches &&
        window.matchMedia("(pointer: fine)").matches;

    if (allowDepthMotion) {
        let targetX = 0;
        let targetY = 0;
        let currentX = 0;
        let currentY = 0;
        let animationFrame = null;

        const updateDepth = () => {
            currentX += (targetX - currentX) * 0.08;
            currentY += (targetY - currentY) * 0.08;

            root.style.setProperty("--pointer-x", currentX.toFixed(3));
            root.style.setProperty("--pointer-y", currentY.toFixed(3));

            if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
                animationFrame = window.requestAnimationFrame(updateDepth);
            } else {
                animationFrame = null;
            }
        };

        const queueDepthUpdate = () => {
            if (!animationFrame) {
                animationFrame = window.requestAnimationFrame(updateDepth);
            }
        };

        const handlePointerMove = (event) => {
            targetX = ((event.clientX / window.innerWidth) - 0.5) * 2;
            targetY = ((event.clientY / window.innerHeight) - 0.5) * 2;
            queueDepthUpdate();
        };

        const resetDepth = () => {
            targetX = 0;
            targetY = 0;
            queueDepthUpdate();
        };

        window.addEventListener("pointermove", handlePointerMove);
        document.body.addEventListener("pointerleave", resetDepth);
        window.addEventListener("blur", resetDepth);
    } else {
        root.style.setProperty("--pointer-x", "0");
        root.style.setProperty("--pointer-y", "0");
    }
});

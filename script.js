document.addEventListener("DOMContentLoaded", () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.body.classList.add("no-scroll");

    const loader = document.getElementById("loader");
    if (loader) {
        window.setTimeout(() => {
            loader.classList.add("hide");
            document.body.classList.remove("no-scroll");
        }, 1100);

        window.setTimeout(() => {
            loader.style.display = "none";
        }, 1750);
    } else {
        document.body.classList.remove("no-scroll");
    }

    const currentYear = document.getElementById("current-year");
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    const roles = [
        "frontend development",
        "AI-assisted prototyping",
        "product-minded interfaces",
        "creative problem solving"
    ];
    const typedTextSpan = document.querySelector(".typed-text");
    const cursorSpan = document.querySelector(".cursor");
    let textArrayIndex = 0;
    let charIndex = 0;
    const typingDelay = 90;
    const erasingDelay = 45;
    const newTextDelay = 1800;

    const type = () => {
        if (!typedTextSpan || !cursorSpan) {
            return;
        }

        if (charIndex < roles[textArrayIndex].length) {
            typedTextSpan.textContent += roles[textArrayIndex].charAt(charIndex);
            charIndex += 1;
            window.setTimeout(type, typingDelay);
            return;
        }

        window.setTimeout(erase, newTextDelay);
    };

    const erase = () => {
        if (!typedTextSpan || !cursorSpan) {
            return;
        }

        if (charIndex > 0) {
            typedTextSpan.textContent = roles[textArrayIndex].substring(0, charIndex - 1);
            charIndex -= 1;
            window.setTimeout(erase, erasingDelay);
            return;
        }

        textArrayIndex = (textArrayIndex + 1) % roles.length;
        window.setTimeout(type, typingDelay + 220);
    };

    if (typedTextSpan) {
        if (prefersReducedMotion) {
            typedTextSpan.textContent = roles[0];
        } else {
            window.setTimeout(type, 1500);
        }
    }

    const navbar = document.getElementById("navbar");
    const sections = Array.from(document.querySelectorAll("main section[id]"));
    const navLinks = Array.from(document.querySelectorAll(".nav-link"));
    const progressBar = document.getElementById("page-progress-bar");

    const updateScrollState = () => {
        const scrollTop = window.scrollY;

        if (navbar) {
            navbar.classList.toggle("scrolled", scrollTop > 40);
        }

        const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollRange > 0 ? (scrollTop / scrollRange) * 100 : 0;
        if (progressBar) {
            progressBar.style.width = `${Math.min(progress, 100)}%`;
        }

        let currentSectionId = sections[0] ? sections[0].id : "";
        sections.forEach((section) => {
            if (scrollTop >= section.offsetTop - 180) {
                currentSectionId = section.id;
            }
        });

        navLinks.forEach((link) => {
            const href = link.getAttribute("href");
            link.classList.toggle("active", href === `#${currentSectionId}`);
        });
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    const mobileMenu = document.getElementById("mobile-menu");
    const navLinksContainer = document.querySelector(".nav-links");

    const closeMobileMenu = () => {
        if (!mobileMenu || !navLinksContainer) {
            return;
        }

        navLinksContainer.classList.remove("active");
        mobileMenu.setAttribute("aria-expanded", "false");

        const icon = mobileMenu.querySelector("i");
        if (icon) {
            icon.classList.remove("fa-times");
            icon.classList.add("fa-bars");
        }
    };

    if (mobileMenu && navLinksContainer) {
        mobileMenu.addEventListener("click", () => {
            const isActive = navLinksContainer.classList.toggle("active");
            mobileMenu.setAttribute("aria-expanded", String(isActive));

            const icon = mobileMenu.querySelector("i");
            if (icon) {
                icon.classList.toggle("fa-bars", !isActive);
                icon.classList.toggle("fa-times", isActive);
            }
        });

        navLinks.forEach((link) => {
            link.addEventListener("click", closeMobileMenu);
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 780) {
                closeMobileMenu();
            }
        });
    }

    const counterElements = Array.from(document.querySelectorAll("[data-count]"));

    const animateCounter = (element) => {
        if (element.dataset.animated === "true") {
            return;
        }

        const targetValue = Number.parseFloat(element.dataset.count);
        if (Number.isNaN(targetValue)) {
            return;
        }

        element.dataset.animated = "true";
        const rawValue = element.dataset.count;
        const decimals = rawValue.includes(".") ? rawValue.split(".")[1].length : 0;
        const duration = prefersReducedMotion ? 0 : 1400;

        if (duration === 0) {
            element.textContent = targetValue.toFixed(decimals);
            return;
        }

        const startTime = performance.now();
        const step = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const currentValue = targetValue * eased;

            element.textContent = decimals > 0
                ? currentValue.toFixed(decimals)
                : `${Math.round(currentValue)}`;

            if (progress < 1) {
                window.requestAnimationFrame(step);
                return;
            }

            element.textContent = targetValue.toFixed(decimals);
        };

        window.requestAnimationFrame(step);
    };

    const revealElements = Array.from(document.querySelectorAll(".reveal"));
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("active");

            if (entry.target.classList.contains("skill-category")) {
                const bars = entry.target.querySelectorAll(".progress");
                bars.forEach((bar) => {
                    const width = bar.getAttribute("data-width");
                    if (width) {
                        bar.style.width = width;
                    }
                });
            }

            entry.target.querySelectorAll("[data-count]").forEach((counter) => {
                animateCounter(counter);
            });

            if (entry.target.hasAttribute("data-count")) {
                animateCounter(entry.target);
            }

            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.18,
        rootMargin: "0px 0px -60px 0px"
    });

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });

    counterElements.forEach((counter) => {
        if (!counter.closest(".reveal")) {
            revealObserver.observe(counter);
        }
    });

    const interactiveCards = document.querySelectorAll(".interactive-card");
    interactiveCards.forEach((card) => {
        card.addEventListener("pointermove", (event) => {
            const rect = card.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 100;
            const y = ((event.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty("--pointer-x", `${x}%`);
            card.style.setProperty("--pointer-y", `${y}%`);
        });

        card.addEventListener("pointerleave", () => {
            card.style.removeProperty("--pointer-x");
            card.style.removeProperty("--pointer-y");
        });
    });

    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const submitButton = contactForm.querySelector("button[type='submit']");
            if (!submitButton) {
                return;
            }

            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitButton.disabled = true;

            window.setTimeout(() => {
                submitButton.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitButton.style.background = "#34d399";
                submitButton.style.color = "#052312";
                contactForm.reset();

                window.setTimeout(() => {
                    submitButton.innerHTML = originalText;
                    submitButton.style.background = "";
                    submitButton.style.color = "";
                    submitButton.disabled = false;
                }, 2600);
            }, 1300);
        });
    }

    const canvas = document.getElementById("bg-canvas");
    if (canvas && typeof THREE !== "undefined") {
        const finePointer = window.matchMedia("(pointer: fine)").matches;
        const pointer = {
            targetX: 0,
            targetY: 0,
            currentX: 0,
            currentY: 0
        };

        const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
            powerPreference: "high-performance"
        });
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.setClearColor(0x000000, 0);

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x040811, 0.019);

        const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 220);
        const backgroundGroup = new THREE.Group();
        scene.add(backgroundGroup);

        const torus = new THREE.Mesh(
            new THREE.TorusGeometry(9.2, 2.1, 24, 180),
            new THREE.MeshBasicMaterial({
                color: 0x79b8ff,
                wireframe: true,
                transparent: true,
                opacity: 0.16
            })
        );
        torus.rotation.x = Math.PI / 5;
        torus.rotation.z = Math.PI / 10;
        backgroundGroup.add(torus);

        const icosahedron = new THREE.Mesh(
            new THREE.IcosahedronGeometry(5.4, 1),
            new THREE.MeshBasicMaterial({
                color: 0x49e3c5,
                wireframe: true,
                transparent: true,
                opacity: 0.13
            })
        );
        backgroundGroup.add(icosahedron);

        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(3.5, 28, 28),
            new THREE.MeshBasicMaterial({
                color: 0xff9b54,
                wireframe: true,
                transparent: true,
                opacity: 0.09
            })
        );
        backgroundGroup.add(sphere);

        const halo = new THREE.Mesh(
            new THREE.TorusGeometry(6.7, 0.18, 12, 100),
            new THREE.MeshBasicMaterial({
                color: 0xc8defb,
                wireframe: true,
                transparent: true,
                opacity: 0.08
            })
        );
        halo.rotation.x = Math.PI / 2.4;
        halo.rotation.y = Math.PI / 6;
        backgroundGroup.add(halo);

        const particlesGeometry = new THREE.BufferGeometry();
        const particleCount = window.innerWidth < 768 ? 260 : 460;
        const positions = new Float32Array(particleCount * 3);

        for (let index = 0; index < particleCount; index += 1) {
            const stride = index * 3;
            positions[stride] = (Math.random() - 0.5) * 110;
            positions[stride + 1] = (Math.random() - 0.5) * 74;
            positions[stride + 2] = (Math.random() - 0.5) * 88;
        }

        particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

        const particles = new THREE.Points(
            particlesGeometry,
            new THREE.PointsMaterial({
                size: window.innerWidth < 768 ? 0.12 : 0.1,
                color: 0xe7effa,
                transparent: true,
                opacity: 0.32,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            })
        );
        scene.add(particles);

        const layout = {
            cameraZ: 28,
            groupX: 0,
            groupY: 0,
            torusScale: 1
        };

        const applyLayout = () => {
            const width = window.innerWidth;
            const isMobile = width < 768;
            const isTablet = width >= 768 && width < 1120;

            renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.2 : 1.6));
            renderer.setSize(window.innerWidth, window.innerHeight, false);

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            if (isMobile) {
                layout.cameraZ = 38;
                layout.groupX = 0;
                layout.groupY = 1.2;
                layout.torusScale = 0.78;
                icosahedron.position.set(-10, 8, -14);
                sphere.position.set(10, -5, -12);
            } else if (isTablet) {
                layout.cameraZ = 32;
                layout.groupX = 0;
                layout.groupY = 0.4;
                layout.torusScale = 0.9;
                icosahedron.position.set(-14, 10, -16);
                sphere.position.set(14, -6, -13);
            } else {
                layout.cameraZ = 28;
                layout.groupX = 0;
                layout.groupY = 0;
                layout.torusScale = 1;
                icosahedron.position.set(-18, 12, -18);
                sphere.position.set(18, -8, -14);
            }

            torus.scale.setScalar(layout.torusScale);
            halo.scale.setScalar(layout.torusScale);
            backgroundGroup.position.set(layout.groupX, layout.groupY, 0);
            camera.position.set(0, 0, layout.cameraZ);
            camera.lookAt(backgroundGroup.position);
        };

        applyLayout();

        const resetPointer = () => {
            pointer.targetX = 0;
            pointer.targetY = 0;
        };

        if (finePointer && !prefersReducedMotion) {
            window.addEventListener("pointermove", (event) => {
                pointer.targetX = ((event.clientX / window.innerWidth) - 0.5) * 2;
                pointer.targetY = ((event.clientY / window.innerHeight) - 0.5) * 2;
            });

            document.body.addEventListener("pointerleave", resetPointer);
            window.addEventListener("blur", resetPointer);
        }

        const clock = new THREE.Clock();
        const renderBackground = () => {
            const elapsed = clock.getElapsedTime();

            pointer.currentX += (pointer.targetX - pointer.currentX) * 0.045;
            pointer.currentY += (pointer.targetY - pointer.currentY) * 0.045;

            backgroundGroup.rotation.y = pointer.currentX * 0.14;
            backgroundGroup.rotation.x = -pointer.currentY * 0.06;
            backgroundGroup.position.x += ((layout.groupX + pointer.currentX * 1.2) - backgroundGroup.position.x) * 0.035;
            backgroundGroup.position.y += ((layout.groupY - pointer.currentY * 0.8) - backgroundGroup.position.y) * 0.035;

            camera.position.x += ((pointer.currentX * 2.4) - camera.position.x) * 0.03;
            camera.position.y += (((-pointer.currentY) * 1.35) - camera.position.y) * 0.03;
            camera.position.z += (layout.cameraZ - camera.position.z) * 0.04;
            camera.lookAt(backgroundGroup.position);

            torus.rotation.x += prefersReducedMotion ? 0.0001 : 0.00055;
            torus.rotation.y += prefersReducedMotion ? 0.0002 : 0.0013;
            torus.rotation.z += prefersReducedMotion ? 0.00008 : 0.00034;

            icosahedron.rotation.x -= prefersReducedMotion ? 0.00014 : 0.00068;
            icosahedron.rotation.y -= prefersReducedMotion ? 0.0001 : 0.00052;

            sphere.rotation.x += prefersReducedMotion ? 0.00012 : 0.00058;
            sphere.rotation.y += prefersReducedMotion ? 0.00016 : 0.00082;

            halo.rotation.x = (Math.PI / 2.4) + Math.sin(elapsed * 0.38) * 0.05;
            halo.rotation.z += prefersReducedMotion ? 0.00008 : 0.0004;

            particles.rotation.y = (-elapsed * 0.012) + pointer.currentX * 0.03;
            particles.rotation.x = (Math.sin(elapsed * 0.18) * 0.04) + pointer.currentY * 0.03;

            renderer.render(scene, camera);

            if (!prefersReducedMotion) {
                window.requestAnimationFrame(renderBackground);
            }
        };

        renderBackground();

        window.addEventListener("resize", () => {
            applyLayout();
            if (prefersReducedMotion) {
                renderer.render(scene, camera);
            }
        });
    }
});

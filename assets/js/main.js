/* ===============================================
   THE JUICE SPOT – Main JavaScript
   =============================================== */

document.addEventListener('DOMContentLoaded', () => {

    // === Initialize AOS ===
    AOS.init({
        duration: 700,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50
    });

    // === Preloader ===
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            // Show popup after preloader
            setTimeout(showGuidePopup, 3000);
        }, 1500);
    });

    // Fallback: hide preloader after 4s max
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 4000);

    // === Navigation ===

    // === Hero Carousel ===
    const slides = document.querySelectorAll('.hero-slide');
    const dotsContainer = document.querySelector('.hero-carousel-dots');
    let currentSlide = 0;
    let carouselInterval;

    if (slides.length > 0 && dotsContainer) {
        // Create dots
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Slide ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.dot');

        function goToSlide(index) {
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            currentSlide = index;
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }

        function nextSlide() {
            goToSlide((currentSlide + 1) % slides.length);
        }

        carouselInterval = setInterval(nextSlide, 3500);

        // Pause on hover
        const carousel = document.querySelector('.hero-carousel');
        carousel.addEventListener('mouseenter', () => clearInterval(carouselInterval));
        carousel.addEventListener('mouseleave', () => {
            carouselInterval = setInterval(nextSlide, 3500);
        });
    }
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top visibility
        const backToTop = document.getElementById('backToTop');
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // Active section highlighting
        updateActiveNav();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Active nav updating
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // === Back to Top ===
    document.getElementById('backToTop').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // === Juice Filters ===
    const filterBtns = document.querySelectorAll('.filter-btn');
    const juiceCards = document.querySelectorAll('.juice-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter cards
            juiceCards.forEach(card => {
                const categories = card.dataset.category || '';
                if (filter === 'all' || categories.includes(filter)) {
                    card.style.display = '';
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // === Free Guide Popup ===
    const guidePopup = document.getElementById('guide-popup');
    const popupClose = guidePopup.querySelector('.popup-close');

    function showGuidePopup() {
        // Only show if user hasn't dismissed before
        if (!sessionStorage.getItem('guidePopupDismissed')) {
            guidePopup.classList.add('active');
        }
    }

    function closePopup() {
        guidePopup.classList.remove('active');
        sessionStorage.setItem('guidePopupDismissed', 'true');
    }

    popupClose.addEventListener('click', closePopup);

    guidePopup.addEventListener('click', (e) => {
        if (e.target === guidePopup) closePopup();
    });

    // Guide form handler
    document.getElementById('guide-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        
        // Show success
        const content = guidePopup.querySelector('.popup-content');
        content.innerHTML = `
            <div class="popup-icon">🎉</div>
            <h3>You're In!</h3>
            <p>Check your email at <strong>${email}</strong> for your free Juicing Guide. Welcome to The Juice Spot family!</p>
            <button class="btn btn-primary" onclick="document.getElementById('guide-popup').classList.remove('active')" style="margin-top: 1rem;">
                Start Exploring <i class="fas fa-arrow-right"></i>
            </button>
        `;
    });

    // === Contact Form ===
    document.getElementById('contactForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        
        // Create mailto link with form data
        const subject = formData.get('subject') || 'Website Inquiry';
        const body = `Name: ${formData.get('name')}%0D%0AEmail: ${formData.get('email')}%0D%0ASubject: ${subject}%0D%0A%0D%0AMessage:%0D%0A${formData.get('message')}`;
        
        window.location.href = `mailto:info@TheJuiceSpot.com?subject=${encodeURIComponent(subject)}&body=${body}`;
        
        // Show success message
        const wrapper = form.closest('.contact-form-wrapper');
        wrapper.innerHTML = `
            <div style="text-align: center; padding: 3rem 1.5rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">✉️</div>
                <h3 style="font-family: 'Playfair Display', serif; margin-bottom: 0.75rem;">Message Ready!</h3>
                <p style="color: #4a5568;">Your email client should open with your message. You can also email us directly at <a href="mailto:info@TheJuiceSpot.com" style="color: #2d6a4f; font-weight: 600;">info@TheJuiceSpot.com</a></p>
            </div>
        `;
    });

    // === Smooth reveal animation ===
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

    // === Intersection Observer for counters ===
    const statNumbers = document.querySelectorAll('.stat-number');
    const observerOptions = { threshold: 0.5 };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = el.textContent;
                
                if (target.includes('+')) {
                    animateCounter(el, parseInt(target), '+');
                } else if (target.includes('%')) {
                    animateCounter(el, parseInt(target), '%');
                } else {
                    animateCounter(el, parseInt(target), '');
                }
                counterObserver.unobserve(el);
            }
        });
    }, observerOptions);

    statNumbers.forEach(stat => counterObserver.observe(stat));

    function animateCounter(el, target, suffix) {
        let current = 0;
        const increment = target / 40;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = Math.floor(current) + suffix;
        }, 30);
    }

    // === Escape key handlers ===
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closePopup();
            closeNutrition();
        }
    });
});

// === Nutrition Modal ===
function openNutrition(filename) {
    const modal = document.getElementById('nutritionModal');
    const img = document.getElementById('nutritionImage');
    img.src = `assets/images/${filename}`;
    img.alt = `Nutritional information - ${filename.replace('.jpg', '')}`;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeNutrition() {
    const modal = document.getElementById('nutritionModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal on background click
document.getElementById('nutritionModal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeNutrition();
});

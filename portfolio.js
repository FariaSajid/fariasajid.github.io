// Wait for DOM to load completely
document.addEventListener('DOMContentLoaded', () => {
    
    // ========================================
    // 1. MOBILE MENU FUNCTIONALITY
    // ========================================
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Update aria-expanded attribute for accessibility
            const isExpanded = mobileMenuBtn.classList.contains('active');
            mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isExpanded ? 'hidden' : '';
        });
    }
    
    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target) && navMenu.classList.contains('active')) {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // ========================================
    // 2. DARK MODE TOGGLE
    // ========================================
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        // Toggle icon
        if (document.body.classList.contains('dark-mode')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
            
            // Show cute notification
            showNotification('🌙 Dark mode activated!', 'info');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
            
            // Show cute notification
            showNotification('☀️ Light mode activated!', 'info');
        }
    });

    // ========================================
    // 3. ACTIVE NAVIGATION HIGHLIGHTING
    // ========================================
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY + 100; // Offset for header
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNavLink);

    // ========================================
    // 4. HEADER SCROLL EFFECT
    // ========================================
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ========================================
    // 5. BACK TO TOP BUTTON
    // ========================================
    const backToTop = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ========================================
    // 6. SKILL BARS ANIMATION
    // ========================================
    const skillItems = document.querySelectorAll('.skill-item');
    const skillProgress = document.querySelectorAll('.skill-progress');
    
    function animateSkillBars() {
        skillItems.forEach(item => {
            const skillLevel = item.getAttribute('data-level');
            const progressBar = item.querySelector('.skill-progress');
            
            if (isElementInViewport(item) && !progressBar.classList.contains('animated')) {
                progressBar.classList.add('animated');
                progressBar.style.width = skillLevel + '%';
            }
        });
    }
    
    // Helper function to check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    // Check on scroll
    window.addEventListener('scroll', animateSkillBars);
    // Check on load
    animateSkillBars();

    // ========================================
    // 7. PROJECT FILTERING
    // ========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            // Filter projects with animation
            projectCards.forEach(card => {
                // Add fade-out animation
                card.style.animation = 'fadeOut 0.3s ease forwards';
                
                setTimeout(() => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                        // Add fade-in animation
                        card.style.animation = 'cardAppear 0.5s ease forwards';
                    } else {
                        card.style.display = 'none';
                    }
                }, 300);
            });
            
            // Show notification based on category
        if (filterValue !== 'all') {
            let categoryName = '';
            switch(filterValue) {
                case 'cpp':
                    categoryName = 'C++';
                    break;
                case 'web':
                    categoryName = 'Web Development';
                    break;
                case 'ai':
                    categoryName = 'AI Automation';
                    break;
            }
            showNotification(`Showing ${categoryName} projects!`, 'info');
        }
        });
    });

// ========================================
// 8. CONTACT FORM - WHATSAPP INTEGRATION 
// ========================================
const contactForm = document.getElementById('contactForm');
const formStatus = document.querySelector('.form-status');

// Your WhatsApp number (international format without '+')
const whatsappNumber = '923219526786'; // Remove the '+' and any spaces

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const name = document.getElementById('name')?.value || '';
        const whatsapp = document.getElementById('whatsapp')?.value || '';
        const subject = document.getElementById('subject')?.value || '';
        const message = document.getElementById('message')?.value || '';
        
        // Validate form
        const validation = validateWhatsAppForm({ name, subject, message });
        
        if (validation.isValid) {
            // Create WhatsApp message with better formatting
            let whatsappMessage = `*New message from Portfolio Website*\n\n`;
            whatsappMessage += `*Name:* ${name}\n`;
            if (whatsapp) {
                whatsappMessage += `*WhatsApp:* ${whatsapp}\n`;
            }
            whatsappMessage += `*Subject:* ${subject}\n\n`;
            whatsappMessage += `*Message:* \n${message}\n\n`;
            whatsappMessage += `---\nSent from Faria's Portfolio`;
            
            // Encode message for URL (replace newlines and special characters)
            let encodedMessage = encodeURIComponent(whatsappMessage);
            
            // Create WhatsApp URL - using correct format
            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            
            // Show success message
            formStatus.textContent = '✨ Opening WhatsApp... ✨';
            formStatus.className = 'form-status success';
            formStatus.style.opacity = '1';
            
            // Clear form
            contactForm.reset();
            
            // Open WhatsApp in new tab immediately
            window.open(whatsappURL, '_blank');
            
            // Show notification
            showNotification('💬 WhatsApp opened! Send your message to complete!', 'success');
            
            // Hide status message after 3 seconds
            setTimeout(() => {
                formStatus.style.opacity = '0';
                setTimeout(() => {
                    formStatus.textContent = '';
                    formStatus.className = 'form-status';
                    formStatus.style.opacity = '';
                }, 300);
            }, 3000);
            
        } else {
            // Show validation errors
            formStatus.textContent = validation.message;
            formStatus.className = 'form-status error';
            formStatus.style.opacity = '1';
            
            // Auto-hide error after 5 seconds
            setTimeout(() => {
                formStatus.style.opacity = '0';
                setTimeout(() => {
                    formStatus.textContent = '';
                    formStatus.className = 'form-status';
                    formStatus.style.opacity = '';
                }, 300);
            }, 5000);
        }
    });
}

// WhatsApp Form Validation
function validateWhatsAppForm(data) {
    let isValid = true;
    let message = '';
    
    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('input, textarea').forEach(el => {
        el.style.borderColor = '';
        el.style.border = '';
    });
    
    // Validate name
    if (!data.name.trim()) {
        showError('name', 'Please tell me your name! 💫');
        isValid = false;
        message = 'Please fill in all required fields';
    }
    
    // Validate subject
    if (!data.subject.trim()) {
        showError('subject', 'What would you like to discuss? 📝');
        isValid = false;
        message = 'Please fill in all required fields';
    }
    
    // Validate message
    if (!data.message.trim()) {
        showError('message', 'Please write your message! 💬');
        isValid = false;
        message = 'Please fill in all required fields';
    } else if (data.message.trim().length < 10) {
        showError('message', 'Please write at least 10 characters 📝');
        isValid = false;
        message = 'Message should be at least 10 characters long';
    }
    
    // Optional: Validate WhatsApp number format if provided
    if (data.whatsapp && data.whatsapp.trim()) {
        const whatsappRegex = /^[\+]?[0-9\s\-]{10,20}$/;
        if (!whatsappRegex.test(data.whatsapp)) {
            showError('whatsapp', 'Please enter a valid WhatsApp number (optional) 📱');
            // Not setting isValid = false because this is optional
        }
    }
    
    if (isValid) {
        message = '✓ Opening WhatsApp...';
    }
    
    return { isValid, message };
}

// Show error message (updated)
function showError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}Error`);
    const inputElement = document.getElementById(fieldId);
    
    if (errorElement) {
        errorElement.textContent = message;
    }
    if (inputElement) {
        inputElement.style.border = '2px solid #ff6b6b';
        inputElement.style.borderColor = '#ff6b6b';
    }
}

    // ========================================
    // 9. SMOOTH SCROLLING FOR NAVIGATION
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // 10. STATS COUNTER ANIMATION
    // ========================================
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateStats() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const currentValue = parseInt(stat.textContent);
            
            if (isElementInViewport(stat) && currentValue < target && !stat.classList.contains('animated')) {
                stat.classList.add('animated');
                
                // Animate counting
                let startValue = 0;
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps
                
                function updateCounter() {
                    startValue += increment;
                    if (startValue < target) {
                        stat.textContent = Math.floor(startValue);
                        requestAnimationFrame(updateCounter);
                    } else {
                        stat.textContent = target + '+';
                    }
                }
                
                requestAnimationFrame(updateCounter);
            }
        });
    }
    
    window.addEventListener('scroll', animateStats);

    // ========================================
    // 11. CUSTOM NOTIFICATION SYSTEM
    // ========================================
    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.custom-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `custom-notification ${type}`;
        notification.innerHTML = message;
        
        // Add styles dynamically
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--gradient-1);
            color: white;
            padding: 1rem 2rem;
            border-radius: 50px;
            box-shadow: 0 10px 30px var(--shadow);
            z-index: 9999;
            animation: slideInRight 0.3s ease, slideOutRight 0.3s ease 2.7s forwards;
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // ========================================
    // 12. LAZY LOADING IMAGES
    // ========================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ========================================
    // 13. PAGE LOAD ANIMATIONS
    // ========================================
    window.addEventListener('load', () => {
        // Fade in body content
        document.body.style.opacity = '1';
        
        // Add loaded class to all images
        document.querySelectorAll('img').forEach(img => {
            img.classList.add('loaded');
        });
        
        // Show welcome message for first-time visitors
        if (!localStorage.getItem('visited')) {
            setTimeout(() => {
                showNotification('✨ Welcome to my portfolio!', 'info');
                localStorage.setItem('visited', 'true');
            }, 1000);
        }
    });

    // ========================================
    // 14. TYPING EFFECT FOR HERO (Optional)
    // ========================================
    const heroRole = document.querySelector('.title-role');
    if (heroRole) {
        const roles = ['IT Student', 'Web Developer', 'Problem Solver', 'Crochet Lover'];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let currentText = '';
        
        function typeEffect() {
            const currentRole = roles[roleIndex];
            
            if (isDeleting) {
                currentText = currentRole.substring(0, charIndex - 1);
                charIndex--;
            } else {
                currentText = currentRole.substring(0, charIndex + 1);
                charIndex++;
            }
            
            heroRole.textContent = currentText;
            
            if (!isDeleting && charIndex === currentRole.length) {
                isDeleting = true;
                setTimeout(typeEffect, 2000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                setTimeout(typeEffect, 500);
            } else {
                setTimeout(typeEffect, isDeleting ? 50 : 100);
            }
        }
        
        // Start typing effect (uncomment if you want it)
        // setTimeout(typeEffect, 2000);
    }

    // ========================================
    // 15. PROJECT HOVER EFFECTS (Touch devices)
    // ========================================
    if ('ontouchstart' in window) {
        projectCards.forEach(card => {
            card.addEventListener('touchstart', function() {
                this.querySelector('.project-overlay').style.opacity = '1';
            });
            
            card.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.querySelector('.project-overlay').style.opacity = '0';
                }, 2000);
            });
        });
    }

    // ========================================
    // 16. SCROLL REVEAL ANIMATIONS
    // ========================================
    const revealElements = document.querySelectorAll('.section-title, .skill-category, .project-card, .contact-item');
    
    function revealOnScroll() {
        revealElements.forEach(element => {
            if (isElementInViewport(element) && !element.classList.contains('revealed')) {
                element.classList.add('revealed');
                element.style.animation = 'slideInUp 0.6s ease forwards';
            }
        });
    }
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Check on load

    // ========================================
    // 17. ADD CSS ANIMATIONS DYNAMICALLY
    // ========================================
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOut {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0; transform: scale(0.8); }
        }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100px);
            }
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        body {
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        
        img {
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        
        img.loaded {
            opacity: 1;
        }
        
        .stat-number {
            display: inline-block;
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--primary);
        }
        
        .custom-notification {
            pointer-events: none;
            backdrop-filter: blur(10px);
        }
        
        .custom-notification.info {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .custom-notification.success {
            background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
        }
        
        .custom-notification.error {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
        
        /* Loading state for buttons */
        button[disabled] {
            opacity: 0.7;
            cursor: not-allowed;
        }
        
        /* Form validation styles */
        input:invalid, textarea:invalid {
            border-color: #ff6b6b;
        }
        
        input:valid, textarea:valid {
            border-color: #ff6b6b;
        }
        
        /* Reveal animations */
        .section-title, .skill-category, .project-card, .contact-item {
            opacity: 0;
        }
        
        .section-title.revealed, 
        .skill-category.revealed, 
        .project-card.revealed, 
        .contact-item.revealed {
            opacity: 1;
        }
    `;
    
    document.head.appendChild(style);

    // ========================================
// PERFORMANCE OPTIMIZATIONS FOR MOBILE
// ========================================

// 1. LAZY LOAD IMAGES (Only load images when needed)
// ========================================
function initLazyLoading() {
    // Check if browser supports Intersection Observer
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.classList.add('loaded');
                    }
                    
                    // Also handle background images
                    if (img.dataset.bg) {
                        img.style.backgroundImage = `url(${img.dataset.bg})`;
                    }
                    
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px', // Start loading 50px before image enters viewport
            threshold: 0.01
        });
        
        // Observe all images with data-src attribute
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
        
        // Also observe regular images for progressive loading
        document.querySelectorAll('img:not([data-src])').forEach(img => {
            if (!img.complete) {
                img.style.opacity = '0';
                img.addEventListener('load', function() {
                    this.style.opacity = '1';
                });
                imageObserver.observe(img);
            }
        });
    } else {
        // Fallback for older browsers
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.getAttribute('data-src');
        });
    }
}

// 2. DEFER NON-CRITICAL CSS
// ========================================
function deferNonCriticalCSS() {
    // Load non-critical CSS after page load
    window.addEventListener('load', () => {
        const styles = [
            // Add any non-critical CSS files here
        ];
        
        styles.forEach(style => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = style;
            link.media = 'print';
            link.onload = () => link.media = 'all';
            document.head.appendChild(link);
        });
    });
}

// 3. OPTIMIZE FONTS (Prevent FOIT - Flash of Invisible Text)
// ========================================
function optimizeFonts() {
    if ('fonts' in document) {
        // Wait for fonts to load
        document.fonts.ready.then(() => {
            document.body.classList.add('fonts-loaded');
        });
    }
    
    // Add font-display CSS
    const fontStyle = document.createElement('style');
    fontStyle.textContent = `
        @font-face {
            font-family: 'Inter';
            font-display: swap;
        }
    `;
    document.head.appendChild(fontStyle);
}

// 4. REDUCE ANIMATIONS ON MOBILE (Better performance)
// ========================================
function reduceMobileAnimations() {
    // Check if device is mobile
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Disable heavy animations
        const style = document.createElement('style');
        style.textContent = `
            /* Reduce or remove animations on mobile */
            .hero::before, .hero::after {
                animation: none !important;
                opacity: 0.05 !important;
            }
            
            .skill-progress {
                transition: width 0.5s ease !important;
            }
            
            .project-card {
                animation: none !important;
                opacity: 1 !important;
                transform: none !important;
            }
            
            .project-card:hover {
                transform: none !important;
            }
            
            .skill-category:hover {
                transform: none !important;
            }
            
            /* Simplify transitions */
            * {
                animation-duration: 0.3s !important;
            }
            
            /* Disable background morphing animation */
            .image-wrapper::before {
                animation: none !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// 5. THROTTLE SCROLL EVENTS (Improve scroll performance)
// ========================================
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Apply throttling to scroll-heavy functions
function optimizeScrollEvents() {
    const originalUpdateActiveNavLink = updateActiveNavLink;
    const originalAnimateSkillBars = animateSkillBars;
    const originalRevealOnScroll = revealOnScroll;
    
    // Replace with throttled versions
    window.updateActiveNavLink = throttle(originalUpdateActiveNavLink, 100);
    window.animateSkillBars = throttle(originalAnimateSkillBars, 100);
    window.revealOnScroll = throttle(originalRevealOnScroll, 100);
}

// 6. CACHE DOM ELEMENTS (Reduce DOM queries)
// ========================================
class DOMCache {
    constructor() {
        this.cache = new Map();
    }
    
    get(selector) {
        if (!this.cache.has(selector)) {
            this.cache.set(selector, document.querySelector(selector));
        }
        return this.cache.get(selector);
    }
    
    getAll(selector) {
        if (!this.cache.has(selector)) {
            this.cache.set(selector, document.querySelectorAll(selector));
        }
        return this.cache.get(selector);
    }
    
    clear() {
        this.cache.clear();
    }
}

// Initialize DOM cache
const domCache = new DOMCache();

// 7. PRELOAD CRITICAL RESOURCES
// ========================================
function preloadCriticalResources() {
    const criticalResources = [
        // Preload critical images
        // 'Profile_pic.jpg',
        // 'Portfolio.pic.png'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = resource.endsWith('.css') ? 'style' : 'image';
        link.href = resource;
        document.head.appendChild(link);
    });
}

// 8. DEFFER JAVASCRIPT EXECUTION
// ========================================
function deferJavaScript() {
    // Move non-critical JavaScript to after page load
    window.addEventListener('load', () => {
        // Initialize non-critical features
        setTimeout(() => {
            initNonCriticalFeatures();
        }, 100);
    });
}

function initNonCriticalFeatures() {
    // Initialize stats counter
    if (typeof animateStats === 'function') {
        animateStats();
    }
    
    // Initialize any other non-critical features
    console.log('Non-critical features loaded');
}

// 9. OPTIMIZE EVENT LISTENERS
// ========================================
function optimizeEventListeners() {
    // Use event delegation where possible
    document.body.addEventListener('click', (e) => {
        // Handle filter buttons
        if (e.target.classList && e.target.classList.contains('filter-btn')) {
            // Filter logic here (but it's already handled)
        }
        
        // Handle mobile menu
        if (e.target.closest('.mobile-menu-btn')) {
            // Mobile menu logic
        }
    });
}

// 10. ENABLE SMOOTH SCROLLING WITH PERFORMANCE IN MIND
// ========================================
function initSmoothScrolling() {
    // Only enable smooth scrolling on desktop
    const isMobile = window.innerWidth <= 768;
    
    if (!isMobile) {
        document.documentElement.style.scrollBehavior = 'smooth';
    } else {
        // Use JavaScript smooth scroll on mobile (more performant)
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerOffset = 70;
                    const elementPosition = targetElement.offsetTop;
                    const offsetPosition = elementPosition - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// 11. COMPRESS AND OPTIMIZE IMAGES (Helper function)
// ========================================
function optimizeImages() {
    // Add loading="lazy" to all images
    document.querySelectorAll('img').forEach(img => {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        
        // Add decoding="async" for faster rendering
        img.setAttribute('decoding', 'async');
    });
}

// 12. DETECT SLOW CONNECTION AND ADJUST
// ========================================
function detectSlowConnection() {
    if ('connection' in navigator) {
        const connection = navigator.connection;
        
        if (connection.saveData || 
            connection.effectiveType === 'slow-2g' || 
            connection.effectiveType === '2g') {
            
            // Disable heavy features on slow connections
            document.body.classList.add('slow-connection');
            
            const style = document.createElement('style');
            style.textContent = `
                /* Disable animations on slow connections */
                * {
                    animation: none !important;
                    transition: none !important;
                }
                
                /* Load lower quality images */
                img {
                    filter: blur(0) !important;
                }
            `;
            document.head.appendChild(style);
            
            // Show notification
            showNotification('📱 Optimizing for slower connection...', 'info');
        }
    }
}

// 13. USE REQUESTANIMATIONFRAME FOR SMOOTH ANIMATIONS
// ========================================
function smoothAnimation(fn) {
    let ticking = false;
    
    return function() {
        if (!ticking) {
            requestAnimationFrame(() => {
                fn.apply(this, arguments);
                ticking = false;
            });
            ticking = true;
        }
    };
}

// 14. CLEANUP MEMORY (Prevent memory leaks)
// ========================================
function setupCleanup() {
    // Clear DOM cache when page is unloaded
    window.addEventListener('beforeunload', () => {
        domCache.clear();
    });
    
    // Remove old notifications
    setInterval(() => {
        const oldNotifications = document.querySelectorAll('.custom-notification');
        oldNotifications.forEach(notification => {
            if (notification.style.animation === 'slideOutRight 0.3s ease 2.7s forwards') {
                setTimeout(() => notification.remove(), 3000);
            }
        });
    }, 5000);
}

// 15. MAIN INITIALIZATION FUNCTION
// ========================================
function initPerformanceOptimizations() {
    // Run critical optimizations immediately
    optimizeImages();
    optimizeFonts();
    detectSlowConnection();
    reduceMobileAnimations();
    initLazyLoading();
    
    // Run after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            deferNonCriticalCSS();
            optimizeEventListeners();
            initSmoothScrolling();
            setupCleanup();
        });
    } else {
        deferNonCriticalCSS();
        optimizeEventListeners();
        initSmoothScrolling();
        setupCleanup();
    }
    
    // Run after page fully loads
    window.addEventListener('load', () => {
        preloadCriticalResources();
        deferJavaScript();
        optimizeScrollEvents();
    });
}

// Start performance optimizations
initPerformanceOptimizations();

// Update existing functions to be more performance-friendly
// Override showNotification to be lighter on mobile
const originalShowNotification = window.showNotification;
if (originalShowNotification) {
    window.showNotification = function(message, type) {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Shorter notifications on mobile
            const notification = document.createElement('div');
            notification.className = `custom-notification ${type}`;
            notification.innerHTML = message;
            notification.style.cssText = `
                position: fixed;
                top: 80px;
                right: 10px;
                left: 10px;
                background: var(--gradient-1);
                color: white;
                padding: 0.8rem;
                border-radius: 12px;
                text-align: center;
                z-index: 9999;
                font-size: 0.85rem;
                animation: slideInRight 0.2s ease;
            `;
            document.body.appendChild(notification);
            
            setTimeout(() => notification.remove(), 2000);
        } else {
            originalShowNotification(message, type);
        }
    };
}
});

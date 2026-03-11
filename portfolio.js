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
            
            // Show notification
            if (filterValue !== 'all') {
                const categoryName = filterValue === 'cpp' ? 'C++' : 'Web Development';
                showNotification(`Showing ${categoryName} projects! 🚀`, 'info');
            }
        });
    });

    // ========================================
    // 8. CONTACT FORM HANDLING
    // ========================================
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.querySelector('.form-status');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // Validate form
            if (validateForm(formData)) {
                // Show loading state
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending... ✨';
                submitBtn.disabled = true;
                
                try {
                    // Simulate form submission (replace with actual API endpoint)
                    await simulateFormSubmission(formData);
                    
                    // Show success message
                    formStatus.textContent = 'Message sent successfully! 🎉 I\'ll get back to you soon.';
                    formStatus.className = 'form-status success';
                    
                    // Clear form
                    contactForm.reset();
                    
                    // Hide success message after 5 seconds
                    setTimeout(() => {
                        formStatus.style.opacity = '0';
                        setTimeout(() => {
                            formStatus.textContent = '';
                            formStatus.className = 'form-status';
                            formStatus.style.opacity = '';
                        }, 300);
                    }, 5000);
                    
                } catch (error) {
                    // Show error message
                    formStatus.textContent = 'Oops! Something went wrong. Please try again. 😅';
                    formStatus.className = 'form-status error';
                } finally {
                    // Reset button
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            }
        });
    }
    
    // Form validation function
    function validateForm(data) {
        let isValid = true;
        
        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        document.querySelectorAll('input, textarea').forEach(el => el.style.borderColor = '');
        
        // Validate name
        if (!data.name.trim()) {
            showError('name', 'Name is required 💫');
            isValid = false;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email.trim()) {
            showError('email', 'Email is required 📧');
            isValid = false;
        } else if (!emailRegex.test(data.email)) {
            showError('email', 'Please enter a valid email address 💌');
            isValid = false;
        }
        
        // Validate message
        if (!data.message.trim()) {
            showError('message', 'Message is required 💬');
            isValid = false;
        } else if (data.message.trim().length < 10) {
            showError('message', 'Message should be at least 10 characters long 📝');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Show error message
    function showError(fieldId, message) {
        const errorElement = document.getElementById(`${fieldId}Error`);
        const inputElement = document.getElementById(fieldId);
        
        if (errorElement) {
            errorElement.textContent = message;
        }
        if (inputElement) {
            inputElement.style.borderColor = '#ff6b6b';
        }
    }
    
    // Simulate form submission (replace with actual API call)
    function simulateFormSubmission(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form submitted:', data);
                resolve();
            }, 1500);
        });
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
            border-color: #51cf66;
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
});
/*
===============================
PORTFOLIO WEBSITE SCRIPTS
Frontend Developer Portfolio
Vanilla JavaScript - No Dependencies
===============================
*/

'use strict';

/**
 * DOM Content Loaded Event
 * Initialize all functionality when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    MobileMenu.init();
    SmoothScrolling.init();
    ScrollAnimations.init();
    BackgroundAnimation.init();
    ParticleSystem.init();
    ContactForm.init();
    TypingAnimation.init();
    ScrollIndicator.init();
    ServicesSection.init();
    TestimonialsSection.init();
    DevelopmentPage.init();
    CybersecurityPage.init();
    AIPage.init();
    Footer.init();
    
    // Performance optimization
    Performance.init();
});

/*
===============================
SITE FOOTER
===============================
*/
const Footer = {
    init() {
        this.setCurrentYear();
    },

    setCurrentYear() {
        const yearElement = document.getElementById('current-year');
        if (!yearElement) return;

        const year = new Date().getFullYear();
        yearElement.textContent = year;
    }
};

/*
===============================
MOBILE NAVIGATION MENU
===============================
*/
const MobileMenu = {
    elements: null,
    isOpen: false,
    
    init() {
        this.cacheElements();
        this.bindEvents();
    },
    
    cacheElements() {
        this.elements = {
            menuToggle: document.querySelector('.mobile-menu-toggle'),
            navLinks: document.querySelector('.nav-links'),
            navItems: document.querySelectorAll('.nav-link'),
            body: document.body
        };
    },
    
    bindEvents() {
        const { menuToggle, navItems } = this.elements;
        
        if (menuToggle) {
            menuToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMenu();
            });
        }
        
        // Close menu when clicking nav links
        navItems.forEach(link => {
            link.addEventListener('click', () => {
                if (this.isOpen) {
                    this.closeMenu();
                }
            });
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && !e.target.closest('.navbar')) {
                this.closeMenu();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', Utils.debounce(() => {
            if (window.innerWidth > 768 && this.isOpen) {
                this.closeMenu();
            }
        }, 250));
    },
    
    toggleMenu() {
        this.isOpen ? this.closeMenu() : this.openMenu();
    },
    
    openMenu() {
        const { menuToggle, navLinks, body } = this.elements;
        
        this.isOpen = true;
        menuToggle.setAttribute('aria-expanded', 'true');
        navLinks.classList.add('mobile-open');
        body.style.overflow = 'hidden';
        
        // Animate menu items
        this.animateMenuItems(true);
    },
    
    closeMenu() {
        const { menuToggle, navLinks, body } = this.elements;
        
        this.isOpen = false;
        menuToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('mobile-open');
        body.style.overflow = '';
        
        // Animate menu items
        this.animateMenuItems(false);
    },
    
    animateMenuItems(isOpening) {
        const { navItems } = this.elements;
        
        navItems.forEach((item, index) => {
            if (isOpening) {
                setTimeout(() => {
                    item.style.transform = 'translateY(0)';
                    item.style.opacity = '1';
                }, index * 100);
            } else {
                item.style.transform = 'translateY(-20px)';
                item.style.opacity = '0';
            }
        });
    }
};

/*
===============================
SMOOTH SCROLLING
===============================
*/
const SmoothScrolling = {
    init() {
        this.bindEvents();
    },
    
    bindEvents() {
        // Handle all anchor links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;
            
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;
            
            e.preventDefault();
            this.scrollToTarget(targetId);
        });
    },
    
    scrollToTarget(targetId) {
        const target = document.querySelector(targetId);
        if (!target) return;
        
        const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        
        this.smoothScrollTo(targetPosition);
    },
    
    smoothScrollTo(targetPosition) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = Math.min(Math.abs(distance) / 2, 1000); // Max 1 second
        let startTime = null;
        
        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Easing function (ease-in-out-cubic)
            const ease = progress < 0.5 
                ? 4 * progress * progress * progress
                : (progress - 1) * (2 * progress - 2) * (2 * progress - 2) + 1;
            
            window.scrollTo(0, startPosition + distance * ease);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };
        
        requestAnimationFrame(animation);
    }
};

/*
===============================
SCROLL-BASED ANIMATIONS
===============================
*/
const ScrollAnimations = {
    elements: [],
    observer: null,
    
    init() {
        this.setupIntersectionObserver();
        this.findAnimationElements();
        this.bindScrollEvents();
    },
    
    setupIntersectionObserver() {
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            {
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px'
            }
        );
    },
    
    findAnimationElements() {
        const selectors = [
            '.hero-name',
            '.hero-title', 
            '.hero-description',
            '.cta-buttons',
            '.highlight-card',
            '.project-card',
            '.skill-item',
            '.experience-item',
            '.certification-card',
            '.section-title',
            '.contact-info'
        ];
        
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.classList.add('scroll-animation');
                this.observer.observe(el);
            });
        });
    },
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Add stagger effect for grouped elements
                this.addStaggerEffect(entry.target);
            }
        });
    },
    
    addStaggerEffect(element) {
        const parent = element.parentElement;
        const siblings = Array.from(parent.children).filter(el => 
            el.classList.contains('scroll-animation') && !el.classList.contains('animate')
        );
        
        siblings.forEach((sibling, index) => {
            setTimeout(() => {
                sibling.classList.add('animate');
            }, index * 150);
        });
    },
    
    bindScrollEvents() {
        let ticking = false;
        
        const updateHeaderOnScroll = () => {
            const header = document.querySelector('.header');
            if (!header) return;
            
            const scrolled = window.pageYOffset > 100;
            header.style.background = scrolled 
                ? 'rgba(0, 0, 0, 0.98)' 
                : 'rgba(0, 0, 0, 0.95)';
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateHeaderOnScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
};

/*
===============================
BACKGROUND ANIMATION
===============================
*/
const BackgroundAnimation = {
    container: null,
    elements: [],
    
    init() {
        this.container = document.querySelector('.animated-background');
        if (!this.container) return;
        
        this.elements = Array.from(this.container.querySelectorAll('.floating-element'));
        this.enhanceFloatingElements();
        this.createAdditionalElements();
        this.startAnimation();
    },
    
    enhanceFloatingElements() {
        this.elements.forEach((element, index) => {
            // Add 3D transformation
            element.style.transform = `translateZ(${index * 10}px)`;
            element.style.willChange = 'transform, opacity';
            
            // Random starting positions
            const startX = Math.random() * window.innerWidth;
            const startY = Math.random() * window.innerHeight;
            element.style.left = startX + 'px';
            element.style.top = startY + 'px';
            
            // Add pulsing effect
            this.addPulseAnimation(element, index);
        });
    },
    
    addPulseAnimation(element, index) {
        const duration = 2000 + (index * 500); // Vary duration
        const delay = index * 200;
        
        const pulse = () => {
            element.animate([
                { opacity: 0.1, transform: 'scale(1)' },
                { opacity: 0.4, transform: 'scale(1.2)' },
                { opacity: 0.1, transform: 'scale(1)' }
            ], {
                duration: duration,
                delay: delay,
                easing: 'ease-in-out'
            });
        };
        
        pulse();
        setInterval(pulse, duration + delay);
    },
    
    createAdditionalElements() {
        // Create additional animated shapes
        for (let i = 0; i < 10; i++) {
            const shape = this.createAnimatedShape();
            this.container.appendChild(shape);
        }
    },
    
    createAnimatedShape() {
        const shapes = ['circle', 'triangle', 'square'];
        const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
        
        const element = document.createElement('div');
        element.className = `floating-shape floating-${shapeType}`;
        
        // Base styles
        element.style.position = 'absolute';
        element.style.pointerEvents = 'none';
        element.style.opacity = '0.05';
        element.style.willChange = 'transform, opacity';
        
        // Shape-specific styles
        switch (shapeType) {
            case 'circle':
                element.style.width = '15px';
                element.style.height = '15px';
                element.style.borderRadius = '50%';
                element.style.background = 'linear-gradient(45deg, #FF0000, #FF3333)';
                break;
            case 'triangle':
                element.style.width = '0';
                element.style.height = '0';
                element.style.borderLeft = '8px solid transparent';
                element.style.borderRight = '8px solid transparent';
                element.style.borderBottom = '16px solid #FF0000';
                break;
            case 'square':
                element.style.width = '12px';
                element.style.height = '12px';
                element.style.background = '#FF0000';
                element.style.transform = 'rotate(45deg)';
                break;
        }
        
        // Random position
        element.style.left = Math.random() * 100 + '%';
        element.style.top = Math.random() * 100 + '%';
        
        return element;
    },
    
    startAnimation() {
        const animate = () => {
            this.elements.forEach(element => {
                this.animateElement(element);
            });
            
            // Animate additional shapes
            const shapes = this.container.querySelectorAll('.floating-shape');
            shapes.forEach(shape => {
                this.animateShape(shape);
            });
            
            requestAnimationFrame(animate);
        };
        
        requestAnimationFrame(animate);
    },
    
    animateElement(element) {
        const time = Date.now() * 0.001;
        const rect = element.getBoundingClientRect();
        
        // Gentle floating motion
        const x = Math.sin(time + rect.left * 0.01) * 20;
        const y = Math.cos(time + rect.top * 0.01) * 15;
        const rotation = Math.sin(time * 0.5) * 360;
        
        element.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg)`;
    },
    
    animateShape(shape) {
        const time = Date.now() * 0.0005;
        const rect = shape.getBoundingClientRect();
        
        // More subtle animation for additional shapes
        const x = Math.sin(time + rect.left * 0.005) * 10;
        const y = Math.cos(time + rect.top * 0.005) * 8;
        const scale = 1 + Math.sin(time * 2) * 0.1;
        
        shape.style.transform += ` translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    }
};

/*
===============================
PARTICLE SYSTEM
===============================
*/
const ParticleSystem = {
    canvas: null,
    ctx: null,
    particles: [],
    animationId: null,
    
    init() {
        this.createCanvas();
        this.setupParticles();
        this.bindEvents();
        this.animate();
    },
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.opacity = '0.3';
        
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);
        
        this.resizeCanvas();
    },
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },
    
    setupParticles() {
        const particleCount = Math.min(50, Math.floor(window.innerWidth / 30));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.3 + 0.1,
                color: `rgba(255, ${Math.floor(Math.random() * 100)}, 0, ${Math.random() * 0.3 + 0.1})`
            });
        }
    },
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around edges
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.y > this.canvas.height) particle.y = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            
            // Draw particle
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw connections to nearby particles
            this.drawConnections(particle, index);
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    },
    
    drawConnections(particle, index) {
        this.particles.slice(index + 1).forEach(otherParticle => {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const opacity = (100 - distance) / 100 * 0.1;
                this.ctx.globalAlpha = opacity;
                this.ctx.strokeStyle = `rgba(255, 0, 0, ${opacity})`;
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.moveTo(particle.x, particle.y);
                this.ctx.lineTo(otherParticle.x, otherParticle.y);
                this.ctx.stroke();
            }
        });
    },
    
    bindEvents() {
        window.addEventListener('resize', Utils.debounce(() => {
            this.resizeCanvas();
            this.particles = [];
            this.setupParticles();
        }, 250));
        
        // Add mouse interaction
        document.addEventListener('mousemove', Utils.throttle((e) => {
            this.addMouseParticle(e.clientX, e.clientY);
        }, 100));
    },
    
    addMouseParticle(x, y) {
        if (this.particles.length > 60) return;
        
        this.particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 2 + 1,
            opacity: 0.3,
            color: `rgba(255, 50, 50, 0.3)`,
            life: 60 // Frames to live
        });
    },
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas) {
            this.canvas.remove();
        }
    }
};

/*
===============================
CONTACT FORM VALIDATION
===============================
*/
const ContactForm = {
    form: null,
    fields: {},
    validationRules: {},
    
    init() {
        this.form = document.getElementById('contact-form');
        if (!this.form) return;
        
        this.cacheFields();
        this.setupValidationRules();
        this.bindEvents();
    },
    
    cacheFields() {
        this.fields = {
            name: this.form.querySelector('#contact-name'),
            email: this.form.querySelector('#contact-email'),
            subject: this.form.querySelector('#contact-subject'),
            message: this.form.querySelector('#contact-message'),
            privacy: this.form.querySelector('#privacy-consent'),
            charCount: document.getElementById('char-count'),
            submitBtn: document.getElementById('submit-btn'),
            formStatus: document.getElementById('form-status')
        };
    },
    
    setupValidationRules() {
        this.validationRules = {
            name: {
                required: true,
                minLength: 2,
                maxLength: 50,
                pattern: /^[a-zA-Z\s'-]+$/,
                message: 'Please enter a valid name (2-50 characters, letters only)'
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
            },
            message: {
                required: true,
                minLength: 10,
                maxLength: 1000,
                message: 'Message must be between 10-1000 characters'
            },
            privacy: {
                required: true,
                message: 'You must accept the privacy policy'
            }
        };
    },
    
    bindEvents() {
        const { name, email, message, privacy, charCount } = this.fields;
        
        // Real-time validation
        [name, email, message].forEach(field => {
            if (field) {
                field.addEventListener('blur', (e) => this.validateField(e.target));
                field.addEventListener('input', (e) => this.clearErrors(e.target));
            }
        });
        
        // Character counter for message field
        if (message && charCount) {
            message.addEventListener('input', (e) => {
                const length = e.target.value.length;
                charCount.textContent = length;
                charCount.style.color = length > 900 ? '#FF0000' : '';
            });
        }
        
        // Privacy checkbox
        if (privacy) {
            privacy.addEventListener('change', (e) => this.validateField(e.target));
        }
        
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Prevent double submission
        this.form.addEventListener('submit', Utils.debounce((e) => {
            this.handleSubmit(e);
        }, 1000));
    },
    
    validateField(field) {
        const fieldName = field.name;
        const value = field.type === 'checkbox' ? field.checked : field.value.trim();
        const rules = this.validationRules[fieldName];
        
        if (!rules) return true;
        
        // Clear previous errors
        this.clearErrors(field);
        
        // Required field check
        if (rules.required && (!value || (field.type === 'checkbox' && !field.checked))) {
            this.showError(field, rules.message);
            return false;
        }
        
        // Skip other validations if field is empty and not required
        if (!value && !rules.required) return true;
        
        // Length validation
        if (rules.minLength && value.length < rules.minLength) {
            this.showError(field, rules.message);
            return false;
        }
        
        if (rules.maxLength && value.length > rules.maxLength) {
            this.showError(field, rules.message);
            return false;
        }
        
        // Pattern validation
        if (rules.pattern && !rules.pattern.test(value)) {
            this.showError(field, rules.message);
            return false;
        }
        
        // Show success state
        this.showSuccess(field);
        return true;
    },
    
    showError(field, message) {
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
        
        field.style.borderColor = '#FF0000';
        field.setAttribute('aria-invalid', 'true');
    },
    
    showSuccess(field) {
        field.style.borderColor = '#00FF00';
        field.setAttribute('aria-invalid', 'false');
    },
    
    clearErrors(field) {
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
        
        field.style.borderColor = '';
        field.removeAttribute('aria-invalid');
    },
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const { submitBtn, formStatus } = this.fields;
        
        // Validate all fields
        const isValid = this.validateForm();
        
        if (!isValid) {
            this.showFormStatus('Please correct the errors above.', 'error');
            return;
        }
        
        // Show loading state
        this.setLoadingState(true);
        
        try {
            // Simulate form submission (replace with actual submission logic)
            await this.simulateFormSubmission();
            
            this.showFormStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
            this.resetForm();
        } catch (error) {
            this.showFormStatus('Failed to send message. Please try again later.', 'error');
        } finally {
            this.setLoadingState(false);
        }
    },
    
    validateForm() {
        const { name, email, message, privacy } = this.fields;
        const fieldsToValidate = [name, email, message, privacy].filter(Boolean);
        
        return fieldsToValidate.every(field => this.validateField(field));
    },
    
    setLoadingState(isLoading) {
        const { submitBtn } = this.fields;
        
        if (isLoading) {
            submitBtn.disabled = true;
            submitBtn.querySelector('.btn-text').textContent = 'Sending...';
            submitBtn.querySelector('.btn-icon').textContent = '⏳';
        } else {
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-text').textContent = 'Send Message';
            submitBtn.querySelector('.btn-icon').textContent = '→';
        }
    },
    
    showFormStatus(message, type) {
        const { formStatus } = this.fields;
        
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;
        formStatus.style.color = type === 'success' ? '#00FF00' : '#FF0000';
        
        // Clear status after 5 seconds
        setTimeout(() => {
            formStatus.textContent = '';
            formStatus.className = 'form-status';
        }, 5000);
    },
    
    resetForm() {
        this.form.reset();
        
        // Clear all validation states
        Object.values(this.fields).forEach(field => {
            if (field && field.nodeType === 1) {
                this.clearErrors(field);
            }
        });
        
        // Reset character counter
        if (this.fields.charCount) {
            this.fields.charCount.textContent = '0';
            this.fields.charCount.style.color = '';
        }
    },
    
    async simulateFormSubmission() {
        // Simulate network delay
        return new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });
    }
};

/*
===============================
TYPING ANIMATION
===============================
*/
const TypingAnimation = {
    init() {
        const titleElement = document.querySelector('.title-text');
        if (!titleElement) return;
        
        const texts = ['From Code To Cyber Defense', ' AI-powered Cybersecurity Systems', ' Ethical Hacking & Penetration Testing', ' Cybersecurity Research & Development'];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typeSpeed = 10;
        const deleteSpeed = 20;
        const pauseTime = 2000;
        
        const type = () => {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                titleElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                titleElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let speed = isDeleting ? deleteSpeed : typeSpeed;
            
            if (!isDeleting && charIndex === currentText.length) {
                speed = pauseTime;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                speed = typeSpeed;
            }
            
            setTimeout(type, speed);
        };
        
        // Start typing animation after a short delay
        setTimeout(type, 1000);
    }
};

/*
===============================
SCROLL INDICATOR
===============================
*/
const ScrollIndicator = {
    init() {
        const indicator = document.querySelector('.scroll-indicator');
        if (!indicator) return;
        
        // Hide scroll indicator after scrolling
        let hideTimeout;
        
        const handleScroll = () => {
            if (window.pageYOffset > 100) {
                indicator.style.opacity = '0';
                indicator.style.pointerEvents = 'none';
            } else {
                indicator.style.opacity = '1';
                indicator.style.pointerEvents = 'all';
            }
        };
        
        window.addEventListener('scroll', Utils.throttle(handleScroll, 100));
    }
};

/*
===============================
PERFORMANCE OPTIMIZATION
===============================
*/
const Performance = {
    init() {
        this.optimizeImages();
        this.preloadCriticalResources();
        this.setupServiceWorker();
    },
    
    optimizeImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const lazyImageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        lazyImageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => {
                lazyImageObserver.observe(img);
            });
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
            });
        }
    },
    
    preloadCriticalResources() {
        // Preload critical CSS if not already done
        const criticalCSS = document.querySelector('link[rel="preload"][as="style"]');
        if (!criticalCSS) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = 'assets/css/style.css';
            document.head.appendChild(link);
        }
    },
    
    setupServiceWorker() {
        if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(() => console.log('Service Worker registered'))
                    .catch(() => console.log('Service Worker registration failed'));
            });
        }
    }
};

/*
===============================
SERVICES SECTION INTERACTIONS
===============================
*/
const ServicesSection = {
    elements: null,
    
    init() {
        this.cacheElements();
        this.bindEvents();
        this.addHoverEffects();
    },
    
    cacheElements() {
        this.elements = {
            serviceCards: document.querySelectorAll('.service-card'),
            section: document.querySelector('.services-section')
        };
    },
    
    bindEvents() {
        const { serviceCards } = this.elements;
        
        serviceCards.forEach((card, index) => {
            // Add click events for service cards
            card.addEventListener('click', (e) => {
                // Allow links to work normally
                const isLink = e.target.closest('a');
                if (isLink && isLink.hasAttribute('href')) {
                    return; // Let the link navigate normally
                }
                
                e.preventDefault();
                this.handleServiceClick(card, index);
            });
            
            // Add keyboard support
            card.addEventListener('keydown', (e) => {
                // Allow links to work normally
                const isLink = e.target.closest('a');
                if (isLink && isLink.hasAttribute('href')) {
                    return; // Let the link navigate normally
                }
                
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleServiceClick(card, index);
                }
            });
            
            // Add focus/blur events for accessibility
            card.addEventListener('focus', () => {
                card.style.outline = '2px solid var(--color-primary-red)';
                card.style.outlineOffset = '4px';
            });
            
            card.addEventListener('blur', () => {
                card.style.outline = 'none';
            });
        });
    },
    
    addHoverEffects() {
        const { serviceCards } = this.elements;
        
        serviceCards.forEach(card => {
            const icon = card.querySelector('.service-icon');
            const cta = card.querySelector('.service-cta');
            
            card.addEventListener('mouseenter', () => {
                // Animate card entrance
                card.style.transform = 'translateY(-10px) scale(1.02)';
                
                // Animate icon
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(5deg)';
                }
                
                // Animate CTA
                if (cta) {
                    cta.style.transform = 'translateX(5px)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                // Reset animations
                card.style.transform = '';
                if (icon) {
                    icon.style.transform = '';
                }
                if (cta) {
                    cta.style.transform = '';
                }
            });
        });
    },
    
    handleServiceClick(card, index) {
        const serviceType = card.dataset.service;
        
        // Add ripple effect
        this.createRippleEffect(card);
        
        // You can add more specific functionality here
        console.log(`Service ${serviceType} clicked`);
        
        // Example: Show more details or navigate to a specific page
        // This could open a modal, scroll to a section, or navigate to a new page
        if (serviceType) {
            this.showServiceDetails(serviceType);
        }
    },
    
    createRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 0, 0, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            top: 50%;
            left: 50%;
            width: 100px;
            height: 100px;
            margin-left: -50px;
            margin-top: -50px;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        // Add ripple animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    },
    
    showServiceDetails(serviceType) {
        // This function could be expanded to show detailed service information
        // For now, we'll just log the service type
        console.log(`Showing details for ${serviceType} service`);
        
        // Example implementation: could show a modal or navigate to a service page
        // window.location.href = `/services/${serviceType}`;
    }
};

/*
===============================
TESTIMONIALS SECTION INTERACTIONS
===============================
*/
const TestimonialsSection = {
    elements: null,
    currentTestimonial: 0,
    autoRotateInterval: null,
    
    init() {
        this.cacheElements();
        this.bindEvents();
        this.startAutoRotation();
        this.addScrollAnimations();
    },
    
    cacheElements() {
        this.elements = {
            testimonialCards: document.querySelectorAll('.testimonial-card'),
            section: document.querySelector('.testimonials-section'),
            ratings: document.querySelectorAll('.testimonial-rating')
        };
    },
    
    bindEvents() {
        const { testimonialCards } = this.elements;
        
        testimonialCards.forEach((card, index) => {
            // Add hover effects
            card.addEventListener('mouseenter', () => {
                this.pauseAutoRotation();
                this.highlightTestimonial(index);
            });
            
            card.addEventListener('mouseleave', () => {
                this.resumeAutoRotation();
                this.resetHighlight(index);
            });
            
            // Add click events for potential modal or detailed view
            card.addEventListener('click', () => {
                this.handleTestimonialClick(card, index);
            });
        });
        
        // Pause auto-rotation when user hovers over the section
        const { section } = this.elements;
        if (section) {
            section.addEventListener('mouseenter', () => {
                this.pauseAutoRotation();
            });
            
            section.addEventListener('mouseleave', () => {
                this.resumeAutoRotation();
            });
        }
    },
    
    startAutoRotation() {
        const { testimonialCards } = this.elements;
        
        if (testimonialCards.length <= 1) return;
        
        this.autoRotateInterval = setInterval(() => {
            this.rotateToNext();
        }, 5000); // Rotate every 5 seconds
    },
    
    pauseAutoRotation() {
        if (this.autoRotateInterval) {
            clearInterval(this.autoRotateInterval);
            this.autoRotateInterval = null;
        }
    },
    
    resumeAutoRotation() {
        if (!this.autoRotateInterval) {
            this.startAutoRotation();
        }
    },
    
    rotateToNext() {
        const { testimonialCards } = this.elements;
        
        // Remove highlight from current testimonial
        testimonialCards[this.currentTestimonial]?.classList.remove('testimonial-highlight');
        
        // Move to next testimonial
        this.currentTestimonial = (this.currentTestimonial + 1) % testimonialCards.length;
        
        // Highlight new testimonial
        this.subtlyHighlightTestimonial(this.currentTestimonial);
    },
    
    highlightTestimonial(index) {
        const { testimonialCards } = this.elements;
        const card = testimonialCards[index];
        
        if (card) {
            card.style.transform = 'translateY(-8px) scale(1.02)';
            card.style.boxShadow = '0 20px 40px rgba(255, 0, 0, 0.2)';
            
            // Animate stars
            const stars = card.querySelectorAll('.star');
            stars.forEach((star, starIndex) => {
                setTimeout(() => {
                    star.style.transform = 'scale(1.2)';
                    star.style.color = 'var(--color-accent-red)';
                }, starIndex * 100);
            });
        }
    },
    
    resetHighlight(index) {
        const { testimonialCards } = this.elements;
        const card = testimonialCards[index];
        
        if (card) {
            card.style.transform = '';
            card.style.boxShadow = '';
            
            // Reset stars
            const stars = card.querySelectorAll('.star');
            stars.forEach(star => {
                star.style.transform = '';
                star.style.color = '';
            });
        }
    },
    
    subtlyHighlightTestimonial(index) {
        const { testimonialCards } = this.elements;
        const card = testimonialCards[index];
        
        if (card) {
            card.classList.add('testimonial-highlight');
            
            // Remove highlight after animation
            setTimeout(() => {
                card.classList.remove('testimonial-highlight');
            }, 3000);
        }
    },
    
    handleTestimonialClick(card, index) {
        // Add click animation
        const currentTransform = card.style.transform;
        card.style.transform = currentTransform + ' scale(0.95)';
        
        setTimeout(() => {
            card.style.transform = currentTransform;
        }, 150);
        
        // You can add more functionality here, like opening a detailed modal
        console.log(`Testimonial ${index + 1} clicked`);
    },
    
    addScrollAnimations() {
        const { testimonialCards } = this.elements;
        
        // Add staggered animation when testimonials come into view
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const testimonials = entry.target.querySelectorAll('.testimonial-card');
                    testimonials.forEach((testimonial, index) => {
                        testimonial.style.opacity = '0';
                        testimonial.style.transform = 'translateY(30px)';
                        
                        setTimeout(() => {
                            testimonial.style.transition = 'all 0.6s ease';
                            testimonial.style.opacity = '1';
                            testimonial.style.transform = 'translateY(0)';
                        }, index * 200);
                    });
                }
            });
        }, observerOptions);
        
        const testimonialsSection = document.querySelector('.testimonials-section');
        if (testimonialsSection) {
            observer.observe(testimonialsSection);
        }
    }
};

/*
===============================
UTILITY FUNCTIONS
===============================
*/
const Utils = {
    // Debounce function to limit function calls
    debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },
    
    // Throttle function to limit function calls
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    // Get scroll percentage
    getScrollPercentage() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        return (scrollTop / docHeight) * 100;
    }
};

/*
===============================
ERROR HANDLING
===============================
*/
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    // You can add error reporting service here
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
    // You can add error reporting service here
});

/*
===============================
ACCESSIBILITY ENHANCEMENTS
===============================
*/
document.addEventListener('keydown', (e) => {
    // Add keyboard navigation support
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// Respect user's motion preferences
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.scrollBehavior = 'auto';
}

/*
===============================
DEVELOPMENT PAGE ANIMATIONS
===============================
*/
const DevelopmentPage = {
    observer: null,
    
    init() {
        // Only run on development page
        if (!document.querySelector('.dev-hero')) return;
        
        this.setupObserver();
        this.observeElements();
    },
    
    setupObserver() {
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            {
                threshold: 0.15,
                rootMargin: '0px 0px -50px 0px'
            }
        );
    },
    
    observeElements() {
        // Skill cards
        const skillCards = document.querySelectorAll('.skill-card');
        skillCards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.1}s`;
            this.observer.observe(card);
        });
        
        // Tool cards
        const toolCards = document.querySelectorAll('.tool-card');
        toolCards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.05}s`;
            this.observer.observe(card);
        });
        
        // Project cards
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.15}s`;
            this.observer.observe(card);
        });
        
        // Timeline items
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.2}s`;
            this.observer.observe(item);
        });
    },
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                // Unobserve after animation to improve performance
                this.observer.unobserve(entry.target);
            }
        });
    }
};

/*
===============================
CYBERSECURITY PAGE ANIMATIONS
===============================
*/
const CybersecurityPage = {
    observer: null,
    
    init() {
        // Only run on cybersecurity page
        if (!document.querySelector('.cyber-hero')) return;
        
        this.setupObserver();
        this.observeElements();
    },
    
    setupObserver() {
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            {
                threshold: 0.15,
                rootMargin: '0px 0px -50px 0px'
            }
        );
    },
    
    observeElements() {
        // Security cards
        const securityCards = document.querySelectorAll('.security-card');
        securityCards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.1}s`;
            this.observer.observe(card);
        });
        
        // Tool cards
        const toolCards = document.querySelectorAll('.tool-card');
        toolCards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.05}s`;
            this.observer.observe(card);
        });
        
        // Project cards
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.15}s`;
            this.observer.observe(card);
        });
        
        // Experience cards
        const experienceCards = document.querySelectorAll('.experience-card');
        experienceCards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.1}s`;
            this.observer.observe(card);
        });
    },
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                // Unobserve after animation to improve performance
                this.observer.unobserve(entry.target);
            }
        });
    }
};

/*
===============================
AI PAGE ANIMATIONS
===============================
*/
const AIPage = {
    observer: null,
    
    init() {
        // Only run on AI page
        if (!document.querySelector('.ai-hero')) return;
        
        this.setupObserver();
        this.observeElements();
    },
    
    setupObserver() {
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            {
                threshold: 0.15,
                rootMargin: '0px 0px -50px 0px'
            }
        );
    },
    
    observeElements() {
        // Skill cards
        const skillCards = document.querySelectorAll('.ai-skill-card');
        skillCards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.1}s`;
            this.observer.observe(card);
        });
        
        // Tool cards
        const toolCards = document.querySelectorAll('.ai-tool-card');
        toolCards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.05}s`;
            this.observer.observe(card);
        });
        
        // Project cards
        const projectCards = document.querySelectorAll('.ai-project-card');
        projectCards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.15}s`;
            this.observer.observe(card);
        });
        
        // Experience cards
        const experienceCards = document.querySelectorAll('.ai-experience-card');
        experienceCards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.1}s`;
            this.observer.observe(card);
        });
    },
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                // Unobserve after animation to improve performance
                this.observer.unobserve(entry.target);
            }
        });
    }
};

/*
===============================
CLEANUP ON PAGE UNLOAD
===============================
*/
window.addEventListener('beforeunload', () => {
    // Clean up animations and observers
    if (ParticleSystem.animationId) {
        cancelAnimationFrame(ParticleSystem.animationId);
    }
    
    if (ScrollAnimations.observer) {
        ScrollAnimations.observer.disconnect();
    }
    
    if (DevelopmentPage.observer) {
        DevelopmentPage.observer.disconnect();
    }
    
    if (CybersecurityPage.observer) {
        CybersecurityPage.observer.disconnect();
    }
    
    if (AIPage.observer) {
        AIPage.observer.disconnect();
    }
});
// Global error handler
window.addEventListener('error', function(e) {
    console.error('❌ Global JavaScript Error:', e.message, 'at', e.filename, ':', e.lineno);
    showErrorNotification('A JavaScript error occurred. Check the console for details.');
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('❌ Unhandled Promise Rejection:', e.reason);
    showErrorNotification('An asynchronous error occurred. Check the console for details.');
});

// Global error notification function
function showErrorNotification(message, details = '') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ef4444;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10001;
        max-width: 400px;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: 14px;
        line-height: 1.4;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 0.5rem;">
            <span>⚠️</span>
            <div>
                <strong>Error:</strong> ${message}
                ${details ? `<br><small>${details}</small>` : ''}
                <div style="margin-top: 0.5rem;">
                    <button onclick="this.closest('div').parentElement.parentElement.remove()" 
                            style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; cursor: pointer; font-size: 12px;">
                        Dismiss
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 10000);
}

// Main JavaScript functionality for the portfolio website
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Portfolio website initializing...');
    
    // Initialize all features
    initNavigation();
    initTypingAnimation();
    initScrollAnimations();
    initSkillBars();
    initCounters();
    initContactForm();
    initScrollProgress();
    initMobileMenu();
    initCMS();
    
    // Navigation functionality
    function initNavigation() {
        const navbar = document.querySelector('.navbar');
        const navLinks = document.querySelectorAll('.nav-link');
        
        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
        
        // Smooth scroll for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Only handle hash links (internal navigation), not external pages
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetSection = document.getElementById(targetId);
                    
                    if (targetSection) {
                        const offsetTop = targetSection.offsetTop - 80;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
                
                // Close mobile menu if open (for all navigation)
                const navMenu = document.querySelector('.nav-menu');
                const hamburger = document.querySelector('.hamburger');
                if (navMenu) navMenu.classList.remove('active');
                if (hamburger) hamburger.classList.remove('active');
            });
        });
        
        // Update active navigation link based on scroll position
        window.addEventListener('scroll', updateActiveNavLink);
    }
    
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Mobile menu functionality
    function initMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Typing animation
    function initTypingAnimation() {
        const typedTextElement = document.querySelector('.typed-text');
        const cursor = document.querySelector('.cursor');
        
        const textArray = [
            'Spring Boot • Microservices • DevOps • Cloud Architecture',
            'Enterprise Solutions • High Availability • Performance Optimization',
            'CI/CD Pipelines • Docker • Kubernetes • AWS',
            'PostgreSQL • Redis • Elasticsearch • MongoDB'
        ];
        
        const typingDelay = 100;
        const erasingDelay = 50;
        const newTextDelay = 2000;
        let textArrayIndex = 0;
        let charIndex = 0;
        
        function type() {
            if (charIndex < textArray[textArrayIndex].length) {
                if (!cursor.classList.contains('typing')) {
                    cursor.classList.add('typing');
                }
                typedTextElement.textContent += textArray[textArrayIndex].charAt(charIndex);
                charIndex++;
                setTimeout(type, typingDelay);
            } else {
                cursor.classList.remove('typing');
                setTimeout(erase, newTextDelay);
            }
        }
        
        function erase() {
            if (charIndex > 0) {
                if (!cursor.classList.contains('typing')) {
                    cursor.classList.add('typing');
                }
                typedTextElement.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
                charIndex--;
                setTimeout(erase, erasingDelay);
            } else {
                cursor.classList.remove('typing');
                textArrayIndex++;
                if (textArrayIndex >= textArray.length) textArrayIndex = 0;
                setTimeout(type, typingDelay + 1100);
            }
        }
        
        if (textArray.length) setTimeout(type, newTextDelay + 250);
    }
    
    // Scroll animations
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    
                    // Special handling for staggered animations
                    if (entry.target.classList.contains('stagger-animation')) {
                        const children = entry.target.children;
                        Array.from(children).forEach((child, index) => {
                            setTimeout(() => {
                                child.classList.add('animate-on-scroll', 'animated');
                            }, index * 100);
                        });
                    }
                }
            });
        }, observerOptions);
        
        // Observe elements for scroll animations
        const animateElements = document.querySelectorAll('.animate-on-scroll, .timeline-item, .section-reveal');
        animateElements.forEach(el => observer.observe(el));
        
        // Add animate-on-scroll class to elements that should animate
        const elementsToAnimate = [
            '.about-content',
            '.stat-item',
            '.skill-category',
            '.project-card',
            '.cert-item',
            '.blog-card'
        ];
        
        elementsToAnimate.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => el.classList.add('animate-on-scroll'));
        });
    }
    
    // Skill bars animation
    function initSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const width = progressBar.getAttribute('data-width');
                    
                    setTimeout(() => {
                        progressBar.style.width = width + '%';
                    }, 500);
                    
                    observer.unobserve(progressBar);
                }
            });
        }, { threshold: 0.5 });
        
        skillBars.forEach(bar => observer.observe(bar));
    }
    
    // Counter animation
    function initCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 2000;
                    const increment = target / (duration / 16);
                    let current = 0;
                    
                    const timer = setInterval(() => {
                        current += increment;
                        counter.textContent = Math.floor(current);
                        
                        if (current >= target) {
                            counter.textContent = target;
                            clearInterval(timer);
                        }
                    }, 16);
                    
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.7 });
        
        counters.forEach(counter => observer.observe(counter));
    }
    
    // Contact form handling
    function initContactForm() {
        const contactForm = document.querySelector('.contact-form');
        
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form data
                const formData = new FormData(this);
                const formObject = Object.fromEntries(formData);
                
                // Show loading state
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;
                
                // Simulate form submission (replace with actual form handling)
                setTimeout(() => {
                    // Show success message
                    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                    
                    // Reset form
                    this.reset();
                    
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            });
        }
    }
    
    // Notification system
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Slide in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }
    
    // Scroll progress indicator
    function initScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            progressBar.style.width = scrollPercent + '%';
        });
    }
    
    // Utility functions
    function throttle(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Parallax effect for hero section
    function initParallax() {
        const heroSection = document.querySelector('.hero');
        const shapes = document.querySelectorAll('.shape');
        
        window.addEventListener('scroll', throttle(() => {
            const scrolled = window.pageYOffset;
            const heroHeight = heroSection.offsetHeight;
            
            if (scrolled <= heroHeight) {
                shapes.forEach((shape, index) => {
                    const speed = (index + 1) * 0.5;
                    shape.style.transform = `translateY(${scrolled * speed}px)`;
                });
            }
        }, 16));
    }
    
    // Initialize parallax if supported
    if (window.innerWidth > 768 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        initParallax();
    }
    
    // Initialize tooltip functionality
    function initTooltips() {
        const tooltipElements = document.querySelectorAll('[title]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', function(e) {
                const tooltip = document.createElement('div');
                tooltip.className = 'custom-tooltip';
                tooltip.textContent = this.getAttribute('title');
                
                // Remove the title attribute to prevent default tooltip
                this.setAttribute('data-title', this.getAttribute('title'));
                this.removeAttribute('title');
                
                document.body.appendChild(tooltip);
                
                // Position tooltip
                const rect = this.getBoundingClientRect();
                tooltip.style.cssText = `
                    position: absolute;
                    background: #333;
                    color: white;
                    padding: 8px 12px;
                    border-radius: 4px;
                    font-size: 14px;
                    white-space: nowrap;
                    z-index: 10001;
                    top: ${rect.top - 35}px;
                    left: ${rect.left + rect.width / 2}px;
                    transform: translateX(-50%);
                    opacity: 0;
                    transition: opacity 0.3s;
                `;
                
                setTimeout(() => tooltip.style.opacity = '1', 10);
            });
            
            element.addEventListener('mouseleave', function() {
                const tooltip = document.querySelector('.custom-tooltip');
                if (tooltip) {
                    tooltip.style.opacity = '0';
                    setTimeout(() => {
                        if (tooltip.parentNode) {
                            tooltip.parentNode.removeChild(tooltip);
                        }
                    }, 300);
                }
                
                // Restore title attribute
                if (this.getAttribute('data-title')) {
                    this.setAttribute('title', this.getAttribute('data-title'));
                    this.removeAttribute('data-title');
                }
            });
        });
    }
    
    initTooltips();
    
    // Lazy loading for images
    function initLazyLoading() {
        const images = document.querySelectorAll('img[src*="placeholder"]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Add loading class
                    img.classList.add('loading');
                    
                    // Simulate image loading (replace with actual image URLs)
                    setTimeout(() => {
                        img.classList.remove('loading');
                        img.classList.add('loaded');
                    }, 1000);
                    
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    initLazyLoading();
    
    // Performance optimization: Reduce animations on slow devices
    function optimizeForPerformance() {
        // Simple performance check
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
        const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
        
        if (isSlowConnection || isLowEndDevice) {
            document.body.classList.add('reduced-animations');
            
            // Add CSS for reduced animations
            const style = document.createElement('style');
            style.textContent = `
                .reduced-animations * {
                    animation-duration: 0.3s !important;
                    transition-duration: 0.2s !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    optimizeForPerformance();
    
    // CMS Integration
    function initCMS() {
        try {
            console.log('🚀 Initializing CMS integration...');
            
            // Check if CMS classes are available
            if (typeof StrapiAPI === 'undefined') {
                throw new Error('StrapiAPI class not found - make sure cms-api.js is loaded');
            }
            
            if (typeof CMS_CONFIG === 'undefined') {
                throw new Error('CMS_CONFIG not found - make sure cms-api.js is loaded');
            }
            
            // Initialize Strapi API and Article Manager
            strapiAPI = new StrapiAPI(CMS_CONFIG.strapiURL);
            articleManager = new ArticleManager(strapiAPI);
            articleRouter = new ArticleRouter(articleManager);
            
            console.log('✅ CMS classes initialized');
            console.log('📡 Strapi URL:', CMS_CONFIG.strapiURL);
            console.log('📝 Fallback articles available:', CMS_CONFIG.fallbackArticles?.length || 0);
            
            // Load featured articles for homepage blog section
            const blogGrid = document.querySelector('#homepage-blog-grid');
            if (blogGrid) {
                console.log('🎯 Found blog grid, loading articles...');
                loadFeaturedArticles(blogGrid).catch(error => {
                    console.error('❌ Failed to load articles:', error);
                    showErrorNotification('Failed to load articles', error.message);
                });
            } else {
                console.warn('⚠️ Blog grid element not found - this is normal if not on homepage');
            }
            
            // Add search functionality if search input exists
            const searchInput = document.querySelector('#article-search');
            if (searchInput) {
                console.log('🔍 Search input found, initializing search...');
                initArticleSearch(searchInput);
            }
            
        } catch (error) {
            console.error('❌ CMS initialization failed:', error);
            showErrorNotification('CMS initialization failed', error.message);
            
            // Fallback: try to show fallback articles if possible
            const blogGrid = document.querySelector('#homepage-blog-grid');
            if (blogGrid && typeof CMS_CONFIG !== 'undefined' && CMS_CONFIG.fallbackArticles) {
                console.log('🔄 Using emergency fallback articles...');
                blogGrid.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>CMS Unavailable</h3>
                        <p>Using offline content. Some features may be limited.</p>
                    </div>
                `;
            }
        }
    }
    
    async function loadFeaturedArticles(container) {
        console.log('📰 Loading featured articles...');
        
        try {
            console.log('🌐 Attempting to fetch from Strapi API...');
            const response = await strapiAPI.getFeaturedArticles(3);
            const articles = response.data.map(article => articleManager.formatArticle(article));
            
            if (articles.length > 0) {
                console.log('✅ Found', articles.length, 'featured articles from API');
                articleManager.renderArticles(container, articles);
            } else {
                console.log('📋 No featured articles, trying latest articles...');
                const latestResponse = await strapiAPI.getPaginatedArticles(1, 3);
                const latestArticles = latestResponse.data.map(article => articleManager.formatArticle(article));
                console.log('✅ Found', latestArticles.length, 'latest articles from API');
                articleManager.renderArticles(container, latestArticles);
            }
        } catch (error) {
            console.log('❌ Strapi API not available:', error.message);
            console.log('🔄 Using fallback articles for development...');
            console.log('📝 Fallback articles:', CMS_CONFIG.fallbackArticles);
            
            if (CMS_CONFIG.fallbackArticles && CMS_CONFIG.fallbackArticles.length > 0) {
                console.log('✅ Rendering', CMS_CONFIG.fallbackArticles.length, 'fallback articles');
                articleManager.renderArticles(container, CMS_CONFIG.fallbackArticles);
            } else {
                console.error('❌ No fallback articles available!');
                container.innerHTML = `
                    <div class="error-state">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>No Articles Available</h3>
                        <p>Please set up Strapi CMS or check fallback articles configuration.</p>
                    </div>
                `;
            }
        }
    }
    
    function initArticleSearch(searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value;
            const resultsContainer = document.querySelector('#search-results');
            
            searchTimeout = setTimeout(() => {
                if (resultsContainer) {
                    articleManager.searchArticles(query, resultsContainer);
                }
            }, 300);
        });
    }
    
});
// Advanced animations and interactive effects
class AnimationController {
    constructor() {
        this.init();
    }
    
    init() {
        this.initScrollReveal();
        this.initParticleBackground();
        this.initInteractiveElements();
        this.initLoadingAnimations();
        this.initGestureSupport();
    }
    
    // Advanced scroll reveal animations
    initScrollReveal() {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    this.revealElement(entry.target, index);
                    revealObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Elements to reveal
        const revealElements = document.querySelectorAll(`
            .hero-content > *,
            .about-content > *,
            .skill-category,
            .timeline-item,
            .project-card,
            .cert-item,
            .blog-card
        `);
        
        revealElements.forEach(el => {
            el.classList.add('reveal-element');
            revealObserver.observe(el);
        });
    }
    
    revealElement(element, index) {
        const animations = [
            'fadeInUp',
            'fadeInLeft', 
            'fadeInRight',
            'zoomIn',
            'slideInDown'
        ];
        
        const randomAnimation = animations[index % animations.length];
        
        element.style.animationDelay = `${index * 0.1}s`;
        element.classList.add('animated', randomAnimation);
    }
    
    // Particle background effect
    initParticleBackground() {
        if (window.innerWidth < 768) return; // Skip on mobile for performance
        
        const canvas = document.createElement('canvas');
        canvas.classList.add('particle-canvas');
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.3;
        `;
        
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const particles = [];
        const particleCount = 50;
        
        // Resize canvas
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Particle class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2 + 1;
                this.opacity = Math.random() * 0.5 + 0.3;
            }
            
            update() {
                this.x += this.vx;
                this.y += this.vy;
                
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(26, 35, 126, ${this.opacity})`;
                ctx.fill();
            }
        }
        
        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        
        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            // Draw connections
            particles.forEach((particle, i) => {
                particles.slice(i + 1).forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.strokeStyle = `rgba(26, 35, 126, ${0.1 * (1 - distance / 100)})`;
                        ctx.stroke();
                    }
                });
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    // Interactive element effects
    initInteractiveElements() {
        this.initMagneticButtons();
        this.initTiltEffect();
        this.initGlowEffect();
        this.initRippleEffect();
    }
    
    initMagneticButtons() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0, 0)';
            });
        });
    }
    
    initTiltEffect() {
        const cards = document.querySelectorAll('.project-card, .cert-item');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            });
        });
    }
    
    initGlowEffect() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        skillBars.forEach(bar => {
            bar.addEventListener('mouseenter', () => {
                bar.style.boxShadow = '0 0 20px rgba(26, 35, 126, 0.6)';
                bar.style.filter = 'brightness(1.1)';
            });
            
            bar.addEventListener('mouseleave', () => {
                bar.style.boxShadow = 'none';
                bar.style.filter = 'brightness(1)';
            });
        });
    }
    
    initRippleEffect() {
        const buttons = document.querySelectorAll('.btn, .nav-link');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.height, rect.width);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;
                
                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                button.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
        
        // Add ripple CSS animation
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Loading animations
    initLoadingAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('loaded');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        const elementsToLoad = document.querySelectorAll('img, .skill-category, .project-card');
        elementsToLoad.forEach(el => {
            el.classList.add('loading-element');
            observer.observe(el);
        });
    }
    
    // Touch gesture support
    initGestureSupport() {
        if (!('ontouchstart' in window)) return;
        
        let touchStartY = 0;
        let touchEndY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0].screenY;
            this.handleSwipe();
        }, { passive: true });
        
        // Handle swipe gestures
        this.handleSwipe = () => {
            const swipeThreshold = 100;
            const diff = touchStartY - touchEndY;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe up - scroll to next section
                    this.scrollToNextSection();
                } else {
                    // Swipe down - scroll to previous section
                    this.scrollToPrevSection();
                }
            }
        };
    }
    
    scrollToNextSection() {
        const sections = document.querySelectorAll('section');
        const currentScrollY = window.scrollY;
        let nextSection = null;
        
        sections.forEach(section => {
            if (section.offsetTop > currentScrollY + 100 && !nextSection) {
                nextSection = section;
            }
        });
        
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    scrollToPrevSection() {
        const sections = Array.from(document.querySelectorAll('section')).reverse();
        const currentScrollY = window.scrollY;
        let prevSection = null;
        
        sections.forEach(section => {
            if (section.offsetTop < currentScrollY - 100 && !prevSection) {
                prevSection = section;
            }
        });
        
        if (prevSection) {
            prevSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Text animation effects
class TextAnimations {
    static typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function typing() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(typing, speed);
            }
        }
        typing();
    }
    
    static fadeInWords(element, delay = 100) {
        const words = element.textContent.split(' ');
        element.innerHTML = '';
        
        words.forEach((word, index) => {
            const span = document.createElement('span');
            span.textContent = word + ' ';
            span.style.opacity = '0';
            span.style.transform = 'translateY(20px)';
            span.style.transition = 'all 0.5s ease';
            element.appendChild(span);
            
            setTimeout(() => {
                span.style.opacity = '1';
                span.style.transform = 'translateY(0)';
            }, index * delay);
        });
    }
}

// Advanced scroll effects
class ScrollEffects {
    constructor() {
        this.initSmoothScrolling();
        this.initParallaxElements();
        this.initScrollSnap();
    }
    
    initSmoothScrolling() {
        // Custom smooth scrolling for better control
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    this.smoothScrollTo(target.offsetTop - 80, 1000);
                }
            });
        });
    }
    
    smoothScrollTo(endY, duration) {
        const startY = window.scrollY;
        const distanceY = endY - startY;
        const startTime = new Date().getTime();
        
        const easeInOutQuart = (time, from, distance, duration) => {
            if ((time /= duration / 2) < 1) return distance / 2 * time * time * time * time + from;
            return -distance / 2 * ((time -= 2) * time * time * time - 2) + from;
        };
        
        const timer = setInterval(() => {
            const time = new Date().getTime() - startTime;
            const newY = easeInOutQuart(time, startY, distanceY, duration);
            
            if (time >= duration) {
                clearInterval(timer);
                window.scrollTo(0, endY);
            } else {
                window.scrollTo(0, newY);
            }
        }, 1000 / 60);
    }
    
    initParallaxElements() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        const handleParallax = () => {
            const scrollTop = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.parallax || 0.5;
                const yPos = -(scrollTop * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        };
        
        window.addEventListener('scroll', this.throttle(handleParallax, 16));
    }
    
    initScrollSnap() {
        // Add scroll snap points for better UX on touch devices
        if ('CSS' in window && CSS.supports('scroll-snap-type', 'y mandatory')) {
            document.documentElement.style.scrollSnapType = 'y mandatory';
            
            document.querySelectorAll('section').forEach(section => {
                section.style.scrollSnapAlign = 'start';
            });
        }
    }
    
    throttle(func, wait) {
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
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            fps: 0,
            frameTime: 0,
            memory: 0
        };
        
        this.initFPSMonitor();
        this.initMemoryMonitor();
    }
    
    initFPSMonitor() {
        let lastTime = performance.now();
        let frames = 0;
        
        const measureFPS = (currentTime) => {
            frames++;
            
            if (currentTime >= lastTime + 1000) {
                this.metrics.fps = Math.round((frames * 1000) / (currentTime - lastTime));
                this.metrics.frameTime = (currentTime - lastTime) / frames;
                
                frames = 0;
                lastTime = currentTime;
                
                // Adjust animations based on performance
                this.adjustPerformance();
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);
    }
    
    initMemoryMonitor() {
        if ('memory' in performance) {
            setInterval(() => {
                this.metrics.memory = performance.memory.usedJSHeapSize / 1024 / 1024;
            }, 5000);
        }
    }
    
    adjustPerformance() {
        if (this.metrics.fps < 30) {
            document.body.classList.add('low-performance');
            console.log('Performance: Reducing animations due to low FPS');
        } else if (this.metrics.fps > 50) {
            document.body.classList.remove('low-performance');
        }
    }
}

// Initialize all animation systems
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize advanced animations on capable devices
    const isHighEndDevice = window.innerWidth > 768 && navigator.hardwareConcurrency > 2;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        new AnimationController();
        new ScrollEffects();
        
        if (isHighEndDevice) {
            new PerformanceMonitor();
        }
    }
    
    // Initialize text animations for hero section
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            TextAnimations.fadeInWords(heroTitle, 200);
        }
    }, 500);
});
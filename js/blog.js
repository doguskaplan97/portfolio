// Blog Page JavaScript
class BlogPageManager {
    constructor() {
        this.currentPage = 1;
        this.articlesPerPage = 9;
        this.totalArticles = 0;
        this.currentFilter = '';
        this.currentSort = 'newest';
        this.currentSearch = '';
        this.allArticles = [];
        
        this.init();
    }
    
    async init() {
        // Initialize API and Article Manager
        this.strapiAPI = new StrapiAPI(CMS_CONFIG.strapiURL);
        this.articleManager = new ArticleManager(this.strapiAPI);
        this.articleRouter = new ArticleRouter(this.articleManager);
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load initial articles
        await this.loadArticles();
        
        // Setup newsletter form
        this.setupNewsletterForm();
    }
    
    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('article-search');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.currentSearch = e.target.value;
                    this.currentPage = 1;
                    this.loadArticles();
                }, 300);
            });
        }
        
        // Filter functionality
        const tagFilter = document.getElementById('tag-filter');
        if (tagFilter) {
            tagFilter.addEventListener('change', (e) => {
                this.currentFilter = e.target.value;
                this.currentPage = 1;
                this.loadArticles();
            });
        }
        
        // Sort functionality
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.currentPage = 1;
                this.loadArticles();
            });
        }
        
        // Mobile navigation
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }
        
        // Tag click functionality
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tag')) {
                const tagValue = e.target.textContent;
                const tagFilter = document.getElementById('tag-filter');
                if (tagFilter) {
                    tagFilter.value = tagValue;
                    this.currentFilter = tagValue;
                    this.currentPage = 1;
                    this.loadArticles();
                }
            }
        });
    }
    
    async loadArticles() {
        const articlesGrid = document.getElementById('articles-grid');
        const loadingState = document.getElementById('loading-state');
        const pagination = document.getElementById('pagination');
        
        if (!articlesGrid) return;
        
        // Show loading state
        if (loadingState) {
            loadingState.style.display = 'block';
        }
        articlesGrid.style.display = 'none';
        if (pagination) {
            pagination.style.display = 'none';
        }
        
        try {
            let articles = [];
            
            // Try to fetch from API
            if (this.currentSearch) {
                const response = await this.strapiAPI.searchArticles(this.currentSearch);
                articles = response.data || [];
            } else if (this.currentFilter) {
                const response = await this.strapiAPI.getArticlesByTag(this.currentFilter);
                articles = response.data || [];
            } else {
                const response = await this.strapiAPI.getArticles();
                articles = response.data || [];
            }
            
            // Format articles
            this.allArticles = articles.map(article => this.articleManager.formatArticle(article));
            
        } catch (error) {
            console.log('API not available, using fallback articles');
            // Use fallback articles and filter them
            this.allArticles = this.filterFallbackArticles(CMS_CONFIG.fallbackArticles);
        }
        
        // Apply sorting
        this.sortArticles();
        
        // Calculate pagination
        this.totalArticles = this.allArticles.length;
        const startIndex = (this.currentPage - 1) * this.articlesPerPage;
        const endIndex = startIndex + this.articlesPerPage;
        const articlesToShow = this.allArticles.slice(startIndex, endIndex);
        
        // Hide loading state
        if (loadingState) {
            loadingState.style.display = 'none';
        }
        
        // Render articles
        this.renderArticles(articlesGrid, articlesToShow);
        
        // Render pagination
        this.renderPagination();
        
        // Show articles grid
        articlesGrid.style.display = 'grid';
        if (pagination) {
            pagination.style.display = 'flex';
        }
    }
    
    filterFallbackArticles(articles) {
        let filtered = [...articles];
        
        if (this.currentSearch) {
            const query = this.currentSearch.toLowerCase();
            filtered = filtered.filter(article => 
                article.title.toLowerCase().includes(query) ||
                article.excerpt.toLowerCase().includes(query) ||
                article.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }
        
        if (this.currentFilter) {
            filtered = filtered.filter(article => 
                article.tags.includes(this.currentFilter)
            );
        }
        
        return filtered;
    }
    
    sortArticles() {
        switch (this.currentSort) {
            case 'newest':
                this.allArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
                break;
            case 'oldest':
                this.allArticles.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
                break;
            case 'popular':
                // For now, sort by featured status then by date
                this.allArticles.sort((a, b) => {
                    if (a.featured !== b.featured) {
                        return b.featured - a.featured;
                    }
                    return new Date(b.publishedAt) - new Date(a.publishedAt);
                });
                break;
        }
    }
    
    renderArticles(container, articles) {
        if (articles.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-file-alt"></i>
                    <h3>No Articles Found</h3>
                    <p>Try adjusting your search or filter criteria.</p>
                </div>
            `;
            return;
        }
        
        const articlesHTML = articles.map(article => this.generateArticleCard(article)).join('');
        container.innerHTML = articlesHTML;
        
        // Add click event listeners
        this.attachEventListeners(container);
        
        // Animate cards
        this.animateCards(container);
    }
    
    generateArticleCard(article) {
        return `
            <article class="blog-card animate-on-scroll" data-article-id="${article.id}">
                <div class="blog-image">
                    <img src="${article.image}" alt="${article.title}" loading="lazy">
                    ${article.featured ? '<div class="featured-badge">Featured</div>' : ''}
                </div>
                <div class="blog-content">
                    <div class="blog-meta">
                        <span class="blog-date">${this.formatDate(article.publishedAt)}</span>
                        <span class="blog-read-time">${article.readTime} min read</span>
                    </div>
                    <h3 class="blog-title">
                        <a href="#article/${article.slug}" class="article-link">${article.title}</a>
                    </h3>
                    <p class="blog-excerpt">${article.excerpt}</p>
                    <div class="blog-tags">
                        ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="blog-footer">
                        <a href="#article/${article.slug}" class="blog-link">
                            Read More <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </article>
        `;
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    attachEventListeners(container) {
        const articleLinks = container.querySelectorAll('.article-link');
        articleLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                window.location.hash = href;
            });
        });
    }
    
    animateCards(container) {
        const cards = container.querySelectorAll('.blog-card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        cards.forEach(card => observer.observe(card));
    }
    
    renderPagination() {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;
        
        const totalPages = Math.ceil(this.totalArticles / this.articlesPerPage);
        
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }
        
        let paginationHTML = '<ul class="pagination">';
        
        // Previous button
        const prevDisabled = this.currentPage === 1 ? 'disabled' : '';
        paginationHTML += `
            <li class="page-item">
                <a class="page-link ${prevDisabled}" href="#" data-page="${this.currentPage - 1}">
                    <i class="fas fa-chevron-left"></i> Previous
                </a>
            </li>
        `;
        
        // Page numbers
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);
        
        for (let i = startPage; i <= endPage; i++) {
            const active = i === this.currentPage ? 'active' : '';
            paginationHTML += `
                <li class="page-item ${active}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }
        
        // Next button
        const nextDisabled = this.currentPage === totalPages ? 'disabled' : '';
        paginationHTML += `
            <li class="page-item">
                <a class="page-link ${nextDisabled}" href="#" data-page="${this.currentPage + 1}">
                    Next <i class="fas fa-chevron-right"></i>
                </a>
            </li>
        `;
        
        paginationHTML += '</ul>';
        pagination.innerHTML = paginationHTML;
        
        // Add event listeners
        const pageLinks = pagination.querySelectorAll('.page-link:not(.disabled)');
        pageLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = parseInt(link.getAttribute('data-page'));
                if (page >= 1 && page <= totalPages) {
                    this.currentPage = page;
                    this.loadArticles();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        });
    }
    
    setupNewsletterForm() {
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = newsletterForm.querySelector('.newsletter-input').value;
                
                if (email) {
                    // Show success message (in a real app, you'd send this to your backend)
                    this.showNotification('Thanks for subscribing! You\'ll receive updates on new articles.', 'success');
                    newsletterForm.reset();
                }
            });
        }
    }
    
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            z-index: 10001;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }
}

// Navbar scroll effect for blog page
function initBlogNavbar() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initBlogNavbar();
    new BlogPageManager();
});
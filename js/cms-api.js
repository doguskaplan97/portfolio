// Strapi CMS API Integration
class StrapiAPI {
    constructor(baseURL = 'http://localhost:1337') {
        this.baseURL = baseURL;
        this.apiEndpoint = `${baseURL}/api`;
    }
    
    // Generic API request method
    async request(endpoint, options = {}) {
        const url = `${this.apiEndpoint}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            ...options
        };
        
        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }
    
    // Get all articles with optional filters
    async getArticles(params = {}) {
        const queryParams = new URLSearchParams({
            'populate': '*',
            'sort[0]': 'publishedAt:desc',
            ...params
        });
        
        return this.request(`/articles?${queryParams}`);
    }
    
    // Get single article by ID or slug
    async getArticle(identifier, isSlug = false) {
        const endpoint = isSlug 
            ? `/articles?filters[slug][$eq]=${identifier}&populate=*`
            : `/articles/${identifier}?populate=*`;
            
        const response = await this.request(endpoint);
        return isSlug ? response.data[0] : response.data;
    }
    
    // Get articles by category/tag
    async getArticlesByTag(tag) {
        const queryParams = new URLSearchParams({
            'filters[tags][$containsi]': tag,
            'populate': '*',
            'sort[0]': 'publishedAt:desc'
        });
        
        return this.request(`/articles?${queryParams}`);
    }
    
    // Search articles
    async searchArticles(query) {
        const queryParams = new URLSearchParams({
            'filters[$or][0][title][$containsi]': query,
            'filters[$or][1][excerpt][$containsi]': query,
            'filters[$or][2][content][$containsi]': query,
            'populate': '*',
            'sort[0]': 'publishedAt:desc'
        });
        
        return this.request(`/articles?${queryParams}`);
    }
    
    // Get paginated articles
    async getPaginatedArticles(page = 1, pageSize = 6) {
        const queryParams = new URLSearchParams({
            'pagination[page]': page,
            'pagination[pageSize]': pageSize,
            'populate': '*',
            'sort[0]': 'publishedAt:desc'
        });
        
        return this.request(`/articles?${queryParams}`);
    }
    
    // Get featured articles
    async getFeaturedArticles(limit = 3) {
        const queryParams = new URLSearchParams({
            'filters[featured][$eq]': true,
            'pagination[limit]': limit,
            'populate': '*',
            'sort[0]': 'publishedAt:desc'
        });
        
        return this.request(`/articles?${queryParams}`);
    }
    
    // Get article tags/categories
    async getTags() {
        return this.request('/tags');
    }
}

// Article Display Manager
class ArticleManager {
    constructor(strapiAPI) {
        this.api = strapiAPI;
        this.loadingState = false;
        this.currentPage = 1;
        this.articlesPerPage = 6;
    }
    
    // Format article data from Strapi response
    formatArticle(strapiArticle) {
        const { attributes } = strapiArticle;
        
        return {
            id: strapiArticle.id,
            title: attributes.title,
            slug: attributes.slug,
            excerpt: attributes.excerpt,
            content: attributes.content,
            publishedAt: attributes.publishedAt,
            featured: attributes.featured,
            tags: attributes.tags || [],
            author: attributes.author || 'Senior Java Engineer',
            readTime: this.calculateReadTime(attributes.content),
            image: attributes.image?.data ? 
                `${this.api.baseURL}${attributes.image.data.attributes.url}` : 
                '/images/blog/default-article.jpg'
        };
    }
    
    // Calculate estimated read time
    calculateReadTime(content) {
        const wordsPerMinute = 200;
        const wordCount = content ? content.split(' ').length : 0;
        const readTime = Math.ceil(wordCount / wordsPerMinute);
        return readTime < 1 ? 1 : readTime;
    }
    
    // Format date for display
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    // Generate article card HTML
    generateArticleCard(article) {
        return `
            <article class="blog-card" data-article-id="${article.id}">
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
    
    // Render articles to container
    async renderArticles(container, articles = null) {
        console.log('🎨 ArticleManager.renderArticles called');
        console.log('📦 Container:', container);
        console.log('📰 Articles provided:', articles ? articles.length : 'null (will fetch)');
        
        if (!container) {
            console.error('❌ Container element not found');
            return;
        }
        
        this.showLoading(container);
        
        try {
            if (!articles) {
                const response = await this.api.getArticles();
                articles = response.data.map(article => this.formatArticle(article));
            }
            
            if (articles.length === 0) {
                console.log('📭 No articles to display, showing empty state');
                container.innerHTML = this.getEmptyState();
                return;
            }
            
            console.log('✅ Generating HTML for', articles.length, 'articles');
            const articlesHTML = articles.map(article => this.generateArticleCard(article)).join('');
            container.innerHTML = articlesHTML;
            
            console.log('🔗 Attaching event listeners to articles');
            // Add click event listeners
            this.attachEventListeners(container);
            
        } catch (error) {
            console.error('Error rendering articles:', error);
            container.innerHTML = this.getErrorState();
        }
    }
    
    // Show loading state
    showLoading(container) {
        container.innerHTML = `
            <div class="loading-articles">
                <div class="loading-spinner"></div>
                <p>Loading articles...</p>
            </div>
        `;
    }
    
    // Get empty state HTML
    getEmptyState() {
        return `
            <div class="empty-state">
                <i class="fas fa-file-alt"></i>
                <h3>No Articles Found</h3>
                <p>Check back later for new content!</p>
            </div>
        `;
    }
    
    // Get error state HTML
    getErrorState() {
        return `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Unable to Load Articles</h3>
                <p>Please try again later.</p>
                <button onclick="location.reload()" class="btn btn-primary">Retry</button>
            </div>
        `;
    }
    
    // Attach event listeners to article cards
    attachEventListeners(container) {
        const articleLinks = container.querySelectorAll('.article-link');
        articleLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                this.navigateToArticle(href);
            });
        });
    }
    
    // Handle article navigation
    navigateToArticle(href) {
        window.location.hash = href;
        // This will be handled by the router
    }
    
    // Render featured articles for homepage
    async renderFeaturedArticles(container, limit = 3) {
        try {
            const response = await this.api.getFeaturedArticles(limit);
            const articles = response.data.map(article => this.formatArticle(article));
            
            if (articles.length > 0) {
                this.renderArticles(container, articles);
            } else {
                // Fallback to latest articles if no featured articles
                const latestResponse = await this.api.getPaginatedArticles(1, limit);
                const latestArticles = latestResponse.data.map(article => this.formatArticle(article));
                this.renderArticles(container, latestArticles);
            }
        } catch (error) {
            console.error('Error loading featured articles:', error);
            container.innerHTML = this.getErrorState();
        }
    }
    
    // Search articles
    async searchArticles(query, container) {
        if (!query.trim()) {
            this.renderArticles(container);
            return;
        }
        
        this.showLoading(container);
        
        try {
            const response = await this.api.searchArticles(query);
            const articles = response.data.map(article => this.formatArticle(article));
            this.renderArticles(container, articles);
        } catch (error) {
            console.error('Error searching articles:', error);
            container.innerHTML = this.getErrorState();
        }
    }
    
    // Filter articles by tag
    async filterByTag(tag, container) {
        this.showLoading(container);
        
        try {
            const response = await this.api.getArticlesByTag(tag);
            const articles = response.data.map(article => this.formatArticle(article));
            this.renderArticles(container, articles);
        } catch (error) {
            console.error('Error filtering articles:', error);
            container.innerHTML = this.getErrorState();
        }
    }
}

// Simple Router for article pages
class ArticleRouter {
    constructor(articleManager) {
        this.articleManager = articleManager;
        this.routes = {
            'article': this.handleArticlePage.bind(this)
        };
        
        window.addEventListener('hashchange', this.handleRouteChange.bind(this));
        window.addEventListener('load', this.handleRouteChange.bind(this));
    }
    
    handleRouteChange() {
        const hash = window.location.hash.slice(1); // Remove #
        const [route, param] = hash.split('/');
        
        if (this.routes[route]) {
            this.routes[route](param);
        }
    }
    
    async handleArticlePage(slug) {
        if (!slug) return;
        
        try {
            const article = await this.articleManager.api.getArticle(slug, true);
            if (article) {
                this.displayArticle(this.articleManager.formatArticle(article));
            }
        } catch (error) {
            console.error('Error loading article:', error);
        }
    }
    
    displayArticle(article) {
        // Create or update article modal/page
        this.createArticleModal(article);
    }
    
    createArticleModal(article) {
        // Remove existing modal
        const existingModal = document.querySelector('.article-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        const modal = document.createElement('div');
        modal.className = 'article-modal';
        modal.innerHTML = `
            <div class="article-modal-content">
                <div class="article-modal-header">
                    <button class="article-close" onclick="this.closest('.article-modal').remove(); window.location.hash = '';">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <article class="article-content">
                    <header class="article-header">
                        <h1>${article.title}</h1>
                        <div class="article-meta">
                            <span class="article-date">${this.articleManager.formatDate(article.publishedAt)}</span>
                            <span class="article-read-time">${article.readTime} min read</span>
                            <span class="article-author">by ${article.author}</span>
                        </div>
                        <div class="article-tags">
                            ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </header>
                    <div class="article-image">
                        <img src="${article.image}" alt="${article.title}">
                    </div>
                    <div class="article-body">
                        ${this.parseMarkdown(article.content)}
                    </div>
                </article>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                document.body.style.overflow = '';
                window.location.hash = '';
            }
        });
    }
    
    // Basic markdown parser (you might want to use a library like marked.js)
    parseMarkdown(content) {
        if (!content) return '';
        
        return content
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/!\[([^\]]*)\]\(([^\)]*)\)/gim, '<img alt="$1" src="$2" />')
            .replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2">$1</a>')
            .replace(/\n\n/gim, '</p><p>')
            .replace(/\n/gim, '<br>')
            .replace(/^(.*)$/, '<p>$1</p>');
    }
}

// Configuration and initialization
const CMS_CONFIG = {
    // Environment-based Strapi URL configuration
    strapiURL: (() => {
        const hostname = window.location.hostname;
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://localhost:1337';
        } else if (hostname.includes('github.io')) {
            // For GitHub Pages, we'll use fallback articles since no Strapi is deployed
            return 'https://api-unavailable-using-fallback.local';
        } else {
            // For other production environments
            return 'https://your-strapi-instance.railway.app';
        }
    })(),
    
    // Fallback articles for development/offline mode
    fallbackArticles: [
        {
            id: 1,
            title: 'Optimizing Spring Boot Applications for Production',
            slug: 'spring-boot-optimization',
            excerpt: 'Best practices for tuning Spring Boot applications to handle enterprise-level traffic with optimal performance and resource utilization.',
            content: 'Spring Boot optimization content...',
            publishedAt: '2024-03-15T10:00:00.000Z',
            featured: true,
            tags: ['Spring Boot', 'Performance', 'Java'],
            author: 'Senior Java Engineer',
            readTime: 5,
            image: '/images/blog/spring-boot-placeholder.jpg'
        },
        {
            id: 2,
            title: 'DevOps Best Practices for Java Microservices',
            slug: 'devops-microservices',
            excerpt: 'Comprehensive guide to implementing robust CI/CD pipelines for microservices architecture with automated testing and deployment strategies.',
            content: 'DevOps microservices content...',
            publishedAt: '2024-02-20T10:00:00.000Z',
            featured: false,
            tags: ['DevOps', 'Microservices', 'CI/CD'],
            author: 'Senior Java Engineer',
            readTime: 7,
            image: '/images/blog/devops-placeholder.jpg'
        },
        {
            id: 3,
            title: 'Database Performance Tuning in High-Traffic Applications',
            slug: 'database-performance',
            excerpt: 'Advanced techniques for optimizing database performance in applications serving millions of requests with minimal latency requirements.',
            content: 'Database performance content...',
            publishedAt: '2024-01-10T10:00:00.000Z',
            featured: false,
            tags: ['Database', 'Performance', 'PostgreSQL'],
            author: 'Senior Java Engineer',
            readTime: 6,
            image: '/images/blog/database-placeholder.jpg'
        }
    ]
};

// Global instances - will be initialized in main.js
let strapiAPI;
let articleManager;
let articleRouter;
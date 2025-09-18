// ===== PORTFOLIO APPLICATION - MODULAR ARCHITECTURE =====

/**
 * Configuration object for the portfolio application
 */
const PortfolioConfig = {
    // API Configuration
    api: {
        github: {
            username: 'JSerranom04',
            baseUrl: 'https://api.github.com',
            maxRepos: 20,
            displayLimit: 13  // Show all real projects
        }
    },
    
    // UI Configuration
    ui: {
        animations: {
            duration: 600,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            observerThreshold: 0.1,
            observerRootMargin: '0px 0px -50px 0px'
        },
        scroll: {
            navbarThreshold: 50,
            backToTopThreshold: 300,
            parallaxSpeed: 0.5
        },
        typing: {
            text: "Hi, I'm",
            speed: 100,
            delay: 1000
        }
    },
    
    // Theme Configuration
    theme: {
        default: 'light',
        storageKey: 'theme'
    },
    
    // Selectors
    selectors: {
        navbar: '#navbar',
        hamburger: '#hamburger',
        navMenu: '#nav-menu',
        navLinks: '.nav-link',
        themeToggle: '#theme-toggle',
        backToTop: '#back-to-top',
        contactForm: '#contact-form',
        projectsGrid: '#projects-grid',
        tabButtons: '.tab-button',
        tabContents: '.tab-content',
        filterButtons: '.filter-btn',
        statNumbers: '.stat-number',
        skillBars: '.skill-progress',
        typingText: '.typing-text'
    }
};

/**
 * Base Component Class - Abstract base for all components
 */
class BaseComponent {
    constructor(config = {}) {
        this.config = { ...PortfolioConfig, ...config };
        this.initialized = false;
        this.eventListeners = new Map();
    }
    
    /**
     * Initialize the component
     */
    init() {
        if (this.initialized) return;
        
        this.beforeInit();
        this.setupDOM();
        this.bindEvents();
        this.afterInit();
        
        this.initialized = true;
    }
    
    /**
     * Template methods - Override in subclasses
     */
    beforeInit() {}
    setupDOM() {}
    bindEvents() {}
    afterInit() {}
    
    /**
     * Safe event listener management
     */
    addEventListener(element, event, handler, options = {}) {
        if (!element) return;
        
        // Create unique key using element reference instead of constructor name
        const key = `${element.tagName || 'unknown'}-${event}-${Date.now()}-${Math.random()}`;
        
        element.addEventListener(event, handler, options);
        this.eventListeners.set(key, { el: element, evt: event, hdl: handler });
    }
    
    /**
     * Cleanup method
     */
    destroy() {
        this.eventListeners.forEach(({ el, evt, hdl }) => {
            el.removeEventListener(evt, hdl);
        });
        this.eventListeners.clear();
        this.initialized = false;
    }
    
    /**
     * Utility methods
     */
    $(selector) {
        return document.querySelector(selector);
    }
    
    $$(selector) {
        return document.querySelectorAll(selector);
    }
}

/**
 * Navigation Component - Handles all navigation-related functionality
 */
class NavigationComponent extends BaseComponent {
    constructor(config) {
        super(config);
        this.isMenuOpen = false;
    }
    
    setupDOM() {
        this.navbar = this.$(this.config.selectors.navbar);
        this.hamburger = this.$(this.config.selectors.hamburger);
        this.navMenu = this.$(this.config.selectors.navMenu);
        this.navLinks = this.$$(this.config.selectors.navLinks);
    }
    
    bindEvents() {
        // Mobile menu toggle
        this.addEventListener(this.hamburger, 'click', () => this.toggleMobileMenu());
        
        // Navigation links
        this.navLinks.forEach(link => {
            this.addEventListener(link, 'click', (e) => this.handleNavClick(e));
        });
        
        // Scroll events for active link updates
        this.addEventListener(window, 'scroll', this.throttle(() => {
            this.updateScrollEffects();
            this.updateActiveNavLink();
        }, 16));
        
        // Keyboard navigation
        this.addEventListener(document, 'keydown', (e) => this.handleKeyboard(e));
    }
    
    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        this.hamburger?.classList.toggle('active', this.isMenuOpen);
        this.navMenu?.classList.toggle('active', this.isMenuOpen);
    }
    
    closeMobileMenu() {
        this.isMenuOpen = false;
        this.hamburger?.classList.remove('active');
        this.navMenu?.classList.remove('active');
    }
    
    handleNavClick(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href')?.substring(1);
        const targetSection = this.$(`#${targetId}`);
        
        if (targetSection) {
            this.closeMobileMenu();
            this.smoothScrollTo(targetSection);
            this.setActiveNavLink(e.target);
        }
    }
    
    smoothScrollTo(element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    setActiveNavLink(activeLink) {
        this.navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }
    
    updateActiveNavLink() {
        const sections = this.$$('section[id]');
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = this.$(`${this.config.selectors.navLinks}[href="#${sectionId}"]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight && navLink) {
                this.setActiveNavLink(navLink);
            }
        });
    }
    
    updateScrollEffects() {
        const scrollY = window.pageYOffset;
        
        // Navbar background
        if (scrollY > this.config.ui.scroll.navbarThreshold) {
            this.navbar?.classList.add('scrolled');
        } else {
            this.navbar?.classList.remove('scrolled');
        }
    }
    
    handleKeyboard(e) {
        if (e.key === 'Escape' && this.isMenuOpen) {
            this.closeMobileMenu();
        }
    }
    
    // Utility method
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

/**
 * Theme Component - Handles theme switching functionality
 */
class ThemeComponent extends BaseComponent {
    setupDOM() {
        this.themeToggle = this.$(this.config.selectors.themeToggle);
        this.currentTheme = this.loadSavedTheme();
    }
    
    bindEvents() {
        this.addEventListener(this.themeToggle, 'click', () => this.toggleTheme());
    }
    
    afterInit() {
        this.applyTheme(this.currentTheme);
    }
    
    loadSavedTheme() {
        return localStorage.getItem(this.config.theme.storageKey) || this.config.theme.default;
    }
    
    saveTheme(theme) {
        localStorage.setItem(this.config.theme.storageKey, theme);
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        this.saveTheme(this.currentTheme);
    }
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const themeIcon = this.themeToggle?.querySelector('i');
        
        if (themeIcon) {
            themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }
}

/**
 * Animation Component - Handles all animations and visual effects
 */
class AnimationComponent extends BaseComponent {
    constructor(config) {
        super(config);
        this.observers = new Map();
    }
    
    afterInit() {
        this.setupScrollAnimations();
        this.setupStatsAnimation();
        this.setupSkillBarsAnimation();
        this.setupTypingAnimation();
        this.setupParallaxEffect();
    }
    
    setupScrollAnimations() {
        const observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            {
                threshold: this.config.ui.animations.observerThreshold,
                rootMargin: this.config.ui.animations.observerRootMargin
            }
        );
        
        const animatedElements = this.$$('.section-header, .about-text, .about-stats, .timeline-item, .skill-category, .project-card, .contact-item, .contact-form');
        
        animatedElements.forEach(el => observer.observe(el));
        this.observers.set('scroll', observer);
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                this.observers.get('scroll')?.unobserve(entry.target);
            }
        });
    }
    
    setupStatsAnimation() {
        const statNumbers = this.$$(this.config.selectors.statNumbers);
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateNumber(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        statNumbers.forEach(stat => observer.observe(stat));
        this.observers.set('stats', observer);
    }
    
    animateNumber(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }
    
    setupSkillBarsAnimation() {
        const skillBars = this.$$(this.config.selectors.skillBars);
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    observer.unobserve(entry.target);
                }
            });
        });
        
        skillBars.forEach(bar => {
            bar.style.animationPlayState = 'paused';
            observer.observe(bar);
        });
        
        this.observers.set('skills', observer);
    }
    
    setupTypingAnimation() {
        const typingText = this.$(this.config.selectors.typingText);
        if (!typingText) return;
        
        const { text, speed, delay } = this.config.ui.typing;
        let i = 0;
        
        typingText.innerHTML = '';
        
        const type = () => {
            if (i < text.length) {
                typingText.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        };
        
        setTimeout(type, delay);
    }
    
    setupParallaxEffect() {
        const hero = this.$('.hero');
        if (!hero) return;
        
        this.addEventListener(window, 'scroll', () => {
            const scrollY = window.pageYOffset;
            const heroHeight = hero.offsetHeight;
            
            if (scrollY < heroHeight) {
                const parallaxSpeed = scrollY * this.config.ui.scroll.parallaxSpeed;
                hero.style.transform = `translateY(${parallaxSpeed}px)`;
            }
        });
    }
    
    destroy() {
        super.destroy();
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
    }
}

/**
 * Projects Component - Handles project loading and filtering
 */
class ProjectsComponent extends BaseComponent {
    constructor(config) {
        super(config);
        this.projects = [];
        this.currentFilter = 'all';
    }
    
    setupDOM() {
        this.projectsGrid = this.$(this.config.selectors.projectsGrid);
        this.filterButtons = this.$$(this.config.selectors.filterButtons);
        

    }
    
    bindEvents() {
        // Project filter buttons
        this.filterButtons.forEach((button) => {
            this.addEventListener(button, 'click', (e) => {
                e.preventDefault();
                this.handleFilterClick(button);
            });
        });
    }
    
    afterInit() {
        this.loadProjects();
    }
    
    async loadProjects() {
        // Load real projects directly instead of trying GitHub API first
        this.displayFallbackProjects();
    }
    
    async fetchGitHubRepos() {
        const { username, baseUrl, maxRepos } = this.config.api.github;
        const response = await fetch(`${baseUrl}/users/${username}/repos?sort=updated&per_page=${maxRepos}`);
        
        if (!response.ok) {
            throw new Error('GitHub API request failed');
        }
        
        return response.json();
    }
    
    processRepos(repos) {
        return repos.slice(0, this.config.api.github.displayLimit).map(repo => ({
            name: repo.name,
            description: repo.description || 'An interesting project developed with best practices and modern technologies.',
            categories: this.getProjectCategories(repo),
            techStack: this.getTechStack(repo),
            links: {
                github: repo.html_url,
                demo: repo.homepage
            }
        }));
    }
    
    getProjectCategories(repo) {
        const language = repo.language?.toLowerCase();
        const topics = repo.topics || [];
        const categories = [];
        
        if (topics.includes('mobile') || ['swift', 'kotlin'].includes(language)) {
            categories.push('mobile');
        } else if (topics.includes('backend') || ['python', 'java', 'go'].includes(language)) {
            categories.push('backend');
        } else if (topics.includes('web') || ['javascript', 'typescript', 'html'].includes(language)) {
            categories.push('web');
        }
        
        if (topics.includes('opensource') || repo.fork) {
            categories.push('opensource');
        }
        
        return categories.length > 0 ? categories : ['web'];
    }
    
    getTechStack(repo) {
        const languages = repo.language ? [repo.language] : ['JavaScript'];
        return [...languages, ...(repo.topics || [])].slice(0, 4);
    }
    
    displayProjects(projects) {
        if (!this.projectsGrid) return;
        
        this.projectsGrid.innerHTML = '';
        
        projects.forEach(project => {
            const projectCard = this.createProjectCard(project);
            this.projectsGrid.appendChild(projectCard);
        });
    }
    
    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';
        
        // Convert tags to data-tags with proper formatting
        const dataTagsString = project.tags.map(tag => {
            return tag.toLowerCase()
                .replace(/ai\/ml/g, 'ai-ml')
                .replace(/[^a-z0-9]/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');
        }).join(' ');
        
        card.setAttribute('data-tags', dataTagsString);
        
        const imageContent = project.image 
            ? `<img src="images/${project.image}" alt="${project.name}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
               <i class="fab fa-github" style="display:none;"></i>`
            : `<i class="fab fa-github"></i>`;
        
        card.innerHTML = `
            <div class="project-image">
                ${imageContent}
            </div>
            <div class="project-content">
                <div class="project-header">
                    <h3 class="project-title">${project.name}</h3>
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                    </div>
                </div>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${project.techStack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="project-links">
                    <a href="${project.links.github}" target="_blank" rel="noopener" class="project-link">
                        <i class="fab fa-github"></i> Code
                    </a>
                    ${project.links.demo ? `
                        <a href="${project.links.demo}" target="_blank" rel="noopener" class="project-link">
                            <i class="fas fa-external-link-alt"></i> Demo
                        </a>
                    ` : ''}
                </div>
            </div>
        `;
        
        return card;
    }
    
    displayFallbackProjects() {
        const fallbackProjects = [
            {
                name: 'Gaussian Processes',
                description: 'Advanced probabilistic machine learning implementation using Gaussian Processes for regression and classification tasks with uncertainty quantification.',
                tags: ['AI/ML'],
                techStack: ['Python', 'Jupyter', 'NumPy', 'SciPy', 'Matplotlib'],
                links: { 
                    github: 'https://github.com/JSerranom04/gaussian-processes',
                    demo: null 
                },
                image: 'gaussian-processes.jpg'
            },
            {
                name: 'Generative GMM',
                description: 'Generative Gaussian Mixture Models implementation for unsupervised learning, clustering, and density estimation with EM algorithm optimization.',
                tags: ['AI/ML'],
                techStack: ['Python', 'Jupyter', 'Scikit-learn', 'NumPy'],
                links: { 
                    github: 'https://github.com/JSerranom04/generative-GMM',
                    demo: null 
                },
                image: 'generative-gmm.jpg'
            },
            {
                name: 'Logistic Regression & Neural Networks',
                description: 'From-scratch implementation of logistic regression and neural networks with backpropagation, showcasing deep understanding of ML fundamentals.',
                tags: ['AI/ML'],
                techStack: ['Python', 'Jupyter', 'NumPy', 'Matplotlib'],
                links: { 
                    github: 'https://github.com/JSerranom04/logistic-regression-and-neural-networks',
                    demo: null 
                },
                image: 'neural-networks.jpg'
            },
            {
                name: 'Binary Logistic Regression',
                description: 'Mathematical implementation of binary logistic regression from scratch, demonstrating statistical learning theory and optimization techniques.',
                tags: ['AI/ML'],
                techStack: ['Python', 'Jupyter', 'NumPy', 'Statistics'],
                links: { 
                    github: 'https://github.com/JSerranom04/binary-logistic-regression',
                    demo: null 
                },
                image: 'logistic-regression.jpg'
            },
            {
                name: 'Compiler from Scratch (JavaCC)',
                description: 'Complete language processor implementation including lexical analysis, parsing, semantic analysis, and code generation using JavaCC framework.',
                tags: ['Compiler Design'],
                techStack: ['Java', 'JavaCC', 'Compiler Design', 'AST'],
                links: { 
                    github: 'https://github.com/JSerranom04/compiler-from-scratch-Javacc',
                    demo: null 
                },
                image: 'compiler-design.jpg'
            },
            {
                name: 'Raft Distributed Algorithm',
                description: 'Implementation of the Raft consensus algorithm for distributed systems, ensuring fault tolerance and consistency in distributed environments.',
                tags: ['Distributed Systems'],
                techStack: ['Go', 'Distributed Systems', 'Consensus', 'Networking'],
                links: { 
                    github: 'https://github.com/JSerranom04/raft-distributed-algorithm',
                    demo: null 
                },
                image: 'raft-algorithm.jpg'
            },
            {
                name: 'Ricart-Agrawala Writers-Readers',
                description: 'Implementation of the Ricart-Agrawala distributed mutual exclusion algorithm for coordinating writers and readers in distributed systems.',
                tags: ['Distributed Systems'],
                techStack: ['Go', 'Distributed Systems', 'Concurrency', 'Mutex'],
                links: { 
                    github: 'https://github.com/JSerranom04/ricart-agrawala-writters-readers',
                    demo: null 
                },
                image: 'distributed-mutex.jpg'
            },
            {
                name: 'Branch and Prune Algorithms',
                description: 'Implementation of branch-and-bound optimization algorithms with pruning techniques for solving complex combinatorial problems efficiently.',
                tags: ['Algorithms'],
                techStack: ['Go', 'Algorithms', 'Optimization', 'Data Structures'],
                links: { 
                    github: 'https://github.com/JSerranom04/branch-and-prune',
                    demo: null 
                },
                image: 'branch-bound.jpg'
            },
            {
                name: 'Python Message Broker',
                description: 'High-performance message broker implementation in Python supporting multiple messaging patterns and protocols for distributed communication.',
                tags: ['Software Engineering'],
                techStack: ['Python', 'Networking', 'Message Queue', 'Concurrency'],
                links: { 
                    github: 'https://github.com/JSerranom04/py-message-broker',
                    demo: null 
                },
                image: 'message-broker.jpg'
            },
            {
                name: 'Content-Aware Image Resizing',
                description: 'Implementation of seam carving algorithm for intelligent image resizing that preserves important visual content while removing less significant areas.',
                tags: ['Algorithms'],
                techStack: ['Go', 'Image Processing', 'Computer Vision', 'Algorithms'],
                links: { 
                    github: 'https://github.com/JSerranom04/content-aware-image-resizing',
                    demo: null 
                },
                image: 'seam-carving.jpg'
            },
            {
                name: 'Hamming Distance Calculator',
                description: 'Efficient implementation of Hamming distance calculation for error detection and correction in digital communications and bioinformatics.',
                tags: ['Algorithms'],
                techStack: ['Go', 'Bit Manipulation', 'Error Detection', 'Algorithms'],
                links: { 
                    github: 'https://github.com/JSerranom04/hamming-distance',
                    demo: null 
                },
                image: 'hamming-distance.jpg'
            },
            {
                name: 'Algorithmic Problem Collection',
                description: 'Comprehensive collection of algorithmic solutions covering dynamic programming, greedy algorithms, graph theory, and competitive programming.',
                tags: ['Algorithms'],
                techStack: ['Python', 'Algorithms', 'Data Structures', 'Problem Solving'],
                links: { 
                    github: 'https://github.com/JSerranom04/algorithmic-problem-collection',
                    demo: null 
                },
                image: 'algorithms.jpg'
            },
            {
                name: 'P2P2P Web Page',
                description: 'Peer-to-peer web application demonstrating distributed web technologies and decentralized communication protocols.',
                tags: ['Web'],
                techStack: ['JavaScript', 'P2P', 'WebRTC', 'Networking'],
                links: { 
                    github: 'https://github.com/JSerranom04/P2P2P-web-page',
                    demo: null 
                },
                image: 'p2p-network.jpg'
            }
        ];
        
        this.displayProjects(fallbackProjects);
    }
    
    handleFilterClick(button) {
        const filter = button.getAttribute('data-filter');
        
        // Update button states
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Filter projects
        this.filterProjects(filter);
    }
    
    filterProjects(filter) {
        const projectCards = this.$$('.project-card:not(.loading-placeholder)');
        
        projectCards.forEach(card => {
            const tags = card.getAttribute('data-tags') || '';
            
            if (filter === 'all' || tags.includes(filter)) {
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                card.style.animation = 'fadeInUp 0.5s ease-out';
            } else {
                card.style.display = 'none';
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
            }
        });
    }
}

/**
 * Contact Component - Handles contact form functionality
 */
class ContactComponent extends BaseComponent {
    setupDOM() {
        this.contactForm = this.$(this.config.selectors.contactForm);
    }
    
    bindEvents() {
        this.addEventListener(this.contactForm, 'submit', (e) => this.handleFormSubmit(e));
    }
    
    async handleFormSubmit(e) {
        e.preventDefault();
        
        const submitBtn = this.contactForm.querySelector('button[type="submit"]');
        const formData = new FormData(this.contactForm);
        
        this.setLoadingState(submitBtn, true);
        
        try {
            await this.submitForm(formData);
            this.showNotification('Message sent successfully!', 'success');
            this.contactForm.reset();
        } catch (error) {
            this.showNotification('Error sending message. Please try again.', 'error');
        } finally {
            this.setLoadingState(submitBtn, false);
        }
    }
    
    setLoadingState(button, isLoading) {
        button.classList.toggle('loading', isLoading);
    }
    
    async submitForm(formData) {
        // Simulate form submission
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                Math.random() > 0.1 ? resolve() : reject(new Error('Simulated error'));
            }, 2000);
        });
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        this.addNotificationStyles();
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
    
    addNotificationStyles() {
        if (this.$('#notification-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed; top: 20px; right: 20px; padding: 1rem 1.5rem;
                border-radius: 0.5rem; color: white; z-index: 10000;
                animation: slideInRight 0.3s ease-out;
            }
            .notification-success { background: #10b981; }
            .notification-error { background: #ef4444; }
            .notification-content { display: flex; align-items: center; gap: 0.5rem; }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
}

/**
 * UI Component - Handles miscellaneous UI functionality
 */
class UIComponent extends BaseComponent {
    setupDOM() {
        this.backToTop = this.$(this.config.selectors.backToTop);
        this.tabButtons = this.$$(this.config.selectors.tabButtons);
        this.tabContents = this.$$(this.config.selectors.tabContents);
    }
    
    bindEvents() {
        // Back to top button
        this.addEventListener(this.backToTop, 'click', () => this.scrollToTop());
        this.addEventListener(window, 'scroll', () => this.updateBackToTopVisibility());
        
        // Resume tabs
        this.tabButtons.forEach((button) => {
            this.addEventListener(button, 'click', (e) => {
                e.preventDefault();
                this.handleTabClick(button);
            });
        });
        
        // Download CV button
        const downloadBtn = this.$('.download-cv');
        if (downloadBtn) {
            this.addEventListener(downloadBtn, 'click', (e) => this.handleDownload(e));
        }
        
        // Window resize
        this.addEventListener(window, 'resize', () => this.handleResize());
    }
    
    afterInit() {
        // Initialize tab visibility
        this.tabContents.forEach(content => {
            if (content.classList.contains('active')) {
                content.style.display = 'block';
                content.setAttribute('aria-hidden', 'false');
            } else {
                content.style.display = 'none';
                content.setAttribute('aria-hidden', 'true');
            }
        });
    }

    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    updateBackToTopVisibility() {
        const scrollY = window.pageYOffset;
        const isVisible = scrollY > this.config.ui.scroll.backToTopThreshold;
        
        this.backToTop?.classList.toggle('visible', isVisible);
    }
    
    handleTabClick(button) {
        const tabName = button.getAttribute('data-tab');
        const targetContent = this.$(`#${tabName}`);
        
        if (!targetContent) {
            return;
        }
        
        // Force remove active from all buttons and contents
        this.tabButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });
        
        this.tabContents.forEach(content => {
            content.classList.remove('active');
            content.style.display = 'none';
            content.setAttribute('aria-hidden', 'true');
        });
        
        // Add active to selected
        button.classList.add('active');
        button.setAttribute('aria-selected', 'true');
        
        targetContent.classList.add('active');
        targetContent.style.display = 'block';
        targetContent.setAttribute('aria-hidden', 'false');
        
        // Scroll to content if needed
        targetContent.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    handleResize() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768) {
            const hamburger = this.$(this.config.selectors.hamburger);
            const navMenu = this.$(this.config.selectors.navMenu);
            
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
        }
    }

    handleDownload(e) {
        // Let the browser handle the download naturally first
        // If that doesn't work, this provides a fallback
        const link = e.target.closest('a');
        const href = link.getAttribute('href');
        const filename = link.getAttribute('download') || 'Resume_Juan_Jose_Serrano_Mora.pdf';
        
        // Create a temporary link element for forced download
        setTimeout(() => {
            const tempLink = document.createElement('a');
            tempLink.href = href;
            tempLink.download = filename;
            tempLink.style.display = 'none';
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
        }, 100);
    }
}

/**
 * Portfolio Application - Main application class using Component Factory
 */
class PortfolioApp {
    constructor(config = {}) {
        this.config = { ...PortfolioConfig, ...config };
        this.components = new Map();
        this.initialized = false;
    }
    
    /**
     * Initialize the application
     */
    init() {
        if (this.initialized) return;
        
        this.createComponents();
        this.initializeComponents();
        this.setupGlobalEventHandlers();
        this.enhanceAccessibility();
        
        this.initialized = true;
        console.log('Portfolio application initialized successfully');
    }
    
    /**
     * Create all components using factory pattern
     */
    createComponents() {
        const componentClasses = {
            navigation: NavigationComponent,
            theme: ThemeComponent,
            animation: AnimationComponent,
            projects: ProjectsComponent,
            contact: ContactComponent,
            ui: UIComponent
        };
        
        Object.entries(componentClasses).forEach(([name, ComponentClass]) => {
            this.components.set(name, new ComponentClass(this.config));
        });
    }
    
    /**
     * Initialize all components
     */
    initializeComponents() {
        this.components.forEach(component => component.init());
    }
    
    /**
     * Setup global event handlers
     */
    setupGlobalEventHandlers() {
        // Global error handling
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            // Could send to error tracking service
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            // Could send to error tracking service
        });
        
        // Performance monitoring
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                console.log(`Page loaded in ${loadTime}ms`);
            });
        }
        
        // Service Worker registration
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => console.log('SW registered:', registration))
                    .catch(error => console.log('SW registration failed:', error));
            });
        }
    }
    
    /**
     * Enhance accessibility
     */
    enhanceAccessibility() {
        // Add skip link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute; top: -40px; left: 6px; background: var(--primary-color);
            color: white; padding: 8px; text-decoration: none; border-radius: 4px;
            z-index: 10000; transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => skipLink.style.top = '6px');
        skipLink.addEventListener('blur', () => skipLink.style.top = '-40px');
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add main landmark
        const heroSection = document.getElementById('home');
        if (heroSection) {
            heroSection.setAttribute('role', 'main');
            heroSection.id = 'main-content';
        }
    }
    
    /**
     * Get component by name
     */
    getComponent(name) {
        return this.components.get(name);
    }
    
    /**
     * Destroy the application
     */
    destroy() {
        this.components.forEach(component => component.destroy());
        this.components.clear();
        this.initialized = false;
    }
}

// ===== APPLICATION INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the portfolio application
    const portfolio = new PortfolioApp();
    portfolio.init();
    
    // Make portfolio instance globally available for debugging
    window.portfolio = portfolio;
});

// ===== POLYFILLS =====
// Smooth scroll polyfill for older browsers
if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = function(options = {}) {
        const element = this;
        const behavior = options.behavior || 'auto';
        
        if (behavior === 'smooth') {
            const targetPosition = element.offsetTop;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 500;
            let start = null;
            
            function animation(currentTime) {
                if (start === null) start = currentTime;
                const timeElapsed = currentTime - start;
                const run = ease(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);
                if (timeElapsed < duration) requestAnimationFrame(animation);
            }
            
            function ease(t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t + b;
                t--;
                return -c / 2 * (t * (t - 2) - 1) + b;
            }
            
            requestAnimationFrame(animation);
        } else {
            element.scrollIntoView();
        }
    };
}

// Intersection Observer polyfill check
if (!window.IntersectionObserver) {
    const script = document.createElement('script');
    script.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver';
    document.head.appendChild(script);
} 
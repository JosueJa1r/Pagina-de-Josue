// Language System
let currentLanguage = 'es';
let translations = {};

// Load translations
async function loadTranslations() {
    try {
        const response = await fetch('translations.json');
        translations = await response.json();
    } catch (error) {
        console.error('Error loading translations:', error);
    }
}

// Translate page content
function translatePage(lang) {
    currentLanguage = lang;
    
    // Update language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        }
    });
    
    // Translate elements with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.dataset.translate;
        const keys = key.split('.');
        let translation = translations[lang];
        
        for (const k of keys) {
            translation = translation?.[k];
        }
        
        if (translation) {
            element.textContent = translation;
        }
    });
    
    // Translate placeholders
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.dataset.translatePlaceholder;
        const keys = key.split('.');
        let translation = translations[lang];
        
        for (const k of keys) {
            translation = translation?.[k];
        }
        
        if (translation) {
            element.placeholder = translation;
        }
    });
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Store language preference
    localStorage.setItem('preferredLanguage', lang);
}

// Initialize language system
document.addEventListener('DOMContentLoaded', async () => {
    await loadTranslations();
    
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && translations[savedLanguage]) {
        translatePage(savedLanguage);
    }
    
    // Add click listeners to language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            if (translations[lang]) {
                translatePage(lang);
            }
        });
    });
});

// Header, and mobile navigation elements
const header = document.querySelector('.header');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

// Hide/show header on scroll
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > lastScrollTop && currentScroll > header.offsetHeight) {
        // Scrolling down
        header.classList.add('header-hidden');
        // Close mobile menu if open
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    } else {
        // Scrolling up or at the top
        header.classList.remove('header-hidden');
    }
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // For Mobile or negative scrolling
});

// Mobile Navigation Toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Skills tab system
const skillTabs = document.querySelector('.skills-tabs');
const skillCategories = document.querySelectorAll('.skill-category');

if (skillTabs) {
    skillTabs.addEventListener('click', (e) => {
        if (e.target.classList.contains('skill-tab-btn')) {
            const targetId = e.target.dataset.target;

            // Update button active state
            skillTabs.querySelectorAll('.skill-tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            e.target.classList.add('active');

            // Update content active state
            skillCategories.forEach(category => {
                category.classList.remove('active');
                if (category.id === targetId) {
                    category.classList.add('active');
                }
            });
        }
    });
}

// Skills animation on scroll
const skillItems = document.querySelectorAll('.skill-item');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            entry.target.style.animationDelay = `${Math.random() * 0.5}s`;
        }
    });
}, { threshold: 0.1 });

skillItems.forEach(item => {
    skillObserver.observe(item);
});

// Portfolio item hover and click effects
const portfolioItems = document.querySelectorAll('.portfolio-item');
portfolioItems.forEach(item => {
    // Hover effect
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });

    // Click effect for the entire card
    item.addEventListener('click', function(event) {
        // Prevent opening the link twice if the click is directly on the 'portfolio-link'
        if (event.target.closest('.portfolio-link')) {
            return;
        }
        const link = this.querySelector('.portfolio-link');
        if (link && link.href && link.href !== '#') { // Ensure there's a valid link
            window.open(link.href, '_blank');
        }
    });
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add active class styles
const activeStyle = document.createElement('style');
activeStyle.textContent = `
    .nav-link.active {
        color: #059669 !important; /* Verde más oscuro para el enlace activo */
    }
    
    .nav-link.active::after {
        width: 100% !important;
    }
`;
document.head.appendChild(activeStyle);

// Preloader
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('preloader-hidden');
    }
});

// Smooth reveal animation for elements
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            // No es necesario dejar de observar si quieres que la animación se repita
            // revealObserver.unobserve(entry.target); 
        }
    });
}, {
    threshold: 0.15, // El elemento debe ser visible en un 15%
});

document.addEventListener('DOMContentLoaded', () => {
    const elementsToReveal = document.querySelectorAll('.animate-on-scroll');
    elementsToReveal.forEach(element => {
        revealObserver.observe(element);
    });
});

// Back to top button
const backToTopButton = document.createElement('button');
backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTopButton.className = 'back-to-top';
backToTopButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    background: #10b981; /* Verde principal */
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    z-index: 1000;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
`;

document.body.appendChild(backToTopButton);

// Show/hide back to top button
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopButton.style.display = 'flex';
    } else {
        backToTopButton.style.display = 'none';
    }
});

// Back to top functionality
backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add hover effect to back to top button
backToTopButton.addEventListener('mouseenter', () => {
    backToTopButton.style.transform = 'scale(1.1)';
    backToTopButton.style.background = '#059669'; /* Verde más oscuro en hover */
});

backToTopButton.addEventListener('mouseleave', () => {
    backToTopButton.style.transform = 'scale(1)';
    backToTopButton.style.background = '#10b981'; /* Verde principal */
});

// ========================================
// Navigation Toggle (Mobile)
// ========================================
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = navToggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

// Close mobile nav when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = navToggle.querySelector('i');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
    });
});

// ========================================
// Navbar Scroll Effect
// ========================================
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 80) {
        navbar.style.background = 'rgba(10, 10, 18, 0.95)';
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(10, 10, 18, 0.85)';
        navbar.style.boxShadow = 'none';
    }
});

// ========================================
// Scroll Animations
// ========================================
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add animation classes to elements
document.querySelectorAll('.feature-card, .download-card, .community-card, .section-header, .requirement-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
});

// Add animate-in styles
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// Stagger animation for grid items
document.querySelectorAll('.features-grid, .download-cards, .community-cards, .requirements-grid').forEach(grid => {
    const cards = grid.children;
    Array.from(cards).forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.08}s`;
    });
});

// ========================================
// Smooth Scroll for Anchor Links
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = navbar.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// Active Nav Link Highlight
// ========================================
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
        
        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.style.color = '#a78bfa';
            } else {
                navLink.style.color = '';
            }
        }
    });
});

// ========================================
// Parallax Effect for Background Orbs
// ========================================
const orbs = document.querySelectorAll('.gradient-orb');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    orbs.forEach((orb, index) => {
        const speed = 0.1 + (index * 0.05);
        orb.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ========================================
// Mouse Move Parallax for Hero
// ========================================
const heroSection = document.querySelector('.hero');
const previewWindow = document.querySelector('.preview-window');

if (heroSection && previewWindow) {
    heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        previewWindow.style.transform = `perspective(1000px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateY(0)`;
    });
    
    heroSection.addEventListener('mouseleave', () => {
        previewWindow.style.transform = '';
    });
}

// ========================================
// Download Card Hover Animation
// ========================================
document.querySelectorAll('.download-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const ring = card.querySelector('.icon-ring');
        if (ring) {
            ring.style.animationPlayState = 'running';
        }
    });
});

// ========================================
// Add Extra Particles Dynamically
// ========================================
const particlesContainer = document.querySelector('.particles');
if (particlesContainer) {
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('span');
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 15}s`;
        particle.style.width = `${2 + Math.random() * 4}px`;
        particle.style.height = particle.style.width;
        particlesContainer.appendChild(particle);
    }
}

// ========================================
// GitHub Release API - Fetch Latest Version
// ========================================
async function fetchLatestRelease() {
    const versionText = document.getElementById('version-text');
    const installerBtn = document.getElementById('download-installer');
    const portableBtn = document.getElementById('download-portable');
    const installerSize = document.getElementById('installer-size');
    const portableSize = document.getElementById('portable-size');
    
    try {
        const response = await fetch('https://api.github.com/repos/Anneardysa/ArdysaModsTools/releases/latest');
        
        if (!response.ok) {
            throw new Error('Failed to fetch release');
        }
        
        const release = await response.json();
        const version = release.tag_name;
        
        // Update version badge
        if (versionText) {
            versionText.textContent = `Version ${version.replace('v', '')}`;
        }
        
        // Find assets
        const assets = release.assets || [];
        const installerAsset = assets.find(a => a.name.endsWith('.exe') && a.name.includes('Setup'));
        const portableAsset = assets.find(a => a.name.endsWith('.zip'));
        
        // Update installer button
        if (installerBtn && installerAsset) {
            installerBtn.href = installerAsset.browser_download_url;
            if (installerSize) {
                const sizeMB = (installerAsset.size / (1024 * 1024)).toFixed(1);
                installerSize.textContent = `(${sizeMB} MB)`;
            }
        }
        
        // Update portable button
        if (portableBtn && portableAsset) {
            portableBtn.href = portableAsset.browser_download_url;
            if (portableSize) {
                const sizeMB = (portableAsset.size / (1024 * 1024)).toFixed(1);
                portableSize.textContent = `(${sizeMB} MB)`;
            }
        }
        
        console.log(`✅ Loaded release: ${version}`);
        
    } catch (error) {
        console.warn('⚠️ Could not fetch latest release, using fallback:', error.message);
        
        // Fallback to static version
        if (versionText) {
            versionText.textContent = 'Version 2.1.0-beta';
        }
    }
}

// Fetch release info on page load
fetchLatestRelease();

console.log('🎮 ArdysaModsTools - Made with ❤️ for the Dota 2 Community');


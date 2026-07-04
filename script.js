// ========================================
// Shared helpers — every block is guarded so this same file powers
// the minimal landing page (index) AND the content-rich subpages
// (updates.html / whatsnew.html) without throwing on missing nodes.
// ========================================

// ---------- Navigation Toggle (Mobile) ----------
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = navToggle.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        });
    });
}

// ---------- Navbar Scroll Effect ----------
const navbar = document.querySelector('.navbar');

if (navbar) {
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
}

// ---------- Scroll Animations ----------
const animatedEls = document.querySelectorAll(
    '.feature-card, .download-card, .community-card, .section-header, .requirement-item'
);

if (animatedEls.length) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.1 });

    animatedEls.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });

    const animStyle = document.createElement('style');
    animStyle.textContent = `.animate-in { opacity: 1 !important; transform: translateY(0) !important; }`;
    document.head.appendChild(animStyle);

    // Stagger animation for grid items
    document.querySelectorAll('.features-grid, .download-cards, .community-cards, .requirements-grid').forEach(grid => {
        Array.from(grid.children).forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.08}s`;
        });
    });
}

// ---------- Smooth Scroll for Anchor Links (same-page only) ----------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const navHeight = navbar ? navbar.offsetHeight : 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    });
});

// ---------- Active Nav Link Highlight ----------
const sections = document.querySelectorAll('section[id]');

if (sections.length && navLinks) {
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
}

// ========================================
// Landing page — Download dropdown (Installer / Portable)
// ========================================
const dlWrap = document.getElementById('lp-download');
const dlToggle = document.getElementById('dl-toggle');

if (dlWrap && dlToggle) {
    const closeMenu = () => {
        dlWrap.classList.remove('open');
        dlToggle.setAttribute('aria-expanded', 'false');
    };

    dlToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dlWrap.classList.toggle('open');
        dlToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close when clicking outside or pressing Escape
    document.addEventListener('click', (e) => {
        if (!dlWrap.contains(e.target)) closeMenu();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });
}

// ========================================
// Landing page — subtle background parallax
// (respects reduced-motion; safe because the backdrop bleeds -6%)
// ========================================
const backdrop = document.querySelector('.animated-bg');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (backdrop && document.body.classList.contains('landing') && !prefersReducedMotion) {
    let raf = null;
    window.addEventListener('mousemove', (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
            const x = (e.clientX / window.innerWidth - 0.5) * -12;
            const y = (e.clientY / window.innerHeight - 0.5) * -12;
            backdrop.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            raf = null;
        });
    });
}

// ========================================
// Landing page — modal (embeds What's New / ModsPack pages)
// ========================================
const modal = document.getElementById('lp-modal');

if (modal) {
    const frame = document.getElementById('lp-modal-frame');
    const loader = document.getElementById('lp-modal-loader');
    const titleText = document.getElementById('lp-modal-titletext');
    const titleIcon = document.getElementById('lp-modal-icon');
    const openFull = document.getElementById('lp-modal-open');
    let lastFocus = null;

    const openModal = (url, title, icon) => {
        if (!url) return;
        lastFocus = document.activeElement;
        if (titleText) titleText.textContent = title || 'ArdysaModsTools';
        if (titleIcon) titleIcon.className = 'fas ' + (icon || 'fa-layer-group');
        if (openFull) openFull.href = url;
        if (loader) loader.style.display = '';
        // load the target page in embed mode (hides its own chrome)
        frame.src = url + (url.indexOf('?') === -1 ? '?' : '&') + 'embed=1';
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        const closeBtn = modal.querySelector('.lp-modal__close');
        if (closeBtn) closeBtn.focus();
    };

    const closeModal = () => {
        if (!modal.classList.contains('open')) return;
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        // unload the iframe shortly after the close animation to reset state
        setTimeout(() => {
            if (!modal.classList.contains('open')) frame.src = 'about:blank';
        }, 260);
        if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    };

    if (frame) {
        frame.addEventListener('load', () => {
            if (loader) loader.style.display = 'none';
        });
    }

    document.querySelectorAll('[data-modal]').forEach((trigger) => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(
                trigger.getAttribute('href'),
                trigger.dataset.modalTitle,
                trigger.dataset.modalIcon
            );
        });
    });

    modal.querySelectorAll('[data-close]').forEach((el) => {
        el.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

// ========================================
// Landing page — random lightning streaks (decorative)
// ========================================
const fxLayer = document.querySelector('.fx-lightning');

if (fxLayer && !prefersReducedMotion) {
    const BOLT_COLORS = ['#a855f7', '#8b5cf6', '#7c3aed', '#c4b5fd'];
    let fxTimer = null;

    // Build a jagged zig-zag path from top to bottom of a w×h box.
    const jaggedPath = (w, h, segs, startX) => {
        let x = startX;
        let d = `M ${x.toFixed(1)} 0`;
        const step = h / segs;
        for (let i = 1; i <= segs; i++) {
            x += (Math.random() - 0.5) * w * 0.9;
            x = Math.max(3, Math.min(w - 3, x));
            d += ` L ${x.toFixed(1)} ${(step * i).toFixed(1)}`;
        }
        return d;
    };

    // A short forked branch shooting off a point on the main bolt.
    const branchPath = (w, h) => {
        const startY = h * (0.25 + Math.random() * 0.45);
        let x = w / 2 + (Math.random() - 0.5) * w * 0.4;
        let y = startY;
        let d = `M ${x.toFixed(1)} ${y.toFixed(1)}`;
        const dir = Math.random() < 0.5 ? -1 : 1;
        const segs = 2 + ((Math.random() * 3) | 0);
        for (let i = 0; i < segs; i++) {
            x += dir * (6 + Math.random() * 20);
            y += 16 + Math.random() * 26;
            d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
        }
        return d;
    };

    const spawnBolt = () => {
        const w = 44 + Math.random() * 90;
        const h = 180 + Math.random() * 340;
        const segs = 6 + ((Math.random() * 6) | 0);
        const angle = -42 + Math.random() * 84;
        const duration = 200 + Math.random() * 340;
        const color = BOLT_COLORS[(Math.random() * BOLT_COLORS.length) | 0];

        const main = jaggedPath(w, h, segs, w / 2 + (Math.random() - 0.5) * w * 0.3);
        const branch = Math.random() < 0.65 ? branchPath(w, h) : '';

        const bolt = document.createElement('span');
        bolt.className = 'fx-bolt';
        bolt.style.left = Math.random() * 100 + 'vw';
        bolt.style.top = Math.random() * 100 + 'vh';
        bolt.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
        bolt.style.animationDuration = duration + 'ms';
        bolt.style.setProperty('--bolt-color', color);
        bolt.innerHTML =
            `<svg width="${w | 0}" height="${h | 0}" viewBox="0 0 ${w | 0} ${h | 0}">` +
            `<path class="fx-glow" d="${main}"/>` +
            (branch ? `<path class="fx-glow" d="${branch}"/>` : '') +
            `<path class="fx-core" d="${main}"/>` +
            (branch ? `<path class="fx-core" d="${branch}"/>` : '') +
            `</svg>`;

        fxLayer.appendChild(bolt);
        setTimeout(() => bolt.remove(), duration + 90);
    };

    const loop = () => {
        // Pause spawning while the tab is hidden to save resources.
        if (!document.hidden) {
            // burst of 1–3 strikes for a more intense storm
            const count = 1 + (Math.random() < 0.55 ? 1 : 0) + (Math.random() < 0.3 ? 1 : 0);
            for (let k = 0; k < count; k++) setTimeout(spawnBolt, k * 45);
        }
        fxTimer = setTimeout(loop, 150 + Math.random() * 520);
    };

    loop();
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && fxTimer) {
            clearTimeout(fxTimer);
            fxTimer = null;
        } else if (!document.hidden && !fxTimer) {
            loop();
        }
    });
}

// ========================================
// GitHub Release API — Fetch Latest Version
// ========================================
async function fetchLatestRelease() {
    const versionText = document.getElementById('version-text');
    const installerBtn = document.getElementById('download-installer');
    const portableBtn = document.getElementById('download-portable');
    const installerSize = document.getElementById('installer-size');
    const portableSize = document.getElementById('portable-size');

    // Nothing to populate on this page — bail early.
    if (!versionText && !installerBtn && !portableBtn) return;

    try {
        const response = await fetch('https://api.github.com/repos/Anneardysa/ArdysaModsTools/releases/latest');
        if (!response.ok) throw new Error('Failed to fetch release');

        const release = await response.json();
        const version = release.tag_name;

        if (versionText) {
            versionText.textContent = `Version ${version.replace('v', '')}`;
        }

        const assets = release.assets || [];
        const installerAsset = assets.find(a => a.name.endsWith('.exe') && a.name.includes('Setup'));
        const portableAsset = assets.find(a => a.name.endsWith('.zip'));

        if (installerBtn && installerAsset) {
            installerBtn.href = installerAsset.browser_download_url;
            if (installerSize) {
                const sizeMB = (installerAsset.size / (1024 * 1024)).toFixed(1);
                installerSize.textContent = `(${sizeMB} MB)`;
            }
        }

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
        if (versionText) {
            versionText.textContent = 'Version 2.1.0-beta';
        }
    }
}

fetchLatestRelease();

console.log('🎮 ArdysaModsTools - Made with ❤️ for the Dota 2 Community');

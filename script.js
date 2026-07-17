// ========================================
// Shared helpers — every block is guarded so this same file powers
// the landing page (index) AND the content-rich subpages
// (updates.html / whatsnew.html) without throwing on missing nodes.
// ========================================

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Tabler sprite icon helper (sprite is inlined in each page's <body>)
const tIcon = (name, cls = 'icon') =>
    `<svg class="${cls}" aria-hidden="true"><use href="#ti-${name}" /></svg>`;

// ---------- Navigation Toggle (Mobile) ----------
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
    const setToggleIcon = (open) => {
        const use = navToggle.querySelector('use');
        if (use) use.setAttribute('href', open ? '#ti-x' : '#ti-menu-2');
    };

    navToggle.addEventListener('click', () => {
        const open = navLinks.classList.toggle('active');
        setToggleIcon(open);
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            setToggleIcon(false);
        });
    });
}

// ---------- Nav Scroll Effect (index .site-nav + subpage .navbar) ----------
const siteNav = document.querySelector('.site-nav, .navbar');

if (siteNav) {
    const onScroll = () => {
        siteNav.classList.toggle('scrolled', window.pageYOffset > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

// ---------- Smooth Scroll for Anchor Links (same-page only) ----------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const navHeight = siteNav ? siteNav.offsetHeight : 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
            window.scrollTo({ top: targetPosition, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        }
    });
});

// ---------- Scroll Reveal ----------
const revealEls = document.querySelectorAll('.reveal');

if (revealEls.length) {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        revealEls.forEach(el => el.classList.add('in'));
    } else {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealEls.forEach(el => revealObserver.observe(el));
    }
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
// Landing page — feature tabs (screenshot preview switcher)
// ========================================
const featureTabs = document.querySelectorAll('.feature-tab');

if (featureTabs.length) {
    const previewDots = document.querySelectorAll('.preview-dots button');
    const previewImgs = document.querySelectorAll('.preview-img');

    const selectTab = (index) => {
        featureTabs.forEach((tab, i) => {
            const active = i === index;
            tab.classList.toggle('is-active', active);
            tab.setAttribute('aria-selected', String(active));
        });
        previewDots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
        previewImgs.forEach((img, i) => img.classList.toggle('is-active', i === index));
    };

    featureTabs.forEach((tab) => {
        tab.addEventListener('click', () => selectTab(Number(tab.dataset.tab)));
        tab.addEventListener('keydown', (e) => {
            if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
            const current = Number(tab.dataset.tab);
            const delta = e.key === 'ArrowRight' ? 1 : -1;
            const next = (current + delta + featureTabs.length) % featureTabs.length;
            selectTab(next);
            featureTabs[next].focus();
        });
    });
    previewDots.forEach((dot) => {
        dot.addEventListener('click', () => selectTab(Number(dot.dataset.tab)));
    });
}

// ========================================
// Landing page — hero GIF carousel (vertical slide)
// ========================================
const heroCarousel = document.getElementById('hero-carousel');

if (heroCarousel) {
    const track = heroCarousel.querySelector('.hero-carousel-track');
    const dots = heroCarousel.querySelectorAll('.hero-carousel-dots button');
    const slides = heroCarousel.querySelectorAll('.hero-slide');
    const count = slides.length;
    const INTERVAL = 6000;
    let index = 0;
    let timer = null;

    const goTo = (i) => {
        index = ((i % count) + count) % count;
        track.style.transform = `translateY(-${index * 100}%)`;
        dots.forEach((dot, d) => dot.classList.toggle('is-active', d === index));
        // Only the visible video keeps playing — saves CPU/battery
        slides.forEach((slide, d) => {
            if (slide.tagName !== 'VIDEO') return;
            if (d === index) slide.play().catch(() => {});
            else slide.pause();
        });
    };

    const stop = () => {
        if (timer) clearInterval(timer);
        timer = null;
    };
    const start = () => {
        stop();
        timer = setInterval(() => goTo(index + 1), INTERVAL);
    };

    dots.forEach((dot) => {
        dot.addEventListener('click', () => {
            goTo(Number(dot.dataset.slide));
            start(); // reset the timer after a manual jump
        });
    });

    // Pause while hovered or while the tab is hidden
    heroCarousel.addEventListener('mouseenter', stop);
    heroCarousel.addEventListener('mouseleave', start);
    document.addEventListener('visibilitychange', () => {
        document.hidden ? stop() : start();
    });

    goTo(0);
    start();
}

// ========================================
// Landing page — terminal typing animation
// ========================================
const terminalPre = document.querySelector('.terminal-body');

if (terminalPre && !prefersReducedMotion && 'IntersectionObserver' in window) {
    const code = terminalPre.querySelector('code');
    const lines = code ? Array.from(code.querySelectorAll('span')) : [];

    if (lines.length) {
        const texts = lines.map((line) => line.textContent);
        let caret;

        const eraseAll = (onDone) => {
            // Backspace from the last line to the first, like a real caret deleting text
            let li = lines.length - 1;
            const eraseLine = () => {
                if (li < 0) { onDone(); return; }
                const line = lines[li];
                if (line.nextSibling && line.nextSibling.nodeType === Node.TEXT_NODE) {
                    code.removeChild(line.nextSibling); // the trailing "\n"
                }
                const backspace = () => {
                    if (line.textContent.length > 0) {
                        line.textContent = line.textContent.slice(0, -1);
                        setTimeout(backspace, 14 + Math.random() * 18);
                    } else {
                        li--;
                        setTimeout(eraseLine, 90);
                    }
                };
                backspace();
            };
            eraseLine();
        };

        const runTyping = () => {
            // Freeze the height so the terminal doesn't grow while typing
            terminalPre.style.minHeight = terminalPre.offsetHeight + 'px';
            code.textContent = '';
            caret = document.createElement('span');
            caret.className = 't-caret';
            code.appendChild(caret);

            let li = 0;
            const nextLine = () => {
                if (li >= lines.length) {
                    // Full loop: hold, erase everything, then type it all again
                    setTimeout(() => eraseAll(() => setTimeout(runTyping, 500)), 1700);
                    return;
                }
                const line = lines[li];
                const text = texts[li];
                line.textContent = '';
                code.insertBefore(line, caret);

                if (line.classList.contains('t-cmd')) {
                    // Commands are typed character by character
                    let ci = 0;
                    const typeChar = () => {
                        line.textContent = text.slice(0, ++ci);
                        if (ci < text.length) {
                            setTimeout(typeChar, 26 + Math.random() * 44);
                        } else {
                            code.insertBefore(document.createTextNode('\n'), caret);
                            li++;
                            setTimeout(nextLine, 300);
                        }
                    };
                    typeChar();
                } else {
                    // Output lines appear whole, like real command output
                    line.textContent = text;
                    code.insertBefore(document.createTextNode('\n'), caret);
                    li++;
                    setTimeout(nextLine, 260 + Math.random() * 300);
                }
            };
            nextLine();
        };

        const terminalObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    terminalObserver.disconnect();
                    setTimeout(runTyping, 350);
                }
            });
        }, { threshold: 0.4 });
        terminalObserver.observe(terminalPre);
    }
}

// ========================================
// Landing page — FAQ accordion (single-open behaviour)
// ========================================
const faqItems = document.querySelectorAll('.faq-item');

if (faqItems.length) {
    faqItems.forEach((item) => {
        item.addEventListener('toggle', () => {
            if (!item.open) return;
            faqItems.forEach((other) => {
                if (other !== item) other.open = false;
            });
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
        if (titleIcon) {
            const use = titleIcon.querySelector('use');
            if (use) use.setAttribute('href', '#' + (icon || 'ti-stack-2'));
        }
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

    // Delegated so dynamically-rendered triggers (ModsPack grid) work too
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-modal]');
        if (!trigger) return;
        e.preventDefault();
        openModal(
            trigger.getAttribute('href'),
            trigger.dataset.modalTitle,
            trigger.dataset.modalIcon
        );
    });

    modal.querySelectorAll('[data-close]').forEach((el) => {
        el.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

// ========================================
// GitHub Releases API — version, download links/sizes, downloads stat
// One request powers every [data-version] / [data-dl] / [data-dl-size]
// element on the page, plus the hero downloads counter.
// ========================================
async function fetchReleaseInfo() {
    const versionEls = document.querySelectorAll('[data-version], #version-text');
    const dlLinks = document.querySelectorAll('[data-dl]');
    const statDownloads = document.querySelector('[data-stat="downloads"]');

    // Nothing to populate on this page — bail early.
    if (!versionEls.length && !dlLinks.length && !statDownloads) return;

    const formatCount = (n) => {
        if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
        if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
        return String(n);
    };

    try {
        const response = await fetch('https://api.github.com/repos/Anneardysa/ArdysaModsTools/releases?per_page=100');
        if (!response.ok) throw new Error('Failed to fetch releases');

        const releases = await response.json();
        if (!Array.isArray(releases) || !releases.length) throw new Error('No releases');

        const latest = releases.find(r => !r.prerelease && !r.draft) || releases[0];
        const version = latest.tag_name || '';

        versionEls.forEach((el) => {
            el.textContent = el.id === 'version-text'
                ? `Version ${version.replace(/^v/, '')}`
                : version;
        });

        const assets = latest.assets || [];
        const matchAsset = {
            installer: assets.find(a => a.name.endsWith('.exe') && a.name.includes('Setup')),
            portable: assets.find(a => a.name.endsWith('.zip')),
        };

        dlLinks.forEach((link) => {
            const asset = matchAsset[link.dataset.dl];
            if (asset) link.href = asset.browser_download_url;
        });
        document.querySelectorAll('[data-dl-size]').forEach((el) => {
            const asset = matchAsset[el.dataset.dlSize];
            if (asset) {
                const sizeMB = (asset.size / (1024 * 1024)).toFixed(1);
                el.textContent = `(${sizeMB} MB)`;
            }
        });

        // Total downloads across every release asset
        if (statDownloads) {
            const total = releases.reduce((sum, release) =>
                sum + (release.assets || []).reduce((s, a) => s + (a.download_count || 0), 0), 0);
            statDownloads.textContent = total > 0 ? formatCount(total) : '10K+';
        }

        console.log(`✅ Loaded release: ${version}`);
    } catch (error) {
        console.warn('⚠️ Could not fetch releases, using fallbacks:', error.message);
        versionEls.forEach((el) => {
            el.textContent = el.id === 'version-text' ? 'Latest version' : 'Latest';
        });
        if (statDownloads) statDownloads.textContent = '10K+';
        // [data-dl] links keep their static releases/latest hrefs
    }
}

fetchReleaseInfo();

// ========================================
// Landing page — ModsPack teaser grid + heroes stat (from updates.json)
// ========================================
async function loadModspackTeaser() {
    const grid = document.getElementById('modspack-grid');
    const statHeroes = document.querySelector('[data-stat="heroes"]');
    const dateEl = document.querySelector('[data-modspack-date]');

    if (!grid && !statHeroes && !dateEl) return;

    const TEASER_COUNT = 11;

    try {
        const response = await fetch('updates.json');
        if (!response.ok) throw new Error('Failed to load updates.json');

        const heroes = await response.json();
        if (!Array.isArray(heroes) || !heroes.length) throw new Error('Empty updates.json');

        if (statHeroes) statHeroes.textContent = `${heroes.length}+`;

        if (dateEl) {
            const maxDate = heroes.reduce((max, h) => (h.date > max ? h.date : max), heroes[0].date);
            dateEl.textContent = new Date(maxDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        }

        if (grid) {
            const tiles = heroes.slice(0, TEASER_COUNT).map((h) => `
                <div class="mp-tile">
                    <img src="${h.image}" alt="${h.hero} skin" loading="lazy" />
                    <span class="mp-name">${h.hero}</span>
                </div>`).join('');

            const remaining = heroes.length - TEASER_COUNT;
            const moreTile = `
                <a class="mp-tile mp-more" href="updates" data-modal
                   data-modal-title="ModsPack" data-modal-icon="ti-stack-2">
                    ${tIcon('stack-2')}
                    <span>+${remaining} more</span>
                </a>`;

            grid.innerHTML = tiles + moreTile;
        }
    } catch (error) {
        console.warn('⚠️ Could not load ModsPack teaser:', error.message);
        if (statHeroes) statHeroes.textContent = '120+';
        if (dateEl) dateEl.textContent = 'see ModsPack';
        if (grid) {
            grid.innerHTML = `
                <a class="mp-tile mp-more" href="updates" data-modal
                   data-modal-title="ModsPack" data-modal-icon="ti-stack-2"
                   style="grid-column: 1 / -1; aspect-ratio: auto; padding: 40px;">
                    ${tIcon('stack-2')}
                    <span>Browse the ModsPack</span>
                </a>`;
        }
    }
}

loadModspackTeaser();

console.log('🎮 ArdysaModsTools - Made with ❤️ for the Dota 2 Community');

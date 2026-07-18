document.addEventListener('DOMContentLoaded', () => {
    const updatesContainer = document.getElementById('updates-container');
    const updatesUrl = 'updates.json';

    // Tabler sprite icon helper (sprite is inlined in the page <body>)
    const upIcon = (name, style = '') =>
        `<svg class="icon" aria-hidden="true"${style ? ` style="${style}"` : ''}><use href="#ti-${name}" /></svg>`;
    
    // State
    let allUpdates = [];
    let currentFilter = 'all';
    let currentSearch = '';

    // Elements
    const searchInput = document.getElementById('hero-search');
    const filterButtons = document.querySelectorAll('.filter-btn');

    async function fetchUpdates() {
        try {
            const response = await fetch(updatesUrl);
            if (!response.ok) {
                throw new Error('Failed to load updates');
            }
            allUpdates = await response.json();
            
            // Set global date immediately
            setGlobalDate(allUpdates);
            
            // Initial render
            filterAndRender();
        } catch (error) {
            console.error('Error fetching updates:', error);
            updatesContainer.innerHTML = `
                <div class="update-card" style="grid-column: 1 / -1; padding: 40px; text-align: center;">
                    ${upIcon('alert-triangle', 'width: 2rem; height: 2rem; color: #ff4444; margin-bottom: 16px;')}
                    <p data-i18n="updates.errorLoad">Unable to load updates at this time.</p>
                </div>
            `;
            window.i18n?.apply?.(updatesContainer);
        }
    }

    function setGlobalDate(updates) {
        if (updates.length > 0) {
            const maxDate = updates.reduce((max, p) => p.date > max ? p.date : max, updates[0].date);
            const dateObj = new Date(maxDate);
            const dateStr = dateObj.toLocaleDateString(window.i18n?.localeFor?.() || 'en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            const headerDateEl = document.getElementById('latest-update-date');
            if (headerDateEl) {
                headerDateEl.innerHTML = `${upIcon('calendar')} ${dateStr}`;
            }
        }
    }

    function filterAndRender() {
        const filtered = allUpdates.filter(update => {
            // Filter by attribute
            const matchesFilter = currentFilter === 'all' || (update.attribute && update.attribute === currentFilter);
            
            // Filter by search
            const matchesSearch = update.hero.toLowerCase().includes(currentSearch.toLowerCase());
            
            return matchesFilter && matchesSearch;
        });

        renderUpdates(filtered);
    }

    function renderUpdates(updates) {
        updatesContainer.innerHTML = ''; // Clear container

        if (updates.length === 0) {
            updatesContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
                    ${upIcon('search', 'width: 2rem; height: 2rem; margin: 0 auto 15px; display: block;')}
                    <p data-i18n="updates.noResults">No updates found matching your criteria.</p>
                </div>
            `;
            window.i18n?.apply?.(updatesContainer);
            return;
        }

        // Placeholder shown when an image is missing or fails to load.
        const makePlaceholder = () => {
            const ph = document.createElement('div');
            ph.className = 'placeholder-image';
            ph.innerHTML = "<svg class='icon' aria-hidden='true'><use href='#ti-photo' /></svg>";
            return ph;
        };

        updates.forEach(update => {
            const card = document.createElement('div');
            card.className = 'update-card';

            // Build with DOM APIs so hero names and image URLs from
            // updates.json are treated as data, never parsed as markup.
            const imageContainer = document.createElement('div');
            imageContainer.className = 'update-image-container';

            if (update.image) {
                const img = document.createElement('img');
                img.src = update.image;
                img.alt = `${update.hero} update`;
                img.loading = 'lazy';
                img.addEventListener('error', () => {
                    imageContainer.replaceChildren(makePlaceholder());
                });
                imageContainer.appendChild(img);
            } else {
                imageContainer.appendChild(makePlaceholder());
            }

            const content = document.createElement('div');
            content.className = 'update-content';
            const heroName = document.createElement('h3');
            heroName.className = 'update-hero-name';
            heroName.textContent = update.hero;
            content.appendChild(heroName);

            card.append(imageContainer, content);
            updatesContainer.appendChild(card);
        });
    }

    // Event Listeners
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.trim();
            filterAndRender();
        });
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add to clicked
            btn.classList.add('active');
            
            // Update filter
            currentFilter = btn.getAttribute('data-filter');
            filterAndRender();
        });
    });

    fetchUpdates();
});

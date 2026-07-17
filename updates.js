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
                    <p>Unable to load updates at this time.</p>
                </div>
            `;
        }
    }

    function setGlobalDate(updates) {
        if (updates.length > 0) {
            const maxDate = updates.reduce((max, p) => p.date > max ? p.date : max, updates[0].date);
            const dateObj = new Date(maxDate);
            const dateStr = dateObj.toLocaleDateString('en-US', { 
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
                    <p>No updates found matching your criteria.</p>
                </div>
            `;
            return;
        }

        updates.forEach(update => {
            const card = document.createElement('div');
            card.className = 'update-card';
            
            // Image handling with fallback (single quotes so it can live
            // inside the double-quoted data attribute below)
            const placeholderHtml = "<div class='placeholder-image'><svg class='icon' aria-hidden='true'><use href='#ti-photo' /></svg></div>";
            const imageHtml = update.image
                ? `<img src="${update.image}" alt="${update.hero} update" loading="lazy" onerror="this.parentElement.innerHTML=this.parentElement.dataset.fallback">`
                : placeholderHtml;

            card.innerHTML = `
                <div class="update-image-container" data-fallback="${placeholderHtml}">
                    ${imageHtml}
                </div>
                <div class="update-content">
                    <h3 class="update-hero-name">${update.hero}</h3>
                </div>
            `;

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

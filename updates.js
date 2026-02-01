document.addEventListener('DOMContentLoaded', () => {
    const updatesContainer = document.getElementById('updates-container');
    const updatesUrl = 'updates.json';
    
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
                    <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: #ff4444; margin-bottom: 16px;"></i>
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
                headerDateEl.innerHTML = `<i class="far fa-calendar-alt"></i> ${dateStr}`;
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
                    <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 15px; display: block;"></i>
                    <p>No updates found matching your criteria.</p>
                </div>
            `;
            return;
        }

        updates.forEach(update => {
            const card = document.createElement('div');
            card.className = 'update-card';
            
            // Image handling with fallback
            const imageHtml = update.image 
                ? `<img src="${update.image}" alt="${update.hero} update" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'placeholder-image\\'><i class=\\'fas fa-image\\'></i></div>'">`
                : `<div class="placeholder-image"><i class="fas fa-image"></i></div>`;

            card.innerHTML = `
                <div class="update-image-container">
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

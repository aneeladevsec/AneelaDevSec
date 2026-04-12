'use strict';

/*
===============================
BLOG PAGE INTERACTIONS
Load More + Category Filters
===============================
*/

document.addEventListener('DOMContentLoaded', () => {
    BlogFilters.init();
    BlogLoadMore.init();
});

const BlogFilters = {
    init() {
        this.buttons = Array.from(document.querySelectorAll('.blog-filter-btn'));
        this.cards = Array.from(document.querySelectorAll('.blog-card'));
        if (!this.buttons.length || !this.cards.length) return;

        this.bindEvents();
    },

    bindEvents() {
        this.buttons.forEach((btn) => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter || 'all';
                this.setActiveButton(btn);
                this.filterCards(filter);
            });
        });
    },

    setActiveButton(activeBtn) {
        this.buttons.forEach((btn) => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    },

    filterCards(filter) {
        this.cards.forEach((card) => {
            const category = card.dataset.category || '';
            const isHiddenByLoadMore = card.classList.contains('blog-card-hidden');

            if (filter === 'all' || category === filter) {
                // Respect Load More: only show if not in hidden group
                card.style.display = isHiddenByLoadMore ? 'none' : '';
            } else {
                card.style.display = 'none';
            }
        });
    }
};

const BlogLoadMore = {
    init() {
        this.button = document.querySelector('.blog-load-more');
        this.hiddenCards = Array.from(document.querySelectorAll('.blog-card-hidden'));

        if (!this.button || !this.hiddenCards.length) return;

        this.bindEvents();
    },

    bindEvents() {
        this.button.addEventListener('click', () => this.revealCards());
    },

    revealCards() {
        // Reveal all remaining hidden cards for simplicity
        this.hiddenCards.forEach((card) => {
            card.classList.remove('blog-card-hidden');
            card.style.display = '';
        });

        this.button.style.display = 'none';
    }
};

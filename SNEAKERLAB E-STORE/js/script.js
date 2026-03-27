/**
 * script.js - THE MASTER SCRIPT (COMPLETE VERSION)
 */

// --- 1. MOCK DATA & SERVICE ---
const MOCK_DB = [
    { id: 1, name: 'Air Jordan 1 Retro High', price: 190, old_price: 220, brand: 'jordan', image_url: 'images/jordan-1.jpg', tag: 'trending' },
    { id: 2, name: 'Nike Dunk Low Panda', price: 110, old_price: null, brand: 'nike', image_url: 'images/dunk-panda.jpg', tag: 'new' },
    { id: 3, name: 'Adidas Yeezy Boost 350', price: 230, old_price: 250, brand: 'adidas', image_url: 'images/yeezy.jpg', tag: 'trending' },
    { id: 4, name: 'New Balance 2002R Protection', price: 160, old_price: null, brand: 'new-balance', image_url: 'images/nb-2002.jpg', tag: 'trending' },
    { id: 5, name: 'Nike Air Max 270', price: 150, old_price: 180, brand: 'nike', image_url: 'images/airmax-270.jpg', tag: 'trending' },
    { id: 6, name: 'Jordan 4 Retro Thunder', price: 210, old_price: null, brand: 'jordan', image_url: 'images/jordan-4.jpg', tag: 'trending' },
    { id: 7, name: 'Nike Air Max 95 Neon', price: 175, old_price: 200, brand: 'nike', image_url: 'images/airmax-95.jpg', tag: 'trending' },
    { id: 8, name: 'Adidas Forum Low', price: 100, old_price: 120, brand: 'adidas', image_url: 'images/forum-low.jpg', tag: 'trending' }
];

// --- 2. GLOBAL INITIALIZER ---
document.addEventListener('DOMContentLoaded', () => {
    updateCartCounters();
    updateWishlistCounters();

    // Initialize Product Grids (Forced to 8 items)
    initLatestArrivals(); 
    initCuratedSection();
    
    // Initialize UI Components
    initHeroSlider();
    startReviewSlider();
    initReviewsPagination();
    setupScrollTopBtn();

    if (document.getElementById("announcement-text")) {
        setInterval(rotateMessages, 5000);
    }

    // Initialize Global Search Overlay
    initSearchEngine();

    // Mobile Drawer Logic
    const mobileMenuTrigger = document.getElementById('mobile-menu-trigger');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerClose = document.getElementById('drawer-close');

    if (mobileMenuTrigger) mobileMenuTrigger.addEventListener('click', () => toggleDrawer(true));
    if (drawerClose) drawerClose.addEventListener('click', () => toggleDrawer(false));

    // Accordion for Mobile Nav
    const mobileDropdowns = document.querySelectorAll('.mobile-nav-links .has-dropdown > .dropdown-trigger');
    mobileDropdowns.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const parentLi = trigger.parentElement;
            const isActive = parentLi.classList.contains('submenu-active');
            document.querySelectorAll('.mobile-nav-links .has-dropdown').forEach(li => li.classList.remove('submenu-active'));
            if (!isActive) parentLi.classList.add('submenu-active');
        });
    });
});

// --- 3. PRODUCT GRID LOGIC (THE 8-ITEM FIX) ---
async function initLatestArrivals() {
    const grid = document.getElementById('latest-arrivals-grid');
    if (!grid) return;
    const products = await MockService.getAllProducts();
    const displayList = products.slice(0, 8); 
    renderToGrid(grid, displayList, true);
}

async function initCuratedSection() {
    const grid = document.getElementById('curated-grid');
    if (!grid) return;
    const products = await MockService.getAllProducts();
    const shuffled = [...products].sort(() => 0.5 - Math.random()).slice(0, 8);
    renderToGrid(grid, shuffled, true);
}

function renderToGrid(container, products, showViewAll = false) {
    let html = products.map(p => createProductCard(p)).join('');
    if (showViewAll) {
        html += `
            <div class="min-w-[200px] flex items-center justify-center px-8">
                <a href="catalog.html" class="group flex flex-col items-center gap-4">
                    <div class="w-16 h-16 rounded-full border-2 border-dashed border-zinc-200 flex items-center justify-center group-hover:border-red-600 group-hover:bg-red-50 transition-all">
                        <i class="fa-solid fa-arrow-right text-zinc-300 group-hover:text-red-600"></i>
                    </div>
                    <span class="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-black">View All Drops</span>
                </a>
            </div>`;
    }
    container.innerHTML = html;
    container.scrollLeft = 0;
}

function createProductCard(product) {
    const hasDiscount = product.old_price && product.old_price > product.price;
    const discountPercent = hasDiscount ? Math.round(((product.old_price - product.price) / product.old_price) * 100) : 0;
    const imgUrl = product.image_url || 'https://via.placeholder.com/400x400?text=Sneaker';

    return `
    <div class="product-card group relative flex flex-col animate-fade-in bg-white p-2 rounded-[32px] transition-all duration-500 hover:shadow-2xl hover:shadow-zinc-200/50 min-w-[280px] lg:min-w-0">
        <div class="relative aspect-square bg-zinc-100 rounded-[28px] overflow-hidden flex items-center justify-center p-6">
            <div class="absolute top-3 left-3 z-20">
                <span class="bg-white px-3 py-1.5 rounded-full shadow-sm text-[9px] font-black uppercase tracking-tighter">
                    ${hasDiscount ? `<span class="text-red-600">${discountPercent}% OFF</span>` : 'New Arrival'}
                </span>
            </div>
            <button class="absolute top-4 right-4 text-black hover:text-red-600 transition-colors z-20">
                <i class="fa-solid fa-heart text-lg"></i>
            </button>
            <img src="${imgUrl}" alt="${product.name}" class="w-[85%] object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110">
            <div class="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                <button onclick="window.location.href='product-details.html?id=${product.id}'" 
                        class="w-full bg-black text-white font-black py-3 rounded-xl uppercase italic text-[10px] tracking-widest shadow-2xl hover:bg-red-600 transition-all">
                    Buy Now
                </button>
            </div>
        </div>
        <div class="p-3 flex flex-col flex-grow">
            <p class="text-red-600 text-[9px] font-black uppercase tracking-[0.15em] mb-1">${product.brand}</p>
            <h3 class="text-black font-bold text-sm leading-tight mt-1 uppercase truncate">${product.name}</h3>
            <div class="flex items-end justify-between mt-auto pt-2">
                <div class="flex flex-col">
                    <span class="text-black font-black text-lg leading-none">$${Number(product.price).toFixed(2)}</span>
                    ${hasDiscount ? `<span class="text-zinc-400 text-[10px] font-bold line-through mt-1">$${Number(product.old_price).toFixed(2)}</span>` : ''}
                </div>
                <button onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})" class="w-12 h-12 border border-zinc-100 rounded-2xl flex items-center justify-center bg-white hover:bg-black hover:text-white transition-all shadow-sm active:scale-95">
                    <i class="fa-solid fa-cart-plus text-sm"></i>
                </button>
            </div>
        </div>
    </div>`;
}

// --- 4. CART & WISHLIST ---
function updateCartCounters() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
    document.querySelectorAll('.cart-count').forEach(c => c.innerText = count);
}

function updateWishlistCounters() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    document.querySelectorAll('.wishlist-count').forEach(c => c.innerText = wishlist.length);
}

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item.id === product.id);
    existing ? existing.quantity++ : cart.push({ ...product, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounters();
    showToast(`${product.name} added!`, "success");
}

// --- 5. SEARCH ENGINE ---
function initSearchEngine() {
    const searchOverlay = document.getElementById('search-overlay');
    const searchOpenIcons = document.querySelectorAll('.icon-search');
    const searchClose = document.getElementById('search-close');
    const searchInput = document.getElementById('search-input');
    const resultsDropdown = document.getElementById('search-results');

    searchOpenIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            searchOverlay.classList.add('active');
            setTimeout(() => searchInput.focus(), 400); 
        });
    });

    if (searchClose) {
        searchClose.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
            if(resultsDropdown) resultsDropdown.classList.remove('active');
        });
    }

    if (searchInput && resultsDropdown) {
        searchInput.addEventListener('input', async (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            if (searchTerm.length < 2) {
                resultsDropdown.classList.remove('active');
                return;
            }
            const filtered = MOCK_DB.filter(p => p.name.toLowerCase().includes(searchTerm));
            if (filtered.length > 0) {
                resultsDropdown.innerHTML = filtered.map(p => `
                    <a href="product-details.html?id=${p.id}" class="result-item">
                        <img src="${p.image_url}" alt="${p.name}">
                        <div class="result-info">
                            <span class="result-brand">${p.brand}</span>
                            <span class="result-name">${p.name}</span>
                            <span class="result-price">$${p.price}</span>
                        </div>
                    </a>`).join('');
                resultsDropdown.classList.add('active');
            } else {
                resultsDropdown.innerHTML = '<div class="result-item">No sneakers found.</div>';
            }
        });
    }
}

// --- 6. UI HELPERS & SLIDERS ---
const toggleDrawer = (isOpen) => {
    const mobileDrawer = document.getElementById('mobile-drawer');
    if (isOpen) {
        mobileDrawer.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        mobileDrawer.classList.remove('active');
        document.body.style.overflow = '';
    }
};

async function initHeroSlider() {
    const track = document.getElementById('hero-slider-track');
    if (!track) return;
    const products = await MockService.getFeaturedProducts(6);
    track.innerHTML = products.map(product => `
        <div class="hero-slide-card">
            <img src="${product.image_url}" alt="${product.name}">
            <div class="card-overlay">
                <h4>${product.name}</h4>
                <p>$${product.price}</p>
            </div>
        </div>`).join('');
}

function startReviewSlider() {
    const container = document.getElementById('reviews-container');
    const dotsContainer = document.getElementById('reviews-dots');
    if (!container || !dotsContainer) return;
    const cards = container.querySelectorAll('.review-card');
    dotsContainer.innerHTML = '';
    cards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `review-dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => {
            const width = cards[0].offsetWidth + 24;
            container.scrollTo({ left: width * index, behavior: 'smooth' });
        });
        dotsContainer.appendChild(dot);
    });
}

function initReviewsPagination() {
    const container = document.getElementById('reviews-container');
    const pagination = document.getElementById('reviews-pagination');
    if (!container || !pagination) return;
    const cards = container.querySelectorAll('.bg-white');
    if (cards.length <= 1) return;
    pagination.innerHTML = '';
    for (let i = 0; i < cards.length; i++) {
        const dot = document.createElement('div');
        dot.className = `w-2 h-2 rounded-full cursor-pointer transition-all duration-300 ${i === 0 ? 'bg-black w-3 h-3' : 'bg-zinc-300'}`;
        dot.addEventListener('click', () => {
            const width = cards[0].offsetWidth + 24;
            container.scrollTo({ left: width * i, behavior: 'smooth' });
        });
        pagination.appendChild(dot);
    }
}

const messages = ["WINTER SALE - 50% OFF!", "FREE SHIPPING OVER $150!", "JOIN THE CREW"];
let currentIndex = 0;
function rotateMessages() {
    const el = document.getElementById("announcement-text");
    if (!el) return;
    el.style.opacity = 0;
    setTimeout(() => {
        currentIndex = (currentIndex + 1) % messages.length;
        el.textContent = messages[currentIndex];
        el.style.opacity = 1;
    }, 500);
}

function setupScrollTopBtn() {
    let btn = document.getElementById('scroll-top-btn');
    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'scroll-top-btn';
        btn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
        document.body.appendChild(btn);
    }
    window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 500));
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container') || document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerText = message;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 500); }, 3000);
}
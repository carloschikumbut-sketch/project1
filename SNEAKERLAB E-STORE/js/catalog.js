/**
 * CATALOG.JS - The Brain of The Vault
 * Integrated with Pagination, Marketing Badges, and High-End UX
 */

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const itemsPerPage = 12; 

// Initialize Catalog
async function initCatalog() {
    try {
        // 1. Fetch products from your MockService
        allProducts = await MockService.getAllProducts();
        filteredProducts = [...allProducts];

        // 2. Initial Render via the Pagination Wrapper
        renderCatalog();

        // 3. Set up Event Listeners
        setupListeners();

        console.log("Vault loaded: " + allProducts.length + " sneakers found.");
    } catch (error) {
        console.error("Error opening the vault:", error);
    }
}

// WRAPPER: Handles slicing data for pages and updating UI
function renderCatalog() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedItems = filteredProducts.slice(start, end);

    renderProducts(paginatedItems);
    renderPaginationUI();
}

// Render Products to the Grid
// UPDATED: Now accepts a containerId as the second argument
// Defaults to 'catalog-grid' if no ID is provided
function renderProducts(products, containerId = 'catalog-grid') {
    const grid = document.getElementById(containerId);
    
    // Safety check: If the container doesn't exist on the current page, don't crash
    if (!grid) {
        console.warn(`Target grid "${containerId}" was not found on this page.`);
        return;
    }

    if (products.length === 0) {
        grid.innerHTML = `<div class="col-span-full py-20 text-center font-black uppercase text-zinc-400 tracking-widest text-[10px]">No items found in the vault.</div>`;
        return;
    }

    grid.innerHTML = products.map(product => {
        // Marketing Logic
        const hasDiscount = product.old_price && product.old_price > product.price;
        const discountPercent = hasDiscount ? Math.round(((product.old_price - product.price) / product.old_price) * 100) : 0;
        
        // Safety check for image property names (supports both 'image' and 'image_url')
        const productImage = product.image_url || product.image || 'images/placeholder.jpg';

        return `
        <div class="group relative flex flex-col animate-fade-in bg-white p-2 rounded-[32px] transition-all duration-500 hover:shadow-2xl hover:shadow-zinc-200/50">
            
            <div class="relative aspect-square bg-zinc-100 rounded-[28px] overflow-hidden flex items-center justify-center p-6">
                <div class="absolute top-3 left-3 z-20">
                    <span class="bg-white px-3 py-1.5 rounded-full shadow-sm text-[9px] font-black uppercase tracking-tighter">
                        ${hasDiscount ? `<span class="text-red-600">${discountPercent}% OFF</span>` : 'New Arrival'}
                    </span>
                </div>

                <img src="${productImage}" alt="${product.name}" class="w-[85%] object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110">
                
                <div class="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                    <button onclick="window.location.href='product-details.html?id=${product.id}'" 
                            class="w-full bg-black text-white font-black py-3 rounded-xl uppercase italic text-[10px] tracking-widest shadow-2xl hover:bg-red-600 transition-all">
                        View Details
                    </button>
                </div>
            </div>

            <div class="p-3 flex flex-col flex-grow">
                <p class="text-red-600 text-[9px] font-black uppercase tracking-[0.15em] mb-1">${product.brand}</p>
                
                <h3 class="text-black font-bold text-sm leading-snug uppercase overflow-hidden" 
                    style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; min-height: 2.5rem;">
                    ${product.name}
                </h3>
                
                <div class="flex items-end justify-between mt-auto pt-2">
                    <div class="flex flex-col justify-end min-h-[45px]">
                        ${hasDiscount 
                            ? `<span class="text-red-600 text-[10px] font-bold line-through mb-1">$${product.old_price}.00</span>` 
                            : `<span class="text-transparent text-[10px] font-bold mb-1 opacity-0 pointer-events-none">$0.00</span>`
                        }
                        <span class="text-black font-black text-lg md:text-xl leading-none">$${product.price}.00</span>
                    </div>
                </div>
            </div>
        </div>
        `;
    }).join('');
}
// UI: Renders Page Numbers
function renderPaginationUI() {
   const paginationContainer = document.getElementById('pagination-container') || document.querySelector('.pagination-container'); 
    if (!paginationContainer) return;

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let html = '';
    for (let i = 1; i <= totalPages; i++) {
        const activeClass = i === currentPage ? 'bg-black text-white shadow-lg' : 'bg-white text-zinc-400 border border-zinc-100 hover:text-black hover:border-black';
        html += `
            <button onclick="changePage(${i})" class="w-12 h-12 flex items-center justify-center font-black text-xs rounded-xl transition-all ${activeClass}">
                ${i}
            </button>
        `;
    }
    
    if (currentPage < totalPages) {
        html += `
            <button onclick="changePage(${currentPage + 1})" class="w-12 h-12 flex items-center justify-center bg-white text-black border border-zinc-100 font-black rounded-xl hover:bg-zinc-50 transition-all">
                <i class="fa-solid fa-chevron-right text-xs"></i>
            </button>
        `;
    }

    paginationContainer.innerHTML = html;
}

// NAV: Switch Page and Scroll Up
function changePage(page) {
    currentPage = page;
    renderCatalog();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Logic for Search and Filter Sidebar
// Logic for Search and Filter Sidebar
function setupListeners() {
    const searchInput = document.getElementById('catalog-search');
    const priceRange = document.getElementById('price-range');
    const priceDisplay = document.getElementById('price-display');
    const brandCheckboxes = document.querySelectorAll('.filter-checkbox');
    const filterBtn = document.getElementById('mobile-filter-btn');
    const filterDrawer = document.getElementById('filter-drawer');

    // 1. Define the filtering logic
    const applyFilters = () => {
        if (!searchInput || !priceRange) return; // Guard clause

        const query = searchInput.value.toLowerCase();
        const maxPrice = parseInt(priceRange.value);
        const selectedBrands = Array.from(brandCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        filteredProducts = allProducts.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query);
            const matchesPrice = p.price <= maxPrice;
            const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
            return matchesSearch && matchesPrice && matchesBrand;
        });

        currentPage = 1; 
        renderCatalog();
    };

    // 2. ONLY attach listeners if the elements exist (Safety Checks)
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }

    if (priceRange && priceDisplay) {
        priceRange.addEventListener('input', (e) => {
            priceDisplay.textContent = `$${e.target.value}`;
            applyFilters();
        });
    }

    if (brandCheckboxes.length > 0) {
        brandCheckboxes.forEach(cb => cb.addEventListener('change', applyFilters));
    }

    if (filterBtn && filterDrawer) {
        filterBtn.addEventListener('click', () => {
            filterDrawer.classList.toggle('active');
        });
    }
}
// THE IGNITION: Run the initialization when the page loads
document.addEventListener('DOMContentLoaded', initCatalog);
function renderHomeSection(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const productHTML = products.map(product => `
        <div class="flex-shrink-0 w-[75vw] md:w-[300px] group relative flex flex-col bg-white p-4 rounded-[32px] border border-zinc-100 transition-all snap-center">
             <div class="aspect-square bg-zinc-50 rounded-[24px] overflow-hidden flex items-center justify-center p-4">
                <img src="${product.image}" class="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform">
                
                <button onclick="addToCart('${product.id}')" class="absolute bottom-20 right-8 bg-black text-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xl">
                    <i class="fa-solid fa-plus"></i>
                </button>
             </div>
             <div class="mt-4">
                <p class="text-[9px] font-black text-red-600 uppercase">${product.brand}</p>
                <h3 class="text-xs font-bold uppercase truncate">${product.name}</h3>
                <p class="text-sm font-black mt-1">$${product.price}</p>
             </div>
        </div>
    `).join('');

    const viewAllCard = `...`; // your existing view all code
    container.innerHTML = productHTML + viewAllCard;
}
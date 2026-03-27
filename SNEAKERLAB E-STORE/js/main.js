/**
 * MASTER MAIN.JS - SNEAKERLAB 2026
 * Combined: Mobile Drawer, Auto-inject Cart, Size Selector, CRUD Cart, and Auth Logic.
 */

// 1. GLOBAL STATE & UNIFIED KEYS
const CART_KEY = 'sneaker-lab-cart';
const USER_KEY = 'sneaker-lab-user';
window.currentSelectedSize = null;
window.currentProduct = null;

// 2. INITIALIZATION ON PAGE LOAD
document.addEventListener('DOMContentLoaded', () => {
    // A. AUTO-INJECT CART HTML
    injectCartHTML();

    // B. MOBILE DRAWER LOGIC
    setupMobileMenu();

    // C. AUTH FORM LISTENERS
    const regForm = document.getElementById('register-form');
    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showVerificationStep();
        });
    }

    const logForm = document.getElementById('login-form');
    if (logForm) {
        logForm.addEventListener('submit', (e) => {
            e.preventDefault();
            mockLogin();
        });
    }

    // D. SYNC EVERYTHING
    updateCartBadge();
    checkUserSession();
    initHeaderCart();
    initCustomSelect();
    initNotifySystem();
});

// 3. HEADER & CART UI LOGIC
function injectCartHTML() {
    if (document.getElementById('cart-sidebar')) return;
    const cartHTML = `
        <div id="cart-overlay" class="fixed inset-0 bg-black/50 z-[999] hidden opacity-0 transition-opacity duration-400" onclick="closeCart()"></div>
        <div id="cart-sidebar" class="fixed top-0 right-0 h-full w-[90%] md:w-[500px] bg-white z-[1000] transform translate-x-full transition-transform duration-400 flex flex-col shadow-2xl">
            <div class="p-6 border-b flex justify-between items-center bg-white">
                <h2 class="text-xl font-bold uppercase tracking-widest text-black">Cart</h2>
                <button onclick="closeCart()" class="p-2 hover:rotate-90 transition-transform duration-300">
                    <i class="fa-solid fa-xmark text-2xl"></i>
                </button>
            </div>
            <div id="side-cart-items" class="flex-1 overflow-y-auto p-6 space-y-6"></div>
            <div id="side-cart-footer" class="p-6 border-t bg-white space-y-4">
                <div class="flex justify-between items-center px-2">
                    <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">Subtotal</span>
                    <span id="side-subtotal" class="text-xl font-bold tracking-tight text-black">$0.00</span>
                </div>
                <p class="text-[8px] text-center text-gray-300 font-bold uppercase tracking-widest px-4">
                    Delivery costs will be calculated later after you choose destination
                </p>
                <button onclick="window.location.href='checkout.html'" class="w-full bg-black text-white py-5 font-bold uppercase tracking-[0.3em] text-xs hover:bg-zinc-900 transition-all active:scale-[0.98]">
                    Check Out
                </button>
            </div>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', cartHTML);
}

const initHeaderCart = () => {
    const cartBtn = document.getElementById('header-cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openCart();
        });
    }
};

// 4. SIZE SELECTOR & NOTIFY SYSTEM
function initCustomSelect() {
    const display = document.getElementById('selected-size-display');
    const menu = document.getElementById('size-dropdown-menu');
    
    if (display && menu) {
        display.onclick = (e) => {
            e.stopPropagation();
            menu.classList.toggle('hidden');
        };
        window.addEventListener('click', () => menu.classList.add('hidden'));
    }
}

function initNotifySystem() {
    const missingBtn = document.getElementById('size-missing-btn');
    const submitBtn = document.getElementById('modal-email-btn');

    if (missingBtn) {
        missingBtn.onclick = (e) => {
            e.preventDefault();
            openNotifyModal();
        };
    }

    if (submitBtn) {
        submitBtn.onclick = function() {
            const sizeValue = document.getElementById('modal-size-input')?.value;
            const emailValue = document.getElementById('notify-email-input')?.value;

            if (sizeValue && emailValue?.includes('@')) {
                this.innerText = "SUCCESS ✓";
                this.style.background = "#16a34a"; 
                setTimeout(() => {
                    closeNotifyModal();
                    this.innerText = "SUBMIT REQUEST";
                    this.style.background = "#000";
                }, 2000);
            } else {
                alert("Please enter both a size and a valid email.");
            }
        };
    }
}

function selectThisSize(size) {
    const display = document.getElementById('selected-size-display');
    if (display) {
        display.innerHTML = `<span class="font-bold text-black">${size} US</span> <i class="fa-solid fa-chevron-down text-xs"></i>`;
    }
    window.currentSelectedSize = size;
}

// 5. CART CRUD OPERATIONS
function renderSideCart() {
    const container = document.getElementById('side-cart-items');
    const subtotalElement = document.getElementById('side-subtotal');
    const cartData = JSON.parse(localStorage.getItem(CART_KEY)) || [];

    if (!container) return;

    if (cartData.length === 0) {
        container.innerHTML = `<p class="text-center text-gray-400 uppercase text-[10px] tracking-widest mt-10">Your bag is empty</p>`;
        if (subtotalElement) subtotalElement.innerText = "$0.00";
        return;
    }

    let subtotal = 0;
    container.innerHTML = cartData.map((item, index) => {
        subtotal += item.price * (item.quantity || 1);
        return `
            <div class="flex gap-4 items-center">
                <div class="w-20 h-20 bg-gray-50 p-2 flex-shrink-0">
                    <img src="${item.image_url || item.image}" class="w-full h-full object-contain">
                </div>
                <div class="flex-1">
                    <div class="flex justify-between">
                        <h4 class="text-[11px] font-bold uppercase tracking-tight">${item.name}</h4>
                        <button onclick="removeFromCart(${index})" class="text-gray-300 hover:text-black">
                            <i class="fa-solid fa-trash-can text-xs"></i>
                        </button>
                    </div>
                    <p class="text-[9px] text-gray-400 font-bold uppercase mt-1">SIZE: <span class="text-black">${item.size || 'N/A'}</span></p>
                    <div class="flex justify-between items-center mt-2">
                         <div class="flex border border-gray-100 items-center bg-white">
                            <button onclick="changeQty(${index}, -1)" class="px-2 py-1 text-xs">-</button>
                            <span class="px-2 text-[10px] font-bold">${item.quantity || 1}</span>
                            <button onclick="changeQty(${index}, 1)" class="px-2 py-1 text-xs">+</button>
                         </div>
                         <p class="font-bold text-sm text-black">$${(item.price * (item.quantity || 1)).toFixed(2)}</p>
                    </div>
                </div>
            </div>`;
    }).join('');

    if (subtotalElement) subtotalElement.innerText = `$${subtotal.toFixed(2)}`;
}

window.changeQty = (index, delta) => {
    let cartData = JSON.parse(localStorage.getItem(CART_KEY));
    cartData[index].quantity = (cartData[index].quantity || 1) + delta;
    if (cartData[index].quantity < 1) return removeFromCart(index);
    localStorage.setItem(CART_KEY, JSON.stringify(cartData));
    renderSideCart();
    updateCartBadge();
};

window.removeFromCart = (index) => {
    let cartData = JSON.parse(localStorage.getItem(CART_KEY));
    cartData.splice(index, 1);
    localStorage.setItem(CART_KEY, JSON.stringify(cartData));
    renderSideCart();
    updateCartBadge();
};

// 6. AUTH & SESSION LOGIC
function showVerificationStep() {
    document.getElementById('auth-tabs')?.classList.add('hidden');
    document.getElementById('login-form')?.classList.add('hidden');
    document.getElementById('register-form')?.classList.add('hidden');
    
    const verifySection = document.getElementById('verify-section');
    if(verifySection) {
        verifySection.classList.remove('hidden');
        document.getElementById('otp-input')?.focus();
    }
}

function verifyMyCode() {
    const code = document.getElementById('otp-input').value;
    if (code === "123456") {
        mockLogin();
    } else {
        alert("Invalid code. Use 123456 for testing.");
    }
}

function mockLogin() {
    const nameInput = document.querySelector('#register-form input[type="text"]');
    const userName = nameInput ? nameInput.value : "Guest User";

    const userData = {
        isLoggedIn: true,
        name: userName,
        email: "user@example.com"
    };

    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    alert("Welcome to SneakerLab!");
    window.location.href = "profile.html";
}

function checkUserSession() {
    const user = JSON.parse(localStorage.getItem(USER_KEY));
    const btn = document.getElementById('mobile-account-btn');
    const circle = document.getElementById('user-initials-circle');

    if (user?.isLoggedIn && user.name) {
        // Calculate initials
        const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        
        // Update UI
        if (circle) {
            circle.innerHTML = initials;
            circle.classList.add('has-initials');
        }
        if (btn) {
            btn.classList.add('is-logged-in');
        }
    }
}

// 7. UTILITY & UI HELPERS
function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (!badge) return;
    const cartData = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    const totalItems = cartData.reduce((total, item) => total + (item.quantity || 1), 0);
    badge.innerText = totalItems;
    totalItems > 0 ? badge.classList.remove('hidden') : badge.classList.add('hidden');
}

function setupMobileMenu() {
    const trigger = document.getElementById('mobile-menu-trigger');
    const drawer = document.getElementById('mobile-drawer');
    const close = document.getElementById('drawer-close');

    if (trigger && drawer) {
        trigger.onclick = () => {
            drawer.classList.add('active');
            document.body.style.overflow = 'hidden';
        };
        if (close) close.onclick = () => {
            drawer.classList.remove('active');
            document.body.style.overflow = 'auto';
        };
    }
}

function openCart() {
    renderSideCart(); 
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    if (sidebar && overlay) {
        overlay.classList.remove('hidden');
        setTimeout(() => {
            sidebar.style.transform = 'translateX(0)';
            overlay.classList.add('opacity-100');
        }, 10);
        document.body.style.overflow = 'hidden';
    }
}

function closeCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    if (sidebar && overlay) {
        sidebar.style.transform = 'translateX(100%)';
        overlay.classList.remove('opacity-100');
        setTimeout(() => {
            overlay.classList.add('hidden');
            document.body.style.overflow = ''; 
        }, 400);
    }
}

function openNotifyModal() {
    const modal = document.getElementById('notify-modal');
    if (window.currentProduct && document.getElementById('modal-product-img')) {
        document.getElementById('modal-product-img').src = window.currentProduct.image_url;
    }
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeNotifyModal() {
    const modal = document.getElementById('notify-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}
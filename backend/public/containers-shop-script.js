// Container Products Database
const products = [
    {
        id: 1,
        name: '20ft HS Shipping Container with Rollup Door',
        category: '20ft Containers',
        size: '20ft',
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 240"%3E%3Crect fill="%23d4a574" width="300" height="240"/%3E%3Crect fill="%23a0a0a0" x="20" y="80" width="260" height="100"/%3E%3Ccircle fill="%23666" cx="150" cy="130" r="20"/%3E%3C/svg%3E',
        originalPrice: 2500,
        salePrice: 2250,
        discount: 10
    },
    {
        id: 2,
        name: '20ft High Cube Shipping Container',
        category: '20ft Containers',
        size: '20ft',
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 240"%3E%3Crect fill="%23c0c0c0" width="300" height="240"/%3E%3Crect fill="%23808080" x="15" y="50" width="270" height="140"/%3E%3Crect fill="%23333" x="50" y="100" width="40" height="40"/%3E%3Crect fill="%23333" x="150" y="100" width="40" height="40"/%3E%3Crect fill="%23333" x="210" y="100" width="40" height="40"/%3E%3C/svg%3E',
        originalPrice: 3500,
        salePrice: 3350,
        discount: 5
    },
    {
        id: 3,
        name: '20ft One-Trip Shipping Container',
        category: '20ft Containers',
        size: '20ft',
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 240"%3E%3Crect fill="%23e0e0e0" width="300" height="240"/%3E%3Crect fill="%239a9a9a" x="20" y="60" width="260" height="120"/%3E%3Crect fill="%23444" x="30" y="75" width="15" height="90"/%3E%3Crect fill="%23444" x="255" y="75" width="15" height="90"/%3E%3C/svg%3E',
        originalPrice: 2500,
        salePrice: 2250,
        discount: 10
    },
    {
        id: 4,
        name: '20ft x 8ft Insulated Storage Unit',
        category: '20ft Containers',
        size: '20ft',
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 240"%3E%3Crect fill="%23d0d0d0" width="300" height="240"/%3E%3Crect fill="%23b0b0b0" x="25" y="70" width="250" height="100"/%3E%3Crect fill="%23ffffff" x="40" y="85" width="30" height="30"/%3E%3Crect fill="%23ffffff" x="230" y="85" width="30" height="30"/%3E%3C/svg%3E',
        originalPrice: 5850,
        salePrice: 5850,
        discount: 0
    },
    {
        id: 5,
        name: '20ft x 8ft Shipping Containers Nationwide',
        category: '20ft Containers',
        size: '20ft',
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 240"%3E%3Crect fill="%23a0a080" width="300" height="240"/%3E%3Crect fill="%23888888" x="20" y="80" width="260" height="80"/%3E%3Ccircle fill="%23444" cx="80" cy="120" r="15"/%3E%3Ccircle fill="%23444" cx="220" cy="120" r="15"/%3E%3C/svg%3E',
        originalPrice: 2500,
        salePrice: 1999,
        discount: 20
    },
    {
        id: 6,
        name: '40-foot Standard Shipping Container',
        category: '40ft Containers',
        size: '40ft',
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 240"%3E%3Crect fill="%23d0a080" width="300" height="240"/%3E%3Crect fill="%23909090" x="15" y="75" width="270" height="90"/%3E%3Crect fill="%23333" x="35" y="95" width="20" height="50"/%3E%3Crect fill="%23333" x="245" y="95" width="20" height="50"/%3E%3C/svg%3E',
        originalPrice: 4500,
        salePrice: 4250,
        discount: 6
    },
    {
        id: 7,
        name: '40ft High Cube Shipping Container',
        category: '40ft Containers',
        size: '40ft',
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 240"%3E%3Crect fill="%23c8d0a0" width="300" height="240"/%3E%3Crect fill="%23a0a0a0" x="15" y="50" width="270" height="140"/%3E%3Ccircle fill="%23666" cx="60" cy="120" r="12"/%3E%3Ccircle fill="%23666" cx="150" cy="120" r="12"/%3E%3Ccircle fill="%23666" cx="240" cy="120" r="12"/%3E%3C/svg%3E',
        originalPrice: 4500,
        salePrice: 4100,
        discount: 9
    },
    {
        id: 8,
        name: '40ft Shipping Containers - Ready To Ship',
        category: '40ft Containers',
        size: '40ft',
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 240"%3E%3Crect fill="%23a8a880" width="300" height="240"/%3E%3Crect fill="%23808080" x="20" y="70" width="260" height="100"/%3E%3Crect fill="%23222" x="50" y="90" width="30" height="60"/%3E%3Crect fill="%23222" x="220" y="90" width="30" height="60"/%3E%3C/svg%3E',
        originalPrice: 3500,
        salePrice: 2950,
        discount: 16
    },
    {
        id: 9,
        name: 'Enduroplas THC0300Fg 3,000 Gallon Storage Tank',
        category: 'Storage Tanks',
        size: 'storage',
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 240"%3E%3Cdefs%3E%3ClinearGradient id="tankGrad" x1="0%25" y1="0%25" x2="100%25" y2="0%25"%3E%3Cstop offset="0%25" style="stop-color:%234a9eff;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%230077cc;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Cellipse cx="150" cy="100" rx="80" ry="50" fill="url(%23tankGrad)"/%3E%3Cellipse cx="150" cy="140" rx="70" ry="40" fill="%23006bb3"/%3E%3Ccircle cx="150" cy="60" r="10" fill="%23333"/%3E%3C/svg%3E',
        originalPrice: 4500,
        salePrice: 4100,
        discount: 9
    },
    {
        id: 10,
        name: 'Enduroplas THV03000GY 3,000 Gallon Flat Bottom Tank',
        category: 'Storage Tanks',
        size: 'storage',
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 240"%3E%3Crect fill="%23707070" x="60" y="40" width="180" height="140" rx="20"/%3E%3Crect fill="%23505050" x="70" y="50" width="160" height="120"/%3E%3Ccircle cx="150" cy="30" r="8" fill="%23333"/%3E%3C/svg%3E',
        originalPrice: 3000,
        salePrice: 2250,
        discount: 25
    },
    {
        id: 11,
        name: 'Enduroplas THY06250Y 6250 Gallon Flat Bottom Storage Tank',
        category: 'Storage Tanks',
        size: 'storage',
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 240"%3E%3Crect fill="%23d4af37" x="50" y="35" width="200" height="150" rx="25"/%3E%3Crect fill="%23c9a928" x="65" y="50" width="170" height="120"/%3E%3Ccircle cx="150" cy="25" r="10" fill="%23333"/%3E%3C/svg%3E',
        originalPrice: 6000,
        salePrice: 5200,
        discount: 13
    },
    {
        id: 12,
        name: 'Enduroplas TLV01550BK 1,550 Gallon Flat Bottom Tank',
        category: 'Storage Tanks',
        size: 'storage',
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 240"%3E%3Crect fill="%23303030" x="70" y="50" width="160" height="130" rx="15"/%3E%3Crect fill="%23151515" x="80" y="60" width="140" height="110"/%3E%3Ccircle cx="150" cy="35" r="8" fill="%23444"/%3E%3C/svg%3E',
        originalPrice: 2500,
        salePrice: 1950,
        discount: 22
    }
];

let cart = [];
let currentPage = 1;
let itemsPerPage = 12;
let filteredProducts = [...products];
let sortOrder = 'popular';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    setupPagination();
    loadCartFromStorage();
});

function displayProducts() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedProducts = filteredProducts.slice(start, end);

    const grid = document.getElementById('productsGrid');

    if (paginatedProducts.length === 0) {
        grid.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📦</div><p>No products found</p></div>';
        return;
    }

    grid.innerHTML = paginatedProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.discount > 0 ? `<div class="discount-badge">-${product.discount}%</div>` : ''}
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-price">
                    ${product.originalPrice !== product.salePrice ? `<span class="original-price">$${product.originalPrice.toLocaleString()}</span>` : ''}
                    <span class="sale-price">$${product.salePrice.toLocaleString()}</span>
                </div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

function setupPagination() {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const pagination = document.getElementById('pagination');

    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    let html = '';
    for (let i = 1; i <= totalPages; i++) {
        html += `<button ${i === currentPage ? 'class="active"' : ''} onclick="goToPage(${i})">${i}</button>`;
    }
    pagination.innerHTML = html;
}

function goToPage(page) {
    currentPage = page;
    displayProducts();
    setupPagination();
    window.scrollTo(0, 0);
}

function filterProducts() {
    const sizeFilter = document.getElementById('sizeFilter').value;
    filteredProducts = sizeFilter ? products.filter(p => p.size === sizeFilter) : [...products];
    sortProducts();
    currentPage = 1;
    displayProducts();
    setupPagination();
}

function sortProducts() {
    const sortBy = document.getElementById('sortBy').value;

    switch(sortBy) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.salePrice - b.salePrice);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.salePrice - a.salePrice);
            break;
        case 'newest':
            filteredProducts.reverse();
            break;
        default:
            filteredProducts.sort((a, b) => b.discount - a.discount);
    }

    currentPage = 1;
    displayProducts();
    setupPagination();
}

function changeItemsPerPage() {
    itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
    currentPage = 1;
    displayProducts();
    setupPagination();
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCartToStorage();
    updateCartUI();

    // Show feedback
    const btn = event.target;
    btn.textContent = 'Added! ✓';
    btn.classList.add('added');
    setTimeout(() => {
        btn.textContent = 'Add to Cart';
        btn.classList.remove('added');
    }, 2000);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartUI();
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');
    const cartTotal = document.getElementById('cartTotal');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.salePrice * item.quantity), 0);

    if (totalItems > 0) {
        cartCount.textContent = totalItems;
        cartCount.style.display = 'flex';
    } else {
        cartCount.style.display = 'none';
    }

    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
        cartFooter.style.display = 'none';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${(item.salePrice * item.quantity).toLocaleString()}</div>
                    <small style="color: #999;">Qty: ${item.quantity}</small>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `).join('');

        cartFooter.style.display = 'block';
        cartTotal.textContent = `$${totalPrice.toLocaleString()}`;
    }
}

function toggleCart() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('overlay');
    drawer.classList.toggle('open');
    overlay.classList.toggle('show');
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.salePrice * item.quantity), 0);
    alert(`Checkout coming soon!\n\nTotal: $${total.toLocaleString()}\n\nFor now, call +1 858-428-7703 to place an order.`);
}

function saveCartToStorage() {
    localStorage.setItem('containersCart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const saved = localStorage.getItem('containersCart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCartUI();
    }
}

// Search functionality
document.getElementById('searchInput').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    filteredProducts = query ?
        products.filter(p => p.name.toLowerCase().includes(query)) :
        [...products];
    currentPage = 1;
    displayProducts();
    setupPagination();
});

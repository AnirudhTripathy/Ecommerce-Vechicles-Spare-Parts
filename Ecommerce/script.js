// ============================================
// DATA MANAGEMENT
// ============================================

const appState = {
    currentUser: null,
    users: {
        'demo@example.com': { password: 'password123', name: 'Demo User' }
    },
    products: [
        { id: 1, name: 'Engine Oil 5L', category: 'Car Parts', price: 2499, description: 'Premium synthetic engine oil', specs: '5 Litre, 10W-40, Full Synthetic', image: '🛢️' },
        { id: 2, name: 'Air Filter', category: 'Car Parts', price: 499, description: 'High-quality air filter for engine protection', specs: 'Replaceable, Long-lasting', image: '🌬️' },
        { id: 3, name: 'Spark Plugs Set', category: 'Car Parts', price: 999, description: 'Set of 4 premium spark plugs', specs: 'NGK Quality, Set of 4', image: '⚡' },
        { id: 4, name: 'Brake Pads', category: 'Car Parts', price: 1499, description: 'High-performance brake pads', specs: 'Front/Rear Compatible', image: '🛑' },
        { id: 5, name: 'Car Battery', category: 'Car Parts', price: 4999, description: 'Powerful 100Ah car battery', specs: '100Ah, 1000A Cranking Power', image: '🔋' },
        { id: 6, name: 'Chain Oil 200ml', category: 'Bike Parts', price: 299, description: 'Premium chain oil for smooth bike operation', specs: '200ml, Heavy Duty', image: '🏍️' },
        { id: 7, name: 'Bike Air Filter', category: 'Bike Parts', price: 399, description: 'Aftermarket air filter for bikes', specs: 'Universal Fit', image: '🌬️' },
        { id: 8, name: 'Brake Pads Bike', category: 'Bike Parts', price: 799, description: 'High-friction brake pads for bikes', specs: 'Organic Pads', image: '🛑' },
        { id: 9, name: 'Spark Plugs Bike', category: 'Bike Parts', price: 599, description: 'OEM quality spark plugs for bikes', specs: 'NGK Quality', image: '⚡' },
        { id: 10, name: 'Bike Seat Cover', category: 'Bike Parts', price: 899, description: 'Comfortable and durable seat cover', specs: 'Premium Leather, UV Resistant', image: '🪑' },
        { id: 11, name: 'Car Freshener', category: 'Accessories', price: 199, description: 'Aromatic car air freshener', specs: 'Various Scents Available', image: '🌸' },
        { id: 12, name: 'Bike Lock', category: 'Accessories', price: 1299, description: 'Heavy-duty motorcycle lock', specs: 'Anti-Theft, 1m Cable', image: '🔐' },
        { id: 13, name: 'Cleaning Kit', category: 'Accessories', price: 899, description: 'Complete car/bike cleaning kit', specs: '5 Piece Set, All Brushes Included', image: '🧹' },
        { id: 14, name: 'LED Light Kit', category: 'Accessories', price: 1899, description: 'Waterproof LED light strips', specs: 'RGB, 5M Long, USB Powered', image: '💡' },
        { id: 15, name: 'Phone Mount', category: 'Accessories', price: 599, description: 'Universal 360° phone mount', specs: 'Dashboard/Windshield Mount', image: '📱' }
    ],
    cart: [],
    currentFilter: 'All Products'
};

// ============================================
// DOM ELEMENTS
// ============================================

const authModal = document.getElementById('authModal');
const productModal = document.getElementById('productModal');
const checkoutModal = document.getElementById('checkoutModal');
const confirmationModal = document.getElementById('confirmationModal');
const cartSidebar = document.getElementById('cartSidebar');
const overlay = document.getElementById('cartOverlay');

const authForm = document.getElementById('authForm');
const authEmail = document.getElementById('authEmail');
const authPassword = document.getElementById('authPassword');
const authName = document.getElementById('authName');
const authTitle = document.getElementById('authTitle');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const toggleAuthBtn = document.getElementById('toggleAuthBtn');
const toggleText = document.getElementById('toggleText');
const nameGroup = document.getElementById('nameGroup');
const authError = document.getElementById('authError');

const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const subtotal = document.getElementById('subtotal');
const tax = document.getElementById('tax');
const total = document.getElementById('total');
const checkoutBtn = document.getElementById('checkoutBtn');

const userBtn = document.getElementById('userBtn');
const userDropdown = document.getElementById('userDropdown');
const userName = document.getElementById('userName');
const logoutBtn = document.getElementById('logoutBtn');

const productsGrid = document.getElementById('productsGrid');
const categoryBtns = document.querySelectorAll('.category-btn');

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

const productQuantity = document.getElementById('productQuantity');
const decreaseQty = document.getElementById('decreaseQty');
const increaseQty = document.getElementById('increaseQty');
const addToCartBtn = document.getElementById('addToCartBtn');

const checkoutForm = document.getElementById('checkoutForm');
const checkoutSummary = document.getElementById('checkoutSummary');
const continueShoppingBtn = document.getElementById('continueShoppingBtn');

let isLoginMode = true;

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    showAuthModal();
    setupEventListeners();
});

function setupEventListeners() {
    // Auth events
    authForm.addEventListener('submit', handleAuth);
    toggleAuthBtn.addEventListener('click', toggleAuthMode);
    document.getElementById('closeAuthModal').addEventListener('click', closeAuthModal);

    // Cart events
    cartBtn.addEventListener('click', openCart);
    closeCart.addEventListener('click', closeCartSidebar);
    overlay.addEventListener('click', closeCartSidebar);
    checkoutBtn.addEventListener('click', openCheckout);

    // User menu
    userBtn.addEventListener('click', toggleUserDropdown);
    logoutBtn.addEventListener('click', handleLogout);

    // Category filters
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => filterByCategory(btn.dataset.category));
    });

    // Search
    searchBtn.addEventListener('click', searchProducts);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchProducts();
    });

    // Checkout
    checkoutForm.addEventListener('submit', handleCheckout);
    document.getElementById('closeCheckoutModal').addEventListener('click', closeCheckoutModal);

    // Product modal
    document.getElementById('closeProductModal').addEventListener('click', closeProductModal);
    decreaseQty.addEventListener('click', () => changeQuantity(-1));
    increaseQty.addEventListener('click', () => changeQuantity(1));
    addToCartBtn.addEventListener('click', handleAddToCart);

    // Confirmation
    continueShoppingBtn.addEventListener('click', () => {
        confirmationModal.classList.remove('active');
        renderProducts();
    });
}

// ============================================
// AUTHENTICATION
// ============================================

function showAuthModal() {
    authModal.classList.add('active');
}

function closeAuthModal() {
    if (appState.currentUser) {
        authModal.classList.remove('active');
    }
}

function toggleAuthMode(e) {
    e.preventDefault();
    isLoginMode = !isLoginMode;

    if (isLoginMode) {
        authTitle.textContent = 'Login';
        authSubmitBtn.textContent = 'Login';
        nameGroup.style.display = 'none';
        toggleText.textContent = "Don't have an account?";
        toggleAuthBtn.textContent = 'Sign Up';
        authName.value = '';
    } else {
        authTitle.textContent = 'Sign Up';
        authSubmitBtn.textContent = 'Sign Up';
        nameGroup.style.display = 'block';
        toggleText.textContent = 'Already have an account?';
        toggleAuthBtn.textContent = 'Login';
    }
    authError.classList.remove('show');
}

function handleAuth(e) {
    e.preventDefault();
    const email = authEmail.value.trim();
    const password = authPassword.value.trim();
    const name = authName.value.trim();

    authError.classList.remove('show');

    if (!email || !password) {
        showAuthError('Please fill in all fields');
        return;
    }

    if (!isValidEmail(email)) {
        showAuthError('Please enter a valid email');
        return;
    }

    if (password.length < 6) {
        showAuthError('Password must be at least 6 characters');
        return;
    }

    if (isLoginMode) {
        // Login
        if (appState.users[email] && appState.users[email].password === password) {
            appState.currentUser = { email, name: appState.users[email].name };
            updateUserUI();
            authForm.reset();
            authModal.classList.remove('active');
            renderProducts();
        } else {
            showAuthError('Invalid email or password');
        }
    } else {
        // Signup
        if (appState.users[email]) {
            showAuthError('Email already registered');
            return;
        }

        if (!name) {
            showAuthError('Please enter your name');
            return;
        }

        appState.users[email] = { password, name };
        appState.currentUser = { email, name };
        updateUserUI();
        authForm.reset();
        authModal.classList.remove('active');
        renderProducts();
    }
}

function showAuthError(message) {
    authError.textContent = message;
    authError.classList.add('show');
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ============================================
// USER INTERFACE
// ============================================

function updateUserUI() {
    userName.textContent = `Hello, ${appState.currentUser.name}!`;
}

function toggleUserDropdown() {
    userDropdown.classList.toggle('active');
}

function handleLogout() {
    appState.currentUser = null;
    appState.cart = [];
    appState.currentFilter = 'All Products';
    isLoginMode = true;
    authForm.reset();
    authTitle.textContent = 'Login';
    authSubmitBtn.textContent = 'Login';
    nameGroup.style.display = 'none';
    toggleText.textContent = "Don't have an account?";
    toggleAuthBtn.textContent = 'Sign Up';
    userDropdown.classList.remove('active');
    closeCartSidebar();
    showAuthModal();
}

// ============================================
// PRODUCT DISPLAY
// ============================================

function renderProducts(productsToShow = appState.products) {
    productsGrid.innerHTML = '';

    if (productsToShow.length === 0) {
        productsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No products found</p>';
        return;
    }

    productsToShow.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">${product.image}</div>
            <div class="product-body">
                <p class="product-category">${product.category}</p>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">₹${product.price}</div>
                <div class="product-actions">
                    <button class="btn-view" onclick="openProductModal(${product.id})">View Details</button>
                    <button class="btn-add-cart" onclick="quickAddToCart(${product.id})">Add to Cart</button>
                </div>
            </div>
        `;
        productsGrid.appendChild(card);
    });
}

function filterByCategory(category) {
    appState.currentFilter = category;

    categoryBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (category === 'All Products') {
        renderProducts(appState.products);
    } else {
        const filtered = appState.products.filter(p => p.category === category);
        renderProducts(filtered);
    }
}

function searchProducts() {
    const query = searchInput.value.trim().toLowerCase();

    if (!query) {
        renderProducts(appState.products);
        return;
    }

    const filtered = appState.products.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );

    renderProducts(filtered);
}

// ============================================
// PRODUCT MODAL
// ============================================

let selectedProduct = null;

function openProductModal(productId) {
    selectedProduct = appState.products.find(p => p.id === productId);

    if (!selectedProduct) return;

    document.getElementById('productName').textContent = selectedProduct.name;
    document.getElementById('productCategory').textContent = selectedProduct.category;
    document.getElementById('productDescription').textContent = selectedProduct.description;
    document.getElementById('productSpecs').textContent = selectedProduct.specs;
    document.getElementById('productPrice').textContent = `₹${selectedProduct.price}`;
    document.getElementById('productImageLarge').textContent = selectedProduct.image;
    document.getElementById('productQuantity').value = 1;

    productModal.classList.add('active');
}

function closeProductModal() {
    productModal.classList.remove('active');
    selectedProduct = null;
}

function changeQuantity(delta) {
    const input = document.getElementById('productQuantity');
    let value = parseInt(input.value) + delta;
    if (value < 1) value = 1;
    input.value = value;
}

function handleAddToCart() {
    if (!selectedProduct) return;

    const quantity = parseInt(document.getElementById('productQuantity').value);
    addToCart(selectedProduct, quantity);
    closeProductModal();
}

function quickAddToCart(productId) {
    const product = appState.products.find(p => p.id === productId);
    if (product) {
        addToCart(product, 1);
    }
}

// ============================================
// SHOPPING CART
// ============================================

function addToCart(product, quantity) {
    const existingItem = appState.cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        appState.cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity
        });
    }

    updateCartUI();
}

function removeFromCart(productId) {
    appState.cart = appState.cart.filter(item => item.id !== productId);
    updateCartUI();
}

function updateItemQuantity(productId, quantity) {
    const item = appState.cart.find(i => i.id === productId);
    if (item) {
        item.quantity = Math.max(1, quantity);
        updateCartUI();
    }
}

function updateCartUI() {
    cartCount.textContent = appState.cart.length;

    if (appState.cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    } else {
        cartItems.innerHTML = appState.cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₹${item.price} x ${item.quantity}</div>
                    <div class="cart-item-quantity">
                        <button onclick="updateItemQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <input type="number" value="${item.quantity}" min="1" onchange="updateItemQuantity(${item.id}, this.value)">
                        <button onclick="updateItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `).join('');
    }

    calculateCartTotals();
}

function calculateCartTotals() {
    const subtotalAmount = appState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxAmount = Math.round(subtotalAmount * 0.1);
    const totalAmount = subtotalAmount + taxAmount;

    subtotal.textContent = `₹${subtotalAmount}`;
    tax.textContent = `₹${taxAmount}`;
    total.textContent = `₹${totalAmount}`;
}

function openCart() {
    cartSidebar.classList.add('active');
    overlay.classList.add('active');
}

function closeCartSidebar() {
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
}

// ============================================
// CHECKOUT
// ============================================

function openCheckout() {
    if (appState.cart.length === 0) {
        alert('Your cart is empty');
        return;
    }

    renderCheckoutSummary();
    checkoutModal.classList.add('active');
    closeCartSidebar();
}

function closeCheckoutModal() {
    checkoutModal.classList.remove('active');
}

function renderCheckoutSummary() {
    const subtotalAmount = appState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxAmount = Math.round(subtotalAmount * 0.1);
    const totalAmount = subtotalAmount + taxAmount;

    checkoutSummary.innerHTML = `
        <div>
            ${appState.cart.map(item => `
                <div class="checkout-item">
                    <span>${item.name} x ${item.quantity}</span>
                    <span>₹${item.price * item.quantity}</span>
                </div>
            `).join('')}
            <div class="checkout-totals">
                <div class="checkout-total-row">
                    <span>Subtotal:</span>
                    <span>₹${subtotalAmount}</span>
                </div>
                <div class="checkout-total-row">
                    <span>Tax (10%):</span>
                    <span>₹${taxAmount}</span>
                </div>
                <div class="checkout-total-row grand-total">
                    <span>Total:</span>
                    <span>₹${totalAmount}</span>
                </div>
            </div>
        </div>
    `;
}

function handleCheckout(e) {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const zipcode = document.getElementById('zipcode').value.trim();

    const checkoutError = document.getElementById('checkoutError');
    checkoutError.classList.remove('show');

    if (!fullName || !email || !phone || !address || !city || !zipcode) {
        checkoutError.textContent = 'Please fill in all fields';
        checkoutError.classList.add('show');
        return;
    }

    if (!isValidEmail(email)) {
        checkoutError.textContent = 'Please enter a valid email';
        checkoutError.classList.add('show');
        return;
    }

    if (!/^[0-9]{10}$/.test(phone.replace(/[\D]/g, ''))) {
        checkoutError.textContent = 'Please enter a valid phone number';
        checkoutError.classList.add('show');
        return;
    }

    // Generate order ID
    const orderId = 'ORD' + Date.now();
    const totalAmount = appState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.1;

    // Show confirmation
    document.getElementById('orderId').textContent = orderId;
    document.getElementById('orderTotal').textContent = `₹${Math.round(totalAmount)}`;

    closeCheckoutModal();
    confirmationModal.classList.add('active');

    // Clear cart and form
    appState.cart = [];
    checkoutForm.reset();
    updateCartUI();
}
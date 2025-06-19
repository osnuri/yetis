/*
=====================================
YETIS KURYE - CLEAN JAVASCRIPT
=====================================
*/

// ===== GLOBAL VARIABLES =====
let cart = [];
let cartCount = 0;
let cartTotal = 0;
let currentPage = 'home';
let orderHistory = [
    {
        id: 12345,
        status: 'completed',
        items: '2x Coca-Cola, 1x Ekmek',
        date: '15 Haziran 2025, 14:30',
        total: 29.50
    },
    {
        id: 12346,
        status: 'in-progress',
        items: '1x Pizza, 1x Su',
        date: '15 Haziran 2025, 15:45',
        total: 88.50
    }
];

function loadOrderHistoryFromStorage() {
    const stored = localStorage.getItem('yetisCourier_orders');
    if (stored) {
        try {
            orderHistory = JSON.parse(stored);
        } catch (e) {
            orderHistory = [];
        }
    }
}

function saveOrderHistoryToStorage() {
    localStorage.setItem('yetisCourier_orders', JSON.stringify(orderHistory));
}

// Tema değiştirildiğinde SVG renkleri otomatik olarak güncellenecek
function initializeThemeToggle() {
    const toggleBtn = document.getElementById('themeToggle');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', function () {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        
        // SVG'lerin renklerini güncelle
        updateSVGColors();
    });

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }
    
    // Sayfa yüklendiğinde SVG renklerini güncelle
    updateSVGColors();
}

function updateSVGColors() {
    // Tüm SVG'ler CSS değişkenleri kullandığı için otomatik olarak güncellenecek
    // Ekstra bir işlem gerekmiyor
}

const DEBUG = false;
function debugLog(...args){ if (DEBUG) console.log(...args); }


function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('cartCount', cartCount.toString());
    localStorage.setItem('cartTotal', cartTotal.toString());
}

function loadCartFromStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
    }
    const storedCount = localStorage.getItem('cartCount');
    if (storedCount) cartCount = parseInt(storedCount, 10);
    const storedTotal = localStorage.getItem('cartTotal');
    if (storedTotal) cartTotal = parseFloat(storedTotal);
    updateCartDisplay();
}

// ===== NAVIGATION SYSTEM =====

/**
 * Sayfa navigasyonunu yönetir
 * @param {string} pageId - Gösterilecek sayfa ID'si
 */
function navigateToPage(pageId) {
    // Tüm sayfaları gizle
    document.querySelectorAll('.page-section').forEach(page => {
        page.classList.remove('active');
    });
    
    // Seçili sayfayı göster
    const targetPage = document.getElementById(pageId + 'Page');
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageId;
        
        // Sayfa yüklendiğinde özel işlemler
        handlePageLoad(pageId);
    }
}

/**
 * Sayfa yüklendiğinde yapılacak özel işlemler
 * @param {string} pageId - Yüklenen sayfa ID'si
 */
function handlePageLoad(pageId) {
    switch(pageId) {
        case 'search':
            const searchInput = document.getElementById('advancedSearchInput');
            if (searchInput) searchInput.focus();
            break;
        case 'orders':
            loadOrderHistory();
            break;
        case 'notifications':
            markNotificationsAsRead();
            break;
    }
}

/**
 * Navigasyon menüsünü başlatır
 */
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const navPages = {
        0: 'home',        // Ana Sayfa
        1: 'categories',  // Kategoriler
        2: 'search',      // Ara
        3: 'orders',      // Siparişlerim
        4: 'notifications', // Bildirimler
        5: 'profile'      // Profil
    };
    
    navItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // Aktif navigasyonları temizle
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Seçili navigasyonu aktif yap
            this.classList.add('active');
            
            // Sayfa navigasyonu
            const pageId = navPages[index];
            if (pageId) {
                navigateToPage(pageId);
            }
            
            // Animasyon efekti
            this.style.transform = 'translateX(16px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateX(12px)';
            }, 150);
            
            debugLog('Navigation:', this.textContent.trim());
        });
    });
}

// ===== USER MENU SYSTEM =====

/**
 * Kullanıcı menüsünü başlatır
 */
function initializeUserMenu() {
    const userAvatar = document.getElementById('userAvatar');
    const userMenu = document.getElementById('userMenu');
    
    if (userAvatar && userMenu) {
        userAvatar.addEventListener('click', function(e) {
            e.stopPropagation();
            userMenu.classList.toggle('active');
        });
        
        // Dışarı tıklanınca menüyü kapat
        document.addEventListener('click', function(e) {
            if (!userMenu.contains(e.target) && !userAvatar.contains(e.target)) {
                userMenu.classList.remove('active');
            }
        });
    }
}

/**
 * Kullanıcı menü fonksiyonları
 */
function editProfile() {
    alert('👤 Profil Düzenleme\n\nProfil düzenleme sayfası açılacak...');
    closeUserMenu();
}

function viewAddresses() {
    alert('📍 Adreslerim\n\nKayıtlı adresleriniz:\n• Ev: Atatürk Cad. No:123, Aksaray\n• İş: Cumhuriyet Mah. İstiklal Sok., Aksaray');
    closeUserMenu();
}

function paymentMethods() {
    alert('💳 Ödeme Yöntemleri\n\nKayıtlı kartlarınız:\n• **** **** **** 1234 (Visa)\n• Nakit ödeme\n• Havale/EFT');
    closeUserMenu();
}

function settings() {
    alert('⚙️ Ayarlar\n\n• Bildirim ayarları\n• Gizlilik tercihleri\n• Dil seçenekleri\n• Tema ayarları');
    closeUserMenu();
}

function logout() {
    if (confirm('🚪 Çıkış yapmak istediğinizden emin misiniz?')) {
        alert('👋 Güle güle!\n\nBaşarıyla çıkış yapıldı.');
        // Sepeti temizle
    cart = [];
    cartCount = 0;
    cartTotal = 0;
    updateCartDisplay();
    localStorage.removeItem('cart');
    localStorage.removeItem('cartCount');
    localStorage.removeItem('cartTotal');
}
    closeUserMenu();
}

function closeUserMenu() {
    const userMenu = document.getElementById('userMenu');
    if (userMenu) {
        userMenu.classList.remove('active');
    }
}

// ===== CART FUNCTIONS =====

/**
 * Sepete ürün ekler
 * @param {string} productName - Ürün adı
 * @param {string} productSize - Ürün boyutu/miktarı
 * @param {number} price - Ürün fiyatı
 */
function addToCart(productName, productSize, price) {
    // LocalStorage'dan sepeti yükle
    let savedCart = localStorage.getItem('yetisCourier_cart');
    let cartItems = savedCart ? JSON.parse(savedCart) : [];
    
    const existingItem = cartItems.find(item => 
        item.name === productName && item.size === productSize
    );
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({
            name: productName,
            size: productSize,
            price: price,
            quantity: 1
        });
    }
    
    // LocalStorage'a kaydet
    localStorage.setItem('yetisCourier_cart', JSON.stringify(cartItems));
    
    // Lokal sepet verilerini güncelle
    cart = cartItems;
    cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    updateCartDisplay();
    
    // Animasyonları göster
    showSuccessAnimation();
    showAddedAnimation();
}

/**
 * Sepet sayacını günceller
 */
function updateCartDisplay() {
    const cartCounter = document.getElementById('cartCounter');
    const badge = document.getElementById('cartCounterBadge');
    if (cartCounter && badge) {
        badge.textContent = cartCount;

        if (cartCount > 0) {
            cartCounter.classList.add('visible');
            badge.classList.add('visible');
        } else {
            cartCounter.classList.remove('visible');
            badge.classList.remove('visible');
        }
    }
}

/**
 * Sepete ekleme animasyonu gösterir
 */
function showAddedAnimation() {
    const cartCounter = document.getElementById('cartCounter');
    if (cartCounter) {
        cartCounter.style.transform = 'scale(1.3)';
        cartCounter.style.boxShadow = '0 12px 40px rgba(255, 107, 53, 0.6)';
        
        setTimeout(() => {
            cartCounter.style.transform = 'scale(1)';
            cartCounter.style.boxShadow = '0 8px 30px rgba(255, 107, 53, 0.4)';
        }, 300);
    }
}

/**
 * Başarı animasyonu gösterir
 */
function showSuccessAnimation() {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-animation';
    successDiv.innerHTML = '✓';
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 600);
}

/**
 * Sepet sayfasına gider
 */
function goToCart() {
    window.location.href = 'cart.html';
}

/**
 * Sepeti gösterir ve sipariş onayı alır
 */
function showCart() {
    if (cart.length === 0) {
        alert('Sepetiniz boş! 🛒\n\nÜrün eklemek için kategorilerden seçim yapabilirsiniz.');
        return;
    }
    
    let cartContent = '🛒 SEPETİNİZ\n\n';
    
    cart.forEach(item => {
        const itemTotal = (item.price * item.quantity).toFixed(2);
        cartContent += `${item.name} (${item.size})\n`;
        cartContent += `   ${item.quantity} x ₺${item.price.toFixed(2)} = ₺${itemTotal}\n\n`;
    });
    
    cartContent += `💰 TOPLAM: ₺${cartTotal.toFixed(2)}\n`;
    cartContent += `📦 ${cartCount} ürün\n`;
    cartContent += `🚚 Tahmini teslimat: 8-12 dakika`;
    
    if (confirm(cartContent + '\n\nSiparişi tamamlamak istiyor musunuz?')) {
        completeOrder();
    }
}

/**
 * Siparişi tamamlar ve sepeti sıfırlar
 */
function completeOrder() {
    // Yeni sipariş oluştur
    const newOrder = {
        id: Math.floor(Math.random() * 90000) + 10000,
        status: 'in-progress',
        items: cart.map(item => `${item.quantity}x ${item.name}`).join(', '),
        date: new Date().toLocaleString('tr-TR'),
        total: cartTotal
    };
    
    // Sipariş geçmişine ekle
    orderHistory.unshift(newOrder);
    saveOrderHistoryToStorage();
    
    alert('🎉 Siparişiniz alındı!\n\nSipariş No: #' + newOrder.id + '\nKuryemiz yolda, 8 dakika içinde kapınızda olacak!');
    
    // Sepeti sıfırla
    cart = [];
    cartCount = 0;
    cartTotal = 0;
    updateCartDisplay();
    localStorage.removeItem('cart');
    localStorage.removeItem('cartCount');
    localStorage.removeItem('cartTotal');
}

function renderCartPage() {
    const listEl = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotalDisplay');
    if (!listEl || !totalEl) return;

    listEl.innerHTML = '';
    if (cart.length === 0) {
        listEl.innerHTML = '<li>Sepetiniz boş.</li>';
        totalEl.textContent = '₺0.00';
        return;
    }

    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.quantity} x ${item.name} (${item.size}) - ₺${(item.price * item.quantity).toFixed(2)}`;
        listEl.appendChild(li);
    });

    totalEl.textContent = `₺${cartTotal.toFixed(2)}`;
}

function initializeCartPage() {
    loadCartFromStorage();
    renderCartPage();
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', showCart);
    }
}

// ===== CATEGORY SYSTEM =====

/**
 * Kategori seçimini yönetir
 */
function initializeCategories() {
    // Ana sayfa kategorileri
    document.querySelectorAll('#homePage .category-item').forEach(item => {
        item.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            if (category) {
                filterProductsByCategory(category);
                updateActiveCategory(this);
            }
            addRippleEffect(this);
        });
    });
    
    // Kategori sayfası öğeleri
    document.querySelectorAll('.category-large-item').forEach(item => {
        item.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            if (category) {
                // Ana sayfaya dön ve kategoriyi filtrele
                navigateToPage('home');
                setTimeout(() => {
                    filterProductsByCategory(category);
                    updateHomeCategoryActive(category);
                }, 300);
            }
        });
    });
}

/**
 * Ürünleri kategoriye göre filtreler
 * @param {string} category - Filtrelenecek kategori
 */
function filterProductsByCategory(category) {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        if (category === 'all' || card.classList.contains(category)) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.5s ease';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Başlığı güncelle
    const sectionTitle = document.querySelector('#homePage .section-title');
    if (sectionTitle) {
        const categoryNames = {
            'market': '🛒 Market Ürünleri',
            'food': '🍔 Yiyecekler',
            'water': '💧 İçecekler',
            'pharmacy': '💊 İlaç & Sağlık',
            'documents': '📄 Belgeler',
            'gifts': '🎁 Hediyeler',
            'all': '🔥 Popüler Ürünler'
        };
        
        sectionTitle.textContent = categoryNames[category] || '🔥 Popüler Ürünler';
    }
}

/**
 * Aktif kategoriyi günceller
 * @param {Element} selectedItem - Seçilen kategori öğesi
 */
function updateActiveCategory(selectedItem) {
    document.querySelectorAll('#homePage .category-item').forEach(item => {
        item.classList.remove('active');
    });
    selectedItem.classList.add('active');
}

/**
 * Ana sayfa kategori aktifliğini günceller
 * @param {string} category - Kategori adı
 */
function updateHomeCategoryActive(category) {
    const categoryItem = document.querySelector(`#homePage .category-item[data-category="${category}"]`);
    if (categoryItem) {
        updateActiveCategory(categoryItem);
    }
}

/**
 * Ripple efekti ekler
 * @param {Element} element - Efekt eklenecek element
 */
function addRippleEffect(element) {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 107, 53, 0.3);
        width: 100px;
        height: 100px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    `;
    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

// ===== SEARCH SYSTEM =====

/**
 * Arama fonksiyonlarını başlatır
 */
function initializeSearch() {
    // Ana sayfa arama
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.search-btn');
    
    // Gelişmiş arama sayfası
    const advancedSearchInput = document.getElementById('advancedSearchInput');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Ana sayfa arama olayları
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performHomeSearch();
            }
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performHomeSearch);
    }
    
    // Gelişmiş arama olayları
    if (advancedSearchInput) {
        advancedSearchInput.addEventListener('input', performAdvancedSearch);
        advancedSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performAdvancedSearch();
            }
        });
    }
    
    // Filtre butonları
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            performAdvancedSearch();
        });
    });
}

/**
 * Ana sayfa araması
 */
function performHomeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    const productCards = document.querySelectorAll('#homePage .product-card');
    let foundCount = 0;
    
    productCards.forEach(card => {
        const productNameEl = card.querySelector('.product-name');
        if (productNameEl) {
            const productName = productNameEl.textContent.toLowerCase();
            
            if (productName.includes(searchTerm) || searchTerm === '') {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease';
                foundCount++;
            } else {
                card.style.display = 'none';
            }
        }
    });
    
    if (searchTerm && foundCount === 0) {
        alert('😕 Aradığınız ürün bulunamadı.\n\nFarklı bir arama terimi deneyin.');
    }
}

/**
 * Gelişmiş arama
 */
function performAdvancedSearch() {
    const advancedSearchInput = document.getElementById('advancedSearchInput');
    const activeFilterBtn = document.querySelector('.filter-btn.active');
    const searchResults = document.getElementById('searchResults');
    
    if (!advancedSearchInput || !searchResults) return;
    
    const searchTerm = advancedSearchInput.value.toLowerCase();
    const activeFilter = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';
    
    if (!searchTerm.trim()) {
        searchResults.innerHTML = '<div class="no-results">🔍 Arama yapmak için yukarıdaki kutucuğa yazın</div>';
        return;
    }
    
    // Tüm ürünleri topla
    const allProducts = Array.from(document.querySelectorAll('.product-card')).map(card => {
        const nameEl = card.querySelector('.product-name');
        const sizeEl = card.querySelector('.product-size');
        const priceEl = card.querySelector('.product-price');
        const imageEl = card.querySelector('.product-image');
        
        return {
            name: nameEl ? nameEl.textContent : '',
            size: sizeEl ? sizeEl.textContent : '',
            price: priceEl ? priceEl.textContent : '',
            image: imageEl ? imageEl.textContent : '📦',
            category: Array.from(card.classList).find(cls => cls !== 'product-card') || 'market',
            onclick: card.getAttribute('onclick') || ''
        };
    });
    
    // Filtreleme
    let filteredProducts = allProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        const matchesFilter = activeFilter === 'all' || product.category === activeFilter;
        return matchesSearch && matchesFilter;
    });
    
    // Sonuçları göster
    if (filteredProducts.length === 0) {
        searchResults.innerHTML = '<div class="no-results">😕 Aradığınız kriterlere uygun ürün bulunamadı</div>';
    } else {
        const resultsHTML = filteredProducts.map(product => `
            <div class="product-card" onclick="${product.onclick}">
                <div class="product-image">${product.image}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-size">${product.size}</div>
                <div class="product-price">${product.price}</div>
                <button class="add-btn">Sepete Ekle</button>
            </div>
        `).join('');
        
        searchResults.innerHTML = `<div class="products-grid">${resultsHTML}</div>`;
    }
}

// ===== ORDER SYSTEM =====

/**
 * Sipariş geçmişini yükler
 */
function loadOrderHistory() {
    const ordersContainer = document.getElementById('ordersContainer');
    if (!ordersContainer) return;
    
    if (orderHistory.length === 0) {
        ordersContainer.innerHTML = '<div class="no-results">📋 Henüz siparişiniz bulunmamaktadır</div>';
        return;
    }
    
    const ordersHTML = orderHistory.map(order => `
        <div class="order-card ${order.status}">
            <div class="order-header">
                <div class="order-id">#${order.id}</div>
                <div class="order-status ${order.status}">
                    ${order.status === 'completed' ? '✅ Teslim Edildi' : '🚚 Yolda'}
                </div>
            </div>
            <div class="order-items">
                <div class="order-item">${order.items}</div>
            </div>
            <div class="order-footer">
                <div class="order-date">${order.date}</div>
                <div class="order-total">₺${order.total.toFixed(2)}</div>
            </div>
        </div>
    `).join('');
    
    ordersContainer.innerHTML = ordersHTML;
}

// ===== NOTIFICATION SYSTEM =====

/**
 * Bildirimleri okundu olarak işaretle
 */
function markNotificationsAsRead() {
    setTimeout(() => {
        document.querySelectorAll('.notification-item.unread').forEach(notification => {
            notification.classList.remove('unread');
        });
    }, 1000);
}

// ===== LOCATION SYSTEM =====

/**
 * Lokasyon değiştirme fonksiyonunu başlatır
 */
function initializeLocationChanger() {
    const backBtn = document.querySelector('.back-btn');
    
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            const locations = ['Aksaray', 'Ortaköy', 'Eskil', 'Ağaçören'];
            const locationEl = document.querySelector('.location');
            if (!locationEl) return;
            
            const currentLocation = locationEl.textContent;
            const currentIndex = locations.indexOf(currentLocation);
            const nextIndex = (currentIndex + 1) % locations.length;
            
            // Animasyon efekti
            locationEl.style.transform = 'translateX(-20px)';
            locationEl.style.opacity = '0.5';
            
            setTimeout(() => {
                locationEl.textContent = locations[nextIndex];
                locationEl.style.transform = 'translateX(0)';
                locationEl.style.opacity = '1';
            }, 200);
        });
    }
}

// ===== LOADING FUNCTIONS =====

/**
 * Yükleme ekranını gizler
 */
function hideLoadingScreen() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    if (loadingOverlay) {
        setTimeout(() => {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 500);
        }, 1500);
    }
}

// ===== UTILITY FUNCTIONS =====

/**
 * Ripple animasyon stilini ekler
 */
function addRippleStyles() {
    if (!document.getElementById('ripple-styles')) {
        const rippleStyle = document.createElement('style');
        rippleStyle.id = 'ripple-styles';
        rippleStyle.textContent = `
            @keyframes ripple {
                to {
                    transform: translate(-50%, -50%) scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(rippleStyle);
    }
}

/**
 * Konsol mesajları
 */
function logAppInfo() {
    debugLog('🚀 Yetis Kurye uygulaması hazır!');
    debugLog('📱 Versiyon: 1.0.0');
    debugLog('🛠️ Temel özellikler aktif');
}

// ===== INITIALIZATION =====

/**
 * Uygulamayı başlatır
 */
function initializeApp() {
    initializeThemeToggle();
    loadCartFromStorage();
    loadOrderHistoryFromStorage();
    const cartBtn = document.getElementById('cartButton');
    if (cartBtn) {
        cartBtn.addEventListener('click', function () {
            window.location.href = 'cart.html';
        });
    }
    // Tüm sistemleri başlat
    initializeNavigation();
    initializeUserMenu();
    initializeCategories();
    initializeSearch();
    initializeLocationChanger();
    
    // Stil ve animasyonları ekle
    addRippleStyles();
    
    // Sepet görünümünü güncelle
    updateCartDisplay();
    
    // Yükleme ekranını gizle
    hideLoadingScreen();
    
    // Konsol mesajları
    logAppInfo();

    let startPage = 'home';
    if (window.location.hash === '#orders') {
        startPage = 'orders';
    }

    navigateToPage(startPage);
    const navItems = document.querySelectorAll('.nav-item');
    if (navItems.length) {
        navItems.forEach(nav => nav.classList.remove('active'));
        const index = startPage === 'orders' ? 3 : 0;
        if (navItems[index]) navItems[index].classList.add('active');
    }
}

// ===== EVENT LISTENERS =====

/**
 * DOM yüklendiğinde uygulamayı başlat
 */
document.addEventListener('DOMContentLoaded', initializeApp);

/**
 * Sayfa yenilenmeden önce uyarı göster (sepette ürün varsa)
 */
window.addEventListener('beforeunload', function(e) {
    if (cart.length > 0) {
        e.preventDefault();
        e.returnValue = 'Sepetinizde ürünler var. Sayfayı kapatmak istediğinizden emin misiniz?';
    }
});

/**
 * Klavye kısayolları
 */
document.addEventListener('keydown', function(e) {
    // Ctrl + K ile arama sayfasına git
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        navigateToPage('search');
        setTimeout(() => {
            const searchInput = document.getElementById('advancedSearchInput');
            if (searchInput) searchInput.focus();
        }, 100);
    }
    
    // ESC ile arama kutusunu temizle
    if (e.key === 'Escape') {
        const searchInputs = document.querySelectorAll('input[type="text"]');
        searchInputs.forEach(input => {
            input.value = '';
            input.blur();
        });
        
        // Ana sayfa aramasını sıfırla
        if (currentPage === 'home') {
            filterProductsByCategory('market');
        }
        
        // Kullanıcı menüsünü kapat
        closeUserMenu();
    }
    
    // Sayfa kısayolları
    if (e.altKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                const firstNav = document.querySelector('.nav-item');
                if (firstNav) firstNav.click();
                break;
            case '2':
                e.preventDefault();
                const secondNav = document.querySelectorAll('.nav-item')[1];
                if (secondNav) secondNav.click();
                break;
            case '3':
                e.preventDefault();
                const thirdNav = document.querySelectorAll('.nav-item')[2];
                if (thirdNav) thirdNav.click();
                break;
        }
    }
});

// ===== EXPORT FUNCTIONS =====
// Global erişim için window'a ekle
window.addToCart = addToCart;
window.showCart = showCart;
window.editProfile = editProfile;
window.viewAddresses = viewAddresses;
window.paymentMethods = paymentMethods;
window.settings = settings;
window.logout = logout;
window.initializeCartPage = initializeCartPage;

function initializeThemeToggle() {
    const toggleBtn = document.getElementById('themeToggle');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', function () {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        toggleBtn.textContent = isLight ? '🌞' : '🌙';
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        toggleBtn.textContent = '🌞';
    }
}


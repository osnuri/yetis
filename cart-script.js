/*
=====================================
CART PAGE JAVASCRIPT
=====================================
*/

// ===== GLOBAL VARIABLES =====
let cart = [];
let cartTotal = 0;
let deliveryFee = 5;
let promoDiscount = 0;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    loadCartFromStorage();
    renderCart();
    hideLoadingScreen();
    initializeTheme();
});

// ===== CART MANAGEMENT =====
/**
 * LocalStorage'dan sepet verilerini yükler
 */
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('yetisCourier_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

/**
 * Sepeti localStorage'a kaydet
 */
function saveCartToStorage() {
    localStorage.setItem('yetisCourier_cart', JSON.stringify(cart));
}

/**
 * Sepeti render et
 */
function renderCart() {
    const container = document.getElementById('cartItemsContainer');
    const emptyCart = document.getElementById('emptyCart');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (!container) return;
    
    // Sepet boşsa
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart" id="emptyCart">
                <div class="empty-cart-icon">🛒</div>
                <h3>Sepetiniz Henüz Boş</h3>
                <p>Hemen alışverişe başlayın ve favori ürünlerinizi sepete ekleyin!</p>
                <button class="start-shopping-btn" onclick="window.location.href='index.html'">
                    Alışverişe Başla
                </button>
            </div>
        `;
        checkoutBtn.disabled = true;
        checkoutBtn.style.opacity = '0.5';
    } else {
        // Sepet dolu
        let cartHTML = '';
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            cartHTML += `
                <div class="cart-item" data-index="${index}">
                    <div class="item-image">${getProductVisual(item.name)}</div>
                    <div class="item-details">
                        <div class="item-name">${item.name}</div>
                        <div class="item-size">${item.size}</div>
                        <div class="item-price">₺${itemTotal.toFixed(2)}</div>
                    </div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="decreaseQuantity(${index})">−</button>
                        <span class="quantity-number">${item.quantity}</span>
                        <button class="quantity-btn" onclick="increaseQuantity(${index})">+</button>
                        <button class="remove-btn" onclick="removeItem(${index})">Kaldır</button>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = cartHTML;
        checkoutBtn.disabled = false;
        checkoutBtn.style.opacity = '1';
        
        // Animasyon
        document.querySelectorAll('.cart-item').forEach((item, index) => {
            item.style.animation = `slideInLeft 0.5s ease ${index * 0.1}s both`;
        });
    }
    
    updateSummary();
    updateCartBadge();
}

/**
 * Ürün görselini veya emojisini döndür
 */
function getProductVisual(productName) {
    const imageMap = {
        'Coca-Cola': 'img/coca-cola.png',
        'Çikolata': 'img/cikolata.png',
        'Muz': 'img/muz.png',
        'Ekmek': 'img/ekmek.png',
        'Süt': 'img/sut.png',
        'Yumurta': 'img/yumurta.png',
        'Peynir': 'img/peynir.png',
        'Domates': 'img/domates.png'
    };

    const emojiMap = {
        'Coca-Cola': '🥤',
        'Çikolata': '🍫',
        'Muz': '🍌',
        'Ekmek': '🍞',
        'Süt': '🥛',
        'Yumurta': '🥚',
        'Peynir': '🧀',
        'Domates': '🍅',
        'Pizza': '🍕',
        'Hamburger': '🍔',
        'Döner': '🌯',
        'Su': '💧',
        'Maden Suyu': '🫧',
        'Aspirin': '💊',
        'Vitamin C': '🧪'
    };

    if (imageMap[productName]) {
        return `<img src="${imageMap[productName]}" alt="${productName}">`;
    }

    return emojiMap[productName] || '📦';
}

/**
 * Miktarı artır
 */
function increaseQuantity(index) {
    cart[index].quantity += 1;
    saveCartToStorage();
    renderCart();
    
    // Animasyon efekti
    const item = document.querySelector(`[data-index="${index}"] .quantity-number`);
    if (item) {
        item.style.transform = 'scale(1.2)';
        setTimeout(() => {
            item.style.transform = 'scale(1)';
        }, 200);
    }
}

/**
 * Miktarı azalt
 */
function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        saveCartToStorage();
        renderCart();
        
        // Animasyon efekti
        const item = document.querySelector(`[data-index="${index}"] .quantity-number`);
        if (item) {
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
                item.style.transform = 'scale(1)';
            }, 200);
        }
    } else {
        removeItem(index);
    }
}

/**
 * Ürünü sepetten kaldır
 */
function removeItem(index) {
    const item = document.querySelector(`[data-index="${index}"]`);
    if (item) {
        item.style.animation = 'slideOutLeft 0.5s ease';
        setTimeout(() => {
            cart.splice(index, 1);
            saveCartToStorage();
            renderCart();
        }, 400);
    }
}

/**
 * Sipariş özetini güncelle
 */
function updateSummary() {
    let subtotal = 0;
    
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    const total = subtotal + deliveryFee - promoDiscount;
    cartTotal = total;
    
    // DOM güncellemeleri
    document.getElementById('subtotal').textContent = `₺${subtotal.toFixed(2)}`;
    document.getElementById('totalAmount').textContent = `₺${total.toFixed(2)}`;
    
    // Ücretsiz teslimat kontrolü
    if (subtotal >= 50) {
        document.getElementById('deliveryFee').textContent = 'ÜCRETSİZ';
        document.getElementById('deliveryFee').style.color = 'var(--success-green)';
        deliveryFee = 0;
    } else {
        document.getElementById('deliveryFee').textContent = '₺5,00';
        document.getElementById('deliveryFee').style.color = 'var(--primary-orange)';
        deliveryFee = 5;
    }
}

/**
 * Sepet sayacını güncelle
 */
function updateCartBadge() {
    const badge = document.getElementById('cartCountBadge');
    if (badge) {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        badge.textContent = count;
        
        // Animasyon
        badge.style.transform = 'scale(1.2)';
        setTimeout(() => {
            badge.style.transform = 'scale(1)';
        }, 200);
    }
}

/**
 * İndirim kodu uygula
 */
function applyPromoCode() {
    const promoInput = document.getElementById('promoCode');
    const code = promoInput.value.toUpperCase();
    
    const promoCodes = {
        'YENI10': 10,
        'HOSGELDIN': 15,
        'HIZLI20': 20
    };
    
    if (promoCodes[code]) {
        promoDiscount = promoCodes[code];
        showNotification(`🎉 İndirim kodu uygulandı! ₺${promoDiscount} indirim kazandınız.`, 'success');
        promoInput.disabled = true;
        promoInput.style.background = 'var(--success-green)';
        promoInput.style.color = 'white';
        updateSummary();
    } else {
        showNotification('❌ Geçersiz indirim kodu!', 'error');
        promoInput.value = '';
    }
}

/**
 * Siparişi tamamla
 */
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Sepetiniz boş!', 'error');
        return;
    }
    
    // Sipariş özeti
    const orderSummary = cart.map(item => 
        `${item.quantity}x ${item.name} (${item.size})`
    ).join('\n');
    
    const message = `
🛒 SİPARİŞ ÖZETİ
================
${orderSummary}

💰 Toplam: ₺${cartTotal.toFixed(2)}
🚚 Teslimat: 8-12 dakika
📍 Adres: Aksaray

Siparişi onaylıyor musunuz?
    `;
    
    if (confirm(message)) {
        const newOrder = {
            id: Math.floor(Math.random() * 90000) + 10000,
            status: 'in-progress',
            items: cart.map(item => `${item.quantity}x ${item.name}`).join(', '),
            date: new Date().toLocaleString('tr-TR'),
            total: cartTotal
        };

        let history = [];
        const stored = localStorage.getItem('yetisCourier_orders');
        if (stored) {
            try { history = JSON.parse(stored); } catch(e) { history = []; }
        }
        history.unshift(newOrder);
        localStorage.setItem('yetisCourier_orders', JSON.stringify(history));

        // Başarı modalını göster
        showSuccessModal();

        // Sepeti temizle
        cart = [];
        saveCartToStorage();

        // 3 saniye sonra siparişlerim sayfasına yönlendir
        setTimeout(() => {
            window.location.href = 'index.html#orders';
        }, 3000);
    }
}

/**
 * Başarı modalını göster
 */
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.add('active');
    }
}

/**
 * Başarı modalını kapat
 */
function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

/**
 * Bildirim göster
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success-green)' : '#ff4444'};
        color: white;
        padding: 15px 25px;
        border-radius: 12px;
        font-weight: 600;
        z-index: 10000;
        animation: slideInRight 0.5s ease;
        box-shadow: 0 8px 25px rgba(0,0,0,0.3);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

/**
 * Yükleme ekranını gizle
 */
function hideLoadingScreen() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    if (loadingOverlay) {
        setTimeout(() => {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 500);
        }, 1000);
    }
}

/**
 * Tema ayarlarını başlat
 */
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }
}

// ===== KLAVYE KISA YOLLARI =====
document.addEventListener('keydown', function(e) {
    // ESC ile ana sayfaya dön
    if (e.key === 'Escape') {
        window.location.href = 'index.html';
    }
    
    // Enter ile sipariş tamamla
    if (e.key === 'Enter' && !e.target.matches('input')) {
        proceedToCheckout();
    }
});

// ===== ANIMASYON STİLLERİ =====
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes slideOutLeft {
        to {
            transform: translateX(-100%);
            opacity: 0;
        }
    }
    
    @keyframes slideOutRight {
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(animationStyles);

// ===== SAYFA YÜKLENME MESAJI =====
console.log('🛒 Sepet sayfası yüklendi!');
console.log('📦 Toplam ürün:', cart.reduce((total, item) => total + item.quantity, 0));
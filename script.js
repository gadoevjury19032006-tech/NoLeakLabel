let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

document.addEventListener('DOMContentLoaded', function() {
    initSite();
    addFaqStyles();
});

function initSite() {
    updateAuthBlock();
    updateCartCounter();
    initMobileMenu();
    initScrollHeader();
    initSocialLinks();
    initMap();
    initFilters();
    initProductClicks();
    initFaq();
    initCartButtons();
    initSmoothScroll();
    initModalClose();
}

// Добавляем стили для FAQ
function addFaqStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .faq-item {
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .faq-item p {
            transition: all 0.3s ease;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid rgba(0, 112, 209, 0.2);
            display: none;
        }
        
        .faq-item p.show {
            display: block;
            animation: fadeIn 0.3s ease;
        }
        
        .faq-question {
            display: flex;
            align-items: center;
            gap: 15px;
            transition: margin 0.3s ease;
        }
        
        .fa-chevron-down, .fa-chevron-up {
            transition: transform 0.3s ease;
            margin-left: auto;
        }
        
        .faq-item.active .fa-chevron-down {
            transform: rotate(180deg);
        }
    `;
    document.head.appendChild(style);
}

function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link, .menu a').forEach(link => {
            link.addEventListener('click', function() {
                if (navMenu) navMenu.classList.remove('active');
            });
        });
    }
}

function initScrollHeader() {
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', function() {
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });
}

function showNotification(message, title = 'Успешно!', type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    const colors = {
        success: 'linear-gradient(135deg, #0070d1, #003791)',
        error: 'linear-gradient(135deg, #d32f2f, #b71c1c)',
        warning: 'linear-gradient(135deg, #ffa000, #ff6f00)'
    };
    
    notification.style.background = colors[type] || colors.success;
    const titleElement = document.getElementById('notificationTitle');
    const messageElement = document.getElementById('notificationMessage');
    
    if (titleElement) titleElement.textContent = title;
    if (messageElement) messageElement.textContent = message;
    
    notification.classList.add('show');
    
    setTimeout(() => {
        hideNotification();
    }, 3000);
}

function hideNotification() {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.classList.remove('show');
    }
}

function updateAuthBlock() {
    const authBlock = document.getElementById('authBlock');
    if (!authBlock) return;
    
    if (currentUser) {
        authBlock.innerHTML = `
            <div class="user-info">
                <div class="user-avatar" onclick="showUserMenu()">
                    <i class="fas fa-user"></i>
                </div>
                <span class="user-name">${currentUser.name || 'Пользователь'}</span>
                <button class="logout-btn" onclick="logout()">
                    <i class="fas fa-sign-out-alt"></i>
                    Выйти
                </button>
            </div>
        `;
    } else {
        authBlock.innerHTML = `
            <button class="auth-btn" onclick="openAuthModal()">
                <i class="fas fa-user"></i>
                Войти
            </button>
        `;
    }
}

function openAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

function switchAuthTab(tab) {
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');
    
    tabs.forEach(t => t.classList.remove('active'));
    forms.forEach(f => f.classList.remove('active'));
    
    if (tab === 'login') {
        if (tabs[0]) tabs[0].classList.add('active');
        const loginForm = document.getElementById('loginForm');
        if (loginForm) loginForm.classList.add('active');
    } else {
        if (tabs[1]) tabs[1].classList.add('active');
        const registerForm = document.getElementById('registerForm');
        if (registerForm) registerForm.classList.add('active');
    }
}

function login() {
    const email = document.getElementById('loginEmail')?.value;
    const password = document.getElementById('loginPassword')?.value;
    
    if (!email || !password) {
        showNotification('Заполните все поля!', 'Ошибка', 'error');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateAuthBlock();
        closeAuthModal();
        showNotification(`Добро пожаловать, ${user.name || 'Пользователь'}!`);
    } else {
        showNotification('Неверный email или пароль', 'Ошибка', 'error');
    }
}

function register() {
    const name = document.getElementById('registerName')?.value;
    const email = document.getElementById('registerEmail')?.value;
    const password = document.getElementById('registerPassword')?.value;
    const confirmPassword = document.getElementById('registerConfirmPassword')?.value;
    const agreeTerms = document.getElementById('agreeTerms')?.checked;
    
    if (!name || !email || !password || !confirmPassword) {
        showNotification('Заполните все поля!', 'Ошибка', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Пароли не совпадают!', 'Ошибка', 'error');
        return;
    }
    
    if (!agreeTerms) {
        showNotification('Необходимо согласие с условиями', 'Ошибка', 'error');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.some(u => u.email === email)) {
        showNotification('Пользователь с таким email уже существует', 'Ошибка', 'error');
        return;
    }
    
    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    updateAuthBlock();
    closeAuthModal();
    showNotification(`Добро пожаловать, ${name}!`);
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthBlock();
    showNotification('Вы вышли из аккаунта');
}

function socialLogin(provider) {
    showNotification(`Вход через ${provider} будет доступен позже`, 'В разработке', 'warning');
}

function showUserMenu() {
    showNotification('Профиль пользователя в разработке', 'В разработке', 'warning');
}

function addToCart(name, price, image) {
    if (!currentUser) {
        showNotification('Необходимо войти в аккаунт', 'Внимание', 'warning');
        openAuthModal();
        return;
    }
    
    cart.push({
        name: name,
        price: price,
        image: image,
        quantity: 1
    });
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    showNotification(`${name} добавлен в корзину!`);
}

function updateCartCounter() {
    const counter = document.getElementById('cartCount');
    if (counter) {
        counter.textContent = cart.length;
    }
}

function toggleCart() {
    if (!currentUser) {
        showNotification('Необходимо войти в аккаунт', 'Внимание', 'warning');
        openAuthModal();
        return;
    }
    
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.classList.toggle('show');
        if (modal.classList.contains('show')) {
            updateCartDisplay();
        }
    }
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems || !cartTotal) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart"><i class="fas fa-shopping-cart"></i><p>Корзина пуста</p></div>';
        cartTotal.textContent = '0 ₽';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        html += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${item.price.toLocaleString()} ₽</div>
                </div>
                <div class="cart-item-remove" onclick="removeFromCart(${index})">
                    <i class="fas fa-times"></i>
                </div>
            </div>
        `;
    });
    
    cartItems.innerHTML = html;
    cartTotal.textContent = `${total.toLocaleString()} ₽`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    updateCartDisplay();
    showNotification('Товар удален из корзины');
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Корзина пуста!', 'Ошибка', 'error');
        return;
    }
    
    showNotification('Заказ оформлен! С вами свяжется менеджер');
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    updateCartDisplay();
    toggleCart();
}

let map;
let currentMarker;
let currentLocationIndex = 0;

const locations = [
    {
        name: "Game Store Москва",
        coords: [55.751244, 37.618423],
        address: "г. Москва, ул. Новый Арбат, 24",
        metro: "Арбатская, Смоленская"
    },
    {
        name: "Game Store Центр",
        coords: [55.761665, 37.624592],
        address: "г. Москва, Тверская ул., 16",
        metro: "Тверская, Пушкинская"
    },
    {
        name: "Game Store Южный",
        coords: [55.730826, 37.630231],
        address: "г. Москва, Варшавское шоссе, 16",
        metro: "Нагатинская"
    },
    {
        name: "Game Северный",
        coords: [55.794259, 37.601622],
        address: "г. Москва, Дмитровское шоссе, 25",
        metro: "Дмитровская"
    },
    {
        name: "Game Восточный",
        coords: [55.771759, 37.705502],
        address: "г. Москва, Щелковское шоссе, 75",
        metro: "Щелковская"
    },
    {
        name: "Game Store Западный",
        coords: [55.726763, 37.492711],
        address: "г. Москва, Кутузовский проспект, 48",
        metro: "Славянский бульвар"
    }
];

function initMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement || typeof L === 'undefined') return;
    
    map = L.map('map').setView(locations[0].coords, 12);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© Game Store',
        maxZoom: 19
    }).addTo(map);
    
    updateMarker(0);
    
    const randomBtn = document.getElementById('randomLocationBtn');
    const resetBtn = document.getElementById('resetLocationBtn');
    
    if (randomBtn) {
        randomBtn.addEventListener('click', getRandomLocation);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            updateMarker(0);
            showNotification('Вернулись в главный магазин PlayStation');
        });
    }
}

function updateMarker(index) {
    if (!map) return;
    
    currentLocationIndex = index;
    const location = locations[index];
    
    if (currentMarker) {
        map.removeLayer(currentMarker);
    }
    
    const psIcon = L.divIcon({
        className: 'ps-marker',
        html: '<i class="fas fa-play-circle" style="color: #0070d1; font-size: 30px;"></i>',
        iconSize: [30, 30]
    });
    
    currentMarker = L.marker(location.coords, { icon: psIcon })
        .addTo(map)
        .bindPopup(`
            <b style="color: #0070d1;">${location.name}</b><br>
            <span style="color: #fff;">${location.address}</span><br>
            <span style="color: #0070d1;">Метро: ${location.metro}</span>
        `)
        .openPopup();
    
    map.setView(location.coords, 14);
    
    const addressEl = document.getElementById('address');
    const metroEl = document.getElementById('metro');
    const locationNameEl = document.querySelector('#locationInfo h3');
    
    if (addressEl) addressEl.textContent = location.address;
    if (metroEl) metroEl.textContent = location.metro;
    if (locationNameEl) locationNameEl.textContent = location.name;
}

function getRandomLocation() {
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * locations.length);
    } while (newIndex === currentLocationIndex && locations.length > 1);
    
    updateMarker(newIndex);
    showNotification(`Показан ${locations[newIndex].name}`);
}

function getUserLocation() {
    if (!map) return;
    
    if (navigator.geolocation) {
        showNotification('Определяем ваше местоположение...', 'Пожалуйста, подождите', 'success');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userCoords = [position.coords.latitude, position.coords.longitude];
                
                if (currentMarker) {
                    map.removeLayer(currentMarker);
                }
                
                const userIcon = L.divIcon({
                    className: 'user-marker',
                    html: '<i class="fas fa-user-circle" style="color: #003791; font-size: 30px;"></i>',
                    iconSize: [30, 30]
                });
                
                currentMarker = L.marker(userCoords, { icon: userIcon })
                    .addTo(map)
                    .bindPopup('<b style="color: #0070d1;">Ваше местоположение</b>')
                    .openPopup();
                
                map.setView(userCoords, 13);
                
                const addressEl = document.getElementById('address');
                const metroEl = document.getElementById('metro');
                const locationNameEl = document.querySelector('#locationInfo h3');
                
                if (addressEl) addressEl.textContent = 'Ваше текущее местоположение';
                if (metroEl) metroEl.textContent = 'Определяется...';
                if (locationNameEl) locationNameEl.textContent = 'Ваше местоположение';
                
                showNotification('Мы определили ваше местоположение!');
            },
            (error) => {
                showNotification('Не удалось определить местоположение', 'Ошибка', 'error');
            }
        );
    } else {
        showNotification('Геолокация не поддерживается', 'Ошибка', 'error');
    }
}

function filterProducts(game) {
    const products = document.querySelectorAll('.product-card[data-game]');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (!products.length) return;
    
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    filterButtons.forEach(btn => {
        const btnText = btn.textContent.toLowerCase();
        if ((game === 'all' && btnText === 'все игры') || 
            (game !== 'all' && btnText.includes(game))) {
            btn.classList.add('active');
        }
    });
    
    products.forEach(product => {
        if (game === 'all' || product.dataset.game === game) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
    
    const gameNames = {
        'all': 'все игры',
        'valorant': 'VALORANT',
        'csgo': 'CS:GO',
        'steam': 'Steam',
        'fortnite': 'Fortnite',
        'ps5': 'PlayStation 5',
        'ps4': 'PlayStation 4'
    };
    
    showNotification(`Показаны товары: ${gameNames[game] || game}`);
}

function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const game = this.textContent.toLowerCase();
            filterProducts(game === 'все игры' ? 'all' : game);
        });
    });
}

function initProductClicks() {
    document.querySelectorAll('.spec-item, .modern-table tr, .feature-card').forEach(el => {
        el.addEventListener('click', function() {
            const text = this.textContent.trim();
            showNotification(text.substring(0, 50) + '...');
        });
    });
    
    document.querySelectorAll('.related-item, .category-card, .benefit-card').forEach(el => {
        el.addEventListener('click', function(e) {
            if (!e.target.closest('button') && !e.target.closest('a') && !e.target.closest('.related-item')) {
                const title = this.querySelector('h3')?.textContent || 'Товар';
                showNotification(`Переход к ${title}`);
            }
        });
    });
}

function initFaq() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        // Удаляем старый onclick атрибут, если он есть
        item.removeAttribute('onclick');
        
        // Добавляем обработчик клика
        item.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleFaq(this);
        });
        
        // Скрываем все ответы при загрузке
        const answer = item.querySelector('p');
        if (answer) {
            answer.style.display = 'none';
        }
    });
}

function toggleFaq(element) {
    if (!element) return;
    
    // Убеждаемся, что у нас есть элемент .faq-item
    const faqItem = element.classList.contains('faq-item') ? element : element.closest('.faq-item');
    if (!faqItem) return;
    
    const answer = faqItem.querySelector('p');
    const icon = faqItem.querySelector('.fa-chevron-down, .fa-chevron-up');
    const question = faqItem.querySelector('.faq-question');
    
    if (!answer) return;
    
    // Если ответ скрыт
    if (answer.style.display === 'none' || !answer.style.display) {
        // Закрываем все другие открытые FAQ
        document.querySelectorAll('.faq-item').forEach(otherItem => {
            if (otherItem !== faqItem) {
                const otherAnswer = otherItem.querySelector('p');
                const otherIcon = otherItem.querySelector('.fa-chevron-down, .fa-chevron-up');
                const otherQuestion = otherItem.querySelector('.faq-question');
                
                if (otherAnswer) {
                    otherAnswer.style.display = 'none';
                }
                if (otherIcon) {
                    otherIcon.className = otherIcon.className.replace('fa-chevron-up', 'fa-chevron-down');
                }
                if (otherQuestion) {
                    otherQuestion.style.marginBottom = '0';
                }
                otherItem.classList.remove('active');
            }
        });
        
        // Открываем текущий
        answer.style.display = 'block';
        if (icon) {
            icon.className = icon.className.replace('fa-chevron-down', 'fa-chevron-up');
        }
        if (question) {
            question.style.marginBottom = '15px';
        }
        faqItem.classList.add('active');
        
        // Плавная анимация
        answer.style.animation = 'fadeIn 0.3s ease';
    } else {
        // Закрываем текущий
        answer.style.display = 'none';
        if (icon) {
            icon.className = icon.className.replace('fa-chevron-up', 'fa-chevron-down');
        }
        if (question) {
            question.style.marginBottom = '0';
        }
        faqItem.classList.remove('active');
    }
}

function submitForm(event) {
    event.preventDefault();
    
    const name = document.getElementById('name')?.value;
    const email = document.getElementById('email')?.value;
    const subject = document.getElementById('subject')?.value;
    const message = document.getElementById('message')?.value;
    
    if (!name || !email || !subject || !message) {
        showNotification('Заполните все поля!', 'Ошибка', 'error');
        return;
    }
    
    console.log('Форма отправлена:', { name, email, subject, message });
    
    showNotification('Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.');
    const form = document.getElementById('contactForm');
    if (form) form.reset();
}

function copyToClipboard(text, message) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification(message || 'Скопировано в буфер обмена!');
    }).catch(() => {
        showNotification('Ошибка при копировании', 'Ошибка', 'error');
    });
}

function initSocialLinks() {
    document.querySelectorAll('.social-links a, .footer-section i[onclick]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.querySelector('i')?.className || this.className || 'соцсеть';
            showNotification(`Подпишитесь на PlayStation в ${platform}!`);
        });
    });
}

function initCartButtons() {
    document.querySelectorAll('.product-btn, .buy-btn, .btn-primary[onclick*="addToCart"]').forEach(button => {
        const oldOnClick = button.onclick;
        button.onclick = null;
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (oldOnClick) {
                const match = oldOnClick.toString().match(/addToCart\(['"]([^'"]+)['"],\s*(\d+),\s*['"]([^'"]+)['"]\)/);
                if (match) {
                    addToCart(match[1], parseInt(match[2]), match[3]);
                    return;
                }
            }
            
            const productCard = this.closest('.product-card') || this.closest('.related-item');
            if (!productCard) return;
            
            const productName = productCard.querySelector('h3')?.textContent || 'Товар';
            const productPriceElement = productCard.querySelector('.product-price, .related-price, .price-tag');
            let productPrice = 0;
            
            if (productPriceElement) {
                productPrice = parseInt(productPriceElement.textContent.replace(/[^\d]/g, ''));
            }
            
            const productImage = productCard.querySelector('img')?.src || '';
            
            if (productName && productPrice) {
                addToCart(productName, productPrice, productImage);
            }
        });
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initModalClose() {
    const authModal = document.getElementById('authModal');
    if (authModal) {
        authModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeAuthModal();
            }
        });
    }
}

function addToWishlist(name) {
    if (!currentUser) {
        showNotification('Необходимо войти в аккаунт', 'Внимание', 'warning');
        openAuthModal();
        return;
    }
    
    wishlist.push(name);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    showNotification(`${name} добавлен в избранное!`);
}

function formatPrice(price) {
    return price.toLocaleString() + ' ₽';
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function setPageTitle(title) {
    document.title = `Game Store - ${title}`;
}

// Экспортируем все функции в глобальную область
window.showNotification = showNotification;
window.hideNotification = hideNotification;
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.switchAuthTab = switchAuthTab;
window.login = login;
window.register = register;
window.logout = logout;
window.socialLogin = socialLogin;
window.showUserMenu = showUserMenu;
window.addToCart = addToCart;
window.toggleCart = toggleCart;
window.removeFromCart = removeFromCart;
window.checkout = checkout;
window.filterProducts = filterProducts;
window.submitForm = submitForm;
window.copyToClipboard = copyToClipboard;
window.getUserLocation = getUserLocation;
window.addToWishlist = addToWishlist;
window.toggleFaq = toggleFaq;

// Инициализация анимаций появления
document.addEventListener('DOMContentLoaded', function() {
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.product-card, .category-card, .benefit-card, .feature, .stat-item');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const isVisible = (elementTop < window.innerHeight - 100) && elementBottom > 0;
            
            if (isVisible) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    const elementsToAnimate = document.querySelectorAll('.product-card, .category-card, .benefit-card, .feature, .stat-item');
    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();
});
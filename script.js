/**
 * MANUHUB — SCRIPT.JS
 * Full e-commerce interactivity: preloader, countdown, carousel,
 * product grid, modal, cart, search, transitions, error handling.
 */

'use strict';

/* ============================================================
   PRODUCT DATA
   ============================================================ */
const PRODUCTS = [
  {
    id: 1, name: 'OPPO Reno 11 Pro 5G', category: 'phones',
    price: 45999, oldPrice: 52999,
    image: 'oppo-phone.png', badge: 'Hot Deal',
    badgeType: '',
    desc: 'Flagship 5G smartphone with 50MP triple camera, 6.7" AMOLED display, 4600mAh battery. 256GB ROM, 12GB RAM. Comes with official warranty.',
    featured: true
  },
  {
    id: 2, name: 'Samsung 32" Smart TV', category: 'tvs',
    price: 28999, oldPrice: 34500,
    image: 'samsung-tv-32.png', badge: 'Sale',
    badgeType: 'sale',
    desc: 'Full HD 32-inch Smart TV with built-in Wi-Fi, YouTube, Netflix. Slim bezel design. 3x HDMI, 2x USB. Perfect for bedroom or kitchen.',
    featured: true
  },
  {
    id: 3, name: 'Google TV 43" 4K', category: 'tvs',
    price: 49999, oldPrice: 58000,
    image: 'google-tv.png', badge: 'New',
    badgeType: 'new',
    desc: '4K Ultra HD Smart TV powered by Google TV OS. Voice remote, Chromecast built-in, Dolby Vision. 4x HDMI, 2x USB. 2-year warranty.',
    featured: true
  },
  {
    id: 4, name: 'Lenovo ThinkPad X1 Carbon', category: 'laptops',
    price: 89999, oldPrice: 105000,
    image: 'lenovo-thinkpad.png', badge: 'Hot Deal',
    badgeType: '',
    desc: 'Business ultrabook with Intel Core i7, 16GB RAM, 512GB SSD. 14" FHD IPS display, backlit keyboard, fingerprint reader. Military-grade durability.',
    featured: true
  },
  {
    id: 5, name: 'Dell Desktop Computer', category: 'laptops',
    price: 55000, oldPrice: 62000,
    image: 'computer.png', badge: '',
    badgeType: '',
    desc: 'High-performance desktop with Intel Core i5, 8GB RAM, 1TB HDD + 256GB SSD. Pre-installed Windows 11. Ideal for home and office use.',
    featured: false
  },
  {
    id: 6, name: 'Canon EOS DSLR Camera', category: 'cameras',
    price: 67500, oldPrice: 78000,
    image: 'canon-camera.png', badge: 'Sale',
    badgeType: 'sale',
    desc: '24.1MP APS-C CMOS sensor DSLR. 4K video recording, dual pixel autofocus, 3" vari-angle touchscreen. Includes 18-55mm kit lens.',
    featured: true
  },
  {
    id: 7, name: 'Digital Action Camera', category: 'cameras',
    price: 12500, oldPrice: 16000,
    image: 'camera.png', badge: 'New',
    badgeType: 'new',
    desc: '4K action camera with waterproof case (up to 30m). Wide-angle lens, image stabilization, Wi-Fi + Bluetooth. 170° field of view.',
    featured: false
  },
  {
    id: 8, name: 'Bluetooth Speaker Pro', category: 'audio',
    price: 8500, oldPrice: 11000,
    image: 'speaker.png', badge: 'Sale',
    badgeType: 'sale',
    desc: '360° omnidirectional sound, 24hr battery life. IPX7 waterproof, 30W output, TWS pairing. Deep bass with passive radiator technology.',
    featured: true
  },
  {
    id: 9, name: 'Sony Portable Radio', category: 'audio',
    price: 4200, oldPrice: 5500,
    image: 'sony-radio.png', badge: '',
    badgeType: '',
    desc: 'Compact AM/FM radio with Bluetooth 5.0. Built-in rechargeable battery, USB charging, AUX input. Clear digital tuning display.',
    featured: false
  },
  {
    id: 10, name: 'Amplifere Sound Bar', category: 'audio',
    price: 14999, oldPrice: 18500,
    image: 'amplifere.png', badge: 'Hot Deal',
    badgeType: '',
    desc: '120W Dolby Atmos soundbar with wireless subwoofer. Bluetooth 5.0, HDMI ARC, optical input. Wall-mountable, multi-EQ modes.',
    featured: true
  },
  {
    id: 11, name: 'HP LaserJet Printer', category: 'printers',
    price: 18500, oldPrice: 22000,
    image: 'printers.png', badge: '',
    badgeType: '',
    desc: 'All-in-one print, scan, copy. Wi-Fi + USB connectivity, 1200dpi print resolution. Mobile printing via HP Smart app. High-yield toner included.',
    featured: false
  },
  {
    id: 12, name: 'Multi-Device USB Hub', category: 'accessories',
    price: 2800, oldPrice: 3500,
    image: 'usb.png', badge: 'New',
    badgeType: 'new',
    desc: '7-port USB 3.0 hub with individual power switches. Supports 5Gbps data transfer. Compatible with Windows, Mac, Linux. Compact aluminum design.',
    featured: false
  },
  {
    id: 13, name: 'Smartphone Bundle Pack', category: 'phones',
    price: 35999, oldPrice: 42000,
    image: 'phones.png', badge: 'Bundle',
    badgeType: '',
    desc: 'Dual-SIM Android phone bundle with earbuds, case & screen protector. 6.5" HD+ display, 48MP camera, 5000mAh battery. Ready to use out-of-box.',
    featured: true
  }
];

/* ============================================================
   UTILITY FUNCTIONS
   ============================================================ */
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

function formatPrice(n) {
  return 'KSh ' + Number(n).toLocaleString('en-KE');
}

function discountPct(price, oldPrice) {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

function showToast(msg, duration = 3500) {
  try {
    const toast = $('#errorToast');
    if (!toast) return;
    toast.textContent = msg;
    toast.style.display = 'block';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => { toast.style.display = 'none'; }, duration);
  } catch (e) { console.error('Toast error:', e); }
}

function triggerTransition(cb, delay = 3000) {
  try {
    const overlay = $('#page-transition');
    if (overlay) {
      overlay.classList.add('active');
      setTimeout(() => {
        overlay.classList.remove('active');
        if (typeof cb === 'function') cb();
      }, delay);
    } else {
      if (typeof cb === 'function') cb();
    }
  } catch (e) {
    console.error('Transition error:', e);
    if (typeof cb === 'function') cb();
  }
}

/* ============================================================
   PRELOADER
   ============================================================ */
(function initPreloader() {
  try {
    const preloader = $('#preloader');
    if (!preloader) return;
    const PRELOAD_TIME = 5000;
    setTimeout(() => {
      preloader.classList.add('hide');
      setTimeout(() => {
        preloader.style.display = 'none';
        initPage();
      }, 700);
    }, PRELOAD_TIME);
  } catch (e) {
    console.error('Preloader error:', e);
    initPage();
  }
})();

/* ============================================================
   PAGE INIT (runs after preloader)
   ============================================================ */
function initPage() {
  try {
    setYear();
    initCountdown();
    initNav();
    initSearch();
    initCarousel();
    initProductsGrid();
    initModal();
    initCart();
    initBannerClose();
  } catch (e) {
    console.error('Page init error:', e);
    showToast('⚠️ Some features may not load. Please refresh.');
  }
}

function setYear() {
  try {
    const el = $('#year');
    if (el) el.textContent = new Date().getFullYear();
  } catch (e) { /* silent */ }
}

/* ============================================================
   COUNTDOWN TIMER
   ============================================================ */
function initCountdown() {
  try {
    const STORAGE_KEY = 'manuhub_countdown_end';
    let endTime = localStorage.getItem(STORAGE_KEY);
    if (!endTime) {
      endTime = Date.now() + 48 * 60 * 60 * 1000;
      localStorage.setItem(STORAGE_KEY, endTime);
    }
    endTime = parseInt(endTime, 10);

    function update() {
      try {
        const now = Date.now();
        const diff = Math.max(0, endTime - now);
        const hrs = Math.floor(diff / 3600000);
        const mins = Math.floor((diff % 3600000) / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        const pad = n => String(n).padStart(2, '0');
        const h = $('#hours'), m = $('#minutes'), s = $('#seconds');
        if (h) h.textContent = pad(hrs);
        if (m) m.textContent = pad(mins);
        if (s) s.textContent = pad(secs);
        if (diff === 0) {
          localStorage.removeItem(STORAGE_KEY);
          clearInterval(cdInterval);
        }
      } catch (e) { clearInterval(cdInterval); }
    }

    update();
    const cdInterval = setInterval(update, 1000);
  } catch (e) {
    console.error('Countdown error:', e);
  }
}

/* ============================================================
   OFFER BANNER CLOSE
   ============================================================ */
function initBannerClose() {
  try {
    const btn = $('#bannerClose');
    const banner = $('#offer-banner');
    if (btn && banner) {
      btn.addEventListener('click', () => {
        banner.style.transition = 'max-height 0.4s ease, opacity 0.4s ease';
        banner.style.overflow = 'hidden';
        banner.style.maxHeight = banner.scrollHeight + 'px';
        requestAnimationFrame(() => {
          banner.style.maxHeight = '0';
          banner.style.opacity = '0';
          setTimeout(() => banner.remove(), 400);
        });
      });
    }
  } catch (e) { console.error('Banner close error:', e); }
}

/* ============================================================
   NAVIGATION
   ============================================================ */
let activeCategory = 'all';

function initNav() {
  try {
    $$('.nav-link').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const cat = link.dataset.category || 'all';
        $$('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        triggerTransition(() => {
          activeCategory = cat;
          filterProducts(cat, getCurrentSearch(), getCurrentSort());
          const ps = $('#all-products-heading');
          if (ps) ps.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 3000);
      });
    });

    // Category cards
    $$('.nav-trigger[data-category]').forEach(el => {
      el.addEventListener('click', () => {
        const cat = el.dataset.category;
        const navLink = $(`.nav-link[data-category="${cat}"]`);
        if (navLink) {
          $$('.nav-link').forEach(l => l.classList.remove('active'));
          navLink.classList.add('active');
        }
        triggerTransition(() => {
          activeCategory = cat;
          filterProducts(cat, getCurrentSearch(), getCurrentSort());
          const ps = $('#all-products-heading');
          if (ps) ps.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 3000);
      });

      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          el.click();
        }
      });
    });

    // Shop Now button
    $$('.nav-trigger[data-action="shop"]').forEach(btn => {
      btn.addEventListener('click', () => {
        triggerTransition(() => {
          const ps = $('#all-products-heading');
          if (ps) ps.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 3000);
      });
    });
  } catch (e) {
    console.error('Nav init error:', e);
  }
}

function getCurrentSearch() {
  try { return ($('#searchInput')?.value || '').toLowerCase().trim(); }
  catch (e) { return ''; }
}

function getCurrentSort() {
  try { return $('#sortSelect')?.value || 'default'; }
  catch (e) { return 'default'; }
}

/* ============================================================
   SEARCH
   ============================================================ */
function initSearch() {
  try {
    const input = $('#searchInput');
    const btn = $('#searchBtn');
    let debounceTimer;

    function doSearch() {
      filterProducts(activeCategory, getCurrentSearch(), getCurrentSort());
    }

    if (input) {
      input.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(doSearch, 320);
      });
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') { clearTimeout(debounceTimer); doSearch(); }
      });
    }

    if (btn) btn.addEventListener('click', doSearch);

    const sortSel = $('#sortSelect');
    if (sortSel) sortSel.addEventListener('change', doSearch);

    const clearBtn = $('#clearFiltersBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (input) input.value = '';
        if (sortSel) sortSel.value = 'default';
        activeCategory = 'all';
        $$('.nav-link').forEach(l => l.classList.remove('active'));
        const allLink = $('.nav-link[data-category="all"]');
        if (allLink) allLink.classList.add('active');
        filterProducts('all', '', 'default');
      });
    }
  } catch (e) {
    console.error('Search init error:', e);
  }
}

/* ============================================================
   PRODUCT CARD BUILDER
   ============================================================ */
function buildCard(product, isGrid = false) {
  try {
    const disc = discountPct(product.price, product.oldPrice);
    const article = document.createElement('article');
    article.className = 'product-card';
    article.setAttribute('role', 'button');
    article.setAttribute('tabindex', '0');
    article.setAttribute('aria-label', `View ${product.name}`);
    article.dataset.id = product.id;

    if (!isGrid) article.style.width = '220px';

    const badgeHtml = product.badge
      ? `<span class="product-badge ${product.badgeType || ''}">${product.badge}</span>` : '';

    const discHtml = disc > 0
      ? `<span class="product-oldprice">${formatPrice(product.oldPrice)}</span>
         <span class="product-discount">-${disc}%</span>` : '';

    article.innerHTML = `
      <div class="product-img-wrap">
        <img src="${product.image}" alt="${product.name}" loading="lazy"
             onerror="this.style.opacity='0'; this.parentElement.innerHTML='<div style=\\'display:flex;align-items:center;justify-content:center;height:100%;font-size:3rem;\\'>📦</div>'" />
        ${badgeHtml}
      </div>
      <div class="product-info">
        <p class="product-category">${product.category}</p>
        <h3>${product.name}</h3>
        <div class="product-price-row">
          <span class="product-price">${formatPrice(product.price)}</span>
          ${discHtml}
        </div>
        <div class="product-actions">
          <button class="btn-card" data-action="cart" data-id="${product.id}">🛒 Add to Cart</button>
          <button class="btn-card secondary" data-action="view" data-id="${product.id}">Details</button>
        </div>
      </div>
    `;

    // Events
    article.addEventListener('click', e => {
      const btn = e.target.closest('[data-action]');
      if (btn) {
        e.stopPropagation();
        const id = parseInt(btn.dataset.id, 10);
        if (btn.dataset.action === 'cart') addToCart(id, btn);
        else if (btn.dataset.action === 'view') openModal(id);
      } else {
        openModal(product.id);
      }
    });

    article.addEventListener('keydown', e => {
      if (e.key === 'Enter') openModal(product.id);
    });

    return article;
  } catch (e) {
    console.error(`Card build error for product ${product?.id}:`, e);
    return document.createElement('div');
  }
}

/* ============================================================
   CAROUSEL
   ============================================================ */
let carouselAutoTimer = null;
let carouselIndex = 0;
let carouselItems = [];
let carouselPaused = false;
let touchStartX = 0;

function initCarousel() {
  try {
    const featured = PRODUCTS.filter(p => p.featured);
    if (!featured.length) {
      showToast('⚠️ No featured products to display.');
      return;
    }
    carouselItems = featured;

    const track = $('#carouselTrack');
    const dotsContainer = $('#carouselDots');
    const wrap = $('#carouselWrap');
    const skeleton = $('#skeletonCarousel');

    if (!track || !wrap) return;

    // Populate
    featured.forEach(p => {
      const card = buildCard(p, false);
      card.addEventListener('mouseenter', () => { carouselPaused = true; });
      card.addEventListener('mouseleave', () => { carouselPaused = false; });
      card.addEventListener('touchstart', () => { carouselPaused = true; }, { passive: true });
      card.addEventListener('touchend', () => {
        setTimeout(() => { carouselPaused = false; }, 1200);
      }, { passive: true });
      track.appendChild(card);
    });

    // Dots
    if (dotsContainer) {
      featured.forEach((_, i) => {
        const btn = document.createElement('button');
        btn.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
        btn.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(btn);
      });
    }

    // Show carousel
    setTimeout(() => {
      if (skeleton) skeleton.style.display = 'none';
      wrap.style.display = 'block';
      startCarouselAuto();
    }, 1200);

    // Arrow controls
    const prevBtn = $('#carouselPrev');
    const nextBtn = $('#carouselNext');
    if (prevBtn) prevBtn.addEventListener('click', () => { stopCarouselAuto(); goToSlide(carouselIndex - 1); startCarouselAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { stopCarouselAuto(); goToSlide(carouselIndex + 1); startCarouselAuto(); });

    // Touch swipe
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) {
        stopCarouselAuto();
        goToSlide(dx < 0 ? carouselIndex + 1 : carouselIndex - 1);
        startCarouselAuto();
      }
    }, { passive: true });

  } catch (e) {
    console.error('Carousel init error:', e);
    showToast('⚠️ Featured carousel could not load.');
  }
}

function getCardWidth() {
  try {
    const card = $('#carouselTrack .product-card');
    if (!card) return 236;
    const style = getComputedStyle(card);
    return card.offsetWidth + parseInt(style.marginRight || 0) + 16;
  } catch (e) { return 236; }
}

function getVisibleCount() {
  try {
    const outer = $('.carousel-track-outer');
    if (!outer) return 4;
    return Math.max(1, Math.floor(outer.clientWidth / getCardWidth()));
  } catch (e) { return 4; }
}

function goToSlide(index) {
  try {
    const track = $('#carouselTrack');
    const dots = $$('#carouselDots .carousel-dot');
    const total = carouselItems.length;
    if (!track || !total) return;

    carouselIndex = ((index % total) + total) % total;
    const offset = carouselIndex * getCardWidth();
    track.style.transform = `translateX(-${offset}px)`;

    dots.forEach((d, i) => d.classList.toggle('active', i === carouselIndex));
  } catch (e) {
    console.error('Carousel slide error:', e);
  }
}

function startCarouselAuto() {
  stopCarouselAuto();
  carouselAutoTimer = setInterval(() => {
    if (!carouselPaused) goToSlide(carouselIndex + 1);
  }, 3000);
}

function stopCarouselAuto() {
  clearInterval(carouselAutoTimer);
}

/* ============================================================
   PRODUCTS GRID
   ============================================================ */
function initProductsGrid() {
  try {
    const skeleton = $('#skeletonGrid');
    const grid = $('#productsGrid');
    if (!grid) return;

    setTimeout(() => {
      if (skeleton) skeleton.style.display = 'none';
      grid.style.display = 'grid';
      filterProducts('all', '', 'default');
    }, 1600);
  } catch (e) {
    console.error('Products grid init error:', e);
  }
}

function filterProducts(category, search, sort) {
  try {
    const grid = $('#productsGrid');
    const noResults = $('#noResults');
    if (!grid) return;

    let filtered = PRODUCTS;

    if (category && category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }

    if (search) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.category.toLowerCase().includes(search) ||
        p.desc.toLowerCase().includes(search)
      );
    }

    switch (sort) {
      case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
      case 'name': filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: break;
    }

    grid.innerHTML = '';

    if (!filtered.length) {
      if (noResults) noResults.style.display = 'block';
      return;
    }

    if (noResults) noResults.style.display = 'none';

    filtered.forEach((p, i) => {
      const card = buildCard(p, true);
      card.style.animationDelay = `${i * 50}ms`;
      card.style.animation = 'fadeInCard 0.4s ease both';
      grid.appendChild(card);
    });

    // Add keyframe if not exists
    if (!document.querySelector('#fadeInCardKf')) {
      const style = document.createElement('style');
      style.id = 'fadeInCardKf';
      style.textContent = `
        @keyframes fadeInCard {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `;
      document.head.appendChild(style);
    }
  } catch (e) {
    console.error('Filter products error:', e);
    showToast('⚠️ Could not filter products.');
  }
}

/* ============================================================
   PRODUCT MODAL
   ============================================================ */
function initModal() {
  try {
    const modal = $('#productModal');
    const closeBtn = $('#modalClose');
    if (!modal) return;

    closeBtn?.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.style.display !== 'none') closeModal();
    });

    const addCartBtn = $('#modalAddCart');
    if (addCartBtn) {
      addCartBtn.addEventListener('click', () => {
        const id = parseInt(addCartBtn.dataset.productId, 10);
        if (id) {
          addToCart(id);
          closeModal();
        }
      });
    }
  } catch (e) {
    console.error('Modal init error:', e);
  }
}

function openModal(productId) {
  try {
    const p = PRODUCTS.find(x => x.id === productId);
    if (!p) { showToast('⚠️ Product not found.'); return; }

    const modal = $('#productModal');
    if (!modal) return;

    const disc = discountPct(p.price, p.oldPrice);

    // Set content
    const img = $('#modalImg');
    if (img) {
      img.src = p.image;
      img.alt = p.name;
      img.onerror = () => { img.style.display = 'none'; };
    }

    const badge = $('#modalBadge');
    if (badge) {
      badge.textContent = p.badge || p.category;
      badge.style.display = p.badge ? 'inline-block' : 'none';
    }

    const title = $('#modalTitle');
    if (title) title.textContent = p.name;

    const desc = $('#modalDesc');
    if (desc) desc.textContent = p.desc;

    const price = $('#modalPrice');
    if (price) price.textContent = formatPrice(p.price);

    const oldPrice = $('#modalOldPrice');
    if (oldPrice) {
      oldPrice.textContent = disc > 0 ? formatPrice(p.oldPrice) : '';
    }

    const addCartBtn = $('#modalAddCart');
    if (addCartBtn) addCartBtn.dataset.productId = p.id;

    const waBtn = $('#modalWhatsapp');
    if (waBtn) {
      const msg = encodeURIComponent(`Hello ManuHub! I'm interested in: ${p.name} at ${formatPrice(p.price)}. Is it available?`);
      waBtn.href = `https://wa.me/254707408066?text=${msg}`;
    }

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  } catch (e) {
    console.error('Open modal error:', e);
    showToast('⚠️ Could not open product details.');
  }
}

function closeModal() {
  try {
    const modal = $('#productModal');
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = '';
  } catch (e) { console.error('Close modal error:', e); }
}

/* ============================================================
   CART
   ============================================================ */
let cart = [];

function initCart() {
  try {
    // Load from storage
    const saved = localStorage.getItem('manuhub_cart');
    if (saved) cart = JSON.parse(saved);
    updateCartUI();

    const cartBtn = $('#cartBtn');
    const cartClose = $('#cartClose');
    const cartOverlay = $('#cartOverlay');
    const sidebar = $('#cartSidebar');

    cartBtn?.addEventListener('click', openCart);
    cartClose?.addEventListener('click', closeCart);
    cartOverlay?.addEventListener('click', closeCart);

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && sidebar?.style.display !== 'none') closeCart();
    });
  } catch (e) {
    console.error('Cart init error:', e);
  }
}

function addToCart(productId, btn = null) {
  try {
    const p = PRODUCTS.find(x => x.id === productId);
    if (!p) { showToast('⚠️ Product not found.'); return; }

    const existing = cart.find(i => i.id === productId);
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      cart.push({ id: productId, name: p.name, price: p.price, image: p.image, qty: 1 });
    }

    saveCart();
    updateCartUI();
    showToast(`✅ "${p.name}" added to cart!`, 2500);

    // Button feedback
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = '✓ Added!';
      btn.style.background = 'var(--success)';
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
      }, 1800);
    }
  } catch (e) {
    console.error('Add to cart error:', e);
    showToast('⚠️ Could not add item to cart.');
  }
}

function removeFromCart(productId) {
  try {
    cart = cart.filter(i => i.id !== productId);
    saveCart();
    updateCartUI();
  } catch (e) { console.error('Remove from cart error:', e); }
}

function saveCart() {
  try { localStorage.setItem('manuhub_cart', JSON.stringify(cart)); }
  catch (e) { console.error('Save cart error:', e); }
}

function updateCartUI() {
  try {
    const badge = $('#cartBadge');
    const itemsEl = $('#cartItems');
    const footerEl = $('#cartFooter');
    const emptyEl = $('#cartEmpty');
    const totalEl = $('#cartTotal');
    const checkoutBtn = $('#checkoutWhatsapp');

    const totalItems = cart.reduce((s, i) => s + (i.qty || 1), 0);
    if (badge) badge.textContent = totalItems;

    if (!itemsEl) return;
    itemsEl.innerHTML = '';

    if (!cart.length) {
      if (emptyEl) emptyEl.style.display = 'block';
      if (footerEl) footerEl.style.display = 'none';
      return;
    }

    if (emptyEl) emptyEl.style.display = 'none';
    if (footerEl) footerEl.style.display = 'flex';

    let total = 0;

    cart.forEach(item => {
      total += item.price * (item.qty || 1);
      const el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML = `
        <img src="${item.image}" alt="${item.name}"
             onerror="this.src=''; this.parentElement.querySelector('img').style.display='none'" />
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>${formatPrice(item.price)} × ${item.qty || 1}</p>
        </div>
        <button class="cart-item-remove" data-id="${item.id}" aria-label="Remove ${item.name}">✕</button>
      `;
      el.querySelector('.cart-item-remove').addEventListener('click', () => removeFromCart(item.id));
      itemsEl.appendChild(el);
    });

    if (totalEl) totalEl.textContent = formatPrice(total);

    if (checkoutBtn) {
      const cartSummary = cart.map(i => `• ${i.name} x${i.qty || 1} @ ${formatPrice(i.price)}`).join('%0A');
      const msg = encodeURIComponent(`Hello ManuHub! I'd like to order:%0A${cartSummary}%0ATotal: ${formatPrice(total)}`);
      checkoutBtn.href = `https://wa.me/254707408066?text=${msg}`;
    }
  } catch (e) {
    console.error('Cart UI update error:', e);
  }
}

function openCart() {
  try {
    const sidebar = $('#cartSidebar');
    const overlay = $('#cartOverlay');
    if (sidebar) sidebar.style.display = 'flex';
    if (overlay) overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
  } catch (e) { console.error('Open cart error:', e); }
}

function closeCart() {
  try {
    const sidebar = $('#cartSidebar');
    const overlay = $('#cartOverlay');
    if (sidebar) sidebar.style.display = 'none';
    if (overlay) overlay.style.display = 'none';
    document.body.style.overflow = '';
  } catch (e) { console.error('Close cart error:', e); }
}

/* ============================================================
   RESIZE HANDLER
   ============================================================ */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    try { goToSlide(carouselIndex); }
    catch (e) { /* silent */ }
  }, 200);
});

/* ============================================================
   GLOBAL ERROR HANDLING
   ============================================================ */
window.addEventListener('error', e => {
  console.error('Global error:', e.message, e.filename, e.lineno);
  // Don't show toast for image loading errors
  if (e.target && (e.target.tagName === 'IMG' || e.target.tagName === 'SCRIPT')) return;
  showToast('⚠️ Something went wrong. Please refresh.');
});

window.addEventListener('unhandledrejection', e => {
  console.error('Unhandled promise rejection:', e.reason);
  showToast('⚠️ A network error occurred.');
});

/* ============================================================
   ACCESSIBILITY: focus trap for modal
   ============================================================ */
document.addEventListener('keydown', e => {
  if (e.key !== 'Tab') return;
  const modal = $('#productModal');
  if (!modal || modal.style.display === 'none') return;

  const focusable = $$('button, [href], input, select, [tabindex]:not([tabindex="-1"])', modal);
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === first) { e.preventDefault(); last.focus(); }
  } else {
    if (document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

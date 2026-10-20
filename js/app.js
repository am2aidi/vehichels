/**
 * HURANOW MOTORS - Main Application Logic
 * Nike-inspired luxury automotive marketplace & 3D Studio controller
 */

(function () {
  'use strict';

  // State
  const AppState = {
    mode: 'all',          // 'all', 'buy', 'rent', 'new', 'used'
    category: 'all',
    condition: 'all',
    searchQuery: '',
    dealership: 'all',
    sort: 'featured',
    currency: 'RWF',
    activeVehicleDetail: null,
    rentalBooking: {
      startDate: new Date().toISOString().slice(0, 10),
      days: 3
    },
    purchaseOption: 'deposit', // 'deposit' (10%) or 'full'
    cart: [],
    wishlist: [],
    user: null,
    studioInstance: null
  };

  // Helper DOM selectors
  const $ = (s, parent = document) => parent.querySelector(s);
  const $$ = (s, parent = document) => [...parent.querySelectorAll(s)];

  // Toast System
  function showToast(message, duration = 2800) {
    let toast = $('#global-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'global-toast';
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('active');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => {
      toast.classList.remove('active');
    }, duration);
  }

  // Currency Converter
  function renderMoney(amountInRwf) {
    return formatMoney(amountInRwf, AppState.currency);
  }

  // Local Storage Synchronization
  function initStorage() {
    AppState.user = Storage.get('hn_user', null);
    if (AppState.user) {
      AppState.cart = Storage.get('hn_cart_' + AppState.user.email, []);
      AppState.wishlist = Storage.get('hn_wishlist_' + AppState.user.email, []);
    } else {
      AppState.cart = Storage.get('hn_guest_cart', []);
      AppState.wishlist = Storage.get('hn_guest_wishlist', []);
    }
  }

  function saveCart() {
    const key = AppState.user ? 'hn_cart_' + AppState.user.email : 'hn_guest_cart';
    Storage.set(key, AppState.cart);
    updateCartCount();
    renderCartDrawer();
  }

  function saveWishlist() {
    const key = AppState.user ? 'hn_wishlist_' + AppState.user.email : 'hn_guest_wishlist';
    Storage.set(key, AppState.wishlist);
    updateWishlistCount();
    renderWishlistDrawer();
    renderFleetGrid(); // update heart icons
  }

  function updateCartCount() {
    const count = AppState.cart.length;
    const badge = $('#nav-cart-count');
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  }

  function updateWishlistCount() {
    const count = AppState.wishlist.length;
    const badge = $('#nav-wishlist-count');
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  }

  // -------------------------------------------------------------
  // FLEET GRID RENDERING & FILTERING
  // -------------------------------------------------------------
  function getFilteredVehicles() {
    const q = AppState.searchQuery.trim().toLowerCase();

    return allVehicles.filter(v => {
      // Main mode filter
      if (AppState.mode === 'africa' && !v.isAfricanAffordable) return false;
      if (AppState.mode === 'buy' && !v.price) return false;
      if (AppState.mode === 'rent' && !v.rentDaily) return false;
      if (AppState.mode === 'new' && v.condition !== 'Brand New') return false;
      if (AppState.mode === 'used' && v.condition === 'Brand New') return false;

      // Category filter
      if (AppState.category === 'africa' && !v.isAfricanAffordable) return false;
      if (AppState.category !== 'all' && AppState.category !== 'africa' && v.category !== AppState.category) return false;

      // Condition filter
      if (AppState.condition !== 'all' && v.condition !== AppState.condition) return false;

      // Dealership filter
      if (AppState.dealership !== 'all' && v.dealership !== AppState.dealership) return false;

      // Search query filter
      if (q) {
        const hay = `${v.brand} ${v.model} ${v.category} ${v.fuel} ${v.year} ${v.dealership}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      return true;
    }).sort((a, b) => {
      switch (AppState.sort) {
        case 'price-asc':
          return (a.price || 0) - (b.price || 0);
        case 'price-desc':
          return (b.price || 0) - (a.price || 0);
        case 'power':
          return (b.powerHp || 0) - (a.powerHp || 0);
        case 'year':
          return b.year - a.year;
        case 'featured':
        default:
          return 0;
      }
    });
  }

  function renderFleetGrid() {
    const grid = $('#fleet-grid');
    if (!grid) return;

    const list = getFilteredVehicles();

    if (list.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <h3>No matching vehicles found</h3>
          <p>Try refining your search terms or clearing selected filter chips.</p>
          <button class="btn-nike-pill btn-white" id="btn-reset-filters" style="margin: 20px auto 0;">Reset All Filters</button>
        </div>
      `;
      const resetBtn = $('#btn-reset-filters');
      if (resetBtn) resetBtn.onclick = resetFilters;
      return;
    }

    grid.innerHTML = list.map(v => {
      const isWishlisted = AppState.wishlist.includes(v.id);
      const isNew = v.condition === 'Brand New';
      const is3D = v.is3dAvailable;

      return `
        <article class="vehicle-card" data-id="${v.id}">
          <div class="card-media">
            <img src="${v.images.hero}" alt="${v.brand} ${v.model}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80'">
            <div class="card-badges-top">
              <span class="badge-nike ${isNew ? '' : 'used'}">${v.condition}</span>
              ${v.badge ? `<span class="badge-nike red">${v.badge}</span>` : ''}
            </div>
            <button class="btn-card-wishlist ${isWishlisted ? 'active' : ''}" data-wishlist="${v.id}" title="${isWishlisted ? 'Remove from Garage' : 'Save to Garage'}" aria-label="Wishlist">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="${isWishlisted ? '#fff' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            ${is3D ? `
              <button class="btn-card-3d-launch" data-launch-3d="${v.id}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
                3D Studio
              </button>
            ` : ''}
          </div>
          <div class="card-body">
            <div class="card-title-row">
              <span class="card-brand">${v.brand}</span>
              <h3 class="card-model">${v.model}</h3>
            </div>
            <div class="card-meta">
              ${v.year} · ${v.mileage > 0 ? v.mileage.toLocaleString() + ' km' : 'Factory Delivery (0 km)'} · ${v.fuel.split(' ')[0]}
            </div>
            <div class="card-specs-row">
              <div class="card-spec-item">
                <span class="val">${v.accel0to100}</span>
                <span class="lbl">0-100</span>
              </div>
              <div class="card-spec-item">
                <span class="val">${v.powerHp} HP</span>
                <span class="lbl">Power</span>
              </div>
              <div class="card-spec-item">
                <span class="val">${v.topSpeed}</span>
                <span class="lbl">Top Speed</span>
              </div>
            </div>
            <div class="card-footer">
              <div class="card-pricing">
                <span class="price-main">${renderMoney(v.price)}</span>
                <span class="price-sub">Rent from ${renderMoney(v.rentDaily)}/day</span>
              </div>
              <button class="btn-card-action" data-detail="${v.id}">View & Book</button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  function resetFilters() {
    AppState.mode = 'all';
    AppState.category = 'all';
    AppState.condition = 'all';
    AppState.searchQuery = '';
    AppState.dealership = 'all';
    AppState.sort = 'featured';

    const searchInput = $('#search-input');
    if (searchInput) searchInput.value = '';

    const sortSelect = $('#sort-select');
    if (sortSelect) sortSelect.value = 'featured';

    const dealerSelect = $('#dealership-select');
    if (dealerSelect) dealerSelect.value = 'all';

    updateFilterUI();
    renderFleetGrid();
  }

  function updateFilterUI() {
    // Mode tabs
    $$('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === AppState.mode);
    });

    // Category chips
    $$('.chip-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.category === AppState.category);
    });
  }

  // -------------------------------------------------------------
  // DETAIL MODAL & BOOKING LOGIC
  // -------------------------------------------------------------
  function openVehicleDetail(vehicleId) {
    const v = getVehicleById(vehicleId);
    if (!v) return;

    AppState.activeVehicleDetail = v;
    const modal = $('#modal-detail');
    const sheet = $('#detail-sheet-content');
    if (!modal || !sheet) return;

    const both = v.price > 0 && v.rentDaily > 0;
    const rentTotal = v.rentDaily * AppState.rentalBooking.days;
    const depositAmount = Math.round(v.price * 0.1);

    sheet.innerHTML = `
      <button class="modal-close-btn" data-close-modal aria-label="Close">✕</button>
      <div class="detail-grid">
        <div class="detail-gallery">
          <img class="detail-main-img" id="detail-active-img" src="${v.images.hero}" alt="${v.model}">
          <div class="detail-thumbs-row">
            <img class="detail-thumb active" src="${v.images.hero}" alt="Exterior Angle" onclick="window.setDetailImg(this, '${v.images.hero}')">
            ${v.images.interior ? `<img class="detail-thumb" src="${v.images.interior}" alt="Cockpit Interior" onclick="window.setDetailImg(this, '${v.images.interior}')">` : ''}
            ${v.images.rear ? `<img class="detail-thumb" src="${v.images.rear}" alt="Rear Aero" onclick="window.setDetailImg(this, '${v.images.rear}')">` : ''}
          </div>
          ${v.is3dAvailable ? `
            <button class="btn-nike-pill btn-red" id="btn-detail-3d-launch" style="justify-content: center; height: 46px; margin-top: 8px;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
              Open in 3D Configurator Studio
            </button>
          ` : ''}
        </div>

        <div class="detail-info">
          <span class="card-brand">${v.brand}</span>
          <h2 class="detail-title">${v.model}</h2>
          <p style="color: var(--text-muted); font-size: 13px; margin-bottom: 14px;">
            ${v.condition} · ${v.year} · ${v.dealership}
          </p>

          <p style="color: #cbd2e1; font-size: 13px; line-height: 1.6; margin-bottom: 16px;">
            ${v.description}
          </p>

          <div class="detail-specs-table">
            <div class="detail-spec-cell">
              <b>0-100 km/h</b>
              <span>${v.accel0to100}</span>
            </div>
            <div class="detail-spec-cell">
              <b>Horsepower</b>
              <span>${v.powerHp} HP</span>
            </div>
            <div class="detail-spec-cell">
              <b>Top Speed</b>
              <span>${v.topSpeed}</span>
            </div>
            <div class="detail-spec-cell">
              <b>Transmission</b>
              <span>${v.transmission}</span>
            </div>
            <div class="detail-spec-cell">
              <b>Drivetrain</b>
              <span>${v.drivetrain}</span>
            </div>
            <div class="detail-spec-cell">
              <b>Seating Capacity</b>
              <span>${v.seats} Seats</span>
            </div>
          </div>

          <!-- Purchase vs Rent Option Tabs -->
          <div class="mode-toggle-pills" id="detail-kind-selector">
            <button class="mode-toggle-btn ${AppState.mode !== 'rent' ? 'active' : ''}" data-kind="buy">
              Buy Outright · ${renderMoney(v.price)}
            </button>
            <button class="mode-toggle-btn ${AppState.mode === 'rent' ? 'active' : ''}" data-kind="rent">
              Rent Daily · ${renderMoney(v.rentDaily)}/day
            </button>
          </div>

          <div id="detail-booking-config">
            <!-- Dynamic calculation area injected below -->
          </div>

          <div style="display: flex; gap: 12px; margin-top: 18px;">
            <button class="btn-nike-pill btn-white" id="btn-add-detail-cart" style="flex: 1; height: 48px; justify-content: center;">
              Add to Cart
            </button>
            <button class="btn-nike-pill btn-red" id="btn-instant-reserve" style="flex: 1; height: 48px; justify-content: center;">
              Instant Reserve
            </button>
          </div>
        </div>
      </div>
    `;

    renderDetailConfig(AppState.mode === 'rent' ? 'rent' : 'buy');
    modal.classList.add('active');

    // Bind 3D launch button
    const btn3D = $('#btn-detail-3d-launch');
    if (btn3D) {
      btn3D.onclick = () => {
        closeAllModals();
        scrollTo3DStudio(v.model3dType || 'hypercar');
      };
    }
  }

  window.setDetailImg = function (el, src) {
    const mainImg = $('#detail-active-img');
    if (mainImg) mainImg.src = src;
    $$('.detail-thumb').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
  };

  function renderDetailConfig(kind) {
    const container = $('#detail-booking-config');
    const v = AppState.activeVehicleDetail;
    if (!container || !v) return;

    if (kind === 'rent') {
      const today = new Date().toISOString().slice(0, 10);
      const total = v.rentDaily * AppState.rentalBooking.days;

      container.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 12px 0;">
          <div>
            <label style="font-size: 11px; text-transform: uppercase; color: var(--text-dim); display: block; margin-bottom: 4px;">Pick-up Date</label>
            <input type="date" class="form-input" id="detail-rent-date" min="${today}" value="${AppState.rentalBooking.startDate}">
          </div>
          <div>
            <label style="font-size: 11px; text-transform: uppercase; color: var(--text-dim); display: block; margin-bottom: 4px;">Duration (Days)</label>
            <input type="number" class="form-input" id="detail-rent-days" min="1" max="60" value="${AppState.rentalBooking.days}">
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: baseline; background: var(--bg-card); padding: 12px; border-radius: var(--radius-sm);">
          <span style="color: var(--text-muted); font-size: 12px;">Total Rental Estimate:</span>
          <b style="font-family: var(--font-display); font-size: 24px; color: #fff;">${renderMoney(total)}</b>
        </div>
      `;

      $('#detail-rent-date').onchange = (e) => {
        AppState.rentalBooking.startDate = e.target.value;
      };
      $('#detail-rent-days').oninput = (e) => {
        AppState.rentalBooking.days = Math.max(1, parseInt(e.target.value) || 1);
        renderDetailConfig('rent');
      };
    } else {
      const deposit = Math.round(v.price * 0.1);
      container.innerHTML = `
        <div style="margin: 12px 0; background: var(--bg-card); padding: 14px; border-radius: var(--radius-sm); border: 1px solid var(--line);">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input type="radio" name="buy-opt" value="deposit" ${AppState.purchaseOption === 'deposit' ? 'checked' : ''}>
              <span>10% VIP Reservation Deposit</span>
            </label>
            <b>${renderMoney(deposit)}</b>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input type="radio" name="buy-opt" value="full" ${AppState.purchaseOption === 'full' ? 'checked' : ''}>
              <span>Pay Full Vehicle Amount</span>
            </label>
            <b>${renderMoney(v.price)}</b>
          </div>
        </div>
      `;

      $$('input[name="buy-opt"]').forEach(radio => {
        radio.onchange = (e) => {
          AppState.purchaseOption = e.target.value;
        };
      });
    }

    // Bind Add to Cart / Reserve
    $('#btn-add-detail-cart').onclick = () => {
      addItemToCart(v, kind);
      closeAllModals();
      openCartDrawer();
    };

    $('#btn-instant-reserve').onclick = () => {
      addItemToCart(v, kind);
      closeAllModals();
      openCheckoutModal();
    };
  }

  function addItemToCart(vehicle, kind) {
    const item = {
      id: vehicle.id,
      cartItemId: 'c_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      kind: kind,
      brand: vehicle.brand,
      model: vehicle.model,
      image: vehicle.images.hero,
      price: vehicle.price,
      rentDaily: vehicle.rentDaily,
      days: kind === 'rent' ? AppState.rentalBooking.days : null,
      startDate: kind === 'rent' ? AppState.rentalBooking.startDate : null,
      purchaseOption: kind === 'buy' ? AppState.purchaseOption : null
    };

    AppState.cart.push(item);
    saveCart();
    showToast(`Added ${vehicle.brand} ${vehicle.model} to Cart`);
  }

  // -------------------------------------------------------------
  // CART & WISHLIST DRAWERS
  // -------------------------------------------------------------
  function calculateCartTotals() {
    let buyTotal = 0;
    let rentTotal = 0;
    let dueToday = 0;

    AppState.cart.forEach(item => {
      if (item.kind === 'buy') {
        buyTotal += item.price;
        dueToday += (item.purchaseOption === 'deposit' ? Math.round(item.price * 0.1) : item.price);
      } else {
        const itemRent = item.rentDaily * (item.days || 1);
        rentTotal += itemRent;
        dueToday += itemRent;
      }
    });

    return {
      buyTotal,
      rentTotal,
      grandTotal: buyTotal + rentTotal,
      dueToday
    };
  }

  function renderCartDrawer() {
    const list = $('#drawer-cart-items');
    const summary = $('#drawer-cart-summary');
    if (!list || !summary) return;

    if (AppState.cart.length === 0) {
      list.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; color: var(--text-muted);">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 12px; opacity: 0.5;">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <p>Your cart is empty.</p>
          <p style="font-size: 12px; margin-top: 6px;">Explore our fleet to buy or rent exotic vehicles.</p>
        </div>
      `;
      summary.innerHTML = '';
      const chkBtn = $('#btn-drawer-checkout');
      if (chkBtn) chkBtn.disabled = true;
      return;
    }

    list.innerHTML = AppState.cart.map(item => {
      const isRent = item.kind === 'rent';
      const itemPrice = isRent ? item.rentDaily * item.days : item.price;
      const subtitle = isRent
        ? `Rental (${item.days} days from ${item.startDate})`
        : `Purchase (${item.purchaseOption === 'deposit' ? '10% Deposit' : 'Full Payment'})`;

      return `
        <div class="cart-item-card">
          <img src="${item.image}" alt="${item.model}" class="cart-item-img">
          <div class="cart-item-info">
            <h4 class="cart-item-title">${item.brand} ${item.model}</h4>
            <div style="font-size: 11px; color: var(--text-dim); margin: 2px 0;">${subtitle}</div>
            <div class="cart-item-price">${renderMoney(itemPrice)}</div>
          </div>
          <button class="btn-remove-item" data-remove-cart="${item.cartItemId}" title="Remove item">✕</button>
        </div>
      `;
    }).join('');

    const totals = calculateCartTotals();
    summary.innerHTML = `
      ${totals.buyTotal > 0 ? `<div class="summary-row"><span>Purchases</span><span>${renderMoney(totals.buyTotal)}</span></div>` : ''}
      ${totals.rentTotal > 0 ? `<div class="summary-row"><span>Rentals</span><span>${renderMoney(totals.rentTotal)}</span></div>` : ''}
      <div class="summary-row total">
        <span>Due Today</span>
        <span style="color: var(--red);">${renderMoney(totals.dueToday)}</span>
      </div>
    `;

    const chkBtn = $('#btn-drawer-checkout');
    if (chkBtn) chkBtn.disabled = false;
  }

  function openCartDrawer() {
    closeAllModals();
    renderCartDrawer();
    const dr = $('#drawer-cart');
    if (dr) dr.classList.add('active');
  }

  function renderWishlistDrawer() {
    const list = $('#drawer-wishlist-items');
    if (!list) return;

    if (AppState.wishlist.length === 0) {
      list.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; color: var(--text-muted);">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 12px; opacity: 0.5;">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <p>Your dream garage is empty.</p>
          <p style="font-size: 12px; margin-top: 6px;">Click the heart icon on any vehicle to save it.</p>
        </div>
      `;
      return;
    }

    list.innerHTML = AppState.wishlist.map(id => {
      const v = getVehicleById(id);
      if (!v) return '';

      return `
        <div class="cart-item-card">
          <img src="${v.images.hero}" alt="${v.model}" class="cart-item-img">
          <div class="cart-item-info">
            <h4 class="cart-item-title">${v.brand} ${v.model}</h4>
            <div style="font-size: 11px; color: var(--text-dim);">${v.year} · ${v.powerHp} HP</div>
            <div class="cart-item-price">${renderMoney(v.price)}</div>
          </div>
          <button class="btn-nike-pill btn-white" style="padding: 4px 10px; font-size: 11px;" data-detail="${v.id}">View</button>
          <button class="btn-remove-item" data-remove-wishlist="${v.id}" title="Remove">✕</button>
        </div>
      `;
    }).join('');
  }

  function openWishlistDrawer() {
    closeAllModals();
    renderWishlistDrawer();
    const dr = $('#drawer-wishlist');
    if (dr) dr.classList.add('active');
  }

  // -------------------------------------------------------------
  // CHECKOUT MODAL & PROCESSING FLOW
  // -------------------------------------------------------------
  let checkoutPaymentMethod = 'card';

  function openCheckoutModal() {
    if (AppState.cart.length === 0) {
      showToast('Please add a vehicle to cart first');
      return;
    }

    closeAllModals();
    const modal = $('#modal-checkout');
    if (!modal) return;

    renderCheckoutForm();
    modal.classList.add('active');
  }

  function renderCheckoutForm() {
    const sheet = $('#checkout-sheet-content');
    if (!sheet) return;

    const totals = calculateCartTotals();

    sheet.innerHTML = `
      <button class="modal-close-btn" data-close-modal aria-label="Close">✕</button>
      <h2 style="font-family: var(--font-display); font-size: 28px; font-weight: 900; text-transform: uppercase;">
        Secure Allocation & Checkout
      </h2>
      <p style="color: var(--text-muted); font-size: 12px; margin-bottom: 16px;">
        100% Secure SSL encrypted gateway. Official dealership documentation provided.
      </p>

      <div class="payment-method-grid">
        <button class="pm-btn ${checkoutPaymentMethod === 'card' ? 'active' : ''}" data-pm="card">
          <b>Credit / Debit Card</b>
          <small>Visa, Mastercard, Amex</small>
        </button>
        <button class="pm-btn ${checkoutPaymentMethod === 'momo' ? 'active' : ''}" data-pm="momo">
          <b>MTN MoMo</b>
          <small>Instant Mobile Money (RW)</small>
        </button>
        <button class="pm-btn ${checkoutPaymentMethod === 'airtel' ? 'active' : ''}" data-pm="airtel">
          <b>Airtel Money</b>
          <small>Instant Mobile Money</small>
        </button>
        <button class="pm-btn ${checkoutPaymentMethod === 'apple' ? 'active' : ''}" data-pm="apple">
          <b>Apple Pay / Crypto</b>
          <small>One-touch allocation</small>
        </button>
      </div>

      <div id="checkout-dynamic-fields">
        ${checkoutPaymentMethod === 'card' ? `
          <div class="form-group">
            <input class="form-input" id="cc-num" placeholder="Card Number (e.g. 4242 •••• •••• 4242)" maxlength="19">
          </div>
          <div class="form-group">
            <input class="form-input" id="cc-name" placeholder="Cardholder Name">
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <input class="form-input" id="cc-exp" placeholder="MM/YY" maxlength="5">
            <input class="form-input" id="cc-cvc" placeholder="CVC" maxlength="4" type="password">
          </div>
        ` : `
          <div class="form-group">
            <input class="form-input" id="momo-phone" placeholder="Mobile Phone Number (e.g. 078 123 4567)" maxlength="13">
          </div>
          <p style="font-size: 12px; color: var(--text-dim); margin-bottom: 12px;">
            You will receive an official authorization prompt on your mobile handset to approve the allocation.
          </p>
        `}
      </div>

      <div class="summary-row total" style="margin: 20px 0 16px;">
        <span>Amount Due Today:</span>
        <span style="color: var(--red);">${renderMoney(totals.dueToday)}</span>
      </div>

      <p class="form-error" id="checkout-err"></p>
      <button class="btn-nike-pill btn-red" id="btn-submit-payment" style="width: 100%; height: 48px; justify-content: center; font-size: 15px;">
        Authorize & Allocate Vehicle (${renderMoney(totals.dueToday)})
      </button>
    `;

    // Bind payment selector buttons
    $$('.pm-btn', sheet).forEach(b => {
      b.onclick = () => {
        checkoutPaymentMethod = b.dataset.pm;
        renderCheckoutForm();
      };
    });

    // Formatting helpers
    const ccNum = $('#cc-num');
    if (ccNum) {
      ccNum.oninput = (e) => {
        let v = e.target.value.replace(/\D/g, '').slice(0, 16);
        e.target.value = v.replace(/(.{4})/g, '$1 ').trim();
      };
    }

    const ccExp = $('#cc-exp');
    if (ccExp) {
      ccExp.oninput = (e) => {
        let v = e.target.value.replace(/\D/g, '').slice(0, 4);
        e.target.value = v.length > 2 ? v.slice(0, 2) + '/' + v.slice(2) : v;
      };
    }

    $('#btn-submit-payment').onclick = processCheckout;
  }

  function processCheckout() {
    const err = $('#checkout-err');
    if (checkoutPaymentMethod === 'card') {
      const num = ($('#cc-num')?.value || '').replace(/\s/g, '');
      const name = $('#cc-name')?.value.trim();
      const exp = $('#cc-exp')?.value.trim();
      const cvc = $('#cc-cvc')?.value.trim();

      if (num.length < 13) {
        if (err) err.textContent = 'Please enter a valid card number.';
        return;
      }
      if (!name) {
        if (err) err.textContent = 'Please enter the cardholder name.';
        return;
      }
      if (!exp || exp.length < 5) {
        if (err) err.textContent = 'Please enter a valid expiry date (MM/YY).';
        return;
      }
      if (!cvc || cvc.length < 3) {
        if (err) err.textContent = 'Please enter the security CVC code.';
        return;
      }
    } else if (checkoutPaymentMethod === 'momo' || checkoutPaymentMethod === 'airtel') {
      const phone = ($('#momo-phone')?.value || '').replace(/\s/g, '');
      if (phone.length < 8) {
        if (err) err.textContent = 'Please enter a valid mobile number.';
        return;
      }
    }

    if (err) err.textContent = '';

    const sheet = $('#checkout-sheet-content');
    sheet.innerHTML = `
      <div style="text-align: center; padding: 48px 20px;">
        <h3 style="font-family: var(--font-display); font-size: 26px; font-weight: 900; text-transform: uppercase; margin-bottom: 12px;">
          Securing Vehicle Allocation
        </h3>
        <p style="color: var(--text-muted); font-size: 13px; margin-bottom: 24px;">
          Contacting dealership vault & verifying reserve allocation...
        </p>
        <div style="width: 50px; height: 50px; border: 4px solid var(--line); border-top-color: var(--red); border-radius: 50%; margin: 0 auto; animation: spin 0.8s linear infinite;"></div>
      </div>
      <style>@keyframes spin { 100% { transform: rotate(360deg); } }</style>
    `;

    setTimeout(() => {
      completeCheckoutSuccess();
    }, 2400);
  }

  function completeCheckoutSuccess() {
    const orderRef = 'HN-' + Date.now().toString().slice(-7);
    const totals = calculateCartTotals();
    const purchasedItems = [...AppState.cart];

    // Clear cart
    AppState.cart = [];
    saveCart();

    const sheet = $('#checkout-sheet-content');
    sheet.innerHTML = `
      <div style="text-align: center; margin-bottom: 18px;">
        <div style="width: 58px; height: 58px; border-radius: 50%; background: var(--green); color: #000; font-size: 28px; font-weight: 900; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px;">
          ✓
        </div>
        <h2 style="font-family: var(--font-display); font-size: 32px; font-weight: 900; text-transform: uppercase;">
          Allocation Confirmed!
        </h2>
        <p style="color: var(--text-muted); font-size: 13px;">
          Your official Huranow Motors vehicle reservation is locked.
        </p>
      </div>

      <div class="receipt-box">
        <div class="receipt-header">
          <b style="font-size: 14px; letter-spacing: 0.1em;">HURANOW MOTORS OFFICIAL CERTIFICATE</b>
          <div>Reference: ${orderRef}</div>
          <div>Date: ${new Date().toLocaleDateString()}</div>
        </div>
        <div style="margin: 12px 0;">
          ${purchasedItems.map(i => `
            <div class="receipt-row" style="margin-bottom: 4px;">
              <span>${i.brand} ${i.model} (${i.kind.toUpperCase()})</span>
              <b>${renderMoney(i.kind === 'rent' ? i.rentDaily * i.days : i.price)}</b>
            </div>
          `).join('')}
        </div>
        <div style="border-top: 1px dashed #888; padding-top: 8px;">
          <div class="receipt-row">
            <b>PAID TODAY:</b>
            <b style="color: var(--red);">${renderMoney(totals.dueToday)}</b>
          </div>
          <div class="receipt-row" style="color: #666; font-size: 11px;">
            <span>Balance due at hand-over:</span>
            <span>${renderMoney(totals.grandTotal - totals.dueToday)}</span>
          </div>
        </div>
      </div>

      <button class="btn-nike-pill btn-white" data-close-modal style="width: 100%; height: 46px; justify-content: center;">
        Done & Keep Browsing
      </button>
    `;
  }

  // -------------------------------------------------------------
  // AUTH MODAL & PROFILE LOGIC
  // -------------------------------------------------------------
  function openAuthModal(mode = 'signup') {
    closeAllModals();
    const modal = $('#modal-auth');
    const card = $('#auth-split-card');
    if (!modal || !card) return;

    card.dataset.mode = mode;
    modal.classList.add('active');
  }

  function handleAuthSuccess(userData) {
    AppState.user = userData;
    Storage.set('hn_user', userData);
    initStorage();
    renderUserAccountUI();
    closeAllModals();
    showToast(`Welcome to Huranow Motors, ${userData.name}!`);
  }

  function renderUserAccountUI() {
    const acctBtn = $('#nav-account-btn');
    if (!acctBtn) return;

    if (AppState.user) {
      acctBtn.innerHTML = `
        <div class="user-avatar-img">${AppState.user.name.charAt(0).toUpperCase()}</div>
        <span style="font-weight: 700; font-size: 12px; text-transform: uppercase;">${AppState.user.name}</span>
      `;
      acctBtn.onclick = () => {
        if (confirm(`Logged in as ${AppState.user.name}. Do you want to sign out?`)) {
          AppState.user = null;
          Storage.set('hn_user', null);
          initStorage();
          renderUserAccountUI();
          showToast('Signed out of Huranow Motors');
        }
      };
    } else {
      acctBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span style="font-weight: 700; font-size: 12px; text-transform: uppercase;">Sign In</span>
      `;
      acctBtn.onclick = () => openAuthModal('login');
    }
  }

  // -------------------------------------------------------------
  // SELL / LIST A VEHICLE MODAL
  // -------------------------------------------------------------
  function openSellModal() {
    closeAllModals();
    const modal = $('#modal-sell');
    if (!modal) return;
    modal.classList.add('active');
  }

  function handleSellSubmit(e) {
    e.preventDefault();
    const form = e.target;

    const brand = form.brand.value.trim();
    const model = form.model.value.trim();
    const category = form.category.value;
    const condition = form.condition.value;
    const year = parseInt(form.year.value) || 2026;
    const mileage = parseInt(form.mileage.value) || 0;
    const price = parseInt(form.price.value) || 0;
    const rentDaily = parseInt(form.rentDaily.value) || 0;
    const powerHp = parseInt(form.powerHp.value) || 450;
    const accel0to100 = form.accel0to100.value.trim() || '3.5s';
    const topSpeed = form.topSpeed.value.trim() || '280 km/h';
    const dealership = form.dealership.value.trim() || (AppState.user ? AppState.user.name + ' Vault' : 'Private Collector');
    const description = form.description.value.trim() || 'Exquisite high performance vehicle, fully serviced with documented pedigree.';
    const imageUrl = form.imageUrl.value.trim() || 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80';

    if (!price && !rentDaily) {
      alert('Please specify either a sale price, daily rent price, or both.');
      return;
    }

    const newVehicle = {
      id: 'custom-' + Date.now(),
      brand,
      model,
      category,
      condition,
      year,
      mileage,
      fuel: 'Petrol / Hybrid Performance',
      transmission: 'Automatic Dual-Clutch',
      drivetrain: 'All-Wheel Drive (AWD)',
      powerHp,
      accel0to100,
      topSpeed,
      seats: 2,
      colorName: 'Custom Specification',
      dealership,
      price,
      rentDaily,
      tag: 'NEW LISTING',
      badge: 'COMMUNITY LISTING',
      is3dAvailable: true,
      model3dType: category === 'suv' ? 'suv' : 'hypercar',
      description,
      images: {
        hero: imageUrl,
        interior: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
        rear: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80'
      },
      features: ['Full Inspection Certified', 'Dealer Warranty Included', 'Available for Test Drive']
    };

    const userListings = Storage.get('hn_custom_listings', []);
    userListings.unshift(newVehicle);
    Storage.set('hn_custom_listings', userListings);

    loadVehicles();
    renderFleetGrid();
    closeAllModals();
    form.reset();
    showToast(`Vehicle "${brand} ${model}" published to live marketplace!`);
  }

  // -------------------------------------------------------------
  // 3D STUDIO EMBED CONTROLLER
  // -------------------------------------------------------------
  function init3DStudio() {
    const container = document.getElementById('featured-3d-canvas-container');
    if (!container || !window.Huranow3DStudio) return;

    AppState.studioInstance = new window.Huranow3DStudio('featured-3d-canvas-container');

    // Scramble button
    const scrambleBtn = $('#studio-btn-scramble');
    if (scrambleBtn) {
      scrambleBtn.onclick = () => {
        const isExploded = AppState.studioInstance.toggleExplode();
        scrambleBtn.classList.toggle('scrambled', isExploded);
        scrambleBtn.innerHTML = isExploded
          ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline></svg> Reassemble Car`
          : `💥 Scramble / Explode Parts`;
        showToast(isExploded ? 'Exploded engineering view activated' : 'Reassembled to factory form');
      };
    }

    // View mode pills
    $$('#studio-view-pills button').forEach(b => {
      b.onclick = () => {
        $$('#studio-view-pills button').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        const view = b.dataset.view;

        if (view === 'outside') {
          AppState.studioInstance.setViewMode('outside');
        } else {
          AppState.studioInstance.setViewMode('cockpit', view);
        }
      };
    });

    // Model archetype switcher
    $$('#studio-model-selector button').forEach(b => {
      b.onclick = () => {
        $$('#studio-model-selector button').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        AppState.studioInstance.buildVehicle(b.dataset.model);
        showToast(`Loaded 3D ${b.textContent}`);
      };
    });

    // Exterior paint swatches
    $$('.swatch-paint').forEach(s => {
      s.onclick = () => {
        $$('.swatch-paint').forEach(x => x.classList.remove('active'));
        s.classList.add('active');
        AppState.studioInstance.setPaintColor(s.dataset.color);
      };
    });

    // Interior leather swatches
    $$('.swatch-interior').forEach(s => {
      s.onclick = () => {
        $$('.swatch-interior').forEach(x => x.classList.remove('active'));
        s.classList.add('active');
        AppState.studioInstance.setInteriorColor(s.dataset.color);
      };
    });

    // Wheel styles
    $$('#studio-wheels button').forEach(b => {
      b.onclick = () => {
        $$('#studio-wheels button').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        AppState.studioInstance.setWheelStyle(b.dataset.wheel);
      };
    });

    // Quick action buttons
    const btnHeadlights = $('#studio-btn-headlights');
    if (btnHeadlights) {
      btnHeadlights.onclick = () => {
        const on = AppState.studioInstance.toggleHeadlights();
        btnHeadlights.classList.toggle('active', on);
      };
    }

    const btnAutoRotate = $('#studio-btn-autorotate');
    if (btnAutoRotate) {
      btnAutoRotate.onclick = () => {
        const on = AppState.studioInstance.toggleAutoRotate();
        btnAutoRotate.classList.toggle('active', on);
      };
    }

    // Zoom In & Zoom Out HUD Buttons
    $('#studio-btn-zoomin')?.addEventListener('click', () => {
      AppState.studioInstance?.zoom(-0.8);
    });
    $('#studio-btn-zoomout')?.addEventListener('click', () => {
      AppState.studioInstance?.zoom(0.8);
    });
  }

  function scrollTo3DStudio(modelType = 'real_ferrari') {
    const section = $('#section-3d-studio');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    if (AppState.studioInstance) {
      AppState.studioInstance.buildVehicle(modelType);
      $$('#studio-model-selector button').forEach(b => {
        b.classList.toggle('active', b.dataset.model === modelType);
      });
      showToast('Loaded 3D Configurator Studio');
    }
  }

  // -------------------------------------------------------------
  // MODAL CONTROLS & BINDINGS
  // -------------------------------------------------------------
  function closeAllModals() {
    $$('.modal-backdrop').forEach(m => m.classList.remove('active'));
    $$('.drawer-container').forEach(d => d.classList.remove('active'));
  }

  function bindEventListeners() {
    // Nav links smooth scroll & filters
    $$('.nav-link').forEach(link => {
      link.onclick = () => {
        $$('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        const target = link.dataset.target;
        if (target === 'studio') {
          scrollTo3DStudio();
        } else if (target === 'buy' || target === 'rent') {
          AppState.mode = target;
          updateFilterUI();
          renderFleetGrid();
          $('#fleet-grid-section')?.scrollIntoView({ behavior: 'smooth' });
        } else if (target === 'sell') {
          openSellModal();
        } else {
          AppState.mode = 'all';
          updateFilterUI();
          renderFleetGrid();
          $('#fleet-grid-section')?.scrollIntoView({ behavior: 'smooth' });
        }
      };
    });

    // Main mode tabs
    $$('.tab-btn').forEach(btn => {
      btn.onclick = () => {
        AppState.mode = btn.dataset.mode;
        updateFilterUI();
        renderFleetGrid();
      };
    });

    // Category chips
    $$('.chip-btn').forEach(btn => {
      btn.onclick = () => {
        AppState.category = btn.dataset.category;
        updateFilterUI();
        renderFleetGrid();
      };
    });

    // Search input
    const searchInput = $('#search-input');
    if (searchInput) {
      searchInput.oninput = (e) => {
        AppState.searchQuery = e.target.value;
        renderFleetGrid();
      };
    }

    // Sort select
    const sortSelect = $('#sort-select');
    if (sortSelect) {
      sortSelect.onchange = (e) => {
        AppState.sort = e.target.value;
        renderFleetGrid();
      };
    }

    // Currency picker
    const currSelect = $('#currency-select');
    if (currSelect) {
      currSelect.onchange = (e) => {
        AppState.currency = e.target.value;
        currentCurrency = e.target.value;
        renderFleetGrid();
        renderCartDrawer();
        showToast(`Currency changed to ${e.target.value}`);
      };
    }

    // Global Delegated Clicks
    document.addEventListener('click', (e) => {
      // Close modal
      if (e.target.closest('[data-close-modal]')) {
        closeAllModals();
        return;
      }

      // Close backdrop click
      if (e.target.classList.contains('modal-backdrop')) {
        closeAllModals();
        return;
      }

      // View Detail
      const detailBtn = e.target.closest('[data-detail]');
      if (detailBtn) {
        openVehicleDetail(detailBtn.dataset.detail);
        return;
      }

      // Launch 3D Studio directly
      const launch3DBtn = e.target.closest('[data-launch-3d]');
      if (launch3DBtn) {
        const v = getVehicleById(launch3DBtn.dataset.launch3d);
        if (v && AppState.studioInstance) {
          AppState.studioInstance.loadVehicleConfig(v);
        }
        scrollTo3DStudio(v ? v.model3dType : 'real_ferrari');
        return;
      }

      // Wishlist toggle
      const wishBtn = e.target.closest('[data-wishlist]');
      if (wishBtn) {
        const id = wishBtn.dataset.wishlist;
        const idx = AppState.wishlist.indexOf(id);
        if (idx > -1) {
          AppState.wishlist.splice(idx, 1);
          showToast('Removed from Garage');
        } else {
          AppState.wishlist.push(id);
          showToast('Saved to Garage');
        }
        saveWishlist();
        return;
      }

      // Remove from cart
      const rmCart = e.target.closest('[data-remove-cart]');
      if (rmCart) {
        const cartItemId = rmCart.dataset.removeCart;
        AppState.cart = AppState.cart.filter(i => i.cartItemId !== cartItemId);
        saveCart();
        return;
      }

      // Remove from wishlist
      const rmWish = e.target.closest('[data-remove-wishlist]');
      if (rmWish) {
        const id = rmWish.dataset.removeWishlist;
        AppState.wishlist = AppState.wishlist.filter(x => x !== id);
        saveWishlist();
        return;
      }

      // Auth switch buttons
      const authGo = e.target.closest('[data-auth-go]');
      if (authGo) {
        const card = $('#auth-split-card');
        if (card) card.dataset.mode = authGo.dataset.authGo;
        return;
      }
    });

    // Escape key closes modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAllModals();
    });

    // Nav Cart & Wishlist Buttons
    $('#nav-cart-btn')?.addEventListener('click', openCartDrawer);
    $('#nav-wishlist-btn')?.addEventListener('click', openWishlistDrawer);
    $('#nav-sell-btn')?.addEventListener('click', openSellModal);
    $('#btn-drawer-checkout')?.addEventListener('click', openCheckoutModal);

    // Form Submissions
    $('#form-login')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = e.target.email.value.trim();
      const name = email.split('@')[0] || 'Member';
      handleAuthSuccess({ email, name });
    });

    $('#form-signup')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = e.target.name.value.trim();
      const email = e.target.email.value.trim();
      handleAuthSuccess({ email, name });
    });

    $('#form-sell-vehicle')?.addEventListener('submit', handleSellSubmit);
  }

  // Initialization
  document.addEventListener('DOMContentLoaded', () => {
    initStorage();
    renderUserAccountUI();
    updateCartCount();
    updateWishlistCount();
    renderFleetGrid();
    init3DStudio();
    bindEventListeners();
  });

})();

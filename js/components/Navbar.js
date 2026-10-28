/* ==========================================================================
   Navbar Component (Final 100% Full Production)
   ========================================================================== */

function renderNavbar(currentTab) {
  const store = window.SmartParkingStore;

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'live-parking', label: 'Live Parking', icon: '🅿️' },
    { id: 'ai-detection', label: 'AI Detection', icon: '🤖' },
    { id: 'gate-scanner', label: 'ALPR Gate', icon: '📸' },
    { id: 'navigation', label: 'Navigation', icon: '🗺️' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'architecture', label: 'System Overview', icon: '🧠' }
  ];

  const linksHtml = tabs.map(tab => `
    <li>
      <button class="nav-btn ${currentTab === tab.id ? 'active' : ''}" data-tab="${tab.id}">
        <span>${tab.icon}</span> ${tab.label}
      </button>
    </li>
  `).join('');

  return `
    <nav class="navbar">
      <div class="app-container nav-content">
        <a href="#" class="brand-logo" data-tab="dashboard">
          <div class="brand-icon">🅿️</div>
          <div>
            <div class="brand-title">SmartPark <span class="text-gradient">AI</span></div>
            <div class="brand-sub">YOLOv8 VISION SYSTEM (100% FINAL)</div>
          </div>
        </a>

        <ul class="nav-links" id="navLinks">
          ${linksHtml}
        </ul>

        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          <!-- Multi-Facility Selector Dropdown -->
          <select id="facilitySelector" style="background: rgba(14,21,38,0.9); color: var(--color-ai-cyan); border: 1px solid var(--border-bright); padding: 6px 10px; border-radius: 8px; font-size: 0.78rem; font-weight: 600; cursor: pointer;">
            <option value="ground" ${store.activeFacility === 'ground' ? 'selected' : ''}>Main Ground Deck (50 Slots)</option>
            <option value="tower" ${store.activeFacility === 'tower' ? 'selected' : ''}>East Tower (80 Slots)</option>
            <option value="plaza" ${store.activeFacility === 'plaza' ? 'selected' : ''}>West Plaza & EV (30 Slots)</option>
          </select>

          <!-- Auto Traffic Simulator Toggle Button -->
          <button class="btn btn-sm ${store.isAutoTrafficActive ? 'btn-warning' : 'btn-secondary'}" id="toggleAutoTrafficBtn" title="Toggle Auto Traffic Engine">
            <span>${store.isAutoTrafficActive ? '⏸️ Auto: ON' : '▶️ Auto: OFF'}</span>
          </button>

          <button class="mobile-menu-btn" id="mobileMenuToggle" aria-label="Toggle Menu">
            ☰
          </button>
        </div>
      </div>
    </nav>
  `;
}

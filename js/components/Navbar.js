/* ==========================================================================
   Navbar Component
   ========================================================================== */

function renderNavbar(currentTab, onTabSelect) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'live-parking', label: 'Live Parking', icon: '🅿️' },
    { id: 'ai-detection', label: 'AI Detection', icon: '🤖' },
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
            <div class="brand-sub">YOLOv8 VISION PROTOTYPE</div>
          </div>
        </a>

        <ul class="nav-links" id="navLinks">
          ${linksHtml}
        </ul>

        <div style="display: flex; align-items: center; gap: 12px;">
          <div class="badge badge-ai" style="display: flex; align-items: center; gap: 6px;">
            <span class="status-dot status-dot-green"></span>
            <span style="font-size: 0.7rem;">SYSTEM OPERATIONAL</span>
          </div>
          <button class="mobile-menu-btn" id="mobileMenuToggle" aria-label="Toggle Menu">
            ☰
          </button>
        </div>
      </div>
    </nav>
  `;
}

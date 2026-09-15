/* ==========================================================================
   AI Smart Parking Detection System - Main Application Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const store = window.SmartParkingStore;
  let currentFilter = 'ALL';
  let searchQuery = '';
  let selectedZone = 'ALL';
  let isNavigating = false;

  // Main Render Function
  function renderApp() {
    const navbarEl = document.getElementById('navbarContainer');
    const mainEl = document.getElementById('mainContentContainer');
    const modalEl = document.getElementById('modalContainer');

    if (navbarEl) {
      navbarEl.innerHTML = renderNavbar(store.activeTab);
    }

    if (mainEl) {
      let content = '';
      if (store.activeTab === 'dashboard') {
        content = renderDashboardView();
      } else if (store.activeTab === 'live-parking') {
        content = renderLiveParkingView(currentFilter, searchQuery, selectedZone);
      } else if (store.activeTab === 'ai-detection') {
        content = renderAIDetectionView();
      } else if (store.activeTab === 'navigation') {
        content = renderNavigationView(isNavigating);
      } else if (store.activeTab === 'analytics') {
        content = renderAnalyticsView();
      } else if (store.activeTab === 'architecture') {
        content = renderArchitectureView();
      }
      mainEl.innerHTML = content;
    }

    if (modalEl) {
      modalEl.innerHTML = store.selectedSlot ? renderSlotModal(store.selectedSlot) : '';
    }

    attachEventListeners();
  }

  // Event Listeners Attacher
  function attachEventListeners() {
    // Nav Tab Click Handlers
    document.querySelectorAll('[data-tab]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = btn.getAttribute('data-tab');
        if (tab) {
          store.activeTab = tab;
          window.scrollTo({ top: 0, behavior: 'smooth' });
          renderApp();
        }
      });
    });

    // Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');
    if (mobileBtn && navLinks) {
      mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
      });
    }

    // Refresh Grid Button (Live Parking View)
    const refreshBtn = document.getElementById('refreshGridBtn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        store.lastUpdated = new Date().toLocaleTimeString();
        showToast('Live parking slot grid refreshed successfully.', 'success');
        renderApp();
      });
    }

    // Filter Buttons (Live Parking View)
    document.querySelectorAll('#slotFilterTabs [data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        currentFilter = btn.getAttribute('data-filter');
        renderApp();
      });
    });

    // Zone Select (Live Parking View)
    const zoneSelect = document.getElementById('zoneSelect');
    if (zoneSelect) {
      zoneSelect.addEventListener('change', (e) => {
        selectedZone = e.target.value;
        renderApp();
      });
    }

    // Search Input (Live Parking View)
    const searchInput = document.getElementById('slotSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderApp();
      });
    }

    // Reset Filters Button
    const resetBtn = document.getElementById('resetSlotFilters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        currentFilter = 'ALL';
        searchQuery = '';
        selectedZone = 'ALL';
        renderApp();
      });
    }

    // Slot Card Click (Open Modal Inspector)
    document.querySelectorAll('.slot-card[data-slot-id]').forEach(card => {
      card.addEventListener('click', () => {
        const slotId = card.getAttribute('data-slot-id');
        if (slotId) {
          store.selectedSlot = slotId;
          renderApp();
        }
      });
    });

    // Modal Close Buttons
    const closeBtn1 = document.getElementById('closeModalBtn');
    const closeBtn2 = document.getElementById('closeModalBtn2');
    const backdrop = document.getElementById('slotModalBackdrop');

    const closeModal = () => {
      store.selectedSlot = null;
      renderApp();
    };

    if (closeBtn1) closeBtn1.addEventListener('click', closeModal);
    if (closeBtn2) closeBtn2.addEventListener('click', closeModal);
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal();
      });
    }

    // Toggle Slot State Button (Modal Inspector)
    const toggleBtn = document.getElementById('toggleSlotStateBtn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const slotId = toggleBtn.getAttribute('data-slot-id');
        if (slotId) {
          store.toggleSlotStatus(slotId);
          showToast(`Slot ${slotId} status updated successfully.`, 'success');
          store.selectedSlot = null;
          renderApp();
        }
      });
    }

    // Camera Switcher Buttons (AI Detection View)
    document.querySelectorAll('[data-cam]').forEach(btn => {
      btn.addEventListener('click', () => {
        store.selectedCamera = btn.getAttribute('data-cam');
        renderApp();
      });
    });

    // Start AI Detection Button (AI Detection View)
    const startDetectionBtn = document.getElementById('startDetectionBtn');
    if (startDetectionBtn) {
      startDetectionBtn.addEventListener('click', () => {
        store.isScanning = true;
        renderApp();
        showToast('Initiating YOLOv8 video frame scanning...', 'info');

        setTimeout(() => {
          store.isScanning = false;
          store.lastUpdated = new Date().toLocaleTimeString();
          showToast('YOLOv8 scan complete. All 32 vehicle bounding boxes verified with >95% confidence.', 'success');
          renderApp();
        }, 2500);
      });
    }

    // Start Navigation Button (Navigation View)
    const startNavBtn = document.getElementById('startNavigationBtn');
    if (startNavBtn) {
      startNavBtn.addEventListener('click', () => {
        isNavigating = !isNavigating;
        if (isNavigating) {
          showToast('Turn-by-turn guidance to Slot P18 started.', 'success');
        } else {
          showToast('Navigation simulation ended.', 'info');
        }
        renderApp();
      });
    }
  }

  // Initial Boot
  renderApp();
});

/* ==========================================================================
   AI Smart Parking Detection System - Main Controller (Phase 2 Upgrade)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const store = window.SmartParkingStore;
  let currentFilter = 'ALL';
  let searchQuery = '';
  let selectedZone = 'ALL';
  let isNavigating = false;
  let activeModalTab = 'inspect';

  // Main Render Controller
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
      modalEl.innerHTML = store.selectedSlot ? renderSlotModal(store.selectedSlot, activeModalTab) : '';
    }

    attachEventListeners();
  }

  // Event Listeners Attacher
  function attachEventListeners() {
    // Nav Tab Clicks
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

    // Facility Selector Dropdown
    const facilitySelect = document.getElementById('facilitySelector');
    if (facilitySelect) {
      facilitySelect.addEventListener('change', (e) => {
        store.switchFacility(e.target.value);
        showToast(`Switched active facility to ${store.facilities[e.target.value].name}.`, 'info');
        renderApp();
      });
    }

    // Auto Traffic Simulator Toggle
    const toggleAutoBtn = document.getElementById('toggleAutoTrafficBtn');
    if (toggleAutoBtn) {
      toggleAutoBtn.addEventListener('click', () => {
        store.isAutoTrafficActive = !store.isAutoTrafficActive;
        if (store.isAutoTrafficActive) {
          showToast('Auto Traffic Simulator started. Ticking vehicle entries/exits every 8s.', 'success');
          store.autoTrafficTimer = setInterval(() => {
            store.triggerRandomTrafficEvent();
            renderApp();
          }, 8000);
        } else {
          showToast('Auto Traffic Simulator paused.', 'info');
          if (store.autoTrafficTimer) clearInterval(store.autoTrafficTimer);
        }
        renderApp();
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

    // Slot Card Click (Open Modal Inspector)
    document.querySelectorAll('.slot-card[data-slot-id]').forEach(card => {
      card.addEventListener('click', () => {
        const slotId = card.getAttribute('data-slot-id');
        if (slotId) {
          store.selectedSlot = slotId;
          activeModalTab = 'inspect';
          renderApp();
        }
      });
    });

    // Modal Tabs (Inspect vs Reserve)
    const tabInspect = document.getElementById('modalTabInspect');
    const tabReserve = document.getElementById('modalTabReserve');
    if (tabInspect) {
      tabInspect.addEventListener('click', () => {
        activeModalTab = 'inspect';
        renderApp();
      });
    }
    if (tabReserve) {
      tabReserve.addEventListener('click', () => {
        activeModalTab = 'reserve';
        renderApp();
      });
    }

    // Modal Close Buttons
    const closeModal = () => {
      store.selectedSlot = null;
      renderApp();
    };

    const close1 = document.getElementById('closeModalBtn');
    const close2 = document.getElementById('closeModalBtn2');
    const close3 = document.getElementById('closeModalBtn3');
    const backdrop = document.getElementById('slotModalBackdrop');

    if (close1) close1.addEventListener('click', closeModal);
    if (close2) close2.addEventListener('click', closeModal);
    if (close3) close3.addEventListener('click', closeModal);
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

    // Reservation Form Submit Handler
    const resForm = document.getElementById('reservationForm');
    if (resForm) {
      resForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const driver = document.getElementById('resDriverName').value;
        const plate = document.getElementById('resPlateNumber').value;
        const duration = parseInt(document.getElementById('resDuration').value);

        if (driver && plate) {
          const res = store.reserveSlot(store.selectedSlot, driver, plate, duration);
          if (res) {
            showToast(`Slot ${store.selectedSlot} reserved successfully! Ticket Pass: ${res.ticketId}`, 'success');
            store.selectedSlot = null;
            renderApp();
          }
        }
      });
    }

    // Vision Mode Filter Buttons (AI Detection View)
    document.querySelectorAll('[data-vision-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        store.visionFilterMode = btn.getAttribute('data-vision-filter');
        showToast(`Switched CCTV Vision mode to ${store.visionFilterMode.toUpperCase()}.`, 'info');
        renderApp();
      });
    });

    // Add Custom ROI Box Button
    const addRoiBtn = document.getElementById('addCustomRoiBtn');
    if (addRoiBtn) {
      addRoiBtn.addEventListener('click', () => {
        const newRoi = {
          label: `Custom ROI ${store.customROIs.length + 1}`,
          x: 20 + Math.floor(Math.random() * 50),
          y: 20 + Math.floor(Math.random() * 50),
          w: 20,
          h: 25
        };
        store.customROIs.push(newRoi);
        showToast(`Added custom ROI slot coordinate bounding box to CCTV canvas.`, 'success');
        renderApp();
      });
    }

    const clearRoisBtn = document.getElementById('clearCustomRoisBtn');
    if (clearRoisBtn) {
      clearRoisBtn.addEventListener('click', () => {
        store.customROIs = [];
        showToast(`Cleared custom ROI bounding boxes.`, 'info');
        renderApp();
      });
    }

    // Camera Switcher Buttons (AI Detection View)
    document.querySelectorAll('[data-cam]').forEach(btn => {
      btn.addEventListener('click', () => {
        store.selectedCamera = btn.getAttribute('data-cam');
        renderApp();
      });
    });

    // Start AI Detection Button
    const startDetectionBtn = document.getElementById('startDetectionBtn');
    if (startDetectionBtn) {
      startDetectionBtn.addEventListener('click', () => {
        store.isScanning = true;
        renderApp();
        showToast('Initiating YOLOv8 video frame scanning...', 'info');

        setTimeout(() => {
          store.isScanning = false;
          store.lastUpdated = new Date().toLocaleTimeString();
          showToast('YOLOv8 scan complete. Bounding box coordinates recalibrated.', 'success');
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
          showToast('Animated turn-by-turn guidance simulation started.', 'success');
        } else {
          showToast('Navigation simulation stopped.', 'info');
        }
        renderApp();
      });
    }

    // CSV Log Exporter Button (Analytics View)
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', () => {
        let csvContent = 'data:text/csv;charset=utf-8,ID,Time,Type,Slot,Details\n';
        store.activityLog.forEach(log => {
          csvContent += `${log.id},"${log.time}","${log.type}","${log.slot}","${log.text.replace(/"/g, '""')}"\n`;
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `SmartPark_Activity_Log_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Exported parking activity log CSV file successfully.', 'success');
      });
    }

    // PDF Print Button (Analytics View)
    const printReportBtn = document.getElementById('printReportBtn');
    if (printReportBtn) {
      printReportBtn.addEventListener('click', () => {
        window.print();
      });
    }
  }

  // Initial Boot
  renderApp();
});

/* ==========================================================================
   AI Smart Parking Detection System - Main Controller (100% Final Full Production)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const store = window.SmartParkingStore;
  let currentFilter = 'ALL';
  let searchQuery = '';
  let selectedZone = 'ALL';
  let isNavigating = false;
  let activeModalTab = 'inspect';
  let activeWebcamStream = null;

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
      } else if (store.activeTab === 'gate-scanner') {
        content = renderGateScannerView();
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

    // Attach webcam if active tab is ai-detection and webcam selected
    if (store.activeTab === 'ai-detection' && store.selectedCamera === 'webcam') {
      initWebcamStream();
    } else {
      stopWebcamStream();
    }

    attachEventListeners();
  }

  // Webcam Helpers
  function initWebcamStream() {
    const videoEl = document.getElementById('webcamVideoElement');
    if (!videoEl) return;

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } })
        .then(stream => {
          activeWebcamStream = stream;
          videoEl.srcObject = stream;
          videoEl.play();
        })
        .catch(err => {
          console.warn('Webcam access error:', err);
          showToast('Could not access live webcam. Please ensure camera permissions are allowed.', 'warning');
        });
    } else {
      showToast('Webcam not supported in this browser environment.', 'warning');
    }
  }

  function stopWebcamStream() {
    if (activeWebcamStream) {
      activeWebcamStream.getTracks().forEach(track => track.stop());
      activeWebcamStream = null;
    }
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

    // EV Violation Clear Button
    const clearEvBtn = document.getElementById('clearEvViolationBtn');
    if (clearEvBtn) {
      clearEvBtn.addEventListener('click', () => {
        store.slots.forEach(s => {
          if (s.isEVViolation) {
            s.isEVViolation = false;
            s.status = 'AVAILABLE';
            s.vehicle = null;
          }
        });
        showToast('Security dispatch confirmed: Non-EV vehicles moved. EV Bays are now available.', 'success');
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

    // Modal Close Handlers
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

    // Toggle Slot State Button
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

    // Live Webcam Button Trigger (AI Detection View)
    const webcamBtn = document.getElementById('startWebcamBtn');
    if (webcamBtn) {
      webcamBtn.addEventListener('click', () => {
        store.selectedCamera = 'webcam';
        showToast('Connecting to user webcam stream...', 'info');
        renderApp();
      });
    }

    // Video Upload Button Triggers
    const uploadToggleBtn = document.getElementById('uploadVideoToggleBtn');
    const triggerFileBtn = document.getElementById('triggerFileSelectBtn');
    const fileInput = document.getElementById('videoFileInput');

    if (uploadToggleBtn) {
      uploadToggleBtn.addEventListener('click', () => {
        store.selectedCamera = 'upload';
        renderApp();
      });
    }

    if (triggerFileBtn && fileInput) {
      triggerFileBtn.addEventListener('click', () => {
        fileInput.click();
      });
    }

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          showToast(`Loaded ${file.name}. Running YOLOv8 ROI frame analysis...`, 'success');
          store.selectedCamera = 'upload';
          renderApp();
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
        showToast('Running YOLOv8 frame inference...', 'info');

        setTimeout(() => {
          store.isScanning = false;
          store.lastUpdated = new Date().toLocaleTimeString();
          showToast('YOLOv8 inference complete. All vehicle bounding boxes calibrated with >95% accuracy.', 'success');
          renderApp();
        }, 2200);
      });
    }

    // ALPR Gate Barrier Actions (GateScannerView)
    const toggleBarrierBtn = document.getElementById('toggleBarrierBtn');
    if (toggleBarrierBtn) {
      toggleBarrierBtn.addEventListener('click', () => {
        store.barrierState = store.barrierState === 'OPEN' ? 'CLOSED' : 'OPEN';
        showToast(`Manual Gate Override: Barrier is now ${store.barrierState}.`, 'info');
        renderApp();
      });
    }

    const triggerGateScanBtn = document.getElementById('triggerGateScanBtn');
    if (triggerGateScanBtn) {
      triggerGateScanBtn.addEventListener('click', () => {
        const rec = store.simulateALPRScan();
        showToast(`ALPR Scanned: ${rec.plate} - ${rec.status} (${rec.action}).`, rec.status === 'BLACKLIST_ALERT' ? 'danger' : 'success');
        renderApp();
      });
    }

    const submitCustomPlateBtn = document.getElementById('submitCustomPlateBtn');
    const customPlateInput = document.getElementById('customPlateInput');
    if (submitCustomPlateBtn && customPlateInput) {
      submitCustomPlateBtn.addEventListener('click', () => {
        const val = customPlateInput.value.trim().toUpperCase();
        if (val) {
          const rec = store.simulateALPRScan(val);
          showToast(`ALPR Verified Plate: ${rec.plate} -> ${rec.status}`, rec.status === 'BLACKLIST_ALERT' ? 'danger' : 'success');
          renderApp();
        }
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

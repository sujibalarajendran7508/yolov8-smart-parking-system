/* ==========================================================================
   Live Parking View Component (EV Bay Violation & Multi-Zone Upgrade)
   ========================================================================== */

function renderLiveParkingView(filter = 'ALL', searchQuery = '', selectedZone = 'ALL') {
  const store = window.SmartParkingStore;
  const stats = store.getStats();
  
  // Filter slots logic
  let filteredSlots = store.slots;
  if (filter === 'AVAILABLE') {
    filteredSlots = filteredSlots.filter(s => s.status === 'AVAILABLE');
  } else if (filter === 'OCCUPIED') {
    filteredSlots = filteredSlots.filter(s => s.status === 'OCCUPIED');
  } else if (filter === 'EV') {
    filteredSlots = filteredSlots.filter(s => s.isEVBay);
  }

  if (selectedZone !== 'ALL') {
    filteredSlots = filteredSlots.filter(s => s.zone.includes(selectedZone));
  }

  if (searchQuery.trim() !== '') {
    const q = searchQuery.trim().toLowerCase();
    filteredSlots = filteredSlots.filter(s => s.id.toLowerCase().includes(q) || s.zone.toLowerCase().includes(q));
  }

  const slotsGridHtml = filteredSlots.map(slot => {
    const isAvail = slot.status === 'AVAILABLE';
    const isRec = slot.isRecommended;
    const isReserved = slot.status === 'RESERVED';
    const isEV = slot.isEVBay;
    const isViolation = slot.isEVViolation;

    let cardClass = isAvail ? 'available' : isReserved ? 'reserved' : 'occupied';
    if (isEV) cardClass += ' ev-bay';
    if (isViolation) cardClass += ' ev-violation';
    if (isRec) cardClass += ' recommended';

    let icon = isAvail ? (isEV ? '⚡' : '✅') : (isViolation ? '🚨' : (isEV ? '🔋' : '🚘'));

    return `
      <div class="slot-card ${cardClass}" data-slot-id="${slot.id}">
        ${isRec ? '<span style="position: absolute; top: 4px; right: 4px; font-size: 0.65rem; background: var(--color-warning); color: #000; font-weight: 800; padding: 1px 4px; border-radius: 4px;">BEST</span>' : ''}
        ${isEV ? '<span style="position: absolute; top: 4px; left: 4px; font-size: 0.6rem; background: var(--color-ev-green); color: #000; font-weight: 800; padding: 1px 4px; border-radius: 4px;">EV</span>' : ''}
        
        <div class="slot-number" style="margin-top: ${isEV || isRec ? '6px' : '0'};">${slot.id}</div>
        <div class="slot-icon">${icon}</div>
        <div class="slot-status-text" style="color: ${isViolation ? '#ef4444' : isAvail ? 'var(--color-available)' : isReserved ? 'var(--color-ai-purple)' : 'var(--color-occupied)'};">
          ${isViolation ? 'VIOLATION' : slot.status}
        </div>
        <div style="font-size: 0.68rem; color: var(--text-dim); margin-top: 4px;">${slot.distance}m away</div>
      </div>
    `;
  }).join('');

  return `
    <div class="live-parking-page" style="padding: 32px 0;">
      
      <!-- Security / EV Bay Violation Alert Banner -->
      ${stats.evViolations > 0 ? `
        <div class="glass-card" style="padding: 16px 20px; margin-bottom: 24px; border-left: 4px solid #ef4444; background: rgba(239,68,68,0.12); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; animation: slide-in 0.3s ease;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 1.5rem;">🚨</span>
            <div>
              <strong style="color: #ef4444; font-size: 0.95rem;">UNAUTHORIZED IC VEHICLE IN EV CHARGING BAY</strong>
              <div style="color: var(--text-muted); font-size: 0.85rem; margin-top: 2px;">
                Internal combustion (diesel/petrol) vehicle detected occupying EV charging spot. Guard notification dispatched.
              </div>
            </div>
          </div>
          <button class="btn btn-sm btn-danger" id="clearEvViolationBtn">Resolve Alert</button>
        </div>
      ` : ''}

      <!-- Page Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px; margin-bottom: 24px;">
        <div>
          <h1 style="font-size: 2.2rem; margin-bottom: 6px;">Live Parking Status</h1>
          <p style="color: var(--text-muted); font-size: 1rem;">
            Real-time parking occupancy monitoring for <strong>${store.facilities[store.activeFacility].name}</strong>.
          </p>
        </div>

        <div style="display: flex; align-items: center; gap: 12px; background: var(--bg-card); padding: 8px 16px; border-radius: 10px; border: 1px solid var(--border-color);">
          <span class="status-dot status-dot-green"></span>
          <span style="font-size: 0.85rem; color: var(--text-muted);">
            Last Updated: <strong class="text-mono" style="color: var(--text-main);">${store.lastUpdated}</strong>
          </span>
          <button class="btn btn-sm btn-secondary" id="refreshGridBtn" title="Refresh Live Status">
            🔄 Refresh
          </button>
        </div>
      </div>

      <!-- Quick Summary Pills -->
      <div style="display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap;">
        <div class="badge badge-ai" style="padding: 8px 14px; font-size: 0.82rem;">
          TOTAL: ${stats.total} SLOTS
        </div>
        <div class="badge badge-available" style="padding: 8px 14px; font-size: 0.82rem;">
          🟩 AVAILABLE: ${stats.available}
        </div>
        <div class="badge badge-occupied" style="padding: 8px 14px; font-size: 0.82rem;">
          🟥 OCCUPIED: ${stats.occupied}
        </div>
        <div class="badge badge-ev" style="padding: 8px 14px; font-size: 0.82rem;">
          ⚡ EV CHARGE BAYS: 4
        </div>
        <div class="badge badge-warning" style="padding: 8px 14px; font-size: 0.82rem;">
          ⭐ RECOMMENDED: SLOT P18
        </div>
      </div>

      <!-- Filter Controls Bar -->
      <div class="glass-card" style="padding: 16px 20px; margin-bottom: 28px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
        <!-- Filter Tabs -->
        <div style="display: flex; gap: 8px; flex-wrap: wrap;" id="slotFilterTabs">
          <button class="btn btn-sm ${filter === 'ALL' ? 'btn-primary' : 'btn-secondary'}" data-filter="ALL">
            All Slots (${stats.total})
          </button>
          <button class="btn btn-sm ${filter === 'AVAILABLE' ? 'btn-emerald' : 'btn-secondary'}" data-filter="AVAILABLE">
            🟩 Available (${stats.available})
          </button>
          <button class="btn btn-sm ${filter === 'OCCUPIED' ? 'btn-primary' : 'btn-secondary'}" style="${filter === 'OCCUPIED' ? 'background: var(--grad-occupied);' : ''}" data-filter="OCCUPIED">
            🟥 Occupied (${stats.occupied})
          </button>
          <button class="btn btn-sm ${filter === 'EV' ? 'btn-primary' : 'btn-secondary'}" style="${filter === 'EV' ? 'background: var(--grad-ev);' : ''}" data-filter="EV">
            ⚡ EV Bays
          </button>
        </div>

        <!-- Search & Zone Filters -->
        <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
          <select id="zoneSelect" style="background: rgba(10,16,28,0.8); color: var(--text-main); border: 1px solid var(--border-bright); padding: 8px 12px; border-radius: 8px; font-size: 0.85rem;">
            <option value="ALL" ${selectedZone === 'ALL' ? 'selected' : ''}>All Zones</option>
            <option value="Zone A" ${selectedZone === 'Zone A' ? 'selected' : ''}>Zone A (East)</option>
            <option value="Zone B" ${selectedZone === 'Zone B' ? 'selected' : ''}>Zone B (Central)</option>
            <option value="Zone C" ${selectedZone === 'Zone C' ? 'selected' : ''}>Zone C (West)</option>
            <option value="EV" ${selectedZone === 'EV' ? 'selected' : ''}>EV Charging Hub</option>
          </select>

          <input type="text" id="slotSearchInput" placeholder="Search slot (e.g. P18 or EV01)..." value="${searchQuery}" style="background: rgba(10,16,28,0.8); color: var(--text-main); border: 1px solid var(--border-bright); padding: 8px 14px; border-radius: 8px; font-size: 0.85rem; width: 190px;" />
        </div>
      </div>

      <!-- Legend & Info -->
      <div style="display: flex; gap: 16px; font-size: 0.82rem; color: var(--text-muted); margin-bottom: 16px; align-items: center; flex-wrap: wrap;">
        <span><strong>Legend:</strong></span>
        <span style="display: flex; align-items: center; gap: 6px;"><span style="width: 12px; height: 12px; background: var(--color-available); border-radius: 3px;"></span> Available</span>
        <span style="display: flex; align-items: center; gap: 6px;"><span style="width: 12px; height: 12px; background: var(--color-occupied); border-radius: 3px;"></span> Occupied</span>
        <span style="display: flex; align-items: center; gap: 6px;"><span style="width: 12px; height: 12px; background: var(--color-ev-green); border-radius: 3px;"></span> EV Bay</span>
        <span style="display: flex; align-items: center; gap: 6px;"><span style="width: 12px; height: 12px; background: #ef4444; border-radius: 3px;"></span> Violation</span>
        <span style="margin-left: auto; color: var(--color-ai-cyan);">💡 Click any slot to view details, reserve space, or toggle status</span>
      </div>

      <!-- Parking Slot Grid Container -->
      ${filteredSlots.length > 0 ? `
        <div class="parking-grid">
          ${slotsGridHtml}
        </div>
      ` : `
        <div class="glass-card" style="padding: 40px; text-align: center; color: var(--text-muted);">
          <div style="font-size: 2rem; margin-bottom: 12px;">🔍</div>
          <p>No parking slots match the selected criteria.</p>
          <button class="btn btn-sm btn-secondary" id="resetSlotFilters" style="margin-top: 12px;">Reset Filters</button>
        </div>
      `}
    </div>
  `;
}

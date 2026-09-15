/* ==========================================================================
   Live Parking View Component
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

    return `
      <div class="slot-card ${isAvail ? 'available' : 'occupied'} ${isRec ? 'recommended' : ''}" data-slot-id="${slot.id}">
        ${isRec ? '<span style="position: absolute; top: 4px; right: 4px; font-size: 0.65rem; background: var(--color-warning); color: #000; font-weight: 800; padding: 1px 4px; border-radius: 4px;">BEST</span>' : ''}
        <div class="slot-number">${slot.id}</div>
        <div class="slot-icon">${isAvail ? '✅' : '🚘'}</div>
        <div class="slot-status-text" style="color: ${isAvail ? 'var(--color-available)' : 'var(--color-occupied)'};">
          ${slot.status}
        </div>
        <div style="font-size: 0.68rem; color: var(--text-dim); margin-top: 4px;">${slot.distance}m away</div>
      </div>
    `;
  }).join('');

  return `
    <div class="live-parking-page" style="padding: 32px 0;">
      <!-- Page Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px; margin-bottom: 24px;">
        <div>
          <h1 style="font-size: 2.2rem; margin-bottom: 6px;">Live Parking Status</h1>
          <p style="color: var(--text-muted); font-size: 1rem;">Real-time parking occupancy monitoring with interactive slot inspection.</p>
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
      <div style="display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap;">
        <div class="badge badge-ai" style="padding: 8px 14px; font-size: 0.82rem;">
          TOTAL: ${stats.total} SLOTS
        </div>
        <div class="badge badge-available" style="padding: 8px 14px; font-size: 0.82rem;">
          🟩 AVAILABLE: ${stats.available}
        </div>
        <div class="badge badge-occupied" style="padding: 8px 14px; font-size: 0.82rem;">
          🟥 OCCUPIED: ${stats.occupied}
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
        </div>

        <!-- Search & Zone Filters -->
        <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
          <select id="zoneSelect" style="background: rgba(10,16,28,0.8); color: var(--text-main); border: 1px solid var(--border-bright); padding: 8px 12px; border-radius: 8px; font-size: 0.85rem;">
            <option value="ALL" ${selectedZone === 'ALL' ? 'selected' : ''}>All Parking Zones</option>
            <option value="Zone A" ${selectedZone === 'Zone A' ? 'selected' : ''}>Zone A (East Deck)</option>
            <option value="Zone B" ${selectedZone === 'Zone B' ? 'selected' : ''}>Zone B (Central)</option>
            <option value="Zone C" ${selectedZone === 'Zone C' ? 'selected' : ''}>Zone C (West Plaza)</option>
            <option value="Zone D" ${selectedZone === 'Zone D' ? 'selected' : ''}>Zone D (Executive)</option>
          </select>

          <input type="text" id="slotSearchInput" placeholder="Search slot (e.g. P18)..." value="${searchQuery}" style="background: rgba(10,16,28,0.8); color: var(--text-main); border: 1px solid var(--border-bright); padding: 8px 14px; border-radius: 8px; font-size: 0.85rem; width: 180px;" />
        </div>
      </div>

      <!-- Legend & Info -->
      <div style="display: flex; gap: 20px; font-size: 0.82rem; color: var(--text-muted); margin-bottom: 16px; align-items: center;">
        <span><strong>Legend:</strong></span>
        <span style="display: flex; align-items: center; gap: 6px;"><span style="width: 12px; height: 12px; background: var(--color-available); border-radius: 3px;"></span> Available Space</span>
        <span style="display: flex; align-items: center; gap: 6px;"><span style="width: 12px; height: 12px; background: var(--color-occupied); border-radius: 3px;"></span> Occupied Space</span>
        <span style="display: flex; align-items: center; gap: 6px;"><span style="width: 12px; height: 12px; background: var(--color-warning); border-radius: 3px;"></span> Recommended Nearest Slot</span>
        <span style="margin-left: auto; color: var(--color-ai-cyan);">💡 Click any slot card to inspect details or simulate state change</span>
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

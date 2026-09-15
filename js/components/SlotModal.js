/* ==========================================================================
   Slot Modal Inspector Component
   ========================================================================== */

function renderSlotModal(slotId) {
  const store = window.SmartParkingStore;
  const slot = store.slots.find(s => s.id === slotId);
  if (!slot) return '';

  const isAvail = slot.status === 'AVAILABLE';

  return `
    <div class="modal-backdrop active" id="slotModalBackdrop">
      <div class="modal-content glass-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
          <div>
            <span class="badge ${isAvail ? 'badge-available' : 'badge-occupied'}" style="margin-bottom: 8px;">
              ${slot.status}
            </span>
            <h2 class="text-mono" style="font-size: 2.2rem; color: #fff; line-height: 1;">
              SLOT ${slot.id}
            </h2>
            <div style="color: var(--text-muted); font-size: 0.9rem; margin-top: 4px;">
              ${slot.zone}
            </div>
          </div>
          <button class="btn btn-sm btn-secondary" id="closeModalBtn" style="padding: 6px 10px; font-size: 1.1rem;">
            ✖
          </button>
        </div>

        <div style="background: rgba(10,16,28,0.7); padding: 18px; border-radius: 12px; border: 1px solid var(--border-color); margin-bottom: 24px; display: flex; flex-direction: column; gap: 12px; font-size: 0.9rem;">
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-dim);">Distance from Entry:</span>
            <strong style="color: var(--color-ai-cyan);">${slot.distance} meters</strong>
          </div>
          
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-dim);">Recommendation Rank:</span>
            <span>${slot.isRecommended ? '⭐ Top Recommended Slot' : 'Standard Slot'}</span>
          </div>

          ${!isAvail && slot.vehicle ? `
            <div style="border-top: 1px solid var(--border-color); pt: 10px; margin-top: 6px; padding-top: 10px;">
              <div style="font-size: 0.8rem; font-weight: 700; color: var(--color-occupied); margin-bottom: 8px;">DETECTED VEHICLE DETAILS (YOLOV8)</div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="color: var(--text-dim);">Vehicle Type:</span>
                <strong style="color: #fff;">${slot.vehicle.type}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="color: var(--text-dim);">License Plate (Sim):</span>
                <span class="text-mono" style="color: var(--color-ai-cyan); font-weight: 600;">${slot.vehicle.plate}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="color: var(--text-dim);">AI Confidence:</span>
                <strong style="color: var(--color-available);">${slot.vehicle.confidence}%</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-dim);">Parked Duration:</span>
                <span style="color: var(--text-muted);">${slot.vehicle.parkedTime}</span>
              </div>
            </div>
          ` : `
            <div style="border-top: 1px solid var(--border-color); margin-top: 6px; padding-top: 10px; color: var(--color-available);">
              ✅ This parking space is currently vacant and ready for parking.
            </div>
          `}
        </div>

        <div style="display: flex; gap: 12px; justify-content: flex-end;">
          <button class="btn btn-secondary" id="closeModalBtn2">Close</button>
          <button class="btn ${isAvail ? 'btn-primary' : 'btn-emerald'}" id="toggleSlotStateBtn" data-slot-id="${slot.id}">
            🔄 ${isAvail ? 'Simulate Vehicle Arrival' : 'Simulate Vehicle Departure'}
          </button>
        </div>
      </div>
    </div>
  `;
}

/* ==========================================================================
   Slot Modal Inspector & Reservation Pass Component (Phase 2 Upgrade)
   ========================================================================== */

function renderSlotModal(slotId, activeModalTab = 'inspect') {
  const store = window.SmartParkingStore;
  const slot = store.slots.find(s => s.id === slotId);
  if (!slot) return '';

  const isAvail = slot.status === 'AVAILABLE';
  const isReserved = slot.status === 'RESERVED';

  return `
    <div class="modal-backdrop active" id="slotModalBackdrop">
      <div class="modal-content glass-card">
        <!-- Modal Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
          <div>
            <span class="badge ${isAvail ? 'badge-available' : isReserved ? 'badge-warning' : 'badge-occupied'}" style="margin-bottom: 6px;">
              ${slot.status}
            </span>
            <h2 class="text-mono" style="font-size: 2.2rem; color: #fff; line-height: 1;">
              SLOT ${slot.id}
            </h2>
            <div style="color: var(--text-muted); font-size: 0.88rem; margin-top: 4px;">
              ${slot.zone} • Facility: <strong>${store.facilities[store.activeFacility].name}</strong>
            </div>
          </div>
          <button class="btn btn-sm btn-secondary" id="closeModalBtn" style="padding: 6px 10px; font-size: 1.1rem;">
            ✖
          </button>
        </div>

        <!-- Tab Buttons (Inspect vs Reserve Slot) -->
        <div style="display: flex; gap: 8px; margin-bottom: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
          <button class="btn btn-sm ${activeModalTab === 'inspect' ? 'btn-primary' : 'btn-secondary'}" id="modalTabInspect">
            🔍 Slot Inspector
          </button>
          ${isAvail ? `
            <button class="btn btn-sm ${activeModalTab === 'reserve' ? 'btn-warning' : 'btn-secondary'}" id="modalTabReserve">
              🎟️ Reserve & Generate QR Pass
            </button>
          ` : ''}
        </div>

        <!-- TAB 1: INSPECTOR DETAILS -->
        ${activeModalTab === 'inspect' ? `
          <div style="background: rgba(10,16,28,0.7); padding: 18px; border-radius: 12px; border: 1px solid var(--border-color); margin-bottom: 20px; display: flex; flex-direction: column; gap: 12px; font-size: 0.9rem;">
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--text-dim);">Distance from Main Entry:</span>
              <strong style="color: var(--color-ai-cyan);">${slot.distance} meters</strong>
            </div>
            
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--text-dim);">Recommendation Rank:</span>
              <span>${slot.isRecommended ? '⭐ Top Recommended Slot' : 'Standard Slot'}</span>
            </div>

            ${!isAvail && slot.vehicle ? `
              <div style="border-top: 1px solid var(--border-color); margin-top: 6px; padding-top: 10px;">
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
            ` : isReserved && slot.reservation ? `
              <div style="border-top: 1px solid var(--border-color); margin-top: 6px; padding-top: 10px;">
                <div style="font-size: 0.8rem; font-weight: 700; color: var(--color-warning); margin-bottom: 8px;">ACTIVE RESERVATION TICKET</div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                  <span style="color: var(--text-dim);">Ticket Pass ID:</span>
                  <strong class="text-mono" style="color: var(--color-warning);">${slot.reservation.ticketId}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                  <span style="color: var(--text-dim);">Driver Name:</span>
                  <span style="color: #fff;">${slot.reservation.driverName}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: var(--text-dim);">Vehicle Plate:</span>
                  <span class="text-mono" style="color: var(--color-ai-cyan);">${slot.reservation.plateNumber}</span>
                </div>
              </div>
            ` : `
              <div style="border-top: 1px solid var(--border-color); margin-top: 6px; padding-top: 10px; color: var(--color-available);">
                ✅ Space is vacant. Ready for immediate parking or digital reservation.
              </div>
            `}
          </div>

          <div style="display: flex; gap: 12px; justify-content: flex-end;">
            <button class="btn btn-secondary" id="closeModalBtn2">Close</button>
            <button class="btn ${isAvail ? 'btn-primary' : 'btn-emerald'}" id="toggleSlotStateBtn" data-slot-id="${slot.id}">
              🔄 ${isAvail ? 'Simulate Vehicle Arrival' : 'Simulate Vehicle Departure'}
            </button>
          </div>
        ` : ''}

        <!-- TAB 2: SLOT RESERVATION & QR PASS GENERATOR -->
        ${activeModalTab === 'reserve' ? `
          <form id="reservationForm" style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 16px;">
            <div>
              <label style="display: block; font-size: 0.82rem; color: var(--text-muted); margin-bottom: 4px; font-weight: 600;">Driver Full Name</label>
              <input type="text" id="resDriverName" placeholder="e.g. Alex Morgan" required style="width: 100%; background: rgba(10,16,28,0.8); border: 1px solid var(--border-bright); color: #fff; padding: 10px 14px; border-radius: 8px; font-size: 0.9rem;" />
            </div>

            <div>
              <label style="display: block; font-size: 0.82rem; color: var(--text-muted); margin-bottom: 4px; font-weight: 600;">Vehicle License Plate Number</label>
              <input type="text" id="resPlateNumber" placeholder="e.g. KA-05-MD-9988" required style="width: 100%; background: rgba(10,16,28,0.8); border: 1px solid var(--border-bright); color: #fff; padding: 10px 14px; border-radius: 8px; font-size: 0.9rem; font-family: var(--font-mono);" />
            </div>

            <div>
              <label style="display: block; font-size: 0.82rem; color: var(--text-muted); margin-bottom: 4px; font-weight: 600;">Reservation Duration</label>
              <select id="resDuration" style="width: 100%; background: rgba(10,16,28,0.8); border: 1px solid var(--border-bright); color: #fff; padding: 10px 14px; border-radius: 8px; font-size: 0.9rem;">
                <option value="1">1 Hour ($3.00)</option>
                <option value="2">2 Hours ($5.00)</option>
                <option value="4">4 Hours ($9.00)</option>
                <option value="8">Full Day ($15.00)</option>
              </select>
            </div>

            <!-- Simulated Generated QR Ticket Box -->
            <div class="qr-pass-card" style="margin-top: 10px;">
              <div style="font-size: 0.8rem; font-weight: 800; color: #0f172a; text-transform: uppercase; margin-bottom: 8px;">DIGITAL PARKING PASS TICKET</div>
              
              <!-- SVG Generated QR Code Graphic -->
              <svg width="120" height="120" viewBox="0 0 100 100" style="margin: 0 auto 10px auto; display: block;">
                <rect width="100" height="100" fill="#ffffff"/>
                <rect x="10" y="10" width="30" height="30" fill="#0f172a"/>
                <rect x="15" y="15" width="20" height="20" fill="#ffffff"/>
                <rect x="20" y="20" width="10" height="10" fill="#0f172a"/>
                
                <rect x="60" y="10" width="30" height="30" fill="#0f172a"/>
                <rect x="65" y="15" width="20" height="20" fill="#ffffff"/>
                <rect x="70" y="20" width="10" height="10" fill="#0f172a"/>
                
                <rect x="10" y="60" width="30" height="30" fill="#0f172a"/>
                <rect x="15" y="65" width="20" height="20" fill="#ffffff"/>
                <rect x="20" y="70" width="10" height="10" fill="#0f172a"/>
                
                <rect x="50" y="50" width="15" height="15" fill="#0f172a"/>
                <rect x="70" y="60" width="20" height="10" fill="#0f172a"/>
                <rect x="60" y="75" width="15" height="15" fill="#0f172a"/>
                <rect x="80" y="75" width="10" height="15" fill="#0f172a"/>
              </svg>

              <div style="font-size: 0.85rem; font-weight: 700; color: #0f172a; font-family: var(--font-mono);">
                SLOT: ${slot.id} • ${slot.zone}
              </div>
            </div>

            <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 10px;">
              <button class="btn btn-secondary" type="button" id="closeModalBtn3">Cancel</button>
              <button class="btn btn-warning" type="submit" data-slot-id="${slot.id}">
                🎟️ Confirm Reservation & Issue Pass
              </button>
            </div>
          </form>
        ` : ''}

      </div>
    </div>
  `;
}

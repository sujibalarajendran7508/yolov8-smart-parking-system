/* ==========================================================================
   Gate Scanner & ALPR Component (Automatic License Plate Recognition)
   ========================================================================== */

function renderGateScannerView() {
  const store = window.SmartParkingStore;
  const recentRecords = store.alprRecords;
  const latestRecord = recentRecords[0] || {
    plate: 'KA-05-MD-4812',
    vehicle: 'Sedan (White)',
    confidence: 97.8,
    status: 'AUTHORIZED',
    action: 'Barrier Auto-Opened'
  };

  const isBarrierOpen = store.barrierState === 'OPEN';

  return `
    <div class="gate-scanner-page" style="padding: 32px 0;">
      <!-- Page Header -->
      <div style="margin-bottom: 28px;">
        <div class="badge badge-ai" style="margin-bottom: 10px;">
          📸 AUTOMATIC LICENSE PLATE RECOGNITION (ALPR)
        </div>
        <h1 style="font-size: 2.2rem; margin-bottom: 6px;">
          Smart Entry Gate & Barrier Scanner
        </h1>
        <p style="color: var(--text-muted); font-size: 1rem;">
          Optical Character Recognition (OCR) combined with YOLOv8 bounding boxes for automated access control.
        </p>
      </div>

      <!-- Main Gate Layout: 2 Columns -->
      <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 24px; align-items: flex-start; margin-bottom: 32px;">
        
        <!-- Left: Live Gate Camera & Barrier Visualization -->
        <div class="glass-card" style="padding: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span class="status-dot ${isBarrierOpen ? 'status-dot-green' : 'status-dot-red'}"></span>
              <strong style="color: #fff;">Entry Barrier #01 (Main North Gate)</strong>
            </div>
            <span class="badge ${isBarrierOpen ? 'badge-available' : 'badge-occupied'}">
              BARRIER: ${store.barrierState}
            </span>
          </div>

          <!-- Animated Barrier SVG Graphic -->
          <div class="gate-barrier-container" style="margin-bottom: 20px;">
            <svg width="100%" height="100%" viewBox="0 0 600 220">
              <!-- Lane & Ground -->
              <rect x="0" y="160" width="600" height="60" fill="#1e293b"/>
              <line x1="0" y1="190" x2="600" y2="190" stroke="#f59e0b" stroke-width="3" stroke-dasharray="16 12"/>

              <!-- Vehicle approaching barrier -->
              <g transform="translate(180, 100)">
                <rect x="0" y="20" width="160" height="50" rx="8" fill="#334155" stroke="#38bdf8" stroke-width="2"/>
                <polygon points="20,20 45,0 125,0 145,20" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
                <!-- Wheels -->
                <circle cx="35" cy="70" r="14" fill="#0f172a" stroke="#64748b" stroke-width="3"/>
                <circle cx="125" cy="70" r="14" fill="#0f172a" stroke="#64748b" stroke-width="3"/>
                <!-- Headlights beam -->
                <polygon points="160,35 260,15 260,65" fill="rgba(56,189,248,0.15)"/>
                <!-- Plate Graphic on car -->
                <rect x="135" y="42" width="24" height="12" fill="#fef08a" rx="2" stroke="#000"/>
              </g>

              <!-- Barrier Station Post -->
              <rect x="360" y="70" width="24" height="100" fill="#0f172a" stroke="#64748b" stroke-width="2" rx="4"/>
              <circle cx="372" cy="85" r="7" fill="${isBarrierOpen ? '#10b981' : '#ef4444'}"/>

              <!-- Barrier Arm (Rotates when open) -->
              <g class="gate-arm ${isBarrierOpen ? 'open' : ''}" style="transform-origin: 372px 85px;">
                <rect x="372" y="80" width="180" height="10" fill="#ef4444" rx="3" stroke="#ffffff" stroke-width="1"/>
                <line x1="390" y1="80" x2="390" y2="90" stroke="#fff" stroke-width="4"/>
                <line x1="420" y1="80" x2="420" y2="90" stroke="#fff" stroke-width="4"/>
                <line x1="450" y1="80" x2="450" y2="90" stroke="#fff" stroke-width="4"/>
                <line x1="480" y1="80" x2="480" y2="90" stroke="#fff" stroke-width="4"/>
                <line x1="510" y1="80" x2="510" y2="90" stroke="#fff" stroke-width="4"/>
              </g>

              <!-- Overhead ALPR Camera Sensor -->
              <rect x="420" y="20" width="40" height="20" fill="#0284c7" rx="3"/>
              <circle cx="430" cy="30" r="4" fill="#38bdf8"/>
              <!-- Scan Beam lines pointing down -->
              <line x1="430" y1="30" x2="310" y2="150" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4 4"/>
              <line x1="450" y1="30" x2="350" y2="150" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4 4"/>
            </svg>
          </div>

          <!-- Barrier Control Actions -->
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
            <div style="display: flex; gap: 10px;">
              <button class="btn btn-sm ${isBarrierOpen ? 'btn-secondary' : 'btn-emerald'}" id="toggleBarrierBtn">
                ${isBarrierOpen ? '🔻 Lower Barrier Arm' : '🔺 Raise Barrier Arm'}
              </button>
              <button class="btn btn-sm btn-primary" id="triggerGateScanBtn">
                ⚡ Simulate Vehicle Arrival & OCR Scan
              </button>
            </div>

            <div style="font-size: 0.8rem; color: var(--text-dim);">
              Status: <strong style="color: ${isBarrierOpen ? 'var(--color-available)' : 'var(--color-occupied)'};">${store.barrierState}</strong>
            </div>
          </div>
        </div>

        <!-- Right: Current OCR Plate Recognition Result -->
        <div class="glass-card" style="padding: 24px;">
          <h3 style="font-size: 1.15rem; margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
            Live ALPR Extraction Result
          </h3>

          <div style="margin-bottom: 20px; text-align: center; background: rgba(10,16,28,0.7); padding: 18px; border-radius: 12px; border: 1px solid var(--border-color);">
            <div style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase; font-weight: 700; margin-bottom: 8px;">
              RECOGNIZED LICENSE PLATE (OCR)
            </div>
            <div class="license-plate-badge" id="activePlateBadge">
              ${latestRecord.plate}
            </div>
            <div style="display: flex; justify-content: center; gap: 16px; margin-top: 12px; font-size: 0.85rem;">
              <span>Vehicle: <strong style="color: #fff;">${latestRecord.vehicle}</strong></span>
              <span>Confidence: <strong style="color: var(--color-available);">${latestRecord.confidence}%</strong></span>
            </div>
          </div>

          <!-- Decision / Access State Banner -->
          <div style="margin-bottom: 20px;">
            <div style="font-size: 0.78rem; color: var(--text-dim); text-transform: uppercase; font-weight: 700; margin-bottom: 6px;">
              GATE DECISION ENGINE
            </div>
            <div style="padding: 14px; border-radius: 10px; background: ${latestRecord.status === 'BLACKLIST_ALERT' ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)'}; border: 1px solid ${latestRecord.status === 'BLACKLIST_ALERT' ? '#ef4444' : 'var(--color-available)'};">
              <div style="font-size: 0.95rem; font-weight: 800; color: ${latestRecord.status === 'BLACKLIST_ALERT' ? '#ef4444' : 'var(--color-available)'};">
                ${latestRecord.status === 'BLACKLIST_ALERT' ? '🚨 SECURITY WARNING: BLACKLIST VEHICLE DETECTED' : '✅ ACCESS GRANTED: ' + latestRecord.status}
              </div>
              <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 4px;">
                ${latestRecord.action}
              </div>
            </div>
          </div>

          <!-- Test Custom Plate Input -->
          <div>
            <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 4px; font-weight: 600;">Test Custom Plate Verification</label>
            <div style="display: flex; gap: 8px;">
              <input type="text" id="customPlateInput" placeholder="e.g. DL-01-XX-9999 (Blacklist) or MH-12-RT-9920" style="flex: 1; background: rgba(10,16,28,0.8); border: 1px solid var(--border-bright); color: #fff; padding: 8px 12px; border-radius: 8px; font-size: 0.85rem; font-family: var(--font-mono);" />
              <button class="btn btn-sm btn-secondary" id="submitCustomPlateBtn">Verify</button>
            </div>
          </div>

        </div>

      </div>

      <!-- ALPR Gate Entry Records Table -->
      <div class="glass-card" style="padding: 24px;">
        <h3 style="font-size: 1.15rem; margin-bottom: 16px;">Recent Gate Entry Log Records</h3>

        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.85rem;">
            <thead>
              <tr style="border-bottom: 2px solid var(--border-bright); background: rgba(15,23,42,0.8);">
                <th style="padding: 12px; color: var(--text-muted);">Record ID</th>
                <th style="padding: 12px; color: var(--text-muted);">Timestamp</th>
                <th style="padding: 12px; color: var(--text-muted);">License Plate</th>
                <th style="padding: 12px; color: var(--text-muted);">Vehicle Type</th>
                <th style="padding: 12px; color: var(--text-muted);">OCR Confidence</th>
                <th style="padding: 12px; color: var(--text-muted);">Access Status</th>
                <th style="padding: 12px; color: var(--text-muted);">Gate Action</th>
              </tr>
            </thead>
            <tbody>
              ${recentRecords.map(rec => `
                <tr style="border-bottom: 1px solid var(--border-color);">
                  <td style="padding: 12px; font-family: var(--font-mono); color: var(--text-dim);">${rec.id}</td>
                  <td style="padding: 12px; color: var(--text-muted);">${rec.time}</td>
                  <td style="padding: 12px;"><span style="background: #fef08a; color: #000; font-family: var(--font-mono); font-weight: 800; padding: 2px 6px; border-radius: 4px;">${rec.plate}</span></td>
                  <td style="padding: 12px; color: #fff;">${rec.vehicle}</td>
                  <td style="padding: 12px; color: var(--color-available); font-weight: 700;">${rec.confidence}%</td>
                  <td style="padding: 12px;">
                    <span class="badge ${rec.status === 'BLACKLIST_ALERT' ? 'badge-danger' : 'badge-available'}">
                      ${rec.status}
                    </span>
                  </td>
                  <td style="padding: 12px; color: var(--text-muted);">${rec.action}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

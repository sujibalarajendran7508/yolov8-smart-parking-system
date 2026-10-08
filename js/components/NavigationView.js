/* ==========================================================================
   Navigation View Component (Animated Vehicle Route Simulation Upgrade)
   ========================================================================== */

function renderNavigationView(isNavigating = false, navSpeed = 1) {
  const store = window.SmartParkingStore;
  const recommendedSlot = store.slots.find(s => s.id === 'P18') || store.slots[17];

  return `
    <div class="navigation-page" style="padding: 32px 0;">
      <!-- Page Header -->
      <div style="margin-bottom: 28px;">
        <div class="badge badge-warning" style="margin-bottom: 10px;">
          🗺️ INTELLIGENT SLOT ALLOCATION & ANIMATED ROUTE
        </div>
        <h1 style="font-size: 2.2rem; margin-bottom: 6px;">
          Find Nearest Parking Slot
        </h1>
        <p style="color: var(--text-muted); font-size: 1rem;">
          Real-time distance calculation & shortest-path route recommendation upon entrance.
        </p>
      </div>

      <!-- Recommendation Highlight Banner -->
      <div class="glass-panel" style="padding: 28px; margin-bottom: 32px; border: 2px solid var(--color-warning); background: linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(14,21,38,0.9) 100%);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
          <div>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
              <span class="badge badge-warning" style="font-size: 0.8rem;">RECOMMENDED PARKING SLOT</span>
              <span style="color: var(--color-available); font-weight: 600; font-size: 0.85rem;">🟩 AVAILABLE NOW</span>
            </div>
            <h2 style="font-size: 2.5rem; font-family: var(--font-mono); color: var(--color-warning); line-height: 1;">
              SLOT ${recommendedSlot.id}
            </h2>
            <div style="color: var(--text-muted); font-size: 0.95rem; margin-top: 8px;">
              Located in <strong style="color: #fff;">${recommendedSlot.zone}</strong> • Distance from Main Entrance: <strong style="color: var(--color-ai-cyan);">${recommendedSlot.distance} meters</strong> (~1.5 min walk)
            </div>
          </div>

          <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 10px;">
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-emerald" id="startNavigationBtn" style="padding: 12px 24px; font-size: 0.95rem;">
                <span>🚘</span> ${isNavigating ? 'Stop Vehicle Simulation' : 'Start Animated Driving Simulation'}
              </button>
            </div>
            <span style="font-size: 0.75rem; color: var(--text-dim);">Live Moving Vehicle Map Path</span>
          </div>
        </div>
      </div>

      <!-- Turn-by-Turn Guidance Drawer (Visible during active navigation) -->
      ${isNavigating ? `
        <div class="glass-card" style="padding: 20px 24px; margin-bottom: 28px; border-left: 4px solid var(--color-available); background: rgba(16,185,129,0.08); animation: slide-in 0.3s ease;">
          <h4 style="font-size: 1rem; color: var(--color-available); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
            <span>🚘</span> ANIMATED VEHICLE DRIVING GUIDANCE (LIVE SIMULATION)
          </h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; font-size: 0.88rem;">
            <div style="background: rgba(10,16,28,0.7); padding: 12px; border-radius: 8px;">
              <strong style="color: var(--color-ai-cyan);">Step 1:</strong> Entry Gate East (Barrier 01).
            </div>
            <div style="background: rgba(10,16,28,0.7); padding: 12px; border-radius: 8px;">
              <strong style="color: var(--color-ai-cyan);">Step 2:</strong> Drive 60m straight down Row B Aisle.
            </div>
            <div style="background: rgba(10,16,28,0.7); padding: 12px; border-radius: 8px;">
              <strong style="color: var(--color-ai-cyan);">Step 3:</strong> Turn Left at Zone B Central Indicator.
            </div>
            <div style="background: rgba(10,16,28,0.7); padding: 12px; border-radius: 8px; border: 1px solid var(--color-warning);">
              <strong style="color: var(--color-warning);">Step 4:</strong> Park in <strong>Slot P18</strong> on your right.
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Interactive Parking Layout Map Canvas (SVG Visualization with Animated Vehicle) -->
      <div class="glass-card" style="padding: 24px; position: relative;">
        <h3 style="font-size: 1.1rem; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
          <span>Interactive Parking Map & Moving Vehicle Visualizer</span>
          <span style="font-size: 0.8rem; color: var(--text-dim);">Entrance ➡️ Row A/B/C/D ➡️ Slot P18</span>
        </h3>

        <!-- Interactive Map Graphic -->
        <div style="width: 100%; height: 380px; background: #0a0f1d; border-radius: 12px; border: 1px solid var(--border-bright); position: relative; overflow: hidden;">
          
          <svg width="100%" height="100%" viewBox="0 0 900 360" preserveAspectRatio="none">
            <!-- Background Grid Lines -->
            <defs>
              <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mapGrid)" />

            <!-- Main Entrance Gate Marker -->
            <rect x="30" y="150" width="80" height="60" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
            <text x="70" y="185" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="middle">ENTRY</text>

            <!-- Driving Lanes -->
            <rect x="130" y="160" width="680" height="40" fill="rgba(56,189,248,0.06)" rx="4"/>
            <line x1="140" y1="180" x2="800" y2="180" stroke="#38bdf8" stroke-width="2" stroke-dasharray="8 8"/>

            <!-- Row A (Top Occupied / Free Slots) -->
            <g transform="translate(160, 40)">
              <rect x="0" y="0" width="60" height="90" fill="#f43f5e" opacity="0.3" rx="4" stroke="#f43f5e"/>
              <text x="30" y="50" fill="#fff" font-size="12" text-anchor="middle">P01</text>
              
              <rect x="70" y="0" width="60" height="90" fill="#f43f5e" opacity="0.3" rx="4" stroke="#f43f5e"/>
              <text x="100" y="50" fill="#fff" font-size="12" text-anchor="middle">P02</text>
              
              <rect x="140" y="0" width="60" height="90" fill="#10b981" opacity="0.3" rx="4" stroke="#10b981"/>
              <text x="170" y="50" fill="#fff" font-size="12" text-anchor="middle">P03</text>

              <!-- RECOMMENDED SLOT P18 -->
              <rect x="210" y="0" width="70" height="90" fill="rgba(245,158,11,0.25)" rx="6" stroke="#f59e0b" stroke-width="3"/>
              <text x="245" y="45" fill="#f59e0b" font-size="14" font-weight="bold" text-anchor="middle">P18</text>
              <text x="245" y="65" fill="#10b981" font-size="10" font-weight="bold" text-anchor="middle">FREE</text>

              <rect x="290" y="0" width="60" height="90" fill="#f43f5e" opacity="0.3" rx="4" stroke="#f43f5e"/>
              <text x="320" y="50" fill="#fff" font-size="12" text-anchor="middle">P04</text>
              
              <rect x="360" y="0" width="60" height="90" fill="#10b981" opacity="0.3" rx="4" stroke="#10b981"/>
              <text x="390" y="50" fill="#fff" font-size="12" text-anchor="middle">P05</text>
            </g>

            <!-- Row B (Bottom Slots) -->
            <g transform="translate(160, 230)">
              <rect x="0" y="0" width="60" height="90" fill="#f43f5e" opacity="0.3" rx="4" stroke="#f43f5e"/>
              <text x="30" y="50" fill="#fff" font-size="12" text-anchor="middle">P06</text>

              <rect x="70" y="0" width="60" height="90" fill="#10b981" opacity="0.3" rx="4" stroke="#10b981"/>
              <text x="100" y="50" fill="#fff" font-size="12" text-anchor="middle">P07</text>

              <rect x="140" y="0" width="60" height="90" fill="#f43f5e" opacity="0.3" rx="4" stroke="#f43f5e"/>
              <text x="170" y="50" fill="#fff" font-size="12" text-anchor="middle">P08</text>

              <rect x="210" y="0" width="60" height="90" fill="#f43f5e" opacity="0.3" rx="4" stroke="#f43f5e"/>
              <text x="240" y="50" fill="#fff" font-size="12" text-anchor="middle">P09</text>

              <rect x="280" y="0" width="60" height="90" fill="#10b981" opacity="0.3" rx="4" stroke="#10b981"/>
              <text x="310" y="50" fill="#fff" font-size="12" text-anchor="middle">P10</text>
            </g>

            <!-- Navigation Path Line -->
            <path id="navPath" d="M 110 180 L 405 180 L 405 130" fill="none" stroke="var(--color-warning)" stroke-width="4" stroke-dasharray="10 6">
              <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite"/>
            </path>

            <!-- Animated Car Icon Moving Along Path -->
            ${isNavigating ? `
              <g>
                <circle r="12" fill="#38bdf8" stroke="#ffffff" stroke-width="2">
                  <animateMotion path="M 110 180 L 405 180 L 405 130" dur="${4 / navSpeed}s" repeatCount="indefinite" rotate="auto"/>
                </circle>
                <text font-size="12" text-anchor="middle" dy="4" fill="#000" font-weight="bold">🚘
                  <animateMotion path="M 110 180 L 405 180 L 405 130" dur="${4 / navSpeed}s" repeatCount="indefinite" rotate="auto"/>
                </text>
              </g>
            ` : ''}

            <!-- Target Marker on Slot P18 -->
            <circle cx="405" cy="130" r="14" fill="none" stroke="#f59e0b" stroke-width="3">
              <animate attributeName="r" values="8;18;8" dur="1.5s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="1;0.2;1" dur="1.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="405" cy="130" r="5" fill="#f59e0b"/>
          </svg>

          <div style="position: absolute; bottom: 12px; left: 16px; background: rgba(0,0,0,0.8); padding: 6px 12px; border-radius: 6px; font-size: 0.78rem; color: var(--text-muted); border: 1px solid var(--border-color);">
            🛣️ Route Distance: <strong style="color: var(--color-warning);">120 meters</strong> | Est. Time: <strong style="color: var(--color-available);">45 sec drive + 45 sec walk</strong>
          </div>
        </div>

        <!-- Simulated GPS Notice -->
        <div style="font-size: 0.78rem; color: var(--text-dim); margin-top: 14px; text-align: right;">
          ⚠️ Prototype Disclaimer: Navigation route and turn guidance are simulated visual demonstrations.
        </div>
      </div>
    </div>
  `;
}

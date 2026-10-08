/* ==========================================================================
   AI Detection View Component (YOLOv8 Vision & ROI Canvas Upgrade)
   ========================================================================== */

function renderAIDetectionView() {
  const store = window.SmartParkingStore;
  const cam = store.cameras[store.selectedCamera];
  const stats = store.getStats();

  const bboxHtml = cam.boxes.map(box => {
    const isAvail = box.status === 'AVAILABLE';
    const color = isAvail ? 'var(--color-available)' : 'var(--color-ai-cyan)';
    return `
      <div class="bbox" style="left: ${box.x}%; top: ${box.y}%; width: ${box.w}%; height: ${box.h}%; border-color: ${color};">
        <div class="bbox-label" style="background: ${color}; color: #000;">
          ${box.label}
        </div>
      </div>
    `;
  }).join('');

  // Custom User-Drawn ROIs
  const customBboxHtml = store.customROIs.map(roi => `
    <div class="bbox" style="left: ${roi.x}%; top: ${roi.y}%; width: ${roi.w}%; height: ${roi.h}%; border-color: var(--color-warning); border-style: dashed;">
      <div class="bbox-label" style="background: var(--color-warning); color: #000;">
        ${roi.label}
      </div>
    </div>
  `).join('');

  return `
    <div class="ai-detection-page" style="padding: 32px 0;">
      <!-- Page Header -->
      <div style="margin-bottom: 28px;">
        <div class="badge badge-ai" style="margin-bottom: 10px;">
          🤖 COMPUTER VISION ENGINE - YOLOV8 NANO V8.1
        </div>
        <h1 style="font-size: 2.2rem; margin-bottom: 6px;">
          YOLOv8 Real-Time Vehicle Detection
        </h1>
        <p style="color: var(--text-muted); font-size: 1rem;">
          Simulated live computer vision stream processing parking lot CCTV footage & ROI overlap.
        </p>
      </div>

      <!-- Vision Filter & Mode Toolbar -->
      <div class="glass-card" style="padding: 14px 20px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <strong style="font-size: 0.88rem; color: var(--text-muted);">Vision Mode:</strong>
          <button class="btn btn-sm ${store.visionFilterMode === 'normal' ? 'btn-primary' : 'btn-secondary'}" data-vision-filter="normal">
            📷 Normal CCTV
          </button>
          <button class="btn btn-sm ${store.visionFilterMode === 'heatmap' ? 'btn-primary' : 'btn-secondary'}" data-vision-filter="heatmap">
            🔥 Thermal Heatmap
          </button>
          <button class="btn btn-sm ${store.visionFilterMode === 'night' ? 'btn-primary' : 'btn-secondary'}" data-vision-filter="night">
            🌙 Night Vision
          </button>
        </div>

        <div style="display: flex; gap: 10px;">
          <button class="btn btn-sm btn-warning" id="addCustomRoiBtn">
            ➕ Add Custom Slot ROI
          </button>
          ${store.customROIs.length > 0 ? `
            <button class="btn btn-sm btn-secondary" id="clearCustomRoisBtn">
              🧹 Clear Custom ROIs (${store.customROIs.length})
            </button>
          ` : ''}
        </div>
      </div>

      <!-- Main Detection Layout -->
      <div style="display: grid; grid-template-columns: 1fr 340px; gap: 24px; align-items: flex-start;">
        
        <!-- Left: Simulated CCTV Feed Viewer -->
        <div class="glass-card" style="padding: 20px;">
          <!-- Camera Control Toolbar -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span class="status-dot status-dot-green"></span>
              <strong style="font-size: 0.95rem; color: var(--text-main);">${cam.name}</strong>
            </div>

            <!-- Camera Switcher -->
            <div style="display: flex; gap: 8px;">
              <button class="btn btn-sm ${store.selectedCamera === 'cam1' ? 'btn-primary' : 'btn-secondary'}" data-cam="cam1">Cam 01</button>
              <button class="btn btn-sm ${store.selectedCamera === 'cam2' ? 'btn-primary' : 'btn-secondary'}" data-cam="cam2">Cam 02</button>
              <button class="btn btn-sm ${store.selectedCamera === 'cam3' ? 'btn-primary' : 'btn-secondary'}" data-cam="cam3">Cam 03</button>
            </div>
          </div>

          <!-- Video Stream Container -->
          <div class="video-container ${store.isScanning ? 'laser-scanning' : ''} ${store.visionFilterMode === 'night' ? 'night-vision-mode' : ''} ${store.visionFilterMode === 'heatmap' ? 'heatmap-mode' : ''}" style="background: ${cam.bgGradient}; position: relative;">
            <!-- Simulated Parking Ground Graphics (SVG) -->
            <svg width="100%" height="100%" viewBox="0 0 1000 562" preserveAspectRatio="none" style="position: absolute; top: 0; left: 0; opacity: 0.4;">
              <!-- Parking Bay Markers -->
              <line x1="100" y1="100" x2="300" y2="100" stroke="#38bdf8" stroke-width="2" stroke-dasharray="8 6"/>
              <line x1="100" y1="280" x2="300" y2="280" stroke="#38bdf8" stroke-width="2" stroke-dasharray="8 6"/>
              <line x1="350" y1="100" x2="600" y2="100" stroke="#38bdf8" stroke-width="2" stroke-dasharray="8 6"/>
              <line x1="350" y1="280" x2="600" y2="280" stroke="#38bdf8" stroke-width="2" stroke-dasharray="8 6"/>
              <line x1="650" y1="100" x2="900" y2="100" stroke="#10b981" stroke-width="3"/>
              
              <!-- Slot Labels on Ground -->
              <text x="180" y="200" fill="#64748b" font-family="monospace" font-size="24" font-weight="bold">SLOT P01 [OCCUPIED]</text>
              <text x="440" y="200" fill="#64748b" font-family="monospace" font-size="24" font-weight="bold">SLOT P02 [OCCUPIED]</text>
              <text x="730" y="200" fill="#10b981" font-family="monospace" font-size="24" font-weight="bold">SLOT P18 [AVAILABLE]</text>
            </svg>

            <!-- Detection Bounding Boxes Overlay -->
            ${bboxHtml}
            ${customBboxHtml}

            <!-- Scanline overlay effect -->
            <div class="scanline-overlay"></div>
            <div class="laser-scan"></div>

            <!-- Top Camera Info Banner -->
            <div style="position: absolute; top: 12px; left: 16px; background: rgba(0,0,0,0.7); padding: 4px 10px; border-radius: 6px; font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-ai-cyan); border: 1px solid rgba(56,189,248,0.3);">
              REC 🔴 | 1080p @ 30 FPS | YOLOv8n-weights.pt | MODE: ${store.visionFilterMode.toUpperCase()}
            </div>
            
            <div style="position: absolute; top: 12px; right: 16px; background: rgba(0,0,0,0.7); padding: 4px 10px; border-radius: 6px; font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-available);">
              LATENCY: 12.4ms
            </div>
          </div>

          <!-- Video Footer Controls -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; flex-wrap: wrap; gap: 12px;">
            <div style="display: flex; gap: 12px; font-size: 0.8rem; color: var(--text-muted);">
              <span><span>🟦</span> Car (92%-96%)</span>
              <span><span>🟪</span> SUV / Truck (89%-94%)</span>
              <span><span>🟩</span> Slot ROI (Overlap: 0%)</span>
            </div>

            <button class="btn btn-primary" id="startDetectionBtn" ${store.isScanning ? 'disabled' : ''}>
              ${store.isScanning ? '⏳ Scanning CCTV Stream...' : '⚡ Start AI Detection Scan'}
            </button>
          </div>
        </div>

        <!-- Right: Detection Statistics Panel -->
        <div class="glass-card" style="padding: 24px;">
          <h3 style="font-size: 1.15rem; margin-bottom: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px;">
            AI Detection Statistics
          </h3>

          <div style="display: flex; flex-direction: column; gap: 18px;">
            <div>
              <div style="font-size: 0.8rem; color: var(--text-dim); text-transform: uppercase; font-weight: 600;">AI Detection Status</div>
              <div class="badge badge-ai" style="margin-top: 4px; font-size: 0.85rem;">
                ${store.isScanning ? 'SCANNING & ANALYZING...' : 'ACTIVE (YOLOv8 OPTIMIZED)'}
              </div>
            </div>

            <div>
              <div style="font-size: 0.8rem; color: var(--text-dim); text-transform: uppercase; font-weight: 600;">Vehicles Detected (Camera)</div>
              <div class="text-mono" style="font-size: 1.8rem; font-weight: 800; color: #fff;">
                ${cam.detectedVehicles} Vehicles
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div style="background: rgba(244,63,94,0.1); padding: 12px; border-radius: 8px; border: 1px solid rgba(244,63,94,0.3);">
                <div style="font-size: 0.72rem; color: var(--color-occupied); font-weight: 700;">OCCUPIED SLOTS</div>
                <div class="text-mono" style="font-size: 1.4rem; font-weight: 800; color: var(--color-occupied);">${stats.occupied}</div>
              </div>

              <div style="background: rgba(16,185,129,0.1); padding: 12px; border-radius: 8px; border: 1px solid rgba(16,185,129,0.3);">
                <div style="font-size: 0.72rem; color: var(--color-available); font-weight: 700;">AVAILABLE SLOTS</div>
                <div class="text-mono" style="font-size: 1.4rem; font-weight: 800; color: var(--color-available);">${stats.available}</div>
              </div>
            </div>

            <div style="background: rgba(10,16,28,0.6); padding: 14px; border-radius: 10px; border: 1px solid var(--border-color);">
              <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 6px;">
                <span style="color: var(--text-muted);">Detection Accuracy Goal:</span>
                <strong style="color: var(--color-ai-cyan);">&gt;95%</strong>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 6px;">
                <span style="color: var(--text-muted);">Current Test Benchmark:</span>
                <strong style="color: var(--color-available);">96.4%</strong>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.82rem;">
                <span style="color: var(--text-muted);">Primary Classifiers:</span>
                <span style="color: var(--text-main);">Car, SUV, Truck, Van</span>
              </div>
            </div>

            <!-- Disclaimer Notice per requirements -->
            <div style="font-size: 0.78rem; color: var(--text-dim); line-height: 1.5; padding: 10px; background: rgba(245,158,11,0.08); border-radius: 8px; border: 1px solid rgba(245,158,11,0.2);">
              ⚠️ <strong>Prototype Simulation Notice:</strong> This visual frame demonstrates YOLOv8 bounding box and confidence score processing logic. Live hardware streaming can be integrated via RTSP.
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
}

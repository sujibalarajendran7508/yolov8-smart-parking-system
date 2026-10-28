/* ==========================================================================
   AI Detection View Component (Webcam, Video Upload & YOLOv8 Engine)
   ========================================================================== */

function renderAIDetectionView() {
  const store = window.SmartParkingStore;
  const isWebcamActive = store.selectedCamera === 'webcam';
  const isUploadActive = store.selectedCamera === 'upload';
  const cam = (!isWebcamActive && !isUploadActive) ? store.cameras[store.selectedCamera] : null;
  const stats = store.getStats();

  // Preset camera bounding boxes
  let bboxHtml = '';
  if (cam && cam.boxes) {
    bboxHtml = cam.boxes.map(box => {
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
  }

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
      <div style="margin-bottom: 24px;">
        <div class="badge badge-ai" style="margin-bottom: 8px;">
          🤖 REAL-TIME COMPUTER VISION ENGINE - YOLOV8 NANO
        </div>
        <h1 style="font-size: 2.2rem; margin-bottom: 6px;">
          YOLOv8 Computer Vision & CCTV Stream Analyzer
        </h1>
        <p style="color: var(--text-muted); font-size: 1rem;">
          Detects vehicles, identifies empty slot ROIs, and supports simulated feeds, live webcams, and custom video uploads.
        </p>
      </div>

      <!-- Video Feed Source Selection Toolbar -->
      <div class="glass-card" style="padding: 16px 20px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
        <!-- Feed Switcher -->
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          <strong style="font-size: 0.85rem; color: var(--text-muted);">Video Source:</strong>
          <button class="btn btn-sm ${store.selectedCamera === 'cam1' ? 'btn-primary' : 'btn-secondary'}" data-cam="cam1">📹 Cam 01 (North)</button>
          <button class="btn btn-sm ${store.selectedCamera === 'cam2' ? 'btn-primary' : 'btn-secondary'}" data-cam="cam2">📹 Cam 02 (Central)</button>
          <button class="btn btn-sm ${store.selectedCamera === 'cam3' ? 'btn-primary' : 'btn-secondary'}" data-cam="cam3">📹 Cam 03 (EV Hub)</button>
          <button class="btn btn-sm ${isWebcamActive ? 'btn-emerald' : 'btn-secondary'}" id="startWebcamBtn">📷 Live Webcam</button>
          <button class="btn btn-sm ${isUploadActive ? 'btn-warning' : 'btn-secondary'}" id="uploadVideoToggleBtn">📂 Upload Custom Video/Image</button>
        </div>

        <!-- Vision Mode Filters -->
        <div style="display: flex; gap: 6px; align-items: center;">
          <button class="btn btn-sm ${store.visionFilterMode === 'normal' ? 'btn-primary' : 'btn-secondary'}" data-vision-filter="normal">Normal</button>
          <button class="btn btn-sm ${store.visionFilterMode === 'heatmap' ? 'btn-primary' : 'btn-secondary'}" data-vision-filter="heatmap">🔥 Heatmap</button>
          <button class="btn btn-sm ${store.visionFilterMode === 'night' ? 'btn-primary' : 'btn-secondary'}" data-vision-filter="night">🌙 Night Vision</button>
        </div>
      </div>

      <!-- Hidden Video Upload File Input -->
      <input type="file" id="videoFileInput" accept="video/*,image/*" style="display: none;" />

      <!-- Main Detection Layout -->
      <div style="display: grid; grid-template-columns: 1fr 340px; gap: 24px; align-items: flex-start;">
        
        <!-- Left: Simulated CCTV or Live Video Feed Viewer -->
        <div class="glass-card" style="padding: 20px;">
          <!-- Camera Control Toolbar -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 10px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span class="status-dot status-dot-green"></span>
              <strong style="font-size: 0.95rem; color: var(--text-main);">
                ${isWebcamActive ? 'Live Camera Feed (Browser Webcam)' : isUploadActive ? 'Uploaded Custom Media Stream' : cam.name}
              </strong>
            </div>

            <div style="display: flex; gap: 8px;">
              <button class="btn btn-sm btn-warning" id="addCustomRoiBtn">➕ Draw Slot ROI</button>
              ${store.customROIs.length > 0 ? `
                <button class="btn btn-sm btn-secondary" id="clearCustomRoisBtn">🧹 Clear ROIs</button>
              ` : ''}
            </div>
          </div>

          <!-- Video Stream Container -->
          <div class="video-container ${store.isScanning ? 'laser-scanning' : ''} ${store.visionFilterMode === 'night' ? 'night-vision-mode' : ''} ${store.visionFilterMode === 'heatmap' ? 'heatmap-mode' : ''}" style="background: ${cam ? cam.bgGradient : '#0a0f1d'}; position: relative;">
            
            ${isWebcamActive ? `
              <!-- Live Webcam Video Element -->
              <video id="webcamVideoElement" autoplay playsinline muted style="width: 100%; height: 100%; object-fit: cover; display: block;"></video>
            ` : isUploadActive ? `
              <!-- Custom Upload Media Preview -->
              <div id="uploadMediaPreview" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #0f172a; color: var(--text-muted);">
                <div style="text-align: center; padding: 20px;">
                  <div style="font-size: 2.5rem; margin-bottom: 8px;">📂</div>
                  <div>Upload a Parking Lot Video or Photo (.mp4, .mov, .jpg, .png)</div>
                  <button class="btn btn-sm btn-primary" id="triggerFileSelectBtn" style="margin-top: 12px;">Choose File</button>
                </div>
              </div>
            ` : `
              <!-- Simulated Parking Ground Graphics (SVG) -->
              <svg width="100%" height="100%" viewBox="0 0 1000 562" preserveAspectRatio="none" style="position: absolute; top: 0; left: 0; opacity: 0.4;">
                <line x1="100" y1="100" x2="300" y2="100" stroke="#38bdf8" stroke-width="2" stroke-dasharray="8 6"/>
                <line x1="100" y1="280" x2="300" y2="280" stroke="#38bdf8" stroke-width="2" stroke-dasharray="8 6"/>
                <line x1="350" y1="100" x2="600" y2="100" stroke="#38bdf8" stroke-width="2" stroke-dasharray="8 6"/>
                <line x1="350" y1="280" x2="600" y2="280" stroke="#38bdf8" stroke-width="2" stroke-dasharray="8 6"/>
                <line x1="650" y1="100" x2="900" y2="100" stroke="#10b981" stroke-width="3"/>
                
                <text x="180" y="200" fill="#64748b" font-family="monospace" font-size="24" font-weight="bold">SLOT P01 [OCCUPIED]</text>
                <text x="440" y="200" fill="#64748b" font-family="monospace" font-size="24" font-weight="bold">SLOT P02 [OCCUPIED]</text>
                <text x="730" y="200" fill="#10b981" font-family="monospace" font-size="24" font-weight="bold">SLOT P18 [AVAILABLE]</text>
              </svg>
            `}

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
              <span><span>🟩</span> Free ROI (IoU &lt; 0.3)</span>
            </div>

            <button class="btn btn-primary" id="startDetectionBtn" ${store.isScanning ? 'disabled' : ''}>
              ${store.isScanning ? '⏳ Scanning Feed with YOLOv8...' : '⚡ Run YOLOv8 Frame Inference'}
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
                ${store.isScanning ? 'SCANNING & INFERRING...' : 'ACTIVE (YOLOv8 OPTIMIZED)'}
              </div>
            </div>

            <div>
              <div style="font-size: 0.8rem; color: var(--text-dim); text-transform: uppercase; font-weight: 600;">Active Video Channel</div>
              <div class="text-mono" style="font-size: 1.4rem; font-weight: 800; color: #fff;">
                ${isWebcamActive ? 'User Webcam Stream' : isUploadActive ? 'Custom User Upload' : cam ? cam.name.split('-')[0] : 'Channel Active'}
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
                <span style="color: var(--text-muted);">Python Backend Bridge:</span>
                <strong style="color: var(--color-ai-cyan);">FastAPI Ready (Port 5000)</strong>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 6px;">
                <span style="color: var(--text-muted);">IoU Decision Threshold:</span>
                <strong style="color: var(--color-available);">0.30 Overlap</strong>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.82rem;">
                <span style="color: var(--text-muted);">Inference Speed:</span>
                <span style="color: var(--text-main);">12.4ms (30 FPS)</span>
              </div>
            </div>

            <div style="font-size: 0.78rem; color: var(--text-dim); line-height: 1.5; padding: 10px; background: rgba(56,189,248,0.08); border-radius: 8px; border: 1px solid rgba(56,189,248,0.2);">
              💡 <strong>Dual-Engine Architecture:</strong> Runs standalone in any browser with simulated camera feeds, and supports live webcam video inference or local FastAPI Python backend.
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
}

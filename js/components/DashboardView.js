/* ==========================================================================
   Dashboard View Component
   ========================================================================== */

function renderDashboardView() {
  const stats = window.SmartParkingStore.getStats();
  const activityLog = window.SmartParkingStore.activityLog;

  return `
    <div class="dashboard-page" style="padding: 32px 0;">
      <!-- Hero Section -->
      <div class="glass-panel" style="padding: 40px; margin-bottom: 32px; background: linear-gradient(135deg, rgba(14,21,38,0.9) 0%, rgba(15,23,42,0.95) 100%); position: relative; overflow: hidden;">
        <div style="position: absolute; right: -40px; top: -40px; width: 300px; height: 300px; background: radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%); pointer-events: none;"></div>
        
        <div style="max-width: 800px; position: relative; z-index: 2;">
          <div class="badge badge-demo" style="margin-bottom: 16px;">
            ⚡ ACADEMIC PROJECT PROTOTYPE
          </div>
          <h1 style="font-size: 2.5rem; margin-bottom: 12px; line-height: 1.2;">
            AI-Based Smart Parking <span class="text-gradient">Detection System</span>
          </h1>
          <p style="font-size: 1.15rem; color: var(--color-ai-cyan); font-weight: 500; margin-bottom: 12px;">
            Real-time parking detection using YOLOv8 and computer vision.
          </p>
          <p style="font-size: 0.98rem; color: var(--text-muted); margin-bottom: 28px; line-height: 1.6;">
            Detect available parking spaces in real time, reduce parking search time, and improve parking management using existing CCTV infrastructure.
          </p>
          
          <div style="display: flex; gap: 16px; flex-wrap: wrap;">
            <button class="btn btn-primary nav-action-btn" data-tab="live-parking">
              <span>🅿️</span> View Live Parking
            </button>
            <button class="btn btn-secondary nav-action-btn" data-tab="ai-detection">
              <span>🤖</span> Start AI Detection
            </button>
            <button class="btn btn-secondary nav-action-btn" data-tab="navigation">
              <span>🗺️</span> Find Recommended Slot (P18)
            </button>
          </div>
        </div>
      </div>

      <!-- Demo Disclaimer Banner -->
      <div class="glass-card" style="padding: 14px 20px; margin-bottom: 32px; border-left: 4px solid var(--color-ai-purple); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 1.3rem;">ℹ️</span>
          <div>
            <strong style="color: var(--text-main); font-size: 0.9rem;">Prototype Simulation Notice:</strong>
            <span style="color: var(--text-muted); font-size: 0.85rem; margin-left: 6px;">All slot counts, detection scores, and camera feeds are demo values designed for project evaluation.</span>
          </div>
        </div>
        <span class="badge badge-demo">DEMO DATA ACTIVE</span>
      </div>

      <!-- Statistics Cards Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 32px;">
        <!-- Total Slots -->
        <div class="glass-card" style="padding: 24px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: var(--text-muted); font-size: 0.88rem; font-weight: 600;">TOTAL PARKING SLOTS</span>
            <span style="font-size: 1.5rem;">🅿️</span>
          </div>
          <div class="text-mono" style="font-size: 2.2rem; font-weight: 800; color: #fff;">
            ${stats.total}
          </div>
          <div style="font-size: 0.78rem; color: var(--text-dim); margin-top: 6px;">
            Monitored by 3 CCTV Nodes
          </div>
        </div>

        <!-- Occupied Slots -->
        <div class="glass-card" style="padding: 24px; border-top: 3px solid var(--color-occupied);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: var(--text-muted); font-size: 0.88rem; font-weight: 600;">OCCUPIED SLOTS</span>
            <span style="font-size: 1.5rem;">🚘</span>
          </div>
          <div class="text-mono" style="font-size: 2.2rem; font-weight: 800; color: var(--color-occupied);">
            ${stats.occupied}
          </div>
          <div style="font-size: 0.78rem; color: var(--text-dim); margin-top: 6px;">
            Verified by YOLOv8 bounding boxes
          </div>
        </div>

        <!-- Available Slots -->
        <div class="glass-card" style="padding: 24px; border-top: 3px solid var(--color-available);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: var(--text-muted); font-size: 0.88rem; font-weight: 600;">AVAILABLE SLOTS</span>
            <span style="font-size: 1.5rem;">✅</span>
          </div>
          <div class="text-mono" style="font-size: 2.2rem; font-weight: 800; color: var(--color-available);">
            ${stats.available}
          </div>
          <div style="font-size: 0.78rem; color: var(--text-dim); margin-top: 6px;">
            Nearest: <strong style="color: var(--color-warning);">Slot P18</strong> (120m)
          </div>
        </div>

        <!-- Occupancy Percentage -->
        <div class="glass-card" style="padding: 24px; border-top: 3px solid var(--color-ai-cyan);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: var(--text-muted); font-size: 0.88rem; font-weight: 600;">OCCUPANCY RATE</span>
            <span style="font-size: 1.5rem;">📊</span>
          </div>
          <div class="text-mono" style="font-size: 2.2rem; font-weight: 800; color: var(--color-ai-cyan);">
            ${stats.percentage}%
          </div>
          <!-- Progress bar -->
          <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 4px; margin-top: 10px; overflow: hidden;">
            <div style="width: ${stats.percentage}%; height: 100%; background: var(--grad-ai); border-radius: 4px; transition: width 0.5s ease;"></div>
          </div>
        </div>
      </div>

      <!-- Main Content Split: Status & Recent Activity -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 24px;">
        <!-- Current Status Overview & Gauges -->
        <div class="glass-card" style="padding: 28px;">
          <h3 style="font-size: 1.15rem; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between;">
            <span>Current Parking Status</span>
            <span class="badge badge-available">LIVE STREAMING</span>
          </h3>

          <div style="margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; font-size: 0.88rem; margin-bottom: 8px;">
              <span style="color: var(--text-muted);">Capacity Utilization</span>
              <span class="text-mono" style="font-weight: 700;">${stats.occupied} / ${stats.total} Vehicles</span>
            </div>
            <div style="width: 100%; height: 12px; background: rgba(255,255,255,0.08); border-radius: 6px; overflow: hidden; display: flex;">
              <div style="width: ${stats.percentage}%; background: var(--color-occupied); transition: width 0.3s;" title="Occupied: ${stats.occupied}"></div>
              <div style="width: ${100 - stats.percentage}%; background: var(--color-available); transition: width 0.3s;" title="Available: ${stats.available}"></div>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.78rem; margin-top: 6px; color: var(--text-dim);">
              <span>🟥 Occupied (${stats.occupied})</span>
              <span>🟩 Free (${stats.available})</span>
            </div>
          </div>

          <div style="background: rgba(10, 16, 28, 0.7); padding: 18px; border-radius: 12px; border: 1px solid var(--border-color);">
            <div style="font-size: 0.85rem; font-weight: 600; color: var(--text-muted); margin-bottom: 12px;">SYSTEM HEALTH & PERF</div>
            
            <div style="display: flex; flex-direction: column; gap: 10px; font-size: 0.85rem;">
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-dim);">YOLOv8 Inference Latency:</span>
                <span class="text-mono" style="color: var(--color-available); font-weight: 600;">12.4 ms / frame</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-dim);">Detection Accuracy:</span>
                <span class="text-mono" style="color: var(--color-ai-cyan); font-weight: 600;">96.4% (Goal: &gt;95%)</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-dim);">Active Camera Feed:</span>
                <span style="color: var(--text-main); font-weight: 500;">3 Channels (Cam 01, 02, 03)</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-dim);">Last Database Sync:</span>
                <span class="text-mono" style="color: var(--text-muted);">${window.SmartParkingStore.lastUpdated}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity Feed -->
        <div class="glass-card" style="padding: 28px;">
          <h3 style="font-size: 1.15rem; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between;">
            <span>Recent Parking Activity</span>
            <span style="font-size: 0.8rem; color: var(--color-ai-cyan); font-weight: 500;">Auto-updating</span>
          </h3>

          <div style="display: flex; flex-direction: column; gap: 14px; max-height: 320px; overflow-y: auto; padding-right: 4px;">
            ${activityLog.map(item => `
              <div style="padding: 12px 14px; background: rgba(10,16,28,0.5); border: 1px solid var(--border-color); border-radius: 10px; display: flex; align-items: flex-start; gap: 12px;">
                <span class="badge badge-${item.badge}" style="margin-top: 2px;">${item.type}</span>
                <div style="flex: 1;">
                  <div style="font-size: 0.85rem; color: var(--text-main); font-weight: 500;">${item.text}</div>
                  <div style="font-size: 0.72rem; color: var(--text-dim); margin-top: 4px;">${item.time}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

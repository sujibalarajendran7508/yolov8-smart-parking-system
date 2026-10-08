/* ==========================================================================
   Analytics View Component (Export Suite Upgrade)
   ========================================================================== */

function renderAnalyticsView() {
  const store = window.SmartParkingStore;
  const stats = store.getStats();

  return `
    <div class="analytics-page" style="padding: 32px 0;">
      <!-- Page Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px; margin-bottom: 28px;">
        <div>
          <div class="badge badge-ai" style="margin-bottom: 10px;">
            📈 ADMINISTRATOR ANALYTICS & INSIGHTS
          </div>
          <h1 style="font-size: 2.2rem; margin-bottom: 6px;">
            Smart Parking System Analytics
          </h1>
          <p style="color: var(--text-muted); font-size: 1rem;">
            Historical occupancy trends, entry/exit throughput, peak-hour bottlenecks, and expected outcome benchmarks.
          </p>
        </div>

        <!-- Export Suite Action Buttons -->
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="btn btn-secondary" id="exportCsvBtn">
            📥 Export Logs (CSV)
          </button>
          <button class="btn btn-primary" id="printReportBtn">
            🖨️ Print / Save Report (PDF)
          </button>
        </div>
      </div>

      <!-- Top Summary Metrics Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 18px; margin-bottom: 32px;">
        <div class="glass-card" style="padding: 20px;">
          <div style="font-size: 0.8rem; color: var(--text-dim); text-transform: uppercase; font-weight: 600;">Peak Hour Window</div>
          <div class="text-mono" style="font-size: 1.6rem; font-weight: 800; color: var(--color-warning); margin-top: 4px;">
            11:00 AM - 2:00 PM
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Max Occupancy: 92%</div>
        </div>

        <div class="glass-card" style="padding: 20px;">
          <div style="font-size: 0.8rem; color: var(--text-dim); text-transform: uppercase; font-weight: 600;">Avg Parking Search Time</div>
          <div class="text-mono" style="font-size: 1.6rem; font-weight: 800; color: var(--color-available); margin-top: 4px;">
            2.4 mins <span style="font-size: 0.8rem; color: var(--color-available);">-65%</span>
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Compared to 8.5 min manual</div>
        </div>

        <div class="glass-card" style="padding: 20px;">
          <div style="font-size: 0.8rem; color: var(--text-dim); text-transform: uppercase; font-weight: 600;">Daily Vehicle Throughput</div>
          <div class="text-mono" style="font-size: 1.6rem; font-weight: 800; color: var(--color-ai-cyan); margin-top: 4px;">
            482 Vehicles
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Across 3 Monitored Gates</div>
        </div>

        <div class="glass-card" style="padding: 20px;">
          <div style="font-size: 0.8rem; color: var(--text-dim); text-transform: uppercase; font-weight: 600;">System Accuracy Benchmark</div>
          <div class="text-mono" style="font-size: 1.6rem; font-weight: 800; color: var(--color-available); margin-top: 4px;">
            96.4%
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Goal: &gt;95% Target</div>
        </div>
      </div>

      <!-- Charts Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(420px, 1fr)); gap: 24px; margin-bottom: 36px;">
        
        <!-- Chart 1: Parking Occupancy Over Time (Line Chart SVG) -->
        <div class="glass-card" style="padding: 24px;">
          <h3 style="font-size: 1.1rem; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
            <span>1. Parking Occupancy Over 24 Hours</span>
            <span class="badge badge-ai">LINE CHART</span>
          </h3>
          <div style="width: 100%; height: 220px; position: relative;">
            <svg width="100%" height="100%" viewBox="0 0 500 200" preserveAspectRatio="none">
              <line x1="40" y1="30" x2="480" y2="30" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4 4"/>
              <line x1="40" y1="80" x2="480" y2="80" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4 4"/>
              <line x1="40" y1="130" x2="480" y2="130" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4 4"/>
              <line x1="40" y1="180" x2="480" y2="180" stroke="rgba(255,255,255,0.1)"/>

              <text x="30" y="35" fill="#64748b" font-size="10" text-anchor="end">100%</text>
              <text x="30" y="85" fill="#64748b" font-size="10" text-anchor="end">60%</text>
              <text x="30" y="135" fill="#64748b" font-size="10" text-anchor="end">30%</text>

              <path d="M 50 160 Q 110 170 170 110 T 290 40 T 400 90 T 470 150" fill="none" stroke="var(--color-ai-cyan)" stroke-width="3"/>
              <path d="M 50 160 Q 110 170 170 110 T 290 40 T 400 90 T 470 150 L 470 180 L 50 180 Z" fill="rgba(56,189,248,0.15)"/>

              <circle cx="170" cy="110" r="4" fill="#38bdf8"/>
              <circle cx="290" cy="40" r="6" fill="#f59e0b"/>
              <circle cx="400" cy="90" r="4" fill="#38bdf8"/>

              <text x="290" y="25" fill="#f59e0b" font-size="11" font-weight="bold" text-anchor="middle">PEAK 92% (1:00 PM)</text>

              <text x="50" y="195" fill="#64748b" font-size="10">06:00</text>
              <text x="170" y="195" fill="#64748b" font-size="10">09:00</text>
              <text x="290" y="195" fill="#64748b" font-size="10">13:00</text>
              <text x="400" y="195" fill="#64748b" font-size="10">17:00</text>
              <text x="470" y="195" fill="#64748b" font-size="10">21:00</text>
            </svg>
          </div>
        </div>

        <!-- Chart 2: Vehicle Entry & Exit Trends (Bar Chart SVG) -->
        <div class="glass-card" style="padding: 24px;">
          <h3 style="font-size: 1.1rem; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
            <span>2. Hourly Vehicle Entry & Exit Trends</span>
            <span class="badge badge-ai">BAR CHART</span>
          </h3>
          <div style="width: 100%; height: 220px; position: relative;">
            <svg width="100%" height="100%" viewBox="0 0 500 200" preserveAspectRatio="none">
              <line x1="40" y1="170" x2="480" y2="170" stroke="rgba(255,255,255,0.1)"/>
              
              <rect x="70" y="80" width="16" height="90" fill="var(--color-available)" rx="3"/>
              <rect x="90" y="140" width="16" height="30" fill="var(--color-occupied)" rx="3"/>

              <rect x="170" y="30" width="16" height="140" fill="var(--color-available)" rx="3"/>
              <rect x="190" y="110" width="16" height="60" fill="var(--color-occupied)" rx="3"/>

              <rect x="270" y="60" width="16" height="110" fill="var(--color-available)" rx="3"/>
              <rect x="290" y="50" width="16" height="120" fill="var(--color-occupied)" rx="3"/>

              <rect x="370" y="120" width="16" height="50" fill="var(--color-available)" rx="3"/>
              <rect x="390" y="35" width="16" height="135" fill="var(--color-occupied)" rx="3"/>

              <text x="88" y="190" fill="#64748b" font-size="10" text-anchor="middle">08:00 AM</text>
              <text x="188" y="190" fill="#64748b" font-size="10" text-anchor="middle">11:00 AM</text>
              <text x="288" y="190" fill="#64748b" font-size="10" text-anchor="middle">02:00 PM</text>
              <text x="388" y="190" fill="#64748b" font-size="10" text-anchor="middle">05:00 PM</text>
            </svg>
            <div style="display: flex; justify-content: center; gap: 20px; font-size: 0.78rem; margin-top: -10px;">
              <span><span style="display:inline-block; width:10px; height:10px; background:var(--color-available); border-radius:2px;"></span> Vehicle Entries</span>
              <span><span style="display:inline-block; width:10px; height:10px; background:var(--color-occupied); border-radius:2px;"></span> Vehicle Exits</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Expected Impact & Project Goals Section -->
      <div class="glass-panel" style="padding: 32px; border-left: 4px solid var(--color-available);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
          <div>
            <h2 style="font-size: 1.6rem; color: var(--text-main);">Project Expected Impact & Outcomes</h2>
            <p style="color: var(--text-muted); font-size: 0.9rem;">Target performance goals based on smart parking research benchmarks.</p>
          </div>
          <span class="badge badge-warning" style="font-size: 0.8rem; padding: 6px 12px;">
            🎯 PROJECT GOALS & EXPECTED OUTCOMES
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px;">
          <div style="background: rgba(10,16,28,0.7); padding: 20px; border-radius: 12px; border: 1px solid var(--border-color);">
            <div style="font-size: 2rem; margin-bottom: 8px;">⏱️</div>
            <h4 style="font-size: 1.1rem; color: var(--color-available); margin-bottom: 6px;">Reduced Search Time</h4>
            <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Over <strong>60% expected reduction</strong> in average parking search time (from 8.5 min down to &lt;3 min per vehicle).
            </p>
          </div>

          <div style="background: rgba(10,16,28,0.7); padding: 20px; border-radius: 12px; border: 1px solid var(--border-color);">
            <div style="font-size: 2rem; margin-bottom: 8px;">🌱</div>
            <h4 style="font-size: 1.1rem; color: var(--color-ai-cyan); margin-bottom: 6px;">Environmental & Traffic Impact</h4>
            <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Substantial reduction in fuel consumption, tailpipe carbon emissions, and internal parking lot traffic gridlock.
            </p>
          </div>

          <div style="background: rgba(10,16,28,0.7); padding: 20px; border-radius: 12px; border: 1px solid var(--border-color);">
            <div style="font-size: 2rem; margin-bottom: 8px;">🎯</div>
            <h4 style="font-size: 1.1rem; color: var(--color-warning); margin-bottom: 6px;">Detection Accuracy Goal</h4>
            <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.5;">
              Target computer vision accuracy benchmark of <strong>&gt;95%</strong> under varying lighting & weather conditions.
            </p>
          </div>
        </div>

        <div style="margin-top: 20px; font-size: 0.78rem; color: var(--text-dim); text-align: center;">
          * Note: Above values represent projected target metrics and empirical research goals for prototype validation.
        </div>
      </div>
    </div>
  `;
}

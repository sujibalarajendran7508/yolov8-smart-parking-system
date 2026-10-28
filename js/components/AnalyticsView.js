/* ==========================================================================
   Analytics View Component (Predictive AI Forecasting & Export Suite)
   ========================================================================== */

function renderAnalyticsView() {
  const store = window.SmartParkingStore;
  const stats = store.getStats();
  const forecast = store.predictiveForecast;

  return `
    <div class="analytics-page" style="padding: 32px 0;">
      <!-- Page Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px; margin-bottom: 28px;">
        <div>
          <div class="badge badge-ai" style="margin-bottom: 8px;">
            📈 ADMINISTRATOR ANALYTICS & PREDICTIVE MACHINE LEARNING
          </div>
          <h1 style="font-size: 2.2rem; margin-bottom: 6px;">
            Smart Parking System Analytics
          </h1>
          <p style="color: var(--text-muted); font-size: 1rem;">
            Real-time occupancy metrics, vehicle throughput trends, and ML-based predictive peak forecasting.
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

      <!-- PREDICTIVE AI PEAK FORECASTING MODULE (NEW 100% UPGRADE) -->
      <div class="glass-panel" style="padding: 28px; margin-bottom: 36px; border: 1.5px solid var(--color-ai-indigo); background: linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(14,21,38,0.95) 100%);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
          <div>
            <div class="badge badge-ai" style="margin-bottom: 6px;">🧠 TIME-SERIES ML PREDICTION ENGINE</div>
            <h2 style="font-size: 1.5rem; color: #fff;">Predictive Peak-Hour Lot Occupancy Forecast</h2>
            <p style="color: var(--text-muted); font-size: 0.88rem;">
              ARIMA / Polynomial regression time-series forecasting predicting lot fullness up to 24 hours in advance.
            </p>
          </div>
          <span class="badge badge-warning" style="font-size: 0.82rem; padding: 6px 14px;">
            ⚠️ HIGH CONGESTION EXPECTED AT 18:00 (93%)
          </span>
        </div>

        <!-- Predictive Cards Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">
          ${forecast.predictions.map(p => `
            <div style="background: rgba(10,16,28,0.7); padding: 16px; border-radius: 12px; border: 1px solid var(--border-color);">
              <div style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase; font-weight: 700;">${p.time}</div>
              <div class="text-mono" style="font-size: 1.8rem; font-weight: 800; color: ${p.occupancy > 85 ? 'var(--color-occupied)' : p.occupancy > 75 ? 'var(--color-warning)' : 'var(--color-available)'}; margin: 4px 0;">
                ${p.occupancy}%
              </div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">${p.status}</div>
              <div style="font-size: 0.72rem; color: var(--color-ai-cyan); margin-top: 6px;">Confidence: ${p.confidence}%</div>
            </div>
          `).join('')}
        </div>

        <!-- Predictive Forecast Trend Curve (SVG) -->
        <div style="width: 100%; height: 180px; position: relative; background: rgba(5,8,16,0.6); border-radius: 10px; padding: 10px;">
          <svg width="100%" height="100%" viewBox="0 0 600 160" preserveAspectRatio="none">
            <line x1="40" y1="20" x2="580" y2="20" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4 4"/>
            <line x1="40" y1="70" x2="580" y2="70" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4 4"/>
            <line x1="40" y1="120" x2="580" y2="120" stroke="rgba(255,255,255,0.1)"/>

            <text x="30" y="25" fill="#64748b" font-size="10" text-anchor="end">100%</text>
            <text x="30" y="75" fill="#64748b" font-size="10" text-anchor="end">75%</text>
            <text x="30" y="125" fill="#64748b" font-size="10" text-anchor="end">50%</text>

            <!-- Projected Forecast Curve -->
            <path d="M 60 90 Q 180 60 300 35 T 440 25 T 560 95" fill="none" stroke="var(--color-ai-purple)" stroke-width="3" stroke-dasharray="6 4"/>
            <path d="M 60 90 Q 180 60 300 35 T 440 25 T 560 95 L 560 140 L 60 140 Z" fill="rgba(168,85,247,0.12)"/>

            <!-- Points -->
            <circle cx="60" cy="90" r="5" fill="#38bdf8"/>
            <circle cx="300" cy="35" r="5" fill="#f59e0b"/>
            <circle cx="440" cy="25" r="7" fill="#ef4444"/>
            <circle cx="560" cy="95" r="5" fill="#10b981"/>

            <!-- X Labels -->
            <text x="60" y="145" fill="#64748b" font-size="10">Now</text>
            <text x="180" y="145" fill="#64748b" font-size="10">+1h</text>
            <text x="300" y="145" fill="#64748b" font-size="10">+2h</text>
            <text x="440" y="145" fill="#ef4444" font-size="10" font-weight="bold">+4h (Peak 93%)</text>
            <text x="560" y="145" fill="#64748b" font-size="10">+24h</text>
          </svg>
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

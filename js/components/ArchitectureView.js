/* ==========================================================================
   Architecture & System Overview Component (PPT Concepts & Methodology)
   ========================================================================== */

function renderArchitectureView() {
  const ppt = window.SmartParkingStore.pptContent;

  return `
    <div class="architecture-page" style="padding: 32px 0;">
      <!-- Page Header -->
      <div style="margin-bottom: 32px;">
        <div class="badge badge-demo" style="margin-bottom: 10px;">
          🧠 ACADEMIC METHODOLOGY & ARCHITECTURE
        </div>
        <h1 style="font-size: 2.2rem; margin-bottom: 6px;">
          System Concept & Architecture Overview
        </h1>
        <p style="color: var(--text-muted); font-size: 1rem;">
          Comprehensive breakdown of the Problem Statement, 5-Why Root Cause Analysis, YOLOv8 Pipeline, Comparison, and End-to-End Workflow.
        </p>
      </div>

      <!-- SECTION 1: PROBLEM STATEMENT -->
      <div class="glass-panel" style="padding: 32px; margin-bottom: 36px; border-left: 4px solid var(--color-occupied);">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
          <span class="badge badge-occupied" style="font-size: 0.85rem;">PROBLEM STATEMENT</span>
        </div>
        
        <h2 style="font-size: 1.8rem; margin-bottom: 12px; color: #fff;">
          "${ppt.problemStatement.main}"
        </h2>
        <p style="color: var(--text-muted); font-size: 0.98rem; margin-bottom: 24px; max-width: 900px;">
          Searching for vacant parking slots in congested parking lots creates internal traffic gridlock, wastes fuel, increases carbon footprint, and causes driver frustration.
        </p>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 18px;">
          ${ppt.problemStatement.issues.map(issue => `
            <div style="background: rgba(10,16,28,0.7); padding: 18px; border-radius: 12px; border: 1px solid var(--border-color);">
              <div style="font-size: 2rem; margin-bottom: 10px;">${issue.icon}</div>
              <h4 style="font-size: 1.05rem; color: var(--color-occupied); margin-bottom: 6px;">${issue.title}</h4>
              <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.5;">${issue.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- SECTION 2: FIVE WHY ANALYSIS -->
      <div class="glass-panel" style="padding: 32px; margin-bottom: 36px; border-left: 4px solid var(--color-warning);">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
          <span class="badge badge-warning" style="font-size: 0.85rem;">ROOT CAUSE ANALYSIS</span>
        </div>
        <h2 style="font-size: 1.6rem; margin-bottom: 20px;">Five Why Timeline Analysis</h2>

        <!-- Connected Vertical/Horizontal Timeline -->
        <div style="display: flex; flex-direction: column; gap: 16px; position: relative;">
          ${ppt.fiveWhys.map((item, idx) => `
            <div style="display: flex; gap: 18px; align-items: flex-start; position: relative;">
              <div style="background: ${item.step === 5 ? 'var(--color-warning)' : 'var(--border-bright)'}; color: ${item.step === 5 ? '#000' : '#fff'}; font-family: var(--font-mono); font-weight: 800; padding: 8px 14px; border-radius: 8px; font-size: 0.9rem; min-width: 80px; text-anchor: center; text-align: center;">
                WHY ${item.step}
              </div>

              <div class="glass-card" style="flex: 1; padding: 16px 20px; border-color: ${item.step === 5 ? 'var(--color-warning)' : 'var(--border-color)'};">
                <div style="font-size: 0.9rem; font-weight: 700; color: ${item.step === 5 ? 'var(--color-warning)' : 'var(--color-ai-cyan)'}; margin-bottom: 4px;">
                  ${item.q}
                </div>
                <div style="font-size: 0.88rem; color: var(--text-main); font-weight: 500;">
                  ${item.a}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- SECTION 3: PROPOSED AI SOLUTION PIPELINE -->
      <div class="glass-panel" style="padding: 32px; margin-bottom: 36px; border-left: 4px solid var(--color-ai-cyan);">
        <span class="badge badge-ai" style="margin-bottom: 12px;">PROPOSED ARCHITECTURE</span>
        <h2 style="font-size: 1.6rem; margin-bottom: 12px;">${ppt.proposedSolution.title}</h2>
        <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 24px; max-width: 900px; line-height: 1.6;">
          ${ppt.proposedSolution.description}
        </p>

        <!-- Pipeline Diagram Cards -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; background: rgba(10,16,28,0.8); padding: 20px; border-radius: 14px; border: 1px solid var(--border-color);">
          ${ppt.proposedSolution.pipeline.map((node, i) => `
            <div style="background: var(--bg-card); padding: 12px 18px; border-radius: 10px; border: 1px solid var(--color-ai-cyan); font-weight: 600; font-size: 0.85rem; color: var(--text-main); text-align: center; box-shadow: var(--shadow-glow);">
              ${node}
            </div>
            ${i < ppt.proposedSolution.pipeline.length - 1 ? '<span style="color: var(--color-ai-cyan); font-weight: 800; font-size: 1.2rem;">➡️</span>' : ''}
          `).join('')}
        </div>
      </div>

      <!-- SECTION 4: EXISTING SOLUTION COMPARISON TABLE -->
      <div class="glass-panel" style="padding: 32px; margin-bottom: 36px;">
        <span class="badge badge-ai" style="margin-bottom: 12px;">COMPARATIVE MATRIX</span>
        <h2 style="font-size: 1.6rem; margin-bottom: 20px;">Existing Solution vs YOLOv8 Vision</h2>

        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.88rem;">
            <thead>
              <tr style="border-bottom: 2px solid var(--border-bright); background: rgba(15,23,42,0.8);">
                <th style="padding: 14px; color: var(--text-muted);">Feature / Metric</th>
                <th style="padding: 14px; color: var(--text-dim);">Manual Security</th>
                <th style="padding: 14px; color: var(--text-dim);">RFID Gate System</th>
                <th style="padding: 14px; color: var(--text-dim);">Smart Sensors (Ultrasonic)</th>
                <th style="padding: 14px; color: var(--color-ai-cyan); background: rgba(56,189,248,0.1); border-top: 2px solid var(--color-ai-cyan);">YOLOv8 Vision (Selected)</th>
              </tr>
            </thead>
            <tbody>
              ${ppt.existingComparison.map(row => `
                <tr style="border-bottom: 1px solid var(--border-color);">
                  <td style="padding: 14px; font-weight: 700; color: var(--text-main);">${row.feature}</td>
                  <td style="padding: 14px; color: var(--text-muted);">${row.manual}</td>
                  <td style="padding: 14px; color: var(--text-muted);">${row.rfid}</td>
                  <td style="padding: 14px; color: var(--text-muted);">${row.sensors}</td>
                  <td style="padding: 14px; font-weight: 700; color: var(--color-available); background: rgba(56,189,248,0.05);">${row.yolov8}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- SECTION 5: 9-STEP END-TO-END SYSTEM WORKFLOW -->
      <div class="glass-panel" style="padding: 32px; margin-bottom: 36px; border-left: 4px solid var(--color-available);">
        <span class="badge badge-available" style="margin-bottom: 12px;">SYSTEM FLOW</span>
        <h2 style="font-size: 1.6rem; margin-bottom: 20px;">9-Step End-to-End System Workflow</h2>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px;">
          ${ppt.systemFlow.map(step => `
            <div class="glass-card" style="padding: 18px; border-top: 3px solid var(--color-available);">
              <div class="text-mono" style="font-size: 0.8rem; font-weight: 800; color: var(--color-available); margin-bottom: 6px;">
                STEP ${step.step}
              </div>
              <h4 style="font-size: 1rem; color: #fff; margin-bottom: 6px;">${step.title}</h4>
              <p style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.5;">${step.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- SECTION 6: FUTURE SCOPE -->
      <div class="glass-card" style="padding: 28px;">
        <h3 style="font-size: 1.2rem; color: var(--color-ai-cyan); margin-bottom: 14px;">Future Scope & Expansions</h3>
        <ul style="list-style: disc; padding-left: 20px; color: var(--text-muted); font-size: 0.9rem; line-height: 1.8;">
          <li><strong>EV Charging Management:</strong> Automated detection of EV charging bay compliance.</li>
          <li><strong>Predictive Peak-Hour AI:</strong> Machine learning time-series forecasting to predict parking lot fullness 1 hour in advance.</li>
          <li><strong>Smart Campus Infrastructure Planning:</strong> Heatmap analytics to optimize security staffing and lot allocation.</li>
        </ul>
      </div>
    </div>
  `;
}

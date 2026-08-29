/**
 * CampusAI KNUST - Smart CWA Goal Calculator & Strategist
 * Features: Auto-Save State via LocalStorage, Fully Isolated
 * Developer: Pere Falc
 */

// 1. Core Mathematical & Strategy Engine
function calculateCwaStrategy() {
  const currentCwa = parseFloat(document.getElementById('cwa-current').value);
  const pastCredits = parseFloat(document.getElementById('cwa-past-credits').value);
  const currentCredits = parseFloat(document.getElementById('cwa-current-credits').value);
  const targetCwa = parseFloat(document.getElementById('cwa-target').value);
  const displayBox = document.getElementById('cwa-result-display');

  // Input Validation Guard
  if (isNaN(currentCwa) || isNaN(pastCredits) || isNaN(currentCredits) || isNaN(targetCwa)) {
    displayBox.innerHTML = `
      <div class="cwa-alert cwa-error">
        <span>⚠️</span> Please fill in all fields with valid numbers to compute your strategy.
      </div>`;
    displayBox.classList.remove('cwa-hidden');
    return;
  }

  // Save details locally so students don't have to re-type them next time
  localStorage.setItem('cwa_current', currentCwa);
  localStorage.setItem('cwa_past_credits', pastCredits);
  localStorage.setItem('cwa_current_credits', currentCredits);
  localStorage.setItem('cwa_target', targetCwa);

  // Range Checking for logical values
  if (currentCwa > 100 || targetCwa > 100 || currentCwa < 0 || targetCwa < 0) {
    displayBox.innerHTML = `<div class="cwa-alert cwa-error">⚠️ CWA values must be between 0 and 100.</div>`;
    displayBox.classList.remove('cwa-hidden');
    return;
  }

  // Algorithmic Weight Calculation
  const totalCredits = pastCredits + currentCredits;
  const totalRequiredPoints = targetCwa * totalCredits;
  const existingPoints = currentCwa * pastCredits;
  const requiredAverage = (totalRequiredPoints - existingPoints) / currentCredits;

  displayBox.classList.remove('cwa-hidden');

  // Branch 1: Mathematical Impossibility
  if (requiredAverage > 100) {
    displayBox.innerHTML = `
      <div class="cwa-response-card cwa-impossible">
        <h4>🚨 Target Statistically Out of Reach</h4>
        <p>To achieve a cumulative standing of <strong>${targetCwa.toFixed(2)}%</strong> by the end of this semester, you would need an impossible semester average of <strong>${requiredAverage.toFixed(2)}%</strong>.</p>
        <div class="cwa-tip"><strong>Advisor Tip:</strong> Don't panic. Bring your target down slightly for this semester, step up your performance, and scale your goals next semester.</div>
      </div>`;
    return;
  }

  // Branch 2: Safety/Cruise Control Status
  if (requiredAverage <= 0) {
    displayBox.innerHTML = `
      <div class="cwa-response-card cwa-coasting">
        <h4>🎉 Academic Cruise Control</h4>
        <p>Your current academic cushion is exceptional. Even if you maintain a 0.00% average this semester, your long-term cumulative standing remains safely above your <strong>${targetCwa.toFixed(2)}%</strong> target.</p>
        <div class="cwa-tip"><strong>Advisor Tip:</strong> Don't clear pass blindly. Focus on helping your peers inside your tech circles or halls (Unity, Conti, Republic).</div>
      </div>`;
    return;
  }

  // Branch 3: Actionable Targets
  let motivationalContext = "";
  let badgeStyle = "cwa-normal";

  if (requiredAverage >= 75) {
    badgeStyle = "cwa-critical";
    motivationalContext = "🔥 <strong>Strictly Library Mode!</strong> This requires a heavy academic push. Minimize casual hangouts at the Commercial Area or hostel lobbies. Lock down your mid-sems inside the CCB block or main library.";
  } else if (requiredAverage >= 65) {
    badgeStyle = "cwa-moderate";
    motivationalContext = "💪 <strong>Solid Focus Needed:</strong> Highly realistic and within your reach. Stay highly consistent with lab presentations, assignments, and do not miss early lectures.";
  } else {
    badgeStyle = "cwa-optimal";
    motivationalContext = "😎 <strong>Smooth Sailing:</strong> A comfortable milestone. Execute your foundational study routines perfectly and do not neglect your basic AI 150 tasks.";
  }

  displayBox.innerHTML = `
    <div class="cwa-response-card ${badgeStyle}">
      <h4>🎯 Your Semester Benchmark</h4>
      <p class="cwa-highlight-stat">Target Average: <span>${requiredAverage.toFixed(2)}%</span></p>
      <p class="cwa-brief">Maintain this minimum grade metric across your <strong>${currentCredits} registered credits</strong> to secure your ${targetCwa.toFixed(2)}% graduation objective.</p>
      <hr class="cwa-divider">
      <p class="cwa-motivation">${motivationalContext}</p>
    </div>`;
}

// 2. Automated Safe DOM Injector, Hydration, & Load Saved State
document.addEventListener('DOMContentLoaded', () => {
  const mountPoint = document.getElementById('cwa-calculator');
  
  if (!mountPoint) {
    console.warn("CampusAI Container target '#cwa-calculator' not discovered in DOM.");
    return;
  }

  // Isolated HTML Component String Injector
  mountPoint.innerHTML = `
    <div class="cwa-glass-container">
      <div class="cwa-header">
        <div class="cwa-title-icon">📊</div>
        <div>
          <h3>CWA Goal Strategist</h3>
          <p>Compute semester grade requirements instantly</p>
        </div>
      </div>
      
      <div class="cwa-form-grid">
        <div class="cwa-input-wrapper">
          <label for="cwa-current">Current CWA</label>
          <input type="number" id="cwa-current" step="0.01" min="0" max="100" placeholder="e.g., 68.45">
        </div>
        
        <div class="cwa-input-wrapper">
          <label for="cwa-past-credits">Completed Credits</label>
          <input type="number" id="cwa-past-credits" min="0" placeholder="e.g., 48">
        </div>
        
        <div class="cwa-input-wrapper">
          <label for="cwa-current-credits">Current Credits</label>
          <input type="number" id="cwa-current-credits" min="0" placeholder="e.g., 18">
        </div>
        
        <div class="cwa-input-wrapper">
          <label for="cwa-target">Target CWA Goal</label>
          <input type="number" id="cwa-target" step="0.01" min="0" max="100" placeholder="e.g., 70.00">
        </div>
      </div>
      
      <button id="cwa-calc-trigger" class="cwa-btn-submit">Generate Strategy Blueprint</button>
      
      <div id="cwa-result-display" class="cwa-result-wrapper cwa-hidden"></div>
    </div>
  `;

  // Check LocalStorage and auto-fill data if it exists
  if(localStorage.getItem('cwa_current')) {
    document.getElementById('cwa-current').value = localStorage.getItem('cwa_current');
  }
  if(localStorage.getItem('cwa_past_credits')) {
    document.getElementById('cwa-past-credits').value = localStorage.getItem('cwa_past_credits');
  }
  if(localStorage.getItem('cwa_current_credits')) {
    document.getElementById('cwa-current-credits').value = localStorage.getItem('cwa_current_credits');
  }
  if(localStorage.getItem('cwa_target')) {
    document.getElementById('cwa-target').value = localStorage.getItem('cwa_target');
  }

  // Attach Event Execution
  document.getElementById('cwa-calc-trigger').addEventListener('click', calculateCwaStrategy);
});

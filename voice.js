/**
 * CampusAI KNUST - Hyper-Local Voice Recognition Layer
 * Engine: Web Speech API (Native Browser Interface, Zero Cost)
 * Optimization Core: en-GH (Ghanaian English Language Parameter)
 * Developer: Pere Falc
 */

document.addEventListener('DOMContentLoaded', () => {
  const voiceBtn = document.getElementById('voiceBtn');
  const inputField = document.getElementById('q');

  // Verify browser architecture compatibility
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    // Hide the microphone gracefully if the student's browser doesn't support it
    if (voiceBtn) voiceBtn.style.display = 'none';
    console.warn("Speech recognition interface missing on this browser platform.");
    return;
  }

  const recognition = new SpeechRecognition();
  
  // CRITICAL OPTIMIZATION: Configures engine parameters specifically for Ghanaian accents
  recognition.lang = 'en-GH'; 
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  // Track active execution states for real-time micro-feedback
  recognition.onstart = () => {
    voiceBtn.textContent = '🛑';
    voiceBtn.style.background = '#ef4444'; // Visual alert: Mic is recording
    voiceBtn.style.color = '#ffffff';
    inputField.placeholder = 'Listening to you, chale...';
  };

  recognition.onend = () => {
    voiceBtn.textContent = '🎙️';
    voiceBtn.style.background = '#f1f5f9';
    voiceBtn.style.color = '#0f172a';
    inputField.placeholder = 'Ask something...';
  };

  recognition.onresult = (event) => {
    const speechToText = event.results[0][0].transcript;
    inputField.value = speechToText;
    
    // Automation Hook: Automatically trigger your existing main chat system send function
    if (typeof send === "function") {
      send();
    }
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition anomaly occurred: ", event.error);
    // Graceful recovery handling for user cancellations
    if (event.error === 'not-allowed') {
      inputField.placeholder = 'Permission denied. Check mic settings.';
    }
  };

  // Toggle active microphone listener on mouse interaction
  voiceBtn.addEventListener('click', () => {
    try {
      recognition.start();
    } catch (e) {
      // Prevents crash errors if user rapidly double-clicks the toggle button
      recognition.stop();
    }
  });
});

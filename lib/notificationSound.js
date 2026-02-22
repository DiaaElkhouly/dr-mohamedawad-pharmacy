// Notification Sound Utility
// Uses Web Audio API to play distinctive notification sounds

class NotificationSound {
  constructor() {
    this.audioContext = null;
    this.isInitialized = false;
  }

  // Initialize audio context (must be called after user interaction)
  initialize() {
    if (this.isInitialized) return;

    try {
      this.audioContext = new (
        window.AudioContext || window.webkitAudioContext
      )();
      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize audio context:", error);
    }
  }

  // Play a distinctive notification sound - Professional chime
  playNotificationSound() {
    if (!this.isInitialized) {
      this.initialize();
    }

    if (!this.audioContext) {
      console.warn("Audio context not available");
      return;
    }

    // Resume audio context if suspended (browser autoplay policy)
    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }

    const now = this.audioContext.currentTime;

    // Create a professional bell/chime sound with harmonics
    const fundamental = this.audioContext.createOscillator();
    const harmonic1 = this.audioContext.createOscillator();
    const harmonic2 = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    // Fundamental tone - pleasant E5 note
    fundamental.type = "sine";
    fundamental.frequency.setValueAtTime(659.25, now); // E5

    // First harmonic - adds brightness
    harmonic1.type = "triangle";
    harmonic1.frequency.setValueAtTime(1318.51, now); // E6 (octave)

    // Second harmonic - adds richness
    harmonic2.type = "sine";
    harmonic2.frequency.setValueAtTime(1975.53, now); // B6 (perfect fifth)

    // Create envelope for bell-like decay
    gainNode.gain.setValueAtTime(0, now);
    // Quick attack
    gainNode.gain.linearRampToValueAtTime(0.4, now + 0.02);
    // Long decay with slight sustain
    gainNode.gain.exponentialRampToValueAtTime(0.2, now + 0.3);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1.5);

    // Create separate gain for harmonics
    const harmonicGain = this.audioContext.createGain();
    harmonicGain.gain.setValueAtTime(0, now);
    harmonicGain.gain.linearRampToValueAtTime(0.15, now + 0.02);
    harmonicGain.gain.exponentialRampToValueAtTime(0.05, now + 0.5);
    harmonicGain.gain.exponentialRampToValueAtTime(0.01, now + 1.0);

    // Connect nodes
    fundamental.connect(gainNode);
    harmonic1.connect(harmonicGain);
    harmonic2.connect(harmonicGain);
    harmonicGain.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Play sounds
    fundamental.start(now);
    fundamental.stop(now + 1.5);

    harmonic1.start(now);
    harmonic1.stop(now + 1.0);

    harmonic2.start(now);
    harmonic2.stop(now + 1.0);
  }

  // Play a simple beep (fallback)
  playSimpleBeep() {
    if (!this.isInitialized) {
      this.initialize();
    }

    if (!this.audioContext) return;

    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + 0.5,
    );

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.5);
  }
}

// Create singleton instance
const notificationSound = new NotificationSound();

export default notificationSound;

// Helper function to play sound
export const playOrderNotification = () => {
  notificationSound.playNotificationSound();
};

// Initialize on first user interaction
export const initializeNotificationSound = () => {
  notificationSound.initialize();
};

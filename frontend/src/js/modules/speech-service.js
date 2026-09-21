/**
 * Voice service using the Web Speech API.
 * Isolated here so the chatbot does not depend directly on window.speechSynthesis.
 */
export class SpeechService {
  constructor() {
    this.synth =
      typeof window !== 'undefined' && 'speechSynthesis' in window
        ? window.speechSynthesis
        : null;
    this.enabled = true;
  }

  /** Enables or disables the voice output. */
  setEnabled(enabled) {
    this.enabled = enabled;
  }

  /** Indicates whether the voice is enabled. */
  isEnabled() {
    return this.enabled;
  }

  /**
   * Speaks a text aloud.
   * @param {string} text
   */
  speak(text) {
    if (!this.enabled || !this.synth) return;
    this.synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 1;
    utterance.pitch = 1.1;
    this.synth.speak(utterance);
  }
}

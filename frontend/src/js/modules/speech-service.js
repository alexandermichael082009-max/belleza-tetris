/**
 * Servicio de voz usando Web Speech API.
 * Se aísla aquí para no depender directamente de window.speechSynthesis en el chatbot.
 */
export class SpeechService {
  constructor() {
    this.synth =
      typeof window !== 'undefined' && 'speechSynthesis' in window
        ? window.speechSynthesis
        : null;
    this.enabled = true;
  }

  /** Activa o desactiva la voz. */
  setEnabled(enabled) {
    this.enabled = enabled;
  }

  /** Indica si la voz está activa. */
  isEnabled() {
    return this.enabled;
  }

  /**
   * Reproduce un texto por voz.
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

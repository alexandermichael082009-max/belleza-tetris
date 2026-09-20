import { chatbotService } from '../services/chatbot-service.js';
import { SpeechService } from './speech-service.js';

/**
 * Controla el panel del chatbot: apertura, envío de mensajes y voz.
 */
export class Chatbot {
  constructor() {
    this.toggleButton = document.getElementById('chatbot-toggle');
    this.panel = document.getElementById('chatbot-panel');
    this.closeButton = document.getElementById('chatbot-close');
    this.voiceButton = document.getElementById('chatbot-voice-toggle');
    this.form = document.getElementById('chatbot-form');
    this.input = document.getElementById('chatbot-input');
    this.messagesList = document.getElementById('chatbot-messages');
    this.speech = new SpeechService();
    this.voiceEnabled = true;
  }

  /** Inicializa eventos del chatbot. */
  init() {
    this.toggleButton.addEventListener('click', () => this.#togglePanel());
    this.closeButton.addEventListener('click', () => this.#closePanel());
    this.voiceButton.addEventListener('click', () => this.#toggleVoice());
    this.form.addEventListener('submit', (e) => this.#handleSubmit(e));
    this.#appendMessage(
      'bot',
      '¡Hola! Soy tu asistente de Belleza Tetris. ¿En qué puedo ayudarte?',
    );
  }

  #togglePanel() {
    this.panel.hidden = !this.panel.hidden;
    if (!this.panel.hidden) this.input.focus();
  }

  #closePanel() {
    this.panel.hidden = true;
  }

  #toggleVoice() {
    this.voiceEnabled = !this.voiceEnabled;
    this.speech.setEnabled(this.voiceEnabled);
    this.voiceButton.textContent = this.voiceEnabled ? '🔊' : '🔇';
  }

  async #handleSubmit(event) {
    event.preventDefault();
    const text = this.input.value.trim();
    if (!text) return;
    this.#appendMessage('user', text);
    this.input.value = '';

    try {
      const response = await chatbotService.sendMessage(text);
      const reply = response.data?.reply ?? 'No entendí tu mensaje.';
      this.#appendMessage('bot', reply);
      this.speech.speak(reply);
    } catch (error) {
      this.#appendMessage('bot', `Error: ${error.message}`);
    }
  }

  #appendMessage(sender, text) {
    const li = document.createElement('li');
    li.classList.add('chatbot-message', `chatbot-message--${sender}`);
    li.textContent = text;
    this.messagesList.appendChild(li);
    this.messagesList.scrollTop = this.messagesList.scrollHeight;
  }
}

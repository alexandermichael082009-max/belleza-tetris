import { scoresService } from '../services/scores-service.js';

/**
 * Vista de mejores puntuaciones (leaderboard).
 */
export class ScoresView {
  constructor(container) {
    this.container = container;
  }

  mount() {
    this.container.innerHTML = `
      <section class="card">
        <h2>Mejores puntuaciones</h2>
        <ol class="scores-list" id="scores-list"></ol>
        <p id="scores-feedback" class="form-error"></p>
        <button id="scores-refresh" class="btn-primary">Actualizar</button>
      </section>
    `;

    this.listEl = this.container.querySelector('#scores-list');
    this.feedbackEl = this.container.querySelector('#scores-feedback');
    this.container
      .querySelector('#scores-refresh')
      .addEventListener('click', () => this.load());
    this.load();
  }

  async load() {
    this.feedbackEl.textContent = '';
    try {
      const response = await scoresService.listTop();
      const scores = response.data ?? [];
      this.listEl.innerHTML = scores.length
        ? scores
            .map(
              (entry, index) => `
                <li class="scores-list__item">
                  <span>${index + 1}. ${entry.playerName}</span>
                  <strong>${entry.score} pts</strong>
                </li>
              `,
            )
            .join('')
        : "<li class='scores-list__item'>No hay puntuaciones todavía.</li>";
    } catch (error) {
      this.feedbackEl.textContent = `Error: ${error.message}`;
    }
  }
}

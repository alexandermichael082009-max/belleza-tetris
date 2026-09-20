import { scoresService } from '../../services/scores-service.js';

/**
 * Escena de fin de partida: muestra el resultado, guarda la puntuación
 * y renderiza el top de puntuaciones.
 */
export class GameOverScene {
  constructor(container, { finalState, onReplay, onMenu }) {
    this.container = container;
    this.finalState = finalState;
    this.onReplay = onReplay;
    this.onMenu = onMenu;
  }

  mount() {
    this.container.innerHTML = `
      <section class="card game-over">
        <h2>Fin de la partida</h2>
        <p class="game-over__score">${this.finalState.score} puntos</p>
        <p>Nivel alcanzado: ${this.finalState.level}</p>
        <form id="gameover-form" novalidate>
          <div class="form-field">
            <label for="gameover-name">Tu nombre</label>
            <input id="gameover-name" type="text" maxlength="40" required />
            <span class="form-error" id="gameover-feedback"></span>
          </div>
          <button type="submit" class="btn-primary">Guardar puntuación</button>
        </form>
        <div class="action-row">
          <button id="gameover-replay" class="btn-primary">Jugar de nuevo</button>
          <button id="gameover-menu" class="btn-primary">Volver al menú</button>
        </div>
        <ol class="scores-list leaderboard" id="gameover-leaderboard"></ol>
      </section>
    `;

    this.form = this.container.querySelector('#gameover-form');
    this.nameInput = this.container.querySelector('#gameover-name');
    this.feedbackEl = this.container.querySelector('#gameover-feedback');
    this.leaderboardEl = this.container.querySelector('#gameover-leaderboard');

    this.form.addEventListener('submit', (e) => this.#saveScore(e));
    this.container
      .querySelector('#gameover-replay')
      .addEventListener('click', this.onReplay);
    this.container.querySelector('#gameover-menu').addEventListener('click', this.onMenu);
  }

  destroy() {}

  async #saveScore(event) {
    event.preventDefault();
    const playerName = this.nameInput.value.trim();
    if (!playerName) {
      this.feedbackEl.textContent = 'Escribe tu nombre para guardar la puntuación.';
      return;
    }

    try {
      const response = await scoresService.saveScore({
        playerName,
        score: this.finalState.score,
      });
      this.feedbackEl.textContent = response.message;
      await this.#loadLeaderboard();
    } catch (error) {
      this.feedbackEl.textContent = `Error: ${error.message}`;
    }
  }

  async #loadLeaderboard() {
    try {
      const response = await scoresService.listTop();
      const scores = response.data ?? [];
      this.leaderboardEl.innerHTML = scores
        .map(
          (entry, index) => `
            <li class="scores-list__item">
              <span>${index + 1}. ${entry.playerName}</span>
              <strong>${entry.score} pts</strong>
            </li>
          `,
        )
        .join('');
    } catch {
      this.leaderboardEl.innerHTML = '';
    }
  }
}

/**
 * Menu scene: presents the game mode and its controls.
 */
export class MenuScene {
  constructor(container, { onStart }) {
    this.container = container;
    this.onStart = onStart;
  }

  mount() {
    this.container.innerHTML = `
      <section class="card game-menu">
        <h2 class="game-menu__title">Modo de juego</h2>
        <p>
          Forma líneas completas con las piezas. Cada 5 líneas subes de nivel,
          la velocidad aumenta y tu puntuación crece más rápido.
        </p>
        <h3>Controles</h3>
        <ul class="rules">
          <li>← / → o A / D: mover la pieza</li>
          <li>↑ o W: rotar la pieza</li>
          <li>↓ o S: bajar más rápido</li>
          <li>Espacio: soltar al instante</li>
          <li>P: pausa / reanudar</li>
          <li>R: reiniciar partida</li>
        </ul>
        <div class="action-row">
          <button id="game-start" class="btn-primary">Comenzar partida</button>
        </div>
      </section>
    `;

    this.container.querySelector('#game-start').addEventListener('click', this.onStart);
  }

  destroy() {}
}

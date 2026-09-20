import { SERVICE_PRICES, ROUTES } from '../utils/constants.js';
import { formatCurrency, getServiceLabel } from '../utils/formatters.js';

/**
 * Vista de inicio: presentación del salón y catálogo de servicios.
 */
export class HomeView {
  constructor(container, router) {
    this.container = container;
    this.router = router;
  }

  mount() {
    this.container.innerHTML = `
      <section class="card game-menu">
        <h2 class="game-menu__title">Bienvenido a Belleza Tetris</h2>
        <p>
          Tu salón de belleza favorito y un juego de Tetris en un solo lugar.
          Agenda tu cita, conoce nuestros precios y diviértete jugando.
        </p>
        <div class="action-row">
          <button class="btn-primary" data-nav="${ROUTES.APPOINTMENTS}">Agendar cita</button>
          <button class="btn-primary" data-nav="${ROUTES.GAME}">Jugar Tetris</button>
        </div>
      </section>
      <section class="card">
        <h3>Servicios y precios</h3>
        <ul class="home-services" id="home-services"></ul>
      </section>
    `;

    this.#renderPrices();
    this.container.querySelectorAll('[data-nav]').forEach((button) => {
      button.addEventListener('click', () => this.router.navigate(button.dataset.nav));
    });
  }

  #renderPrices() {
    const list = this.container.querySelector('#home-services');
    list.innerHTML = Object.entries(SERVICE_PRICES)
      .map(
        ([key, price]) => `
          <li class="home-services__item">
            <strong>${getServiceLabel(key)}</strong>
            <span>${formatCurrency(price)}</span>
          </li>
        `,
      )
      .join('');
  }
}

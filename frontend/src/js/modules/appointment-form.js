import { appointmentsService } from '../services/appointments-service.js';
import { validateAppointmentForm, hasErrors } from '../utils/validators.js';
import {
  calculateServiceTotals,
  formatCurrency,
  getServiceLabel,
} from '../utils/formatters.js';
import { SERVICE_PRICES } from '../utils/constants.js';

const SERVICE_OPTIONS = Object.entries(SERVICE_PRICES)
  .map(
    ([key, price]) =>
      `<option value="${key}">${getServiceLabel(key)} - ${formatCurrency(price)}</option>`,
  )
  .join('');

/**
 * Controla la vista de agendado de citas: validación, envío y resumen de precios.
 */
export class AppointmentForm {
  constructor(container) {
    this.container = container;
  }

  /** Renderiza la vista de citas y registra eventos. */
  render() {
    this.container.innerHTML = `
      <section class="card">
        <h2>Agendar cita</h2>
        <form id="appointment-form" novalidate>
          <div class="form-field">
            <label for="appt-name">Nombre</label>
            <input id="appt-name" name="name" type="text" required />
            <span class="form-error" data-error="name"></span>
          </div>
          <div class="form-field">
            <label for="appt-email">Correo</label>
            <input id="appt-email" name="email" type="email" required />
            <span class="form-error" data-error="email"></span>
          </div>
          <div class="form-field">
            <label for="appt-phone">Teléfono</label>
            <input id="appt-phone" name="phone" type="tel" required />
            <span class="form-error" data-error="phone"></span>
          </div>
          <div class="form-field">
            <label for="appt-service">Servicio</label>
            <select id="appt-service" name="service" required>
              <option value="">Selecciona...</option>
              ${SERVICE_OPTIONS}
            </select>
            <span class="form-error" data-error="service"></span>
          </div>
          <div class="form-field">
            <label for="appt-date">Fecha y hora</label>
            <input id="appt-date" name="date" type="datetime-local" required />
            <span class="form-error" data-error="date"></span>
          </div>
          <p id="appt-total" class="form-success"></p>
          <button type="submit" class="btn-primary">Agendar</button>
          <p id="appt-feedback" class="form-success"></p>
        </form>
      </section>
    `;

    this.form = this.container.querySelector('#appointment-form');
    this.totalEl = this.container.querySelector('#appt-total');
    this.feedbackEl = this.container.querySelector('#appt-feedback');
    this.form.addEventListener('submit', (e) => this.#handleSubmit(e));
    this.form
      .querySelector('#appt-service')
      .addEventListener('change', (e) => this.#updateTotal(e.target.value));
  }

  #updateTotal(serviceKey) {
    if (!serviceKey) {
      this.totalEl.textContent = '';
      return;
    }
    const { subtotal, itbis, total } = calculateServiceTotals(serviceKey);
    this.totalEl.textContent =
      `Subtotal: ${formatCurrency(subtotal)} | ` +
      `ITBIS (18%): ${formatCurrency(itbis)} | ` +
      `Total: ${formatCurrency(total)}`;
  }

  async #handleSubmit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(this.form));
    const errors = validateAppointmentForm(data);
    this.#renderErrors(errors);

    if (hasErrors(errors)) return;

    try {
      const response = await appointmentsService.create(data);
      this.feedbackEl.textContent = response.message;
      this.form.reset();
      this.totalEl.textContent = '';
    } catch (error) {
      this.feedbackEl.textContent = `Error: ${error.message}`;
    }
  }

  #renderErrors(errors) {
    this.form.querySelectorAll('.form-error').forEach((el) => {
      el.textContent = errors[el.dataset.error] ?? '';
    });
  }
}

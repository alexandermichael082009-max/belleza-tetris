import { Router } from './modules/router.js';
import { ThemeManager } from './modules/theme-manager.js';
import { Chatbot } from './modules/chatbot.js';

/**
 * Application entry point.
 * Creates the router, the theme manager, the chatbot and the navigation.
 */
function initialize() {
  const mainElement = document.getElementById('app-main');
  const router = new Router(mainElement);
  router.init();

  new ThemeManager(document.getElementById('theme-toggle')).init();

  new Chatbot().init();

  document.querySelectorAll('.app-nav__btn').forEach((button) => {
    button.addEventListener('click', () => router.navigate(button.dataset.route));
  });
}

document.addEventListener('DOMContentLoaded', initialize);

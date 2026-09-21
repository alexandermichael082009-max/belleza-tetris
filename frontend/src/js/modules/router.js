import { ROUTES } from '../utils/constants.js';
import { HomeView } from '../views/home-view.js';
import { AppointmentForm } from '../views/appointment-form.js';
import { ScoresView } from '../views/scores-view.js';
import { MenuScene } from '../game/scenes/menu-scene.js';
import { PlayScene } from '../game/scenes/play-scene.js';
import { GameOverScene } from '../game/scenes/game-over-scene.js';

/**
 * Hash router for the SPA.
 * Builds a scene per route and transitions by calling mount/destroy.
 */
export class Router {
  constructor(main) {
    this.main = main;
    this.currentScene = null;
  }

  /** Registers the hashchange listener and renders the initial route. */
  init() {
    window.addEventListener('hashchange', () => this.#renderFromHash());
    this.#renderFromHash();
  }

  /** Navigates to a route by updating the hash. */
  navigate(route) {
    const target = `#/${route}`;
    if (window.location.hash === target) {
      this.#renderRoute(route);
    } else {
      window.location.hash = target;
    }
  }

  /** Replaces the current scene with a new one. */
  transition(scene) {
    if (this.currentScene?.destroy) this.currentScene.destroy();
    this.currentScene = scene;
    const render = scene.mount ?? scene.render;
    render.call(scene);
  }

  #renderFromHash() {
    const route = window.location.hash.replace(/^#\/?/, '') || ROUTES.HOME;
    this.#renderRoute(route);
  }

  #renderRoute(route) {
    this.transition(this.#buildScene(route));
  }

  #buildScene(route) {
    switch (route) {
      case ROUTES.APPOINTMENTS:
        return new AppointmentForm(this.main);
      case ROUTES.GAME:
        return this.#buildMenuScene();
      case ROUTES.SCORES:
        return new ScoresView(this.main);
      default:
        return new HomeView(this.main, this);
    }
  }

  #buildMenuScene() {
    return new MenuScene(this.main, {
      onStart: () => this.transition(this.#buildPlayScene()),
    });
  }

  #buildPlayScene() {
    return new PlayScene(this.main, {
      onGameOver: (finalState) => this.transition(this.#buildGameOverScene(finalState)),
    });
  }

  #buildGameOverScene(finalState) {
    return new GameOverScene(this.main, {
      finalState,
      onReplay: () => this.transition(this.#buildPlayScene()),
      onMenu: () => this.#renderRoute(ROUTES.GAME),
    });
  }
}

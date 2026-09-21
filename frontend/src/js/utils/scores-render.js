/**
 * Shared helpers to render the score leaderboard list.
 * Used by the scores view and the game-over scene to avoid duplication.
 */

const EMPTY_SCORES_ITEM =
  "<li class='scores-list__item'>No hay puntuaciones todavía.</li>";

/** Renders leaderboard entries as an ordered HTML list. */
export function renderScoreListHtml(entries) {
  if (entries.length === 0) return EMPTY_SCORES_ITEM;
  return entries
    .map(
      (entry, index) => `
        <li class="scores-list__item">
          <span>${index + 1}. ${entry.playerName}</span>
          <strong>${entry.score} pts</strong>
        </li>
      `,
    )
    .join('');
}

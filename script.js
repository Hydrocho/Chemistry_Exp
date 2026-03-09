import * as game from './js/game.js';
import { initDragAndDrop } from './js/dragdrop.js';

// Global exports for HTML event handlers
window.selectReaction = game.selectReaction;
window.resetGame = game.resetGame;
window.handleModalAction = game.handleModalAction;
window.toggleViewMode = game.toggleViewMode;
window.changeCoeff = game.changeCoeff;
window.closeQuestModal = game.closeQuestModal;
window.openQuestModal = game.openQuestModal;
window.goHome = game.goHome;
window.startLesson2 = game.startLesson2;

window.addEventListener('DOMContentLoaded', () => {
    initDragAndDrop();
    game.goHome(); // Start with home view
    game.toggleViewMode('formula');
});

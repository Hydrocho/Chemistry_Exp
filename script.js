import * as game from './js/game.js';
import { initDragAndDrop } from './js/dragdrop.js';
import { initLesson1 } from './js/lesson1.js';

// Global exports for HTML event handlers
window.selectReaction = game.selectReaction;
window.resetGame = game.resetGame;
window.handleModalAction = game.handleModalAction;
window.toggleViewMode = game.toggleViewMode;
window.changeCoeff = game.changeCoeff;
window.closeQuestModal = game.closeQuestModal;
window.openQuestModal = game.openQuestModal;
window.goHome = game.goHome;

window.startLesson1 = function () {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.getElementById('nav-lesson1').classList.add('active');

    document.getElementById('home-view').classList.remove('active');
    document.getElementById('lesson2-content').style.display = 'none';
    document.getElementById('lesson1-content').style.display = 'block';

    initLesson1(); // Start lesson 1 clean
};

window.startLesson2 = function () {
    document.getElementById('lesson1-content').style.display = 'none';
    game.startLesson2();
};

window.addEventListener('DOMContentLoaded', () => {
    initDragAndDrop();
    game.goHome(); // Start with home view
    game.toggleViewMode('formula');
});

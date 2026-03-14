import * as game from './js/game.js';
import { initDragAndDrop } from './js/dragdrop.js';
import { initLesson1 } from './js/lesson1.js';
import { initTest1 } from './js/test1.js';
import { initTest2 } from './js/test2.js';
import { initTest3 } from './js/test3.js';
import { initTest4 } from './js/test4.js';
import { initTest5 } from './js/test5.js';
import { initTest6 } from './js/test6.js';
import { startMemoryMatch } from './js/memoryMatch.js';
import { showLeaderboard } from './js/leaderboard.js';
import { showNameInputModal } from './js/nameInput.js';

// Global exports for HTML event handlers
window.selectReaction = game.selectReaction;
window.resetGame = game.resetGame;
window.handleModalAction = game.handleModalAction;
window.toggleViewMode = game.toggleViewMode;
window.changeCoeff = game.changeCoeff;
window.closeQuestModal = game.closeQuestModal;
window.openQuestModal = game.openQuestModal;
window.startLesson3 = game.startLesson3;
window.goHome = game.goHome;
window.startMemoryMatch = startMemoryMatch;
window.showLeaderboard = showLeaderboard;
window.showNameInputModal = showNameInputModal;

function hideAllContent() {
    document.getElementById('home-view').classList.remove('active');
    document.getElementById('lesson1-content').style.display = 'none';
    document.getElementById('lesson2-content').style.display = 'none';
    document.getElementById('lesson3-content').style.display = 'none';
    document.getElementById('test1-content').style.display = 'none';
    document.getElementById('test2-content').style.display = 'none';
    document.getElementById('test3-content').style.display = 'none';
    document.getElementById('test4-content').style.display = 'none';
    document.getElementById('test5-content').style.display = 'none';
    document.getElementById('test6-content').style.display = 'none';
    document.getElementById('memory-match-content').style.display = 'none';
    document.getElementById('coming-soon-view').style.display = 'none';
    document.querySelectorAll('.step-content').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.mobile-nav-item').forEach(item => item.classList.remove('active'));
}

window.toggleMobileMenu = function() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('active');
    
    // Prevent scrolling when menu is open
    if (menu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
};

window.startLesson1 = function () {
    hideAllContent();
    document.getElementById('nav-lesson1').classList.add('active');
    document.getElementById('m-nav-lesson1').classList.add('active');
    document.getElementById('lesson1-content').style.display = 'block';
    initLesson1();
};

window.startLesson2 = function () {
    hideAllContent();
    document.getElementById('nav-lesson2').classList.add('active');
    document.getElementById('m-nav-lesson2').classList.add('active');
    game.startLesson2();
};

window.startLesson3 = function () {
    hideAllContent();
    document.getElementById('nav-lesson3').classList.add('active');
    document.getElementById('m-nav-lesson3').classList.add('active');
    game.startLesson3();
};

window.startTest1 = function () {
    hideAllContent();
    document.getElementById('nav-test1').classList.add('active');
    document.getElementById('m-nav-test1').classList.add('active');
    document.getElementById('test1-content').style.display = 'block';
    initTest1();
};

window.startTest2 = function () {
    hideAllContent();
    document.getElementById('nav-test2').classList.add('active');
    document.getElementById('m-nav-test2').classList.add('active');
    document.getElementById('test2-content').style.display = 'block';
    initTest2();
};

window.startTest3 = function () {
    hideAllContent();
    document.getElementById('nav-test3').classList.add('active');
    document.getElementById('m-nav-test3').classList.add('active');
    document.getElementById('test3-content').style.display = 'block';
    initTest3();
};

window.startTest4 = function () {
    hideAllContent();
    document.getElementById('nav-test4').classList.add('active');
    document.getElementById('m-nav-test4').classList.add('active');
    document.getElementById('test4-content').style.display = 'block';
    initTest4();
};

window.startTest5 = function () {
    hideAllContent();
    document.getElementById('nav-test5').classList.add('active');
    document.getElementById('m-nav-test5').classList.add('active');
    document.getElementById('test5-content').style.display = 'block';
    initTest5();
};

window.startTest6 = function () {
    hideAllContent();
    if(document.getElementById('nav-test6')) document.getElementById('nav-test6').classList.add('active');
    if(document.getElementById('m-nav-test6')) document.getElementById('m-nav-test6').classList.add('active');
    document.getElementById('test6-content').style.display = 'block';
    initTest6();
};

window.showComingSoon = function(testName) {
    hideAllContent();
    document.getElementById('coming-soon-title').textContent = `${testName}은(는) 준비 중입니다`;
    document.getElementById('coming-soon-view').style.display = 'block';
    document.getElementById('coming-soon-view').classList.add('active');
};

window.setTestCompleted = function(testKey) {
    // Desktop Nav
    const navId = `nav-${testKey}`;
    const navItem = document.getElementById(navId);
    if (navItem && !navItem.textContent.includes('(완료)')) {
        navItem.textContent += ' (완료)';
        navItem.classList.add('completed-nav');
    }

    // Mobile Nav
    const mNavId = `m-nav-${testKey}`;
    const mNavItem = document.getElementById(mNavId);
    if (mNavItem && !mNavItem.textContent.includes('(완료)')) {
        mNavItem.textContent += ' (완료)';
        mNavItem.classList.add('completed-nav');
    }

    // Home Menu Badge
    const menuItems = document.querySelectorAll('.test-item');
    menuItems.forEach(item => {
        const onclick = item.getAttribute('onclick');
        if (onclick && onclick.includes(`start${testKey.charAt(0).toUpperCase() + testKey.slice(1)}`)) {
            if (!item.querySelector('.completed-badge')) {
                const badge = document.createElement('span');
                badge.className = 'completed-badge';
                badge.textContent = '완료';
                item.querySelector('h3').appendChild(badge);
                item.classList.add('completed-menu-item');
            }
        }
    });
};

window.goHome = function() {
    hideAllContent();
    document.getElementById('nav-home').classList.add('active');
    document.getElementById('m-nav-home').classList.add('active');
    document.getElementById('home-view').classList.add('active');
};

window.addEventListener('DOMContentLoaded', () => {
    initDragAndDrop();
    window.goHome(); // Start with home view
    game.toggleViewMode('formula');
});

import * as game from './js/game.js';
import { initDragAndDrop } from './js/dragdrop.js';
import { initLesson1 } from './js/lesson1.js';
import { initTest1 } from './js/test1.js';
import { initTest2 } from './js/test2.js';
import { initTest3 } from './js/test3.js';
import { initTest4 } from './js/test4.js';
import { initTest5 } from './js/test5.js';
import { initTest6 } from './js/test6.js';

import { initBonusGame } from './js/bonusGame.js';
import { startMemoryMatch } from './js/memoryMatch.js';
import { showLeaderboard } from './js/leaderboard.js';
import { showNameInputModal } from './js/nameInput.js';
import { initStudentIdentity, logoutStudent } from './js/studentIdentity.js';
import { updateStudentActivity, issueCoupon, isTeacherMonitoring } from './js/supabaseClient.js';


// Global exports for HTML event handlers
window.selectReaction = game.selectReaction;
window.resetGame = game.resetGame;
window.handleModalAction = game.handleModalAction;
window.toggleViewMode = game.toggleViewMode;
window.changeCoeff = game.changeCoeff;
window.closeQuestModal = game.closeQuestModal;
window.openQuestModal = game.openQuestModal;
window.startLesson3 = game.startLesson3;
window.logoutStudent = logoutStudent;
window.goHome = game.goHome;
async function checkAllTestsCompleted() {
    const completed = JSON.parse(localStorage.getItem('completed_tests') || '[]');
    const requiredTests = ['test1', 'test2', 'test3', 'test4', 'test5', 'test6'];
    const allDone = requiredTests.every(test => completed.includes(test));
    
    if (allDone) {
        document.getElementById('nav-memory-match')?.classList.remove('locked-game');
        document.getElementById('nav-bonus-game')?.classList.remove('locked-game');
        
        const cardMM = document.getElementById('card-memory-match');
        const cardBG = document.getElementById('card-bonus-game');
        if (cardMM) cardMM.classList.remove('locked-game');
        if (cardBG) cardBG.classList.remove('locked-game');

        // Mobile menu also
        if (document.getElementById('m-nav-memory-match')) {
            document.getElementById('m-nav-memory-match').style.opacity = '1';
            document.getElementById('m-nav-memory-match').style.pointerEvents = 'auto';
        }
        if (document.getElementById('m-nav-bonus-game')) {
            document.getElementById('m-nav-bonus-game').style.opacity = '1';
            document.getElementById('m-nav-bonus-game').style.pointerEvents = 'auto';
        }

        // 쿠폰 발급 로직 추가 (선생님이 모니터링 중일 때만!)
        const studentId = localStorage.getItem('student_id');
        const studentUuid = localStorage.getItem('student_uuid');
        const loginType = localStorage.getItem('login_type');

        if (loginType === 'member' && studentId && studentUuid) {
            // 해당 학급(학번 앞 3자리)의 선생님이 모니터링 중인지 확인
            const classPrefix = studentId.substring(0, 3);
            const isMonitoring = await isTeacherMonitoring(classPrefix);

            if (isMonitoring) {
                const issued = await issueCoupon(studentId, studentUuid);
                if (issued) {
                    setTimeout(() => {
                        alert('🎊 축하합니다! 6개 테스트를 모두 완료하여 [아바타 랜덤 쿠폰]이 발급되었습니다!\n메인 화면의 가방(인벤토리)에서 확인하실 수 있습니다.');
                    }, 1000);
                }
            } else {
                console.log('선생님이 모니터링 중이 아니어서 쿠폰이 발급되지 않았습니다.');
            }
        }
    } else {
        // Initial setup for mobile nav (make them gray too)
        if (document.getElementById('m-nav-memory-match')) {
            document.getElementById('m-nav-memory-match').style.opacity = '0.5';
            document.getElementById('m-nav-memory-match').style.pointerEvents = 'none';
        }
        if (document.getElementById('m-nav-bonus-game')) {
            document.getElementById('m-nav-bonus-game').style.opacity = '0.5';
            document.getElementById('m-nav-bonus-game').style.pointerEvents = 'none';
        }
    }
    return allDone;
}

window.startMemoryMatch = function() {
    if (!checkAllTestsCompleted()) {
        alert('먼저 Test 1부터 Test 6까지 모두 완료해야 도전할 수 있습니다!');
        return;
    }
    hideAllContent();
    document.getElementById('nav-memory-match').classList.add('active');
    document.getElementById('m-nav-memory-match').classList.add('active');
    window.logActivity('화학식 외우기 게임');
    startMemoryMatch();
};
window.showLeaderboard = showLeaderboard;
window.showNameInputModal = showNameInputModal;
window.logActivity = function(activity, testStatus = null) {
    const id = localStorage.getItem('student_id');
    const name = localStorage.getItem('student_name');
    const sentiment = localStorage.getItem('sentiment');
    if (id && name) {
        updateStudentActivity(id, name, sentiment, activity, testStatus ? { [testStatus.key]: testStatus.value } : {});
    }
};

window.startBonusGame = function() {
    if (!checkAllTestsCompleted()) {
        alert('먼저 Test 1부터 Test 6까지 모두 완료해야 도전할 수 있습니다!');
        return;
    }
    hideAllContent();
    document.getElementById('nav-bonus-game').classList.add('active');
    document.getElementById('m-nav-bonus-game').classList.add('active');
    document.getElementById('bonus-game-content').style.display = 'block';
    window.logActivity('보너스: 원자 갯수 맞추기');
    initBonusGame();
};

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
    document.getElementById('bonus-game-content').style.display = 'none';
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
    window.logActivity('Lesson 1');
    initLesson1();
};

window.startLesson2 = function () {
    hideAllContent();
    document.getElementById('nav-lesson2').classList.add('active');
    document.getElementById('m-nav-lesson2').classList.add('active');
    window.logActivity('Lesson 2');
    game.startLesson2();
};

window.startLesson3 = function () {
    hideAllContent();
    document.getElementById('nav-lesson3').classList.add('active');
    document.getElementById('m-nav-lesson3').classList.add('active');
    window.logActivity('Lesson 3');
    game.startLesson3();
};

window.startTest1 = function () {
    hideAllContent();
    document.getElementById('nav-test1').classList.add('active');
    document.getElementById('m-nav-test1').classList.add('active');
    document.getElementById('test1-content').style.display = 'block';
    window.logActivity('Test 1 시작', { key: 'test1', value: 'in_progress' });
    initTest1();
};

window.startTest2 = function () {
    hideAllContent();
    document.getElementById('nav-test2').classList.add('active');
    document.getElementById('m-nav-test2').classList.add('active');
    document.getElementById('test2-content').style.display = 'block';
    window.logActivity('Test 2 시작', { key: 'test2', value: 'in_progress' });
    initTest2();
};

window.startTest3 = function () {
    hideAllContent();
    document.getElementById('nav-test3').classList.add('active');
    document.getElementById('m-nav-test3').classList.add('active');
    document.getElementById('test3-content').style.display = 'block';
    window.logActivity('Test 3 시작', { key: 'test3', value: 'in_progress' });
    initTest3();
};

window.startTest4 = function () {
    hideAllContent();
    document.getElementById('nav-test4').classList.add('active');
    document.getElementById('m-nav-test4').classList.add('active');
    document.getElementById('test4-content').style.display = 'block';
    window.logActivity('Test 4 시작', { key: 'test4', value: 'in_progress' });
    initTest4();
};

window.startTest5 = function () {
    hideAllContent();
    document.getElementById('nav-test5').classList.add('active');
    document.getElementById('m-nav-test5').classList.add('active');
    document.getElementById('test5-content').style.display = 'block';
    window.logActivity('Test 5 시작', { key: 'test5', value: 'in_progress' });
    initTest5();
};

window.startTest6 = function () {
    hideAllContent();
    if(document.getElementById('nav-test6')) document.getElementById('nav-test6').classList.add('active');
    if(document.getElementById('m-nav-test6')) document.getElementById('m-nav-test6').classList.add('active');
    document.getElementById('test6-content').style.display = 'block';
    window.logActivity('Test 6 시작', { key: 'test6', value: 'in_progress' });
    initTest6();
};



window.showComingSoon = function(testName) {
    hideAllContent();
    document.getElementById('coming-soon-title').textContent = `${testName}은(는) 준비 중입니다`;
    document.getElementById('coming-soon-view').style.display = 'block';
    document.getElementById('coming-soon-view').classList.add('active');
};

window.setTestCompleted = function(testKey) {
    // Save to localStorage
    const completed = JSON.parse(localStorage.getItem('completed_tests') || '[]');
    if (!completed.includes(testKey)) {
        completed.push(testKey);
        localStorage.setItem('completed_tests', JSON.stringify(completed));
    }

    // Check if everything is done to unlock bonuses
    checkAllTestsCompleted();

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
    window.logActivity('홈 화면');
};

window.addEventListener('DOMContentLoaded', () => {
    initDragAndDrop();
    initStudentIdentity();
    checkAllTestsCompleted(); // Initial check/lock
    window.goHome(); // Start with home view
    game.toggleViewMode('formula');
});

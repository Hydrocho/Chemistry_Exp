import { MOLECULES } from './constants.js';
import { shuffleArray } from './utils.js';
import { showNameInputModal } from './nameInput.js';
import { showLeaderboard } from './leaderboard.js';

let state = {
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    isProcessing: false,
    startTime: null,
    timerInterval: null,
    totalTime: 0
};

export function startMemoryMatch() {
    // UI 초기화
    document.querySelectorAll('.step-content').forEach(s => s.classList.remove('active'));
    document.getElementById('home-view').classList.remove('active');
    
    // 타 퀴즈/레슨 콘텐츠 숨기기
    document.getElementById('lesson1-content').style.display = 'none';
    document.getElementById('lesson2-content').style.display = 'none';
    document.getElementById('test1-content').style.display = 'none';
    document.getElementById('test2-content').style.display = 'none';
    document.getElementById('test3-content').style.display = 'none';
    document.getElementById('test4-content').style.display = 'none';
    document.getElementById('test5-content').style.display = 'none';
    document.getElementById('test6-content').style.display = 'none';
    
    const container = document.getElementById('memory-match-content');
    container.style.display = 'block';
    container.classList.add('active');
    
    initGame();
}

function initGame() {
    // 10개의 분자를 랜덤하게 선택 (4x5 = 20개 카드)
    const moleculeKeys = Object.keys(MOLECULES);
    const selectedKeys = shuffleArray([...moleculeKeys]).slice(0, 10);
    
    // 이름 카드 10개 + 화학식 카드 10개 = 총 20개
    let cards = [];
    selectedKeys.forEach(key => {
        const mol = MOLECULES[key];
        cards.push({ id: key, type: 'name', value: mol.name });
        cards.push({ id: key, type: 'formula', value: mol.formula });
    });
    
    state.cards = shuffleArray(cards);
    state.flippedCards = [];
    state.matchedPairs = 0;
    state.isProcessing = false;
    state.totalTime = 0;
    
    renderBoard();
    startTimer();
}

function renderBoard() {
    const container = document.getElementById('memory-match-content');
    container.innerHTML = `
        <div class="memory-game-header">
            <div class="memory-timer" id="memory-timer">시간: 00:00</div>
            <button class="memory-reset-btn" onclick="window.initMemoryGame()">새 게임</button>
        </div>
        <div class="memory-grid" id="memory-grid">
            ${state.cards.map((card, index) => `
                <div class="memory-card" data-index="${index}" onclick="window.handleCardClick(${index})">
                    <div class="memory-card-inner">
                        <div class="memory-card-front">?</div>
                        <div class="memory-card-back ${card.type}">
                            <div class="card-content">${card.value}</div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="memory-footer">
            <button onclick="window.showLeaderboard('memory-match')" class="memory-ranking-btn">🏆 랭킹 보기</button>
            <button onclick="window.goHome()" class="memory-back-btn">홈으로 돌아가기</button>
        </div>
    `;
}

window.initMemoryGame = initGame;

window.handleCardClick = function(index) {
    if (state.isProcessing) return;
    
    const cardElement = document.querySelector(`.memory-card[data-index="${index}"]`);
    
    // 이미 뒤집혀 있거나 맞춘 카드라면 무시
    if (cardElement.classList.contains('flipped') || cardElement.classList.contains('matched')) return;
    
    // 카드 뒤집기
    cardElement.classList.add('flipped');
    state.flippedCards.push(index);
    
    if (state.flippedCards.length === 2) {
        checkMatch();
    }
};

function checkMatch() {
    state.isProcessing = true;
    const [idx1, idx2] = state.flippedCards;
    const card1 = state.cards[idx1];
    const card2 = state.cards[idx2];
    
    if (card1.id === card2.id && card1.type !== card2.type) {
        // 매치 성공
        setTimeout(() => {
            const el1 = document.querySelector(`.memory-card[data-index="${idx1}"]`);
            const el2 = document.querySelector(`.memory-card[data-index="${idx2}"]`);
            el1.classList.add('matched');
            el2.classList.add('matched');
            
            state.matchedPairs++;
            state.flippedCards = [];
            state.isProcessing = false;
            
            if (state.matchedPairs === 10) {
                endGame();
            }
        }, 500);
    } else {
        // 매치 실패
        setTimeout(() => {
            const el1 = document.querySelector(`.memory-card[data-index="${idx1}"]`);
            const el2 = document.querySelector(`.memory-card[data-index="${idx2}"]`);
            el1.classList.remove('flipped');
            el2.classList.remove('flipped');
            
            state.flippedCards = [];
            state.isProcessing = false;
        }, 1000);
    }
}

function startTimer() {
    if (state.timerInterval) clearInterval(state.timerInterval);
    state.startTime = Date.now();
    state.timerInterval = setInterval(() => {
        const now = Date.now();
        state.totalTime = (now - state.startTime) / 1000;
        const minutes = Math.floor(state.totalTime / 60).toString().padStart(2, '0');
        const seconds = Math.floor(state.totalTime % 60).toString().padStart(2, '0');
        const centiseconds = Math.floor((state.totalTime * 100) % 100).toString().padStart(2, '0');
        document.getElementById('memory-timer').innerText = `시간: ${minutes}:${seconds}.${centiseconds}`;
    }, 10);
}

function endGame() {
    clearInterval(state.timerInterval);
    
    // Show Name Input Modal for High Score
    setTimeout(() => {
        showNameInputModal('memory-match', state.totalTime, (record) => {
            // After saving, show the leaderboard
            showLeaderboard('memory-match');
        });
    }, 500);
}

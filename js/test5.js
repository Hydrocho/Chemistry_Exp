import { MOLECULES, REACTIONS } from './constants.js';
import { createMoleculeCard, shuffleArray } from './utils.js';
import { drag, initDragAndDrop, setOnDropComplete } from './dragdrop.js';
import { state as gameState } from './state.js';

const REACTION_KEYS = Object.keys(REACTIONS);

let state = {
    quizState: 'playing', // playing, result
    reactionKey: '',
    selectedReaction: null,
    score: 0,
    total: REACTION_KEYS.length,
    count: 0,
    wrongKeys: [],
    isChecking: false,
    attempts: 0,
    answerState: 'idle' // idle, correct, incorrect, incorrect_final
};

function setState(updates) {
    state = { ...state, ...updates };
    render();
}

export function initTest5() {
    const shuffledKeys = shuffleArray([...REACTION_KEYS]);
    const firstKey = shuffledKeys[0];
    
    gameState.currentPhase = 2; // 화학식 연결 단계
    setOnDropComplete(checkCompletion);

    setState({
        quizState: 'playing',
        reactionKey: firstKey,
        selectedReaction: REACTIONS[firstKey],
        shuffledKeys: shuffledKeys,
        count: 0,
        score: 0,
        total: REACTION_KEYS.length,
        wrongKeys: [],
        isChecking: false,
        attempts: 0,
        answerState: 'idle'
    });
}

function checkCompletion() {
    if (state.quizState !== 'playing' || state.isChecking || state.answerState !== 'idle') return;

    const reactantSlots = document.querySelectorAll('#test5-content .side-container:nth-child(1) .slot-formula');
    const productSlots = document.querySelectorAll('#test5-content .side-container:nth-child(3) .slot-formula');

    const totalSlots = reactantSlots.length + productSlots.length;
    const getPlacedIds = (slots) =>
        [...slots].map(s => s.firstElementChild?.dataset.moleculeId).filter(id => id);

    const placedReactants = getPlacedIds(reactantSlots);
    const placedProducts = getPlacedIds(productSlots);

    if (placedReactants.length + placedProducts.length === totalSlots) {
        const requiredReactants = [...state.selectedReaction.reactants];
        const requiredProducts = [...state.selectedReaction.products];

        const isMatch = (placed, required) => {
            if (placed.length !== required.length) return false;
            return [...placed].sort().join(',') === [...required].sort().join(',');
        };

        if (isMatch(placedReactants, requiredReactants) && isMatch(placedProducts, requiredProducts)) {
            handleCorrect();
        } else {
            handleIncorrect();
        }
    }
}

function handleCorrect() {
    const updates = { 
        isChecking: true, 
        answerState: 'correct'
    };
    
    // 첫 번째 시도에서 맞춘 경우에만 점수 인정
    if (state.attempts === 0) {
        updates.score = state.score + 1;
    }
    
    setState(updates);
}

function handleIncorrect() {
    const nextAttempts = state.attempts + 1;
    const updates = { 
        isChecking: true,
        attempts: nextAttempts
    };

    if (nextAttempts === 1) {
        updates.answerState = 'incorrect';
        updates.wrongKeys = [...state.wrongKeys, state.reactionKey];
    } else {
        updates.answerState = 'incorrect_final';
    }
    
    setState(updates);
}

window.test5NextQuestion = function() {
    const nextCount = state.count + 1;
    if (nextCount < state.total) {
        const nextKey = state.shuffledKeys[nextCount];
        setState({
            count: nextCount,
            reactionKey: nextKey,
            selectedReaction: REACTIONS[nextKey],
            isChecking: false,
            attempts: 0,
            answerState: 'idle'
        });
        setupInventory();
    } else {
        setState({
            quizState: 'result',
            isChecking: false
        });
    }
};

window.test5RetryQuestion = function() {
    const slots = document.querySelectorAll('#test5-content .slot-formula');
    const inventory = document.getElementById('test5-inventory');
    slots.forEach(slot => {
        if (slot.firstElementChild) {
            inventory.appendChild(slot.firstElementChild);
        }
    });
    
    setState({
        isChecking: false,
        answerState: 'idle'
    });
};

function setupInventory() {
    const container = document.getElementById('test5-inventory');
    if (!container) return;
    container.innerHTML = '';

    const requiredIds = [...new Set([...state.selectedReaction.reactants, ...state.selectedReaction.products])];
    const otherIds = Object.keys(MOLECULES).filter(id => !requiredIds.includes(id));
    
    const distractorCount = Math.max(0, 12 - requiredIds.length);
    const selectedDistractors = shuffleArray([...otherIds]).slice(0, distractorCount);
    
    const finalIds = shuffleArray([...requiredIds, ...selectedDistractors]);

    finalIds.forEach(id => {
        // Test 5는 화학식 연결 테스트이므로 화학식을 노출
        container.appendChild(createMoleculeCard(id, 'formula', drag));
    });

    initDragAndDrop();
}

window.handleTest5ReviewWrong = function() {
    if (state.wrongKeys.length === 0) return;
    
    setState({
        quizState: 'playing',
        reactionKey: state.wrongKeys[0],
        selectedReaction: REACTIONS[state.wrongKeys[0]],
        shuffledKeys: [...state.wrongKeys],
        count: 0,
        total: state.wrongKeys.length,
        score: 0,
        wrongKeys: [],
        isChecking: false,
        attempts: 0,
        answerState: 'idle'
    });
    setupInventory();
};

function render() {
    const container = document.getElementById('test5-content');
    if (!container || container.style.display === 'none') return;

    if (state.quizState === 'playing') {
        const reaction = state.selectedReaction;
        const progress = (state.count / state.total) * 100;
        const isReview = state.shuffledKeys.length !== REACTION_KEYS.length;
        const badgeText = isReview ? '오답 복습 중' : 'Test 5: 화학식 매칭';

        let modalHtml = '';
        if (state.answerState !== 'idle') {
            let title = '';
            let desc = '';
            let btnText = '';
            let btnAction = '';
            let icon = '';

            if (state.answerState === 'correct') {
                title = '정답입니다!';
                desc = '화학식을 정확한 물질명 아래에 배치했습니다.';
                btnText = '다음 문제로 →';
                btnAction = 'test5NextQuestion()';
                icon = '✅';
            } else if (state.answerState === 'incorrect') {
                title = '다시 도전해 보세요';
                desc = '배치한 화학식이 정답과 다릅니다.<br>1회에 한하여 다시 도전할 수 있습니다.';
                btnText = '다시 시도하기';
                btnAction = 'test5RetryQuestion()';
                icon = '❌';
            } else if (state.answerState === 'incorrect_final') {
                title = '아쉬워요!';
                desc = '재도전 기회를 모두 사용했습니다.<br>다음 문제로 이동합니다.';
                btnText = '다음 문제로';
                btnAction = 'test5NextQuestion()';
                icon = '⚠️';
            }

            modalHtml = `
                <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[2000] flex items-center justify-center p-6">
                    <div class="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center border border-slate-100 animate-scale-in">
                        <div class="text-6xl mb-6">${icon}</div>
                        <h3 class="text-2xl font-black text-slate-800 mb-2">${title}</h3>
                        <p class="text-slate-500 mb-8 font-medium">${desc}</p>
                        <button onclick="${btnAction}" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 px-6 rounded-2xl flex items-center justify-center transition-all shadow-lg active:scale-95 text-lg">
                            ${btnText}
                        </button>
                    </div>
                </div>
            `;
        }

        container.innerHTML = `
            <div class="test-container p-6 relative">
                ${modalHtml}
                <div class="flex justify-between items-center mb-4">
                    <span class="text-xs font-black ${isReview ? 'text-red-700 bg-red-100' : 'text-indigo-700 bg-indigo-100'} py-1.5 px-4 rounded-full uppercase tracking-widest">${badgeText}</span>
                    <span class="text-sm font-black text-slate-600 bg-slate-100 px-4 py-1.5 rounded-xl">TEST ${state.count + 1} / ${state.total}</span>
                </div>
                
                <div class="w-full bg-slate-100 rounded-full h-3 mb-8 shadow-inner p-0.5">
                    <div class="bg-gradient-to-r ${isReview ? 'from-red-400 to-orange-500' : 'from-emerald-400 to-teal-500'} h-2 rounded-full transition-all duration-500" style="width: ${progress}%"></div>
                </div>

                <div class="card mb-6">
                    <h3 class="text-2xl font-black text-slate-800 mb-2 text-center tracking-tight">${reaction.title}</h3>
                    <div class="inline-block w-full bg-slate-50 px-4 py-2 rounded-xl text-slate-500 text-center text-sm font-medium mb-6">
                        ${reaction.desc}
                    </div>
                    
                    <div class="equation-container-v4">
                        <div class="side-container">
                            <span class="label">반응물</span>
                            <div class="drop-zone-v4">
                                ${reaction.reactants.map(id => `
                                    <div class="zone-slot">
                                        <div class="slot-formula" data-target="${id}"></div>
                                    </div>
                                `).join('<span class="inner-plus">+</span>')}
                            </div>
                        </div>
                        <span class="big-arrow">→</span>
                        <div class="side-container">
                            <span class="label">생성물</span>
                            <div class="drop-zone-v4">
                                ${reaction.products.map(id => `
                                    <div class="zone-slot">
                                        <div class="slot-formula" data-target="${id}"></div>
                                    </div>
                                `).join('<span class="inner-plus">+</span>')}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="inventory-section">
                    <h4 class="text-center font-black text-slate-400 mb-4 text-xs uppercase tracking-widest">반응식에 알맞은 화학식을 끌어다가 빈 칸에 놓으세요</h4>
                    <div class="card-inventory grid grid-cols-3 gap-3" id="test5-inventory" style="min-height: 200px;"></div>
                </div>
            </div>
        `;
        setupInventory();
    } else {
        const percentage = Math.round((state.score / state.total) * 100);
        
        // perfect score (no retries recorded in score)
        if (state.score === state.total && state.total > 0 && state.quizState === 'result') {
            if (window.setTestCompleted) window.setTestCompleted('test5');
        }

        const displayWrong = state.wrongKeys.length > 0;

        container.innerHTML = `
            <div class="p-10 text-center">
                <div class="mb-8 text-yellow-500 inline-block text-6xl animate-bounce">🏆</div>
                <h2 class="text-3xl font-black text-slate-800 mb-2 tracking-tight">테스트 완료!</h2>
                <p class="text-slate-500 mb-10 font-medium">화학식 연결의 달인이 되셨군요!</p>
                
                <div class="bg-gradient-to-br from-emerald-50 to-teal-100 p-10 rounded-3xl mb-10 border-2 border-white shadow-xl">
                    <div class="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-3">Your Final Score</div>
                    <p class="text-teal-700 font-black text-6xl mb-4 tabular-nums">${state.score} <span class="text-slate-300 text-3xl mx-1">/</span> ${state.total}</p>
                    <div class="h-2 w-full bg-slate-200/50 rounded-full mb-4 overflow-hidden shadow-inner">
                        <div class="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full" style="width: ${percentage}%"></div>
                    </div>
                    <p class="text-teal-600 font-black text-xl">정답률 ${percentage}%</p>
                    <p class="text-slate-500 text-sm mt-3 font-medium">* 첫 번째 시도에서 맞춘 문제만 점수로 인정됩니다.</p>
                </div>

                <div class="space-y-4">
                    <button onclick="window.goHome()" class="w-full bg-slate-800 hover:bg-slate-900 text-white font-black py-5 px-6 rounded-2xl flex items-center justify-center transition-all shadow-lg active:scale-95">
                        홈으로 돌아가기
                    </button>
                    
                    ${displayWrong ? `
                        <button onclick="window.handleTest5ReviewWrong()" class="w-full bg-red-50 hover:bg-red-100 text-red-600 border-2 border-red-200 font-black py-5 px-6 rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-sm">
                            <span class="mr-2">🔍</span> 오답만 다시 풀기
                        </button>
                    ` : ''}

                    <button onclick="initTest5()" class="w-full bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 font-black py-5 px-6 rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-sm">
                        <span class="mr-2">🔄</span> 처음부터 다시 도전
                    </button>
                </div>
            </div>
        `;
    }
}

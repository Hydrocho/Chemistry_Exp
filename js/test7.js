import { MOLECULES, REACTIONS } from './constants.js';
import { createMoleculeCard, shuffleArray } from './utils.js';
import { drag, initDragAndDrop, setOnDropComplete } from './dragdrop.js';
import { state as gameState } from './state.js';
import { generateQuestions as genT1 } from './test1.js';
import { generateQuestions as genT2 } from './test2.js';
import { generateQuestions as genT3 } from './test3.js';

let state = {
    quizState: 'playing', // playing, result, review
    questions: [],
    currentIdx: 0,
    score: 0,
    wrongQuestions: [], // { type, data }
    
    // Sub-states for various question types
    selectedOption: null,
    isChecking: false,
    isShaking: false,
    attempts: 0,
    showNextButton: false,
    
    // For drag-drop (Test 4, 5)
    answerState: 'idle', // idle, correct, incorrect, incorrect_final
    
    // For coefficients (Test 6)
    coeffs: {},
};

function setState(updates) {
    state = { ...state, ...updates };
    render();
}

export function initTest7() {
    const questions = [];
    
    // Test 1: Chemical Formulas (Multiple Choice)
    genT1().forEach(q => questions.push({ type: 'test1', data: q }));
    
    // Test 2: Atom Count with Models (Multiple Choice)
    genT2().forEach(q => questions.push({ type: 'test2', data: q }));
    
    // Test 3: Atom Count with Formulas (Multiple Choice)
    genT3().forEach(q => questions.push({ type: 'test3', data: q }));
    
    // Test 4: Drag & Drop Names
    Object.keys(REACTIONS).forEach(key => questions.push({ type: 'test4', data: { reactionKey: key, reaction: REACTIONS[key] } }));
    
    // Test 5: Drag & Drop Formulas
    Object.keys(REACTIONS).forEach(key => questions.push({ type: 'test5', data: { reactionKey: key, reaction: REACTIONS[key] } }));
    
    // Test 6: Equation Completion (Coefficients)
    Object.keys(REACTIONS).forEach(key => questions.push({ type: 'test6', data: { reactionKey: key, reaction: REACTIONS[key] } }));

    // Initialize the combined test
    setState({
        quizState: 'playing',
        questions: questions, // Notice: Sequential as requested (Test 1 -> 6)
        currentIdx: 0,
        score: 0,
        wrongQuestions: [],
        selectedOption: null,
        isChecking: false,
        isShaking: false,
        attempts: 0,
        showNextButton: false,
        answerState: 'idle',
        coeffs: {}
    });
    
    setupQuestionState();
}

function setupQuestionState() {
    const q = state.questions[state.currentIdx];
    if (!q) return;

    if (q.type === 'test4' || q.type === 'test5') {
        gameState.currentPhase = (q.type === 'test4' ? 1 : 2);
        setOnDropComplete(checkDragDropCompletion);
    } else if (q.type === 'test6') {
        const reaction = q.data.reaction;
        const initialCoeffs = {};
        [...reaction.reactants, ...reaction.products].forEach(id => {
            initialCoeffs[id] = 1;
        });
        setState({ coeffs: initialCoeffs, answerState: 'idle', attempts: 0, isChecking: false });
    } else {
        setState({ selectedOption: null, isChecking: false, isShaking: false, attempts: 0, showNextButton: false });
    }
}

// Event Handlers
window.handleTest7OptionClick = (option) => {
    if (state.isChecking) return;
    const qWrap = state.questions[state.currentIdx];
    const currentQ = qWrap.data;
    const isCorrect = option === currentQ.answer;
    const currentAttempts = state.attempts + 1;

    const updates = { 
        selectedOption: option, 
        isChecking: true,
        isShaking: !isCorrect,
        attempts: currentAttempts
    };

    if (state.quizState === 'playing') {
        if (isCorrect && currentAttempts === 1) {
            updates.score = state.score + 1;
        }
        if (!isCorrect && currentAttempts === 1) {
            updates.wrongQuestions = [...state.wrongQuestions, qWrap];
        }
    }

    setState(updates);

    if (isCorrect) {
        setTimeout(() => {
            setState({ isShaking: false });
            setTimeout(() => {
                goToNextQuestion();
            }, 600);
        }, 400);
    } else if (currentAttempts >= 2) {
        setTimeout(() => {
            setState({ isShaking: false });
            setTimeout(() => {
                setState({ showNextButton: true });
            }, 2500);
        }, 400);
    } else {
        setTimeout(() => {
            setState({ isShaking: false, isChecking: false, selectedOption: null });
        }, 400);
    }
};

window.handleTest7NextClick = () => {
    goToNextQuestion();
};

function goToNextQuestion() {
    let nextIdx = state.currentIdx + 1;
    if (nextIdx < state.questions.length) {
        setState({ 
            currentIdx: nextIdx, 
            selectedOption: null, 
            isChecking: false, 
            attempts: 0, 
            showNextButton: false,
            answerState: 'idle' 
        });
        setupQuestionState();
    } else {
        setState({ quizState: 'result' });
    }
}

// Drag & Drop specific logic
function checkDragDropCompletion() {
    if (state.quizState === 'playing' && state.isChecking) return;
    const qWrap = state.questions[state.currentIdx];
    if (qWrap.type !== 'test4' && qWrap.type !== 'test5') return;

    const selector = qWrap.type === 'test4' ? '.slot-name' : '.slot-formula';
    const slots = document.querySelectorAll(`#test7-content ${selector}`);
    const placedIds = [...slots].map(s => s.firstElementChild?.dataset.moleculeId).filter(id => id);

    const reaction = qWrap.data.reaction;
    const totalNeeded = reaction.reactants.length + reaction.products.length;

    if (placedIds.length === totalNeeded) {
        // Need to check exact placement for reactants and products
        const rSlots = document.querySelectorAll(`#test7-content .side-container:nth-child(1) ${selector}`);
        const pSlots = document.querySelectorAll(`#test7-content .side-container:nth-child(3) ${selector}`);
        
        const placedR = [...rSlots].map(s => s.firstElementChild?.dataset.moleculeId).filter(id => id);
        const placedP = [...pSlots].map(s => s.firstElementChild?.dataset.moleculeId).filter(id => id);

        const isMatch = (placed, required) => {
            if (placed.length !== required.length) return false;
            return [...placed].sort().join(',') === [...required].sort().join(',');
        };

        if (isMatch(placedR, reaction.reactants) && isMatch(placedP, reaction.products)) {
            handleDragDropCorrect();
        } else {
            handleDragDropIncorrect();
        }
    }
}

function handleDragDropCorrect() {
    const updates = { isChecking: true, answerState: 'correct' };
    if (state.attempts === 0 && state.quizState === 'playing') {
        updates.score = state.score + 1;
    }
    setState(updates);
}

function handleDragDropIncorrect() {
    const nextAttempts = state.attempts + 1;
    const updates = { isChecking: true, attempts: nextAttempts };
    if (nextAttempts === 1) {
        updates.answerState = 'incorrect';
        if (state.quizState === 'playing') {
            updates.wrongQuestions = [...state.wrongQuestions, state.questions[state.currentIdx]];
        }
    } else {
        updates.answerState = 'incorrect_final';
    }
    setState(updates);
}

window.test7RetryDragDrop = () => {
    setState({ isChecking: false, answerState: 'idle' });
    // Reset slots? Actually render() will clear them if we don't handle it.
    // We'll let the user manually move them or just re-render.
};

// Coefficient specific logic (Test 6)
window.changeTest7Coeff = (id, delta) => {
    if (state.isChecking || state.answerState === 'correct') return;
    const newVal = state.coeffs[id] + delta;
    if (newVal >= 1 && newVal <= 9) {
        setState({ coeffs: { ...state.coeffs, [id]: newVal }, answerState: 'idle' });
    }
};

window.submitTest7Coeffs = () => {
    const qWrap = state.questions[state.currentIdx];
    const reaction = qWrap.data.reaction;
    const atoms = {};
    reaction.balanceAtoms.forEach(a => atoms[a] = { r: 0, p: 0 });

    reaction.reactants.forEach(id => {
        const count = state.coeffs[id];
        const molAtoms = MOLECULES[id].atoms;
        for (const [a, c] of Object.entries(molAtoms)) { if (atoms[a]) atoms[a].r += count * c; }
    });

    reaction.products.forEach(id => {
        const count = state.coeffs[id];
        const molAtoms = MOLECULES[id].atoms;
        for (const [a, c] of Object.entries(molAtoms)) { if (atoms[a]) atoms[a].p += count * c; }
    });

    let allMatched = true;
    for (const item of Object.values(atoms)) { if (item.r !== item.p) allMatched = false; }

    const isCorrect = allMatched;
    const currentAttempts = state.attempts + 1;
    let newAnswerState = isCorrect ? 'correct' : (currentAttempts >= 2 ? 'incorrect_final' : 'incorrect');

    const updates = { isChecking: true, isShaking: !isCorrect, answerState: newAnswerState, attempts: currentAttempts };
    if (state.quizState === 'playing') {
        if (isCorrect && currentAttempts === 1) updates.score = state.score + 1;
        if (!isCorrect && currentAttempts === 1) updates.wrongQuestions = [...state.wrongQuestions, qWrap];
    }
    setState(updates);

    if (isCorrect || newAnswerState === 'incorrect_final') {
        setTimeout(() => {
            setState({ isShaking: false });
            setTimeout(() => { goToNextQuestion(); }, 600);
        }, 400);
    } else {
        setTimeout(() => { setState({ isShaking: false, isChecking: false }); }, 400);
    }
};

window.handleTest7ReviewWrong = () => {
    if (state.wrongQuestions.length === 0) return;
    setState({
        quizState: 'review',
        questions: shuffleArray([...state.wrongQuestions]),
        currentIdx: 0,
        score: 0,
        wrongQuestions: [],
        selectedOption: null,
        isChecking: false,
        isShaking: false,
        attempts: 0,
        showNextButton: false,
        answerState: 'idle',
        coeffs: {}
    });
    setupQuestionState();
};

function render() {
    const container = document.getElementById('test7-content');
    if (!container || container.style.display === 'none') return;

    const shakeClass = state.isShaking ? 'animate-shake shadow-[0_0_20px_rgba(239,68,68,0.6)]' : '';
    let content = '';

    if ((state.quizState === 'playing' || state.quizState === 'review') && state.questions.length > 0) {
        const qWrap = state.questions[state.currentIdx];
        const progress = (state.currentIdx / state.questions.length) * 100;
        const badgeText = state.quizState === 'review' ? '오답 복습 중' : 'Test 7: 전체 통합 테스트';

        content = `
            <div class="px-4 py-4 sm:p-6">
                <div class="flex justify-between items-center mb-4">
                    <span class="text-xs font-black ${state.quizState === 'review' ? 'text-red-700 bg-red-100' : 'text-indigo-700 bg-indigo-100'} py-1.5 px-4 rounded-full uppercase tracking-widest">${badgeText}</span>
                    <span class="text-sm font-black text-slate-600 bg-slate-100 px-4 py-1.5 rounded-xl">QUESTION ${state.currentIdx + 1} / ${state.questions.length}</span>
                </div>
                <div class="w-full bg-slate-100 rounded-full h-2 mb-6 shadow-inner">
                    <div class="bg-indigo-500 h-2 rounded-full transition-all duration-300" style="width: ${progress}%"></div>
                </div>
                ${renderQuestionBody(qWrap)}
            </div>
        `;
    } else if (state.quizState === 'result') {
        const percentage = Math.round((state.score / state.questions.length) * 100);
        if (state.score === state.questions.length && state.questions.length > 0) {
            window.setTestCompleted('test7');
        }
        content = `
            <div class="p-10 text-center">
                <div class="mb-8 text-yellow-500 inline-block text-6xl animate-bounce">🏆</div>
                <h2 class="text-3xl font-black text-slate-800 mb-2 tracking-tight">통합 테스트 완료!</h2>
                <div class="bg-indigo-50 p-8 rounded-3xl mb-8 border-2 border-white shadow-xl">
                    <p class="text-indigo-700 font-black text-5xl mb-2">${state.score} / ${state.questions.length}</p>
                    <p class="text-indigo-600 font-bold">정답률 ${percentage}%</p>
                </div>
                <div class="space-y-4">
                    <button onclick="window.goHome()" class="w-full bg-slate-800 text-white font-black py-4 rounded-xl">홈으로 돌아가기</button>
                    ${state.wrongQuestions.length > 0 ? `<button onclick="window.handleTest7ReviewWrong()" class="w-full bg-red-500 text-white font-black py-4 rounded-xl">오답만 다시 풀기</button>` : ''}
                    <button onclick="window.initTest7()" class="w-full bg-gray-100 text-gray-700 font-black py-4 rounded-xl">처음부터 다시 도전</button>
                </div>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="min-h-screen bg-transparent flex justify-center pb-12 font-sans text-slate-800 py-6">
            <div class="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden ${shakeClass} mx-auto">
                ${content}
            </div>
        </div>
        ${renderOverlays()}
    `;

    // After HTML is inserted, if it's drag-drop, we need to setup inventory
    if (state.quizState === 'playing' || state.quizState === 'review') {
        const qWrap = state.questions[state.currentIdx];
        if (qWrap && (qWrap.type === 'test4' || qWrap.type === 'test5')) {
            setupInventory(qWrap);
        }
    }
}

function renderQuestionBody(qWrap) {
    const q = qWrap.data;
    switch (qWrap.type) {
        case 'test1': return renderMultipleChoice(q, '화학식 테스트');
        case 'test2': return renderMultipleChoiceWithModel(q, '원자 개수 (모형)');
        case 'test3': return renderMultipleChoiceFormulaOnly(q, '원자 개수 (화학식)');
        case 'test4': return renderDragDrop(q, '이름 매칭');
        case 'test5': return renderDragDrop(q, '화학식 매칭');
        case 'test6': return renderEquationCompletion(q, '최종 챌린지');
        default: return 'Unknown Question Type';
    }
}

function renderMultipleChoice(q, title) {
    const optionsHtml = q.options.map(opt => {
        const isCorrect = opt === q.answer;
        const isSelected = state.selectedOption === opt;
        let cls = "w-full p-4 rounded-xl border-2 font-medium text-left flex justify-between items-center transition-all bg-white ";
        if (!state.isChecking) cls += "border-slate-200 hover:border-indigo-300";
        else if (isCorrect && (isSelected || state.attempts >= 2)) cls += "border-green-500 bg-green-50 text-green-700";
        else if (isSelected && !isCorrect) cls += "border-red-500 bg-red-50 text-red-700";
        else cls += "opacity-50 border-slate-100";
        
        return `<button onclick="handleTest7OptionClick('${opt}')" ${state.isChecking ? 'disabled' : ''} class="${cls}">
            <span class="text-lg">${opt}</span>
        </button>`;
    }).join('');

    return `
        <div class="text-center mb-8">
            <h2 class="text-2xl font-bold text-slate-800 mb-6">${q.text}</h2>
        </div>
        <div class="space-y-3 max-w-md mx-auto">${optionsHtml}</div>
    `;
}

function renderMultipleChoiceWithModel(q, title) {
    const modelSvgs = q.modelIds.map(mid => `<div class="w-20 h-20 sm:w-28 sm:h-28 bg-white p-2 rounded-xl shadow-sm border border-slate-100 flex items-center justify-center">${MOLECULES[mid]?.svg || ''}</div>`).join('');
    const optionsHtml = q.options.map(opt => {
        const isCorrect = opt === q.answer;
        const isSelected = state.selectedOption === opt;
        let cls = "p-4 rounded-xl border-2 font-black text-2xl transition-all ";
        if (!state.isChecking) cls += "border-slate-200 hover:border-indigo-300";
        else if (isCorrect && (isSelected || state.attempts >= 2)) cls += "border-green-500 bg-green-50 text-green-700";
        else if (isSelected && !isCorrect) cls += "border-red-500 bg-red-50 text-red-700";
        else cls += "opacity-50 border-slate-100";

        return `<button onclick="handleTest7OptionClick(${opt})" ${state.isChecking ? 'disabled' : ''} class="${cls}">${opt}</button>`;
    }).join('');

    return `
        <div class="text-center mb-6">
            <div class="text-4xl font-black text-indigo-600 mb-4">${q.formula}</div>
            <h2 class="text-xl font-bold text-slate-700">${q.question}</h2>
        </div>
        <div class="flex flex-wrap justify-center gap-4 py-8 bg-slate-50 rounded-2xl mb-8 border border-slate-100 shadow-inner">${modelSvgs}</div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto">${optionsHtml}</div>
    `;
}

function renderMultipleChoiceFormulaOnly(q, title) {
    const optionsHtml = q.options.map(opt => {
        const isCorrect = opt === q.answer;
        const isSelected = state.selectedOption === opt;
        let cls = "p-4 rounded-xl border-2 font-black text-2xl transition-all ";
        if (!state.isChecking) cls += "border-slate-200 hover:border-indigo-300";
        else if (isCorrect && (isSelected || state.attempts >= 2)) cls += "border-green-500 bg-green-50 text-green-700";
        else if (isSelected && !isCorrect) cls += "border-red-500 bg-red-50 text-red-700";
        else cls += "opacity-50 border-slate-100";

        return `<button onclick="handleTest7OptionClick(${opt})" ${state.isChecking ? 'disabled' : ''} class="${cls}">${opt}</button>`;
    }).join('');

    return `
        <div class="text-center py-12 bg-slate-50 rounded-3xl mb-8 border border-slate-100 shadow-inner">
            <div class="text-6xl font-black text-indigo-600 mb-6 font-mono">${q.formula}</div>
            <h2 class="text-2xl font-bold text-slate-800 mb-2">${q.question}</h2>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto">${optionsHtml}</div>
    `;
}

function renderDragDrop(q, title) {
    const reaction = q.reaction;
    const type = q.reactionKey ? 'test5' : 'test4'; // Actually qWrap.type passed would be better
    // Re-calculating type based on current context
    const isFormula = title.includes('화학식'); 
    const slotClass = isFormula ? 'slot-formula' : 'slot-name';
    const subTitle = isFormula ? '반응식을 보고 알맞은 화학식을 끌어오세요' : '반응물과 생성물의 이름을 알맞게 배치하세요';

    return `
        <div class="mb-4 text-center">
            <h3 class="text-2xl font-black text-slate-800 mb-1">${reaction.title}</h3>
            <p class="text-slate-500 text-sm mb-4">${reaction.desc}</p>
            <div class="equation-container-v4 mb-8">
                <div class="side-container">
                    <span class="label">반응물</span>
                    <div class="drop-zone-v4">
                        ${reaction.reactants.map(id => `<div class="zone-slot"><div class="${slotClass}" data-target="${id}"></div></div>`).join('<span class="inner-plus">+</span>')}
                    </div>
                </div>
                <span class="big-arrow">→</span>
                <div class="side-container">
                    <span class="label">생성물</span>
                    <div class="drop-zone-v4">
                        ${reaction.products.map(id => `<div class="zone-slot"><div class="${slotClass}" data-target="${id}"></div></div>`).join('<span class="inner-plus">+</span>')}
                    </div>
                </div>
            </div>
            <p class="text-xs uppercase font-black text-slate-400 tracking-widest mb-4">${subTitle}</p>
            <div class="card-inventory grid grid-cols-4 sm:grid-cols-6 gap-2 bg-slate-50 p-4 rounded-2xl min-h-[120px]" id="test7-inventory"></div>
        </div>
    `;
}

function renderEquationCompletion(q, title) {
    const reaction = q.reaction;
    const createGroup = (ids) => {
        return `<div class="term-group flex items-center flex-wrap justify-center gap-2">
            ${ids.map((id, idx) => `
                <div class="term flex items-center bg-slate-50 p-2 rounded-xl">
                    <div class="coeff-stepper flex flex-col items-center mr-2">
                        <button class="text-xs hover:text-indigo-600" onclick="changeTest7Coeff('${id}', 1)">▲</button>
                        <div class="text-xl font-black w-6 text-center text-indigo-600">${state.coeffs[id] || 1}</div>
                        <button class="text-xs hover:text-indigo-600" onclick="changeTest7Coeff('${id}', -1)">▼</button>
                    </div>
                    <span class="text-2xl font-bold font-mono">${MOLECULES[id].formula}</span>
                </div>
                ${idx < ids.length - 1 ? '<span class="text-2xl text-slate-300 font-bold px-1">+</span>' : ''}
            `).join('')}
        </div>`;
    };

    return `
        <div class="text-center mb-6">
            <h3 class="text-2xl font-black text-slate-800 mb-2">${reaction.title}</h3>
            <div class="inline-block bg-slate-100 px-6 py-2 rounded-full text-slate-700 font-bold mb-8">
                ${reaction.reactants.map(id => MOLECULES[id].name).join(' + ')} → ${reaction.products.map(id => MOLECULES[id].name).join(' + ')}
            </div>
            <div class="flex items-center justify-center flex-wrap gap-4 py-10 bg-slate-50 rounded-3xl border shadow-inner mb-8">
                ${createGroup(reaction.reactants)}
                <span class="text-4xl text-slate-300 font-black px-2">→</span>
                ${createGroup(reaction.products)}
            </div>
            <button onclick="submitTest7Coeffs()" ${state.isChecking ? 'disabled' : ''} class="w-full max-w-md bg-slate-800 text-white font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all">
                ${state.answerState === 'correct' ? '정답입니다!' : '정답 확인 및 제출'}
            </button>
        </div>
    `;
}

function setupInventory(qWrap) {
    const container = document.getElementById('test7-inventory');
    if (!container) return;
    container.innerHTML = '';
    
    const reaction = qWrap.data.reaction;
    const requiredIds = [...new Set([...reaction.reactants, ...reaction.products])];
    const otherIds = Object.keys(MOLECULES).filter(id => !requiredIds.includes(id));
    const distractors = shuffleArray([...otherIds]).slice(0, Math.max(0, 12 - requiredIds.length));
    const items = shuffleArray([...requiredIds, ...distractors]);
    
    const mode = qWrap.type === 'test5' ? 'formula' : 'name';
    items.forEach(id => {
        container.appendChild(createMoleculeCard(id, mode, drag));
    });
    
    initDragAndDrop();
}

function renderOverlays() {
    let overlay = '';
    if (state.showNextButton) {
        overlay = `
            <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[3000] flex items-center justify-center p-6 animate-fade-in">
                <div class="bg-white rounded-[2rem] shadow-2xl p-8 max-w-sm w-full text-center scale-up border border-slate-100">
                    <div class="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-500">
                        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <h3 class="text-2xl font-black text-slate-800 mb-2">시도가 끝났습니다</h3>
                    <p class="text-slate-500 mb-8 font-medium">정답을 확인하셨나요?<br>다음 문제로 이동할까요?</p>
                    <button onclick="handleTest7NextClick()" class="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-lg active:scale-95 text-xl">다음 문제로 →</button>
                </div>
            </div>
        `;
    } else if (state.answerState !== 'idle' && (state.questions[state.currentIdx].type === 'test4' || state.questions[state.currentIdx].type === 'test5')) {
         // Show mini-modal for drag-drop
         let title = ''; let icon = ''; let btn = ''; let action = '';
         if (state.answerState === 'correct') { title = '정답입니다!'; icon = '✅'; btn = '다음 문제로 →'; action = 'goToNextQuestion()'; }
         else if (state.answerState === 'incorrect') { title = '다시 도전해보세요'; icon = '❌'; btn = '다시 시도하기'; action = 'test7RetryDragDrop()'; }
         else if (state.answerState === 'incorrect_final') { title = '아쉬워요!'; icon = '⚠️'; btn = '다음 문제로'; action = 'goToNextQuestion()'; }

         overlay = `
            <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[2500] flex items-center justify-center p-6">
                <div class="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center animate-scale-in">
                    <div class="text-5xl mb-4">${icon}</div>
                    <h3 class="text-2xl font-black text-slate-800 mb-6">${title}</h3>
                    <button onclick="${action}" class="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-lg">${btn}</button>
                </div>
            </div>
         `;
    }
    return overlay;
}

// Global exposure for goToNextQuestion if needed but local usually fine.
window.goToNextQuestion = goToNextQuestion;

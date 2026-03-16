import { MOLECULES, REACTIONS } from './constants.js';

const REACTION_KEYS = Object.keys(REACTIONS);

let state = {
  quizState: 'playing', // playing, result
  reactionKey: '',
  selectedReaction: null,
  coeffs: {},
  score: 0,
  total: REACTION_KEYS.length,
  count: 0,
  isChecking: false,
  isShaking: false,
  answerState: 'idle',
  wrongKeys: [],
  attempts: 0
};

const icons = {
  Trophy: `<svg class="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>`,
  RotateCcw: `<svg class="mr-2 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>`,
  Search: `<svg class="mr-2 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`
};

function setState(updates) {
  state = { ...state, ...updates };
  // Log detailed progress
  if ((state.quizState === 'playing' || state.quizState === 'review') && state.selectedReaction) {
      const mode = state.quizState === 'review' ? '오답 복습' : 'Test 6';
      window.logActivity(`${mode} - ${state.selectedReaction.title} 계수 맞추기`);
  }
  render();
}

export function initTest6() {
  const reaction = REACTIONS[REACTION_KEYS[0]];
  
  const initialCoeffs = {};
  [...reaction.reactants, ...reaction.products].forEach(id => {
    initialCoeffs[id] = 1;
  });

  setState({
    quizState: 'playing',
    reactionKey: REACTION_KEYS[0],
    selectedReaction: reaction,
    coeffs: initialCoeffs,
    count: 0,
    score: 0,
    total: REACTION_KEYS.length,
    isChecking: false,
    isShaking: false,
    answerState: 'idle',
    wrongKeys: [],
    attempts: 0
  });
}

window.changeTest5Coeff = (id, delta) => {
  if (state.isChecking || state.answerState === 'correct' || state.answerState === 'incorrect_final') return;
  const newVal = state.coeffs[id] + delta;
  if (newVal >= 1 && newVal <= 9) {
    const newCoeffs = { ...state.coeffs, [id]: newVal };
    setState({ coeffs: newCoeffs, answerState: 'idle' });
  }
};

window.submitTest3 = () => {
  if (state.isChecking || state.answerState === 'correct') return;
  const reaction = state.selectedReaction;
  const atoms = {};
  reaction.balanceAtoms.forEach(a => atoms[a] = { r: 0, p: 0 });

  reaction.reactants.forEach(id => {
    const count = state.coeffs[id];
    const molAtoms = MOLECULES[id].atoms;
    for (const [a, c] of Object.entries(molAtoms)) {
      if (atoms[a]) atoms[a].r += count * c;
    }
  });

  reaction.products.forEach(id => {
    const count = state.coeffs[id];
    const molAtoms = MOLECULES[id].atoms;
    for (const [a, c] of Object.entries(molAtoms)) {
      if (atoms[a]) atoms[a].p += count * c;
    }
  });

  let allMatched = true;
  for (const item of Object.values(atoms)) {
    if (item.r !== item.p) allMatched = false;
  }

  const isCorrect = allMatched;
  const currentAttempts = state.attempts + 1;
  let newAnswerState = isCorrect ? 'correct' : 'incorrect';
  
  if (!isCorrect && currentAttempts >= 2) {
    newAnswerState = 'incorrect_final';
  }
  
  const updates = {
    isChecking: true,
    isShaking: !isCorrect,
    answerState: newAnswerState,
    attempts: currentAttempts
  };

  if (state.quizState === 'playing') {
    if (isCorrect) {
      if (!state.wrongKeys.includes(state.reactionKey)) {
        updates.score = state.score + 1;
      }
    } else {
      if (!state.wrongKeys.includes(state.reactionKey)) {
        updates.wrongKeys = [...state.wrongKeys, state.reactionKey];
      }
    }
  }

  setState(updates);

  if (isCorrect || newAnswerState === 'incorrect_final') {
    setTimeout(() => {
      setState({ isShaking: false });
      setTimeout(() => {
        const newCount = state.count + 1;
        const maxCount = state.quizState === 'playing' ? state.total : state.wrongKeys.length;
        
        if (newCount < maxCount) {
          nextQuestion(state.score, newCount);
        } else {
          setState({ 
            count: newCount, 
            quizState: 'result',
            isChecking: false 
          });
        }
      }, 600);
    }, 400);
  } else {
    // 오답일 경우, 흔들림 종료 후 입력을 다시 활성화
    setTimeout(() => {
      setState({ isShaking: false, isChecking: false });
    }, 400);
  }
};

window.handleTest3ReviewWrong = () => {
  if (state.wrongKeys.length === 0) return;
  
  const firstKey = state.wrongKeys[0];
  const reaction = REACTIONS[firstKey];
  const initialCoeffs = {};
  [...reaction.reactants, ...reaction.products].forEach(id => {
    initialCoeffs[id] = 1;
  });

  setState({
      quizState: 'review',
      reactionKey: firstKey,
      selectedReaction: reaction,
      coeffs: initialCoeffs,
      count: 0,
      isChecking: false,
      isShaking: false,
      answerState: 'idle',
      attempts: 0
  });
};

function nextQuestion(score, count) {
  const reactionKey = state.quizState === 'playing' ? REACTION_KEYS[count] : state.wrongKeys[count];
  const reaction = REACTIONS[reactionKey];
  const initialCoeffs = {};
  [...reaction.reactants, ...reaction.products].forEach(id => {
    initialCoeffs[id] = 1;
  });

  setState({
    reactionKey: reactionKey,
    selectedReaction: reaction,
    coeffs: initialCoeffs,
    score: score,
    count: count,
    isChecking: false,
    isShaking: false,
    answerState: 'idle',
    attempts: 0
  });
}

function render() {
  const container = document.getElementById('test6-content');
  if (!container || container.style.display === 'none') return;
  
  const shakeClass = state.isShaking ? 'animate-shake shadow-[0_0_20px_rgba(239,68,68,0.6)]' : '';
  let content = '';

  if (state.quizState === 'playing' || state.quizState === 'review') {
    const reaction = state.selectedReaction;
    const maxCount = state.quizState === 'playing' ? state.total : state.wrongKeys.length;
    const progress = (state.count / maxCount) * 100;
    
    const badgeText = state.quizState === 'review' ? '오답 복습 중' : 'Final Challenge';
    const badgeClass = state.quizState === 'review' ? 'text-red-700 bg-red-100' : 'text-emerald-700 bg-emerald-100';
    const testLabel = state.quizState === 'review' ? 'REVIEW' : 'TEST';

    const checkIsShort = (ids) => {
        const totalLength = ids.reduce((sum, id) => sum + (MOLECULES[id].formula ? MOLECULES[id].formula.length : 0), 0);
        return totalLength <= 10 && ids.length <= 2;
    };

    const isReactantShort = checkIsShort(reaction.reactants);
    const isProductShort = checkIsShort(reaction.products);
    const fullShortClass = (isReactantShort && isProductShort) ? 'is-full-short' : '';

    const createGroup = (ids, isShortSide) => {
        const isShort = isShortSide ? 'is-short' : '';

        const innerHTML = ids.map((id, idx) => {
            const isHidden = state.coeffs[id] === 1;
            return `
                <div class="term">
                    <div class="coeff-stepper">
                        <button class="step-up" onclick="changeTest5Coeff('${id}', 1)">▲</button>
                        <div class="coeff-value ${isHidden ? 'is-hidden' : ''}">${state.coeffs[id]}</div>
                        <button class="step-down" onclick="changeTest5Coeff('${id}', -1)">▼</button>
                    </div>
                    <span class="formula">${MOLECULES[id].formula}</span>
                </div>
                ${idx < ids.length - 1 ? '<span class="plus">+</span>' : ''}
            `;
        }).join('');
        return `<div class="term-group ${isShort}">${innerHTML}</div>`;
    };

    const reactantNames = reaction.reactants.map(id => MOLECULES[id].name).join(' + ');
    const productNames = reaction.products.map(id => MOLECULES[id].name).join(' + ');

    let btnClass = "w-full py-5 px-6 rounded-2xl font-black transition-all duration-200 ease-in-out relative flex items-center justify-center space-x-2 mt-8 text-xl ";
    let iconHtml = '';
    let btnText = '정답 확인 및 제출하기';

    if (state.answerState === 'correct') {
       btnClass += "border-2 border-green-500 bg-green-50 text-green-700 shadow-inner";
       btnText = "정답입니다!";
       iconHtml = `<svg class="text-green-500 w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>`;
    } else if (state.answerState === 'incorrect_final') {
       btnClass += "border-2 border-red-500 bg-red-50 text-red-700 shadow-inner";
       btnText = "오답입니다! 다음 문제로 자동 이동합니다...";
       iconHtml = `<svg class="text-red-500 w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    } else if (state.answerState === 'incorrect') {
       btnClass += "border-2 border-red-500 bg-red-50 text-red-700 shadow-inner";
       btnText = "오답입니다! 다시 풀어보기";
       iconHtml = `<svg class="text-red-500 w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    } else {
       btnClass += "bg-slate-800 hover:bg-slate-900 text-white shadow-lg active:scale-95";
       iconHtml = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>`;
    }

    content = `
      <div class="px-4 py-6 sm:p-8">
        <div class="flex justify-between items-center mb-6">
          <span class="text-xs font-black ${badgeClass} py-1.5 px-4 rounded-full uppercase tracking-widest">${badgeText}</span>
          <span class="text-sm font-black text-slate-600 bg-slate-100 px-4 py-1.5 rounded-xl">${testLabel} ${state.count + 1} / ${maxCount}</span>
        </div>
        
        <div class="w-full bg-slate-100 rounded-full h-3 mb-8 shadow-inner p-0.5">
          <div class="bg-gradient-to-r from-teal-400 to-emerald-500 h-2 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]" style="width: ${progress}%"></div>
        </div>

        <div class="text-center mb-4">
            <h3 class="text-2xl font-black text-slate-800 mb-2 tracking-tight">${reaction.title}</h3>
            <div class="inline-block bg-slate-50 px-5 py-2.5 rounded-xl text-slate-700 font-bold border border-slate-200 shadow-sm text-sm">
               ${reactantNames} <span class="text-blue-500 mx-2">→</span> ${productNames}
            </div>
        </div>

        <div class="equation-interactive-v2 ${fullShortClass} border border-slate-200 rounded-lg shadow-inner" style="min-height: 250px;">
            ${createGroup(reaction.reactants, isReactantShort)}
            <span class="big-arrow">→</span>
            ${createGroup(reaction.products, isProductShort)}
        </div>

        <button onclick="submitTest3()" ${state.isChecking ? 'disabled' : ''} class="${btnClass}">
            <span>${btnText}</span>
            ${iconHtml}
        </button>
      </div>
    `;
  } else {
    const percentage = Math.round((state.score / state.total) * 100);
    
    // perfect score (no retries recorded in score)
    if (state.score === state.total && state.total > 0 && state.quizState === 'result') {
      if (window.setTestCompleted) window.setTestCompleted('test6');
      window.logActivity('Test 6 완료 (만점!)', { key: 'test6', value: 'completed_perfect' });
    } else if (state.quizState === 'result') {
      window.logActivity('Test 6 완료', { key: 'test6', value: 'completed' });
    }

    const hasWrong = state.wrongKeys.length > 0;
    content = `
      <div class="p-10 text-center">
        <div class="mb-8 text-yellow-500 inline-block drop-shadow-2xl animate-bounce">${icons.Trophy}</div>
        <h2 class="text-3xl font-black text-slate-800 mb-2 tracking-tight">테스트 완료!</h2>
        <p class="text-slate-500 mb-10 font-medium">화학 반응식 마스터가 되셨습니다!</p>
        
        <div class="bg-gradient-to-br from-indigo-50 to-purple-100 p-10 rounded-3xl mb-10 border-2 border-white shadow-xl">
          <div class="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-3">Your Final Score</div>
          <p class="text-indigo-700 font-black text-6xl mb-4 tabular-nums">${state.score} <span class="text-slate-300 text-3xl mx-1">/</span> ${state.total}</p>
          <div class="h-2 w-full bg-slate-200/50 rounded-full mb-4 overflow-hidden shadow-inner">
             <div class="h-full bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]" style="width: ${percentage}%"></div>
          </div>
          <p class="text-indigo-600 font-black text-xl">정답률 ${percentage}%</p>
        </div>

        <div class="space-y-4">
            <button onclick="window.goHome()" class="w-full bg-slate-800 hover:bg-slate-900 text-white font-black py-5 px-6 rounded-2xl flex items-center justify-center transition-all shadow-lg active:scale-95">
              홈으로 돌아가기
            </button>
            
            ${hasWrong ? `
                <button onclick="window.handleTest3ReviewWrong()" class="w-full bg-red-50 hover:bg-red-100 text-red-600 border-2 border-red-200 font-black py-5 px-6 rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-sm">
                    ${icons.Search} 오답만 다시 풀기
                </button>
            ` : ''}

            <button onclick="initTest6()" class="w-full bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 font-black py-5 px-6 rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-sm">
              ${icons.RotateCcw} 처음부터 다시 도전
            </button>
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="min-h-screen bg-transparent flex justify-center pb-12 font-sans text-slate-800 py-6" id="tw-root-test6">
      <div id="test6-container" class="max-w-5xl w-full sm:w-11/12 bg-white rounded-none sm:rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-300 border border-slate-100/50 mx-auto ${shakeClass}">
        ${content}
      </div>
    </div>
  `;
}

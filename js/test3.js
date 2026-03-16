import { MOLECULES } from './constants.js';

const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

let state = {
  quizState: 'playing', // playing, result
  questions: [],
  currentIdx: 0,
  score: 0,
  selectedOption: null,
  isChecking: false,
  isShaking: false,
  attempts: 0,
  showNextButton: false,
  wrongQuestions: [],
};

const icons = {
  Trophy: `<svg class="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>`,
  CheckCircle2: `<svg class="text-green-500 w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>`,
  XCircle: `<svg class="text-red-500 w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
  RotateCcw: `<svg class="mr-2 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>`
};

function setState(updates) {
  state = { ...state, ...updates };
  render();
}

export function generateQuestions() {
    const rawData = [
        // Formula Only questions for Test 3
        { formula: '3H₂O', showModel: false, question: '수소(H) 원자의 개수는?', answer: 6, options: [3, 5, 6, 9] },
        { formula: '2CH₄', showModel: false, question: '탄소(C) 원자의 개수는?', answer: 2, options: [1, 2, 4, 8] },
        { formula: '2NH₃', showModel: false, question: '질소(N) 원자의 개수는?', answer: 2, options: [1, 2, 3, 4] },
        { formula: 'MgCl₂', showModel: false, question: '염소(Cl) 원자의 개수는?', answer: 2, options: [1, 2, 3, 4] },
        { formula: '2N₂', showModel: false, question: '질소(N) 원자의 개수는?', answer: 4, options: [2, 4, 6, 8] },
        { formula: '3CO₂', showModel: false, question: '탄소(C) 원자의 개수는?', answer: 3, options: [1, 3, 6, 9] },
        { formula: 'AgNO₃', showModel: false, question: '산소(O) 원자의 개수는?', answer: 3, options: [1, 2, 3, 4] },
        { formula: 'CH₄ + 2O₂', showModel: false, question: '산소(O) 원자의 개수는?', answer: 4, options: [2, 4, 6, 8] },
        { formula: '2H₂ + O₂', showModel: false, question: '수소(H) 원자의 개수는?', answer: 4, options: [2, 4, 6, 8] },
        { formula: '2Cu + O₂', showModel: false, question: '구리(Cu) 원자의 개수는?', answer: 2, options: [1, 2, 3, 4] },
        { formula: 'HCl + NH₃', showModel: false, question: '수소(H) 원자의 개수는?', answer: 4, options: [2, 4, 6, 8] },
        { formula: 'NaCl + AgNO₃', showModel: false, question: '산소(O) 원자의 개수는?', answer: 3, options: [1, 2, 3, 6] },
        { formula: 'N₂ + 3H₂', showModel: false, question: '수소(H) 원자의 개수는?', answer: 6, options: [2, 3, 6, 9] },
        { formula: '2HCl + Mg', showModel: false, question: '염소(Cl) 원자의 개수는?', answer: 2, options: [1, 2, 3, 4] },
        { formula: '2H₂O₂ + MnO₂', showModel: false, question: '산소(O) 원자의 개수는?', answer: 6, options: [2, 4, 6, 8] },
        { formula: 'CaCO₃ + 2HCl', showModel: false, question: '염소(Cl) 원자의 개수는?', answer: 2, options: [1, 2, 3, 4] },
        { formula: '2NaOH + H₂SO₄', showModel: false, question: '수소(H) 원자의 개수는?', answer: 4, options: [2, 4, 6, 8] }
    ];
    return rawData.map(q => ({
        ...q,
        options: shuffleArray([...q.options])
    }));
}

export function initTest3() {
  setState({ 
    quizState: 'playing', 
    questions: generateQuestions(), 
    currentIdx: 0, 
    score: 0, 
    selectedOption: null, 
    isChecking: false, 
    isShaking: false,
    attempts: 0,
    showNextButton: false,
    wrongQuestions: []
  });
}

window.handleTest3OptionClick = (option) => {
  if (state.isChecking) return;
  const currentQ = state.questions[state.currentIdx];
  const isCorrect = option === currentQ.answer;
  const currentAttempts = state.attempts + 1;

  let newScore = state.score;
  if (isCorrect && currentAttempts === 1) {
    newScore = state.score + 1;
  }

  setState({ 
    selectedOption: option, 
    isChecking: true,
    score: newScore,
    isShaking: !isCorrect,
    attempts: currentAttempts,
    wrongQuestions: (!isCorrect && currentAttempts === 1) ? [...state.wrongQuestions, currentQ] : state.wrongQuestions
  });

  if (isCorrect) {
    setTimeout(() => {
      setState({ isShaking: false });
      setTimeout(() => {
          let updates = { selectedOption: null, isChecking: false, attempts: 0, showNextButton: false };
          if (state.currentIdx + 1 < state.questions.length) {
            updates.currentIdx = state.currentIdx + 1;
          } else {
            updates.quizState = 'result';
          }
          setState(updates);
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

window.handleTest3NextClick = () => {
    let updates = { selectedOption: null, isChecking: false, attempts: 0, showNextButton: false };
    if (state.currentIdx + 1 < state.questions.length) {
      updates.currentIdx = state.currentIdx + 1;
    } else {
      updates.quizState = 'result';
    }
    setState(updates);
};

window.handleTest3ReviewWrong = () => {
    if (state.wrongQuestions.length === 0) return;
    
    setState({
        quizState: 'playing',
        questions: shuffleArray([...state.wrongQuestions]),
        currentIdx: 0,
        selectedOption: null,
        isChecking: false,
        isShaking: false,
        attempts: 0,
        showNextButton: false,
        wrongQuestions: []
    });
};

function render() {
  const container = document.getElementById('test3-content');
  if (!container || container.style.display === 'none') return;

  const shakeClass = state.isShaking ? 'animate-shake shadow-[0_0_20px_rgba(239,68,68,0.6)]' : '';
  let content = '';

  if (state.quizState === 'playing' && state.questions.length > 0) {
    const q = state.questions[state.currentIdx];
    const progress = ((state.currentIdx) / state.questions.length) * 100;

    let optionsHtml = q.options.map((opt) => {
      const isCorrectAnswer = opt === q.answer;
      const isSelected = state.selectedOption === opt;
      let btnClass = "w-full p-2 sm:p-4 rounded-xl sm:rounded-2xl border-2 border-solid font-black transition-all duration-200 ease-in-out relative flex items-center justify-center min-h-[4rem] sm:min-h-[5rem] bg-white text-xl sm:text-3xl ";
      let iconHtml = '';

      if (!state.isChecking) {
        btnClass += "border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700 shadow-sm hover:shadow-md active:scale-95";
      } else {
        if (isCorrectAnswer && (isSelected || state.attempts >= 2)) {
          btnClass += "border-green-500 bg-green-50 text-green-700 shadow-inner";
          iconHtml = icons.CheckCircle2;
        } else if (isSelected && !isCorrectAnswer) {
          btnClass += "border-red-500 bg-red-50 text-red-700 shadow-inner";
          iconHtml = icons.XCircle;
        } else {
          btnClass += "border-slate-100 bg-slate-50 text-slate-300 opacity-50";
        }
      }

      return `<button onclick="handleTest3OptionClick(${opt})" ${state.isChecking ? 'disabled' : ''} class="${btnClass}">
        <span class="w-full text-center">${opt}</span>
        ${iconHtml ? `<div class="absolute right-2 sm:right-4">${iconHtml}</div>` : ''}
      </button>`;
    }).join('');

    content = `
      <div class="px-4 py-6 sm:p-8">
        <div class="flex justify-between items-center mb-6">
          <span class="text-xs font-black text-indigo-600 bg-indigo-100 py-1.5 px-4 rounded-full uppercase tracking-widest">Atom Count (Formula Only)</span>
          <span class="text-sm font-black text-slate-600 bg-slate-100 px-4 py-1.5 rounded-xl">QUESTION ${state.currentIdx + 1} / ${state.questions.length}</span>
        </div>
        
        <div class="w-full bg-slate-100 rounded-full h-3 mb-10 shadow-inner p-0.5">
          <div class="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(79,70,229,0.4)]" style="width: ${progress}%"></div>
        </div>

        <div class="text-center mb-10 py-10 bg-slate-50 rounded-3xl border border-slate-100 shadow-inner">
            <div class="text-6xl font-black text-indigo-600 mb-6 font-mono drop-shadow-sm tracking-tight">${q.formula}</div>
            <h2 class="text-2xl font-bold text-slate-800 leading-snug px-4">${q.question}</h2>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-4">
          ${optionsHtml}
        </div>
        <div class="mt-8 h-[76px]"></div>
      </div>
    `;
  } else if (state.quizState === 'result') {
    const percentage = Math.round((state.score / state.questions.length) * 100);
    
    // perfect score (no retries recorded in score)
    if (state.score === state.questions.length && state.questions.length > 0) {
      if (window.setTestCompleted) window.setTestCompleted('test3');
    }

    content = `
      <div class="p-10 text-center">
        <div class="mb-8 text-yellow-500 inline-block drop-shadow-2xl animate-bounce">${icons.Trophy}</div>
        <h2 class="text-3xl font-black text-slate-800 mb-2 tracking-tight">테스트 완료!</h2>
        <p class="text-slate-500 mb-10 font-medium">화학식만 보고도 원자 개수를 척척 맞히시네요!</p>
        
        <div class="bg-gradient-to-br from-indigo-50 to-purple-100 p-10 rounded-3xl mb-10 border-2 border-white shadow-xl">
          <div class="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-3">Your Final Score</div>
          <p class="text-indigo-700 font-black text-6xl mb-4 tabular-nums">${state.score} <span class="text-slate-300 text-3xl mx-1">/</span> ${state.questions.length}</p>
          <div class="h-2 w-full bg-slate-200/50 rounded-full mb-4 overflow-hidden shadow-inner">
             <div class="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.3)]" style="width: ${percentage}%"></div>
          </div>
          <p class="text-indigo-600 font-black text-xl">정답률 ${percentage}%</p>
        </div>

        <div class="space-y-4">
            <button onclick="window.goHome()" class="w-full bg-slate-800 hover:bg-slate-900 text-white font-black py-5 px-6 rounded-2xl flex items-center justify-center transition-all shadow-lg hover:shadow-slate-200 active:scale-95">
              홈으로 돌아가기
            </button>
            ${state.wrongQuestions.length > 0 ? `
            <button onclick="window.handleTest3ReviewWrong()" class="w-full bg-red-50 hover:bg-red-100 text-red-600 border-2 border-red-200 font-black py-5 px-6 rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-sm">
              <svg class="mr-2 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              오답만 다시 풀기
            </button>
            ` : ''}
            <button onclick="window.startTest3()" class="w-full bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 font-black py-5 px-6 rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-sm">
              ${icons.RotateCcw} 처음부터 다시 도전
            </button>
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="min-h-screen bg-transparent flex justify-center pb-12 font-sans text-slate-800 py-6" id="tw-root-test3">
      <div id="test3-container" class="max-w-5xl w-11/12 bg-white rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-300 border border-slate-100/50 mx-auto ${shakeClass}">
        ${content}
      </div>
      </div>
      
      ${state.showNextButton ? `
      <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in">
        <div class="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full transform animate-scale-in text-center border border-slate-100">
          <div class="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-2xl font-black text-slate-800 mb-2">시도가 끝났습니다</h3>
          <p class="text-slate-500 mb-8 font-medium">정답을 확인하셨나요?<br>다음 문제로 이동해 볼까요?</p>
          <button onclick="handleTest3NextClick()" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 px-6 rounded-2xl flex items-center justify-center transition-all shadow-lg active:scale-95 text-lg">
            다음 문제로 <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      </div>` : ''}
    </div>
  `;
}

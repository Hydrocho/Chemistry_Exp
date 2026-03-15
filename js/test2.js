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

function generateQuestions() {
    const rawData = [
        // Only Model + Formula questions for Test 2
        { formula: 'H₂O', modelIds: ['h2o'], question: '수소(H) 원자의 개수는?', answer: 2, options: [1, 2, 3, 4] },
        { formula: '3O₂', modelIds: ['o2', 'o2', 'o2'], question: '산소(O) 원자의 개수는?', answer: 6, options: [3, 4, 6, 9] },
        { formula: '2CH₄', modelIds: ['ch4', 'ch4'], question: '탄소(C) 원자의 개수는?', answer: 2, options: [1, 2, 3, 4] },
        { formula: '3NH₃', modelIds: ['nh3', 'nh3', 'nh3'], question: '수소(H) 원자의 개수는?', answer: 9, options: [3, 6, 9, 12] },
        { formula: '2CO₂', modelIds: ['co2', 'co2'], question: '산소(O) 원자의 개수는?', answer: 4, options: [2, 4, 6, 8] },
        { formula: 'CO₂ + H₂O', modelIds: ['co2', 'h2o'], question: '산소(O) 원자의 개수는?', answer: 3, options: [1, 2, 3, 4] },
        { formula: 'CH₄ + 2O₂', modelIds: ['ch4', 'o2', 'o2'], question: '산소(O) 원자의 개수는?', answer: 4, options: [2, 3, 4, 6] },
        { formula: 'NH₃ + HCl', modelIds: ['nh3', 'hcl'], question: '수소(H) 원자의 개수는?', answer: 4, options: [2, 3, 4, 5] },
    ];
    return rawData.map(q => ({
        ...q,
        options: shuffleArray([...q.options])
    }));
}

export function initTest2() {
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

window.handleTest2OptionClick = (option) => {
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

window.handleTest2NextClick = () => {
    let updates = { selectedOption: null, isChecking: false, attempts: 0, showNextButton: false };
    if (state.currentIdx + 1 < state.questions.length) {
      updates.currentIdx = state.currentIdx + 1;
    } else {
      updates.quizState = 'result';
    }
    setState(updates);
};

window.handleTest2ReviewWrong = () => {
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
  const container = document.getElementById('test2-content');
  if (!container || container.style.display === 'none') return;

  const shakeClass = state.isShaking ? 'animate-shake shadow-[0_0_20px_rgba(239,68,68,0.6)]' : '';
  let content = '';

  if (state.quizState === 'playing' && state.questions.length > 0) {
    const q = state.questions[state.currentIdx];
    const progress = ((state.currentIdx) / state.questions.length) * 100;

    let modelHtml = '';
    if (q.showModel !== false && q.modelIds && Array.isArray(q.modelIds)) {
      modelHtml = `
        <div class="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 bg-slate-50 p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-inner">
          ${q.modelIds.map(mid => {
              const svg = MOLECULES[mid] ? MOLECULES[mid].svg : '';
              return `
                <div class="bg-white p-2 sm:p-4 rounded-xl sm:rounded-2xl shadow-md border border-slate-200 transform transition-transform hover:scale-105 sm:hover:scale-110 flex items-center justify-center w-20 h-20 sm:w-[120px] sm:h-[120px]">
                  <div class="scale-[1.2] sm:scale-[1.8] origin-center flex items-center justify-center w-full h-full">
                    ${svg}
                  </div>
                </div>
              `;
          }).join('')}
          ${q.formula.includes('+') ? '<div class="flex items-center justify-center w-full mt-2 text-slate-400 font-bold text-sm sm:text-2xl">여러 물질이 섞여 있는 복합식입니다.</div>' : ''}
        </div>
      `;
    } else {
      modelHtml = `<div class="h-8"></div>`;
    }

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

      return `<button onclick="handleTest2OptionClick(${opt})" ${state.isChecking ? 'disabled' : ''} class="${btnClass}">
        <span class="w-full text-center">${opt}</span>
        ${iconHtml ? `<div class="absolute right-2 sm:right-4">${iconHtml}</div>` : ''}
      </button>`;
    }).join('');

    content = `
      <div class="px-4 py-6 sm:p-8">
        <div class="flex justify-between items-center mb-6">
          <span class="text-xs font-black text-blue-600 bg-blue-100 py-1.5 px-4 rounded-full uppercase tracking-widest">Atom Count (Models)</span>
          <span class="text-sm font-black text-slate-600 bg-slate-100 px-4 py-1.5 rounded-xl">QUESTION ${state.currentIdx + 1} / ${state.questions.length}</span>
        </div>
        
        <div class="w-full bg-slate-100 rounded-full h-3 mb-10 shadow-inner p-0.5">
          <div class="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(79,70,229,0.4)]" style="width: ${progress}%"></div>
        </div>

        <div class="text-center mb-10">
            <div class="text-5xl font-black text-indigo-600 mb-4 font-mono drop-shadow-sm tracking-tight">${q.formula}</div>
            <h2 class="text-2xl font-bold text-slate-800 leading-snug px-4">${q.question}</h2>
        </div>

        ${modelHtml}

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
      if (window.setTestCompleted) window.setTestCompleted('test2');
    }

    content = `
      <div class="p-10 text-center">
        <div class="mb-8 text-yellow-500 inline-block drop-shadow-2xl animate-bounce">${icons.Trophy}</div>
        <h2 class="text-3xl font-black text-slate-800 mb-2 tracking-tight">테스트 완료!</h2>
        <p class="text-slate-500 mb-10 font-medium">분자 모형 탐지 능력이 대단하시네요!</p>
        
        <div class="bg-gradient-to-br from-blue-50 to-indigo-100 p-10 rounded-3xl mb-10 border-2 border-white shadow-xl">
          <div class="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-3">Your Final Score</div>
          <p class="text-indigo-700 font-black text-6xl mb-4 tabular-nums">${state.score} <span class="text-slate-300 text-3xl mx-1">/</span> ${state.questions.length}</p>
          <div class="h-2 w-full bg-slate-200/50 rounded-full mb-4 overflow-hidden shadow-inner">
             <div class="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.3)]" style="width: ${percentage}%"></div>
          </div>
          <p class="text-indigo-600 font-black text-xl">정답률 ${percentage}%</p>
        </div>

        <div class="space-y-4">
            <button onclick="window.goHome()" class="w-full bg-slate-800 hover:bg-slate-900 text-white font-black py-5 px-6 rounded-2xl flex items-center justify-center transition-all shadow-lg hover:shadow-slate-200 active:scale-95">
              홈으로 돌아가기
            </button>
            ${state.wrongQuestions.length > 0 ? `
            <button onclick="window.handleTest2ReviewWrong()" class="w-full bg-red-50 hover:bg-red-100 text-red-600 border-2 border-red-200 font-black py-5 px-6 rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-sm">
              <svg class="mr-2 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              오답만 다시 풀기
            </button>
            ` : ''}
            <button onclick="window.startTest2()" class="w-full bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 font-black py-5 px-6 rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-sm">
              ${icons.RotateCcw} 처음부터 다시 도전
            </button>
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="min-h-screen bg-transparent flex justify-center pb-12 font-sans text-slate-800 py-6" id="tw-root-test2">
      <div id="test2-container" class="max-w-5xl w-11/12 bg-white rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-300 border border-slate-100/50 mx-auto ${shakeClass}">
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
          <button onclick="handleTest2NextClick()" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 px-6 rounded-2xl flex items-center justify-center transition-all shadow-lg active:scale-95 text-lg">
            다음 문제로 <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      </div>` : ''}
    </div>
  `;
}

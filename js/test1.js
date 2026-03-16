import { shuffleArray as utilShuffle } from './utils.js';

// Data from Lesson 1 - Stage 3 (물질 화학식)
const lesson1Data = [
  { category: '물질 화학식', name: '물', symbol: 'H₂O', distractors: ['HO₂', 'H₂O₂', 'HO'] },
  { category: '물질 화학식', name: '수소', symbol: 'H₂', distractors: ['H', 'H₃', 'H₄'] },
  { category: '물질 화학식', name: '산소', symbol: 'O₂', distractors: ['O', 'O₃', 'O₄'] },
  { category: '물질 화학식', name: '마그네슘', symbol: 'Mg', distractors: ['Mg₂', 'Mn', 'M'] },
  { category: '물질 화학식', name: '산화마그네슘', symbol: 'MgO', distractors: ['Mg₂O', 'MgO₂', 'MnO'] },
  { category: '물질 화학식', name: '암모니아', symbol: 'NH₃', distractors: ['NH₂', 'NH₄', 'N₃H'] },
  { category: '물질 화학식', name: '산화구리', symbol: 'CuO', distractors: ['Cu₂O', 'CuO₂', 'CoO'] },
  { category: '물질 화학식', name: '염화마그네슘', symbol: 'MgCl₂', distractors: ['MgCl', 'Mg₂Cl', 'MnCl₂'] },
  { category: '물질 화학식', name: '구리', symbol: 'Cu', distractors: ['Cu₂', 'Co', 'C'] },
  { category: '물질 화학식', name: '염산', symbol: 'HCl', distractors: ['H₂Cl', 'HCl₂', 'HC'] },
  { category: '물질 화학식', name: '질소', symbol: 'N₂', distractors: ['N', 'N₃', 'N₄'] },
  { category: '물질 화학식', name: '메테인', symbol: 'CH₄', distractors: ['CH₃', 'C₄H', 'C₃H'] },
  { category: '물질 화학식', name: '이산화탄소', symbol: 'CO₂', distractors: ['CO', 'C₂O', 'CO₃'] },
  { category: '물질 화학식', name: '질산은', symbol: 'AgNO₃', distractors: ['Ag₂NO₃', 'AgNO₂', 'Ag(NO₃)₂'] },
  { category: '물질 화학식', name: '과산화수소', symbol: 'H₂O₂', distractors: ['H₂O', 'HO₂', 'HO'] },
  { category: '물질 화학식', name: '염화나트륨', symbol: 'NaCl', distractors: ['Na₂Cl', 'NaCl₂', 'NCl'] },
  { category: '물질 화학식', name: '염화 은', symbol: 'AgCl', distractors: ['AgCl₂', 'Ag₂Cl', 'AgC'] },
  { category: '물질 화학식', name: '질산 나트륨', symbol: 'NaNO₃', distractors: ['Na₂NO₃', 'NaNO₂', 'Na(NO₃)₂'] }
];

const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

// State for Test 1
let state = {
  quizState: 'playing', // playing, review, result
  questions: [],
  totalQuestions: 0, // Preserve original total
  currentIdx: 0,
  score: 0,
  wrongQuestions: [], // Track incorrect answers
  selectedOption: null,
  isChecking: false,
  isShaking: false,
  attempts: 0,
  showNextButton: false,
};

const icons = {
  Play: `<svg class="mr-2 w-5 h-5" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>`,
  Trophy: `<svg class="mr-2 w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>`,
  CheckCircle2: `<svg class="text-green-500 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>`,
  XCircle: `<svg class="text-red-500 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
  RotateCcw: `<svg class="mr-2 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>`,
  Search: `<svg class="mr-2 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`
};

function setState(updates) {
  state = { ...state, ...updates };
  // Log detailed progress
  if (state.quizState === 'playing') {
      window.logActivity(`Test 1 - 문제 ${state.currentIdx + 1}`);
  } else if (state.quizState === 'review') {
      window.logActivity(`Test 1 - 오답 복습 중 (${state.currentIdx + 1})`);
  }
  render();
}

export function generateQuestions() {
  let generated = [];
  lesson1Data.forEach((item) => {
    const distractors = item.distractors && item.distractors.length > 0 ? [...item.distractors] : [];
    generated.push({
      category: item.category,
      text: `'${item.name}' 물질을 화학식으로 바르게 표현한 것은?`,
      answer: item.symbol,
      options: shuffleArray([item.symbol, ...distractors.slice(0, 3)]),
    });
  });
  return shuffleArray(generated);
}

window.handleTest1OptionClick = (option) => {
  if (state.isChecking) return;
  const currentQ = state.questions[state.currentIdx];
  const isCorrect = option === currentQ.answer;
  const currentAttempts = state.attempts + 1;

  const updates = { 
    selectedOption: option, 
    isChecking: true,
    isShaking: !isCorrect,
    attempts: currentAttempts
  };

  // Only update score during 'playing' state
  if (state.quizState === 'playing') {
    if (isCorrect && currentAttempts === 1) {
      updates.score = state.score + 1;
    }
    if (!isCorrect && currentAttempts === 1) {
      updates.wrongQuestions = [...state.wrongQuestions, currentQ];
    }
  }

  setState(updates);

  if (isCorrect) {
    setTimeout(() => {
      setState({ isShaking: false });
      setTimeout(() => {
          let nextUpdates = { 
            selectedOption: null, 
            isChecking: false, 
            attempts: 0, 
            showNextButton: false 
          };
          
          if (state.currentIdx + 1 < state.questions.length) {
            nextUpdates.currentIdx = state.currentIdx + 1;
          } else {
            nextUpdates.quizState = 'result';
          }
          
          if (document.activeElement) document.activeElement.blur();
          setState(nextUpdates);
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
      if (document.activeElement) document.activeElement.blur();
      setState({ isShaking: false, isChecking: false, selectedOption: null });
    }, 400);
  }
};

window.handleTest1NextClick = () => {
    let nextUpdates = { selectedOption: null, isChecking: false, attempts: 0, showNextButton: false };
    if (state.currentIdx + 1 < state.questions.length) {
      nextUpdates.currentIdx = state.currentIdx + 1;
    } else {
      nextUpdates.quizState = 'result';
    }
    if (document.activeElement) document.activeElement.blur();
    setState(nextUpdates);
};

window.handleTest1ReviewWrong = () => {
    if (state.wrongQuestions.length === 0) return;
    
    // Reshuffle options for each wrong question for the review session
    const reviewQueue = state.wrongQuestions.map(q => ({
        ...q,
        options: shuffleArray([...q.options])
    }));

    setState({
        quizState: 'review',
        questions: shuffleArray(reviewQueue),
        currentIdx: 0,
        selectedOption: null,
        isChecking: false,
        isShaking: false,
        attempts: 0,
        showNextButton: false
    });
};

function render() {
  const container = document.getElementById('test1-content');
  if (!container || container.style.display === 'none') return;

  const shakeClass = state.isShaking ? 'animate-shake shadow-[0_0_20px_rgba(239,68,68,0.6)]' : '';
  let content = '';

  if ((state.quizState === 'playing' || state.quizState === 'review') && state.questions.length > 0) {
    const q = state.questions[state.currentIdx];
    const progress = ((state.currentIdx) / state.questions.length) * 100;
    const badgeText = state.quizState === 'review' ? '오답 복습 중' : 'Test 1: 화학식 테스트';

    let optionsHtml = q.options.map((opt) => {
      const isCorrectAnswer = opt === q.answer;
      const isSelected = state.selectedOption === opt;
      let btnClass = "w-full p-4 rounded-xl border-2 border-solid font-medium transition-all duration-200 ease-in-out relative flex items-center justify-between min-h-[4rem] bg-white ";
      let iconHtml = '';

      if (!state.isChecking) {
        btnClass += "test1-option-default text-gray-700";
      } else {
        if (isCorrectAnswer && (isSelected || state.attempts >= 2)) {
          btnClass += "border-green-500 bg-green-50 text-green-700";
          iconHtml = icons.CheckCircle2;
        } else if (isSelected && !isCorrectAnswer) {
          btnClass += "border-red-500 bg-red-50 text-red-700";
          iconHtml = icons.XCircle;
        } else {
          btnClass += "border-gray-200 bg-gray-50 text-gray-400 opacity-50";
        }
      }

      return `<button onclick="handleTest1OptionClick('${opt}')" ${state.isChecking ? 'disabled' : ''} class="${btnClass}">
        <span class="text-lg w-full text-left">${opt}</span>
        ${iconHtml ? `<div>${iconHtml}</div>` : ''}
      </button>`;
    }).join('');

    content = `
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <span class="text-sm font-semibold ${state.quizState === 'review' ? 'text-red-500 bg-red-50' : 'text-gray-500 bg-gray-100'} py-1 px-3 rounded-full">${badgeText}</span>
          <div class="flex space-x-2">
            <span class="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">${state.currentIdx + 1} / ${state.questions.length}</span>
          </div>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5 mb-8">
          <div class="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" style="width: ${progress}%"></div>
        </div>
        <div class="mb-8">
          <h2 class="text-xl font-bold text-gray-800 leading-tight">${q.text}</h2>
        </div>
        <div class="space-y-3">
          ${optionsHtml}
        </div>
        <div class="mt-6 h-[72px]"></div>
      </div>
    `;
  } else if (state.quizState === 'result') {
    const percentage = Math.round((state.score / state.totalQuestions) * 100);
    const hasWrong = state.wrongQuestions.length > 0;
    
    // perfect score (no retries recorded in score)
    if (state.score === state.totalQuestions && state.totalQuestions > 0 && state.quizState === 'result') {
      if (window.setTestCompleted) window.setTestCompleted('test1');
      window.logActivity('Test 1 완료 (만점!)', { key: 'test1', value: 'completed_perfect' });
    } else if (state.quizState === 'result') {
      window.logActivity('Test 1 완료', { key: 'test1', value: 'completed' });
    }
    
    content = `
      <div class="p-8 text-center">
        <div class="mb-8 text-yellow-500 inline-block">${icons.Trophy.replace('w-6 h-6', 'w-16 h-16')}</div>
        <h2 class="text-3xl font-bold text-gray-800 mb-6">테스트 결과</h2>
        <div class="bg-indigo-50 p-6 rounded-xl mb-6 border-2 border-indigo-200">
          <p class="text-indigo-700 font-bold text-2xl mb-2">${state.score} / ${state.totalQuestions}</p>
          <p class="text-indigo-600 font-semibold">정답률: ${percentage}%</p>
        </div>
        
        <div class="space-y-3">
            <button onclick="window.goHome()" class="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center transition-colors">
              홈으로 돌아가기
            </button>
            
            ${hasWrong ? `
                <button onclick="window.handleTest1ReviewWrong()" class="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center transition-colors shadow-md">
                    ${icons.Search} 오답만 다시 풀기
                </button>
            ` : ''}

            <button onclick="window.startTest1()" class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 px-6 rounded-xl flex items-center justify-center transition-colors">
              ${icons.RotateCcw} 처음부터 다시 풀기
            </button>
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="min-h-screen bg-transparent flex justify-center pb-12 font-sans text-gray-800 py-6" id="tw-root-test1">
      <div id="test1-container" class="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden transition-shadow mx-auto ${shakeClass}">
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
          <button onclick="handleTest1NextClick()" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 px-6 rounded-2xl flex items-center justify-center transition-all shadow-lg active:scale-95 text-lg">
            다음 문제로 <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      </div>` : ''}
    </div>
  `;
}

export function initTest1() {
  const questions = generateQuestions();
  setState({ 
    quizState: 'playing', 
    questions: questions, 
    totalQuestions: questions.length,
    currentIdx: 0, 
    score: 0, 
    wrongQuestions: [],
    selectedOption: null, 
    isChecking: false, 
    isShaking: false,
    attempts: 0,
    showNextButton: false
  });
}

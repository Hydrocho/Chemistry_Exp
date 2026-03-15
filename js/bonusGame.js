import { shuffleArray } from './utils.js';
import { showNameInputModal } from './nameInput.js';
import { showLeaderboard } from './leaderboard.js';

const bonusData = [
  { formula: 'CH₄ + 2O₂', question: '산소(O) 원자의 총 개수는?', answer: 4, options: [2, 4, 6, 8] },
  { formula: '2H₂ + O₂', question: '수소(H) 원자의 총 개수는?', answer: 4, options: [2, 4, 6, 8] },
  { formula: 'HCl + NH₃', question: '수소(H) 원자의 총 개수는?', answer: 4, options: [2, 3, 4, 5] },
  { formula: 'NaCl + AgNO₃', question: '산소(O) 원자의 총 개수는?', answer: 3, options: [1, 2, 3, 6] },
  { formula: '2HCl + Mg', question: '염소(Cl) 원자의 총 개수는?', answer: 2, options: [1, 2, 3, 4] },
  { formula: '2H₂O₂ + MnO₂', question: '산소(O) 원자의 총 개수는?', answer: 6, options: [2, 4, 6, 8] },
  { formula: 'CaCO₃ + 2HCl', question: '염소(Cl) 원자의 총 개수는?', answer: 2, options: [1, 2, 3, 4] },
  { formula: '2NaOH + H₂SO₄', question: '수소(H) 원자의 총 개수는?', answer: 4, options: [2, 4, 6, 8] },
  { formula: '3H₂ + N₂', question: '수소(H) 원자의 총 개수는?', answer: 6, options: [3, 5, 6, 9] },
  { formula: 'Fe₂O₃ + 3CO', question: '산소(O) 원자의 총 개수는?', answer: 6, options: [3, 4, 6, 9] },
  { formula: '2Al + 3Cl₂', question: '염소(Cl) 원자의 총 개수는?', answer: 6, options: [3, 5, 6, 9] },
  { formula: 'C₃H₈ + 5O₂', question: '산소(O) 원자의 총 개수는?', answer: 10, options: [5, 8, 10, 13] },
  { formula: '2KClO₃', question: '산소(O) 원자의 총 개수는?', answer: 6, options: [2, 3, 5, 6] },
  { formula: '2H₂S + 3O₂', question: '산소(O) 원자의 총 개수는?', answer: 6, options: [3, 4, 6, 9] },
  { formula: '2C₂H₆ + 7O₂', question: '수소(H) 원자의 총 개수는?', answer: 12, options: [6, 10, 12, 14] },
  { formula: '2Fe₂O₃ + 3C', question: '산소(O) 원자의 총 개수는?', answer: 6, options: [3, 4, 6, 9] },
  { formula: 'NaHCO₃ + CH₃COOH', question: '산소(O) 원자의 총 개수는?', answer: 5, options: [3, 4, 5, 6] },
  { formula: '2AgNO₃ + Cu', question: '질소(N) 원자의 총 개수는?', answer: 2, options: [1, 2, 3, 4] },
  { formula: '2Fe + 3H₂O', question: '수소(H) 원자의 총 개수는?', answer: 6, options: [2, 3, 6, 9] },
  { formula: '3O₂ + 2SO₂', question: '산소(O) 원자의 총 개수는?', answer: 10, options: [5, 7, 10, 12] }
];

let state = {
  quizState: 'idle', // idle, playing, failed, completed
  questions: [],
  currentIdx: 0,
  startTime: null,
  timerInterval: null,
  elapsedTime: 0,
  isChecking: false,
  selectedOption: null,
};

function setState(updates) {
  state = { ...state, ...updates };
  render();
}

export function initBonusGame() {
  const shuffled = shuffleArray([...bonusData]).map(q => ({
    ...q,
    options: shuffleArray([...q.options])
  }));
  
  setState({
    quizState: 'playing',
    questions: shuffled,
    currentIdx: 0,
    startTime: Date.now(),
    elapsedTime: 0,
    isChecking: false,
    selectedOption: null,
  });

  if (state.timerInterval) clearInterval(state.timerInterval);
  state.timerInterval = setInterval(() => {
    if (state.quizState === 'playing') {
      const now = Date.now();
      state.elapsedTime = (now - state.startTime) / 1000;
      
      // 타이머 요소만 실시간 업데이트 (전체 렌더링 방지)
      const timerEl = document.querySelector('.bonus-timer-value');
      if (timerEl) {
        timerEl.textContent = state.elapsedTime.toFixed(2) + 's';
      }
    }
  }, 50);
}

window.handleBonusOptionClick = (option) => {
  if (state.isChecking || state.quizState !== 'playing') return;
  
  const currentQ = state.questions[state.currentIdx];
  const isCorrect = option === currentQ.answer;

  setState({ 
    selectedOption: option, 
    isChecking: true 
  });

  if (isCorrect) {
    setTimeout(() => {
      if (state.currentIdx + 1 < state.questions.length) {
        setState({
          currentIdx: state.currentIdx + 1,
          isChecking: false,
          selectedOption: null
        });
      } else {
        clearInterval(state.timerInterval);
        setState({ quizState: 'completed' });
        
        // Show Name Input Modal for High Score
        setTimeout(() => {
          showNameInputModal('atomic-attack', state.elapsedTime, () => {
              showLeaderboard('atomic-attack');
          });
        }, 800);
      }
    }, 300);
  } else {
    clearInterval(state.timerInterval);
    setTimeout(() => {
      setState({ quizState: 'failed' });
    }, 300);
  }
};

function render() {
  const container = document.getElementById('bonus-game-content');
  if (!container || container.style.display === 'none') return;

  let content = '';
  
  if (state.quizState === 'playing') {
    const q = state.questions[state.currentIdx];
    const progress = (state.currentIdx / state.questions.length) * 100;

    content = `
      <div class="bonus-challenge-ui p-4 sm:p-10">
        <div class="flex justify-between items-center mb-4 sm:mb-6">
          <div class="timer-display font-mono text-2xl sm:text-3xl font-black text-indigo-600 bg-indigo-50 px-4 sm:px-5 py-1.5 sm:py-2 rounded-2xl border-2 border-indigo-100 shadow-sm">
            <span class="bonus-timer-value">${state.elapsedTime.toFixed(2)}s</span>
          </div>
          <div class="text-slate-400 font-black text-lg sm:text-xl uppercase tracking-tighter">
            ${state.currentIdx + 1} <span class="text-slate-200">/</span> ${state.questions.length}
          </div>
        </div>

        <div class="w-full bg-slate-100 rounded-full h-3 sm:h-4 mb-6 sm:mb-10 overflow-hidden border-2 border-white shadow-inner">
          <div class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.5)]" style="width: ${progress}%"></div>
        </div>

        <div class="challenge-card bg-slate-900 text-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 mb-4 sm:mb-8 border-4 border-slate-800 shadow-2xl relative overflow-hidden text-center">
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
            <div class="text-3xl sm:text-5xl font-black mb-4 tracking-tighter text-indigo-400 drop-shadow-[0_0_15px_rgba(129,140,248,0.4)]">${q.formula}</div>
            <p class="text-lg sm:text-xl font-bold text-slate-400">${q.question}</p>
        </div>

        <div class="grid grid-cols-2 gap-3 sm:gap-4">
          ${q.options.map(opt => `
            <button onclick="handleBonusOptionClick(${opt})" 
              class="bonus-btn group ${state.selectedOption === opt ? (opt === q.answer ? 'correct' : 'wrong') : ''}">
              <span class="text-2xl sm:text-4xl font-black transition-transform group-active:scale-90">${opt}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  } else if (state.quizState === 'failed') {
    content = `
      <div class="failed-screen p-10 text-center animate-fade-in">
        <div class="text-8xl mb-6">💥</div>
        <h2 class="text-4xl font-black text-slate-800 mb-4">FAILED!</h2>
        <p class="text-slate-500 text-xl mb-10 font-medium">단 하나의 실수도 용납되지 않습니다.<br>다시 도전하여 한계를 극복하세요!</p>
        <button onclick="window.startBonusGame()" class="w-full bg-slate-900 text-white font-black py-6 rounded-3xl text-2xl shadow-2xl hover:bg-black transition-all active:scale-95">
          RETRY CHALLENGE
        </button>
        <button onclick="window.showLeaderboard('atomic-attack')" class="w-full mt-4 bg-slate-100 text-slate-600 font-black py-4 rounded-2xl shadow-sm hover:bg-slate-200 transition-all active:scale-95">
          🏆 VIEW RANKING
        </button>
        <button onclick="window.goHome()" class="w-full mt-4 text-slate-400 font-bold py-2">GIVE UP</button>
      </div>
    `;
  } else if (state.quizState === 'completed') {
    content = `
      <div class="completed-screen p-10 text-center animate-scale-in">
        <div class="text-8xl mb-6 animate-bounce">🏆</div>
        <h2 class="text-4xl font-black text-indigo-600 mb-2">원자 갯수 맞추기 완주!</h2>
        <p class="text-slate-500 text-lg mb-8 font-medium">복잡한 화학식 20개를 오답 없이 정복했습니다.</p>
        
        <div class="bg-indigo-600 text-white p-10 rounded-[3rem] shadow-2xl mb-10 border-4 border-indigo-400">
          <div class="text-indigo-200 text-sm font-black uppercase tracking-widest mb-2">Your Record</div>
          <div class="text-7xl font-black font-mono">${state.elapsedTime.toFixed(2)}s</div>
        </div>

        <button onclick="window.startBonusGame()" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-6 rounded-3xl text-2xl shadow-xl transition-all mb-4">
          RE-CHALLENGE
        </button>
        <button onclick="window.showLeaderboard('atomic-attack')" class="w-full bg-white border-2 border-indigo-200 text-indigo-600 font-black py-6 rounded-3xl text-xl shadow-sm hover:bg-indigo-50 transition-all mb-4">
          🏆 VIEW RANKING
        </button>
        <button onclick="window.goHome()" class="w-full bg-white border-2 border-slate-200 text-slate-700 font-black py-6 rounded-3xl text-xl shadow-sm hover:bg-slate-50 transition-all">
          EXIT TO HOME
        </button>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="min-h-screen bg-slate-50 flex justify-center py-10 font-sans" id="bonus-game-root">
      <div class="max-w-2xl w-full bg-white rounded-[3rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] overflow-hidden border border-slate-100">
        ${content}
      </div>
    </div>
  `;
}

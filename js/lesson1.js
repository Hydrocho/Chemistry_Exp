import { shuffleArray as utilShuffle } from './utils.js';

const allData = [
  { category: '원소기호', name: '수소', symbol: 'H' },
  { category: '원소기호', name: '산소', symbol: 'O' },
  { category: '원소기호', name: '탄소', symbol: 'C' },
  { category: '원소기호', name: '질소', symbol: 'N' },
  { category: '원소기호', name: '구리', symbol: 'Cu' },
  { category: '원소기호', name: '염소', symbol: 'Cl' },
  { category: '원소기호', name: '마그네슘', symbol: 'Mg' },
  { category: '원소기호', name: '은', symbol: 'Ag' },
  { category: '원소기호', name: '나트륨', symbol: 'Na' },
  { category: '원소기호', name: '철', symbol: 'Fe' },

  { category: '모형 화학식', name: '원소(양이온)', symbol: 'B', isModel: true },
  { category: '모형 화학식', name: '원소(음이온)', symbol: 'W', isModel: true },
  { category: '모형 화학식', name: '음이온 2개', symbol: '2W', isModel: true },
  { category: '모형 화학식', name: '음이온 분자', symbol: 'W₂', isModel: true },
  { category: '모형 화학식', name: '화합물 BW', symbol: 'BW', isModel: true },
  { category: '모형 화학식', name: '화합물 B₂W', symbol: 'B₂W', isModel: true },
  { category: '모형 화학식', name: '화합물 B₂W₂', symbol: 'B₂W₂', isModel: true },
  { category: '모형 화학식', name: '화합물 B₃W', symbol: 'B₃W', isModel: true },
  { category: '모형 화학식', name: 'B₂W 분자 3개', symbol: '3B₂W', isModel: true },
  { category: '모형 화학식', name: 'B₃W 분자 2개', symbol: '2B₃W', isModel: true },

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

const getModelSvg = (type, className = "w-24 h-24") => {
  const rw = 22;
  const rb = 14;
  const sw = 3;

  const b2wInner = `<circle cx="50" cy="45" r="${rw}" fill="white" stroke="#1f2937" stroke-width="${sw}"/><circle cx="30" cy="62" r="${rb}" fill="#1f2937"/><circle cx="70" cy="62" r="${rb}" fill="#1f2937"/>`;
  const b3wInner = `<circle cx="50" cy="42" r="${rw}" fill="white" stroke="#1f2937" stroke-width="${sw}"/><circle cx="30" cy="57" r="${rb}" fill="#1f2937"/><circle cx="70" cy="57" r="${rb}" fill="#1f2937"/><circle cx="50" cy="68" r="${rb}" fill="#1f2937"/>`;

  let inner = "";
  switch (type) {
    case 'B': inner = `<circle cx="50" cy="50" r="${rb}" fill="#1f2937"/>`; break;
    case 'W': inner = `<circle cx="50" cy="50" r="${rw}" fill="white" stroke="#1f2937" stroke-width="${sw}"/>`; break;
    case '2W': inner = `<circle cx="25" cy="50" r="${rw}" fill="white" stroke="#1f2937" stroke-width="${sw}"/><circle cx="75" cy="50" r="${rw}" fill="white" stroke="#1f2937" stroke-width="${sw}"/>`; break;
    case 'W₂': inner = `<circle cx="38" cy="50" r="${rw}" fill="white" stroke="#1f2937" stroke-width="${sw}"/><circle cx="62" cy="50" r="${rw}" fill="white" stroke="#1f2937" stroke-width="${sw}"/>`; break;
    case 'BW': inner = `<circle cx="60" cy="50" r="${rw}" fill="white" stroke="#1f2937" stroke-width="${sw}"/><circle cx="34" cy="50" r="${rb}" fill="#1f2937"/>`; break;
    case 'B₂W': inner = b2wInner; break;
    case 'B₂W₂': inner = `<circle cx="38" cy="50" r="${rw}" fill="white" stroke="#1f2937" stroke-width="${sw}"/><circle cx="62" cy="50" r="${rw}" fill="white" stroke="#1f2937" stroke-width="${sw}"/><circle cx="20" cy="68" r="${rb}" fill="#1f2937"/><circle cx="80" cy="32" r="${rb}" fill="#1f2937"/>`; break;
    case 'B₃W': inner = b3wInner; break;
    case '3B₂W': inner = `<g transform="translate(50, 25) scale(0.45) translate(-50, -50)">${b2wInner}</g><g transform="translate(25, 75) scale(0.45) translate(-50, -50)">${b2wInner}</g><g transform="translate(75, 75) scale(0.45) translate(-50, -50)">${b2wInner}</g>`; break;
    case '2B₃W': inner = `<g transform="translate(30, 50) scale(0.55) translate(-50, -50)">${b3wInner}</g><g transform="translate(70, 50) scale(0.55) translate(-50, -50)">${b3wInner}</g>`; break;
    default: return "";
  }
  return `<svg viewBox="0 0 100 100" class="${className}">${inner}</svg>`;
};

// State
let state = {
  quizState: 'start', // start, study, playing, result
  questions: [],
  currentIdx: 0,
  wrongQuestions: [],
  selectedOption: null,
  isChecking: false,
  isRetryMode: false,
  startTime: null,
  endTime: null,
  isShaking: false,
  isWrongPaused: false,
  currentTime: Date.now(),
  retryCountdown: 3,
  currentMode: 'all',
  timerInterval: null,
  countdownInterval: null
};

// Lucide icon svgs (simplified manually to save dependencies)
const icons = {
  Play: `<svg class="mr-2 w-5 h-5" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>`,
  BookOpen: `<svg class="mr-2 w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>`,
  Trophy: `<svg class="mr-2 w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>`,
  ArrowLeft: `<svg class="text-gray-700 w-5 h-5 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>`,
  Clock: `<svg class="mr-1.5 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
  CheckCircle2: `<svg class="text-green-500 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>`,
  XCircle: `<svg class="text-red-500 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
  RotateCcw: `<svg class="mr-2 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>`
};

function setState(updates) {
  state = { ...state, ...updates };
  render();
}

function getFormattedTime() {
  if (!state.startTime) return "00:00:00";
  const elapsed = Math.max(0, (state.quizState === 'result' && state.endTime ? state.endTime : state.currentTime) - state.startTime);
  const m = Math.floor(elapsed / 60000).toString().padStart(2, '0');
  const s = Math.floor((elapsed % 60000) / 1000).toString().padStart(2, '0');
  const ms = Math.floor((elapsed % 1000) / 10).toString().padStart(2, '0');
  return `${m}:${s}:${ms}`;
}

function generateQuestions(mode = 'all') {
  let generated = [];
  let idCounter = 0;

  allData.forEach((item) => {
    if (item.category === '모형 화학식') {
      const sameCategoryItems = allData.filter((x) => x.isModel && x.symbol !== item.symbol);
      let distractors1 = shuffleArray(sameCategoryItems).slice(0, 3).map((x) => x.symbol);
      generated.push({
        id: `q_${idCounter++}`, category: item.category, text: `다음 모형의 화학식으로 옳은 것은?`,
        targetSvg: item.symbol, answer: item.symbol, options: shuffleArray([item.symbol, ...distractors1]),
        optionType: 'text', subType: 'modelToSym'
      });
      let distractors2 = shuffleArray(sameCategoryItems).slice(0, 3).map((x) => x.symbol);
      generated.push({
        id: `q_${idCounter++}`, category: item.category, text: `'${item.symbol}'의 화학식 모형으로 옳은 것은?`,
        answer: item.symbol, options: shuffleArray([item.symbol, ...distractors2]),
        optionType: 'svg', subType: 'symToModel'
      });
    } else if (item.category === '원소기호') {
      const sameCategoryItems = allData.filter((x) => x.category === item.category && x.name !== item.name);
      let distractors1 = shuffleArray(sameCategoryItems).slice(0, 3).map((x) => x.symbol);
      generated.push({
        id: `q_${idCounter++}`, category: item.category, text: `'${item.name}'의 원소 기호는?`,
        answer: item.symbol, options: shuffleArray([item.symbol, ...distractors1]),
        optionType: 'text', subType: 'nameToSym'
      });
      let distractors2 = shuffleArray(sameCategoryItems).slice(0, 3).map((x) => x.name);
      generated.push({
        id: `q_${idCounter++}`, category: item.category, text: `원소 기호 '${item.symbol}'의 이름은?`,
        answer: item.name, options: shuffleArray([item.name, ...distractors2]),
        optionType: 'text', subType: 'symToName'
      });
    } else if (item.category === '물질 화학식') {
      const sameCategoryItems = allData.filter((x) => x.category === item.category && x.name !== item.name);
      let distractors1 = item.distractors && item.distractors.length > 0 ? [...item.distractors] : shuffleArray(sameCategoryItems).slice(0, 3).map((x) => x.symbol);
      generated.push({
        id: `q_${idCounter++}`, category: item.category, text: `'${item.name}' 물질을 화학식으로 바르게 표현한 것은?`,
        answer: item.symbol, options: shuffleArray([item.symbol, ...distractors1.slice(0, 3)]),
        optionType: 'text', subType: 'nameToSym'
      });
      let distractors2 = shuffleArray(sameCategoryItems).slice(0, 3).map((x) => x.name);
      generated.push({
        id: `q_${idCounter++}`, category: item.category, text: `화학식 '${item.symbol}'의 물질 이름은?`,
        answer: item.name, options: shuffleArray([item.name, ...distractors2]),
        optionType: 'text', subType: 'symToName'
      });
    }
  });

  const elements = shuffleArray(generated.filter(q => q.category === '원소기호'));
  const models = shuffleArray(generated.filter(q => q.category === '모형 화학식'));
  const substancesSymToName = shuffleArray(generated.filter(q => q.category === '물질 화학식' && q.subType === 'symToName'));
  const substancesNameToSym = shuffleArray(generated.filter(q => q.category === '물질 화학식' && q.subType === 'nameToSym'));

  if (mode === 'stage1') return elements;
  if (mode === 'stage2') return models;
  if (mode === 'stage3') return [...substancesSymToName, ...substancesNameToSym];
  return [...elements, ...models, ...substancesSymToName, ...substancesNameToSym];
}

window.handleLesson1Start = (mode = 'all') => {
  if (state.timerInterval) clearInterval(state.timerInterval);
  const now = Date.now();
  setState({
    currentMode: mode,
    questions: generateQuestions(mode),
    currentIdx: 0,
    wrongQuestions: [],
    selectedOption: null,
    isChecking: false,
    isRetryMode: false,
    isWrongPaused: false,
    isShaking: false,
    startTime: now,
    currentTime: now,
    endTime: null,
    quizState: 'playing',
    timerInterval: setInterval(() => { state.currentTime = Date.now(); }, 10)
  });
};

window.handleLesson1Study = () => setState({ quizState: 'study' });
window.handleLesson1BackToStart = () => {
  if (state.timerInterval) clearInterval(state.timerInterval);
  setState({ quizState: 'start', selectedOption: null, isChecking: false, isWrongPaused: false })
};

window.handleLesson1OptionClick = (option) => {
  if (state.isChecking) return;
  setState({ selectedOption: option, isChecking: true });

  const currentQ = state.questions[state.currentIdx];
  const isCorrect = option === currentQ.answer;

  if (isCorrect) {
    setTimeout(() => {
      let updates = { selectedOption: null, isChecking: false, isWrongPaused: false };
      if (state.currentIdx + 1 < state.questions.length) {
        updates.currentIdx = state.currentIdx + 1;
      } else {
        if (state.wrongQuestions.length === 0) updates.endTime = Date.now();
        updates.quizState = 'result';
        if (state.timerInterval) clearInterval(state.timerInterval);
      }
      setState(updates);
      if (state.quizState === 'result') checkResultAutoPilot();
    }, 500);
  } else {
    setState({ wrongQuestions: [...state.wrongQuestions, currentQ], isShaking: true, isWrongPaused: true });
    setTimeout(() => {
      setState({ isShaking: false });
    }, 400);
  }
};

window.handleLesson1NextQuestion = () => {
  let updates = { selectedOption: null, isChecking: false, isWrongPaused: false };
  if (state.currentIdx + 1 < state.questions.length) {
    updates.currentIdx = state.currentIdx + 1;
  } else {
    updates.quizState = 'result';
    if (state.timerInterval) clearInterval(state.timerInterval);
  }
  setState(updates);
  if (updates.quizState === 'result') checkResultAutoPilot();
};

window.handleLesson1RetryWrong = () => {
  if (state.countdownInterval) clearInterval(state.countdownInterval);
  
  // Reshuffle options for each wrong question to prevent memorizing positions
  const reshuffledWrongQuestions = state.wrongQuestions.map(q => ({
    ...q,
    options: shuffleArray([...q.options])
  }));

  setState({
    questions: shuffleArray(reshuffledWrongQuestions),
    currentIdx: 0,
    wrongQuestions: [],
    selectedOption: null,
    isChecking: false,
    isRetryMode: true,
    isWrongPaused: false,
    isShaking: false,
    quizState: 'playing',
    timerInterval: setInterval(() => { state.currentTime = Date.now(); }, 10)
  });
};

function checkResultAutoPilot() {
  if (state.wrongQuestions.length > 0) {
    setState({ retryCountdown: 3 });
    const cInterval = setInterval(() => {
      if (state.retryCountdown <= 1) {
        clearInterval(cInterval);
        handleLesson1RetryWrong();
      } else {
        setState({ retryCountdown: state.retryCountdown - 1 });
      }
    }, 1000);
    setState({ countdownInterval: cInterval });
  }
}

function render() {
  const container = document.getElementById('lesson1-content');
  if (!container || container.style.display === 'none') {
    if (state.timerInterval) clearInterval(state.timerInterval);
    return;
  }

  const shakeClass = state.isShaking ? 'animate-shake shadow-[0_0_20px_rgba(239,68,68,0.6)]' : '';

  let content = '';

  if (state.quizState === 'start') {
    content = `
      <div class="p-8 text-center flex flex-col items-center">
        <div class="mb-6 p-4 bg-blue-50 rounded-lg text-sm text-gray-700 leading-relaxed text-left w-full">
          <p class="mb-2"><strong>학습 내용:</strong></p>
          <ul class="list-disc pl-5 space-y-1">
            <li>원소기호 (수소~철)</li>
            <li>모형과 화학식 (양이온/음이온 결합)</li>
            <li>여러 가지 물질의 화학식 (물~염화나트륨)</li>
          </ul>
          <p class="mt-4 text-xs text-red-500 font-semibold text-center">
            * 한국어 ↔ 기호 양방향으로 총 ${allData.length * 2}문제가 출제됩니다.
          </p>
        </div>
        
        <div class="space-y-4 w-full">
          <button onclick="handleLesson1Study()" class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center transition-colors text-lg shadow-sm">
            ${icons.BookOpen} 학습 내용 확인하기
          </button>
          <div class="flex flex-col space-y-2 mt-2">
            <button onclick="handleLesson1Start('stage1')" class="w-full bg-indigo-400 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center transition-colors shadow-sm">
              ${icons.Play} 1단계 연습하기 (원소기호)
            </button>
            <button onclick="handleLesson1Start('stage2')" class="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center transition-colors shadow-sm">
              ${icons.Play} 2단계 연습하기 (원소모형)
            </button>
            <button onclick="handleLesson1Start('stage3')" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center transition-colors shadow-sm">
              ${icons.Play} 3단계 연습하기 (물질 화학식)
            </button>
          </div>
          <div class="pt-2">
            <button onclick="handleLesson1Start('all')" class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center transition-colors text-xl shadow-lg border-b-4 border-red-800">
              ${icons.Trophy} 최종 테스트 시작하기
            </button>
          </div>
        </div>
      </div>
    `;
  } else if (state.quizState === 'study') {
    let list1 = allData.filter(d => d.category === '원소기호').map(item => `<div class="bg-gray-50 border border-gray-200 rounded-lg p-3 flex justify-between items-center shadow-sm"><span class="font-medium text-gray-700">${item.name}</span><span class="font-bold text-blue-600 text-lg">${item.symbol}</span></div>`).join('');
    let list2 = allData.filter(d => d.category === '모형 화학식').map(item => `<div class="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center shadow-sm"><div class="w-16 h-16 mr-4 bg-white rounded-lg border flex items-center justify-center shrink-0">${getModelSvg(item.symbol, 'w-12 h-12')}</div><div class="flex flex-col"><span class="font-bold text-green-600 text-lg">${item.symbol}</span><span class="text-sm text-gray-600">${item.name}</span></div></div>`).join('');
    let list3 = allData.filter(d => d.category === '물질 화학식').map(item => `<div class="bg-gray-50 border border-gray-200 rounded-lg p-3 flex flex-col justify-center items-center shadow-sm text-center"><span class="font-bold text-purple-600 text-lg mb-1">${item.symbol}</span><span class="text-sm font-medium text-gray-700">${item.name}</span></div>`).join('');

    content = `
      <div class="p-6 flex flex-col" style="height: 60vh;">
        <div class="flex items-center mb-4 pb-4 border-b shrink-0">
          <button onclick="handleLesson1BackToStart()" class="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
            ${icons.ArrowLeft}
          </button>
          <h2 class="text-xl font-bold text-gray-800 ml-3">핵심 내용 정리</h2>
        </div>
        <div class="overflow-y-auto flex-1 pr-2 space-y-8 custom-scrollbar">
          <section><h3 class="text-lg font-bold text-blue-600 mb-3 flex items-center"><span class="w-2 h-6 bg-blue-500 rounded mr-2"></span>1. 원소 기호</h3><div class="grid grid-cols-2 gap-3">${list1}</div></section>
          <section><h3 class="text-lg font-bold text-green-600 mb-3 flex items-center"><span class="w-2 h-6 bg-green-500 rounded mr-2"></span>2. 모형과 화학식</h3><div class="space-y-3">${list2}</div></section>
          <section><h3 class="text-lg font-bold text-purple-600 mb-3 flex items-center"><span class="w-2 h-6 bg-purple-500 rounded mr-2"></span>3. 물질 화학식</h3><div class="grid grid-cols-2 gap-3">${list3}</div></section>
        </div>
        <div class="mt-6 pt-4 border-t shrink-0">
          <button onclick="handleLesson1Start('all')" class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center transition-colors text-lg shadow-md">
            ${icons.Trophy} 학습 완료! 최종 테스트 시작하기
          </button>
        </div>
      </div>
    `;
  } else if (state.quizState === 'playing' && state.questions.length > 0) {
    const q = state.questions[state.currentIdx];
    const modeBadge = state.isRetryMode ? '틀린 문제 복습' : state.currentMode === 'stage1' ? '1단계 (원소기호)' : state.currentMode === 'stage2' ? '2단계 (원소모형)' : state.currentMode === 'stage3' ? '3단계 (화학식)' : '최종 테스트';
    const progress = ((state.currentIdx) / state.questions.length) * 100;

    let optionsHtml = q.options.map((opt, idx) => {
      const isCorrectAnswer = opt === q.answer;
      const isSelected = state.selectedOption === opt;
      let btnClass = "w-full p-4 rounded-xl border-2 border-solid font-medium transition-all duration-200 ease-in-out relative flex items-center min-h-[4rem] bg-white ";
      let iconHtml = '';

      if (!state.isChecking) {
        btnClass += "border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-700";
      } else {
        if (isCorrectAnswer) {
          btnClass += "border-green-500 bg-green-50 text-green-700";
          iconHtml = icons.CheckCircle2;
        } else if (isSelected && !isCorrectAnswer) {
          btnClass += "border-red-500 bg-red-50 text-red-700";
          iconHtml = icons.XCircle;
        } else {
          btnClass += "border-gray-200 bg-gray-50 text-gray-400 opacity-50";
        }
      }

      const inner = q.optionType === 'svg' ? getModelSvg(opt, 'w-16 h-16 my-1 mx-auto') : `<span class="text-lg w-full text-left">${opt}</span>`;
      const align = q.optionType === 'svg' ? 'justify-center' : 'justify-between';
      const iconPos = q.optionType === 'svg' ? 'absolute right-4' : '';

      return `<button onclick="handleLesson1OptionClick('${opt}')" ${state.isChecking ? 'disabled' : ''} class="${btnClass} ${align}">
        ${inner}
        ${iconHtml ? `<div class="${iconPos}">${iconHtml}</div>` : ''}
      </button>`;
    }).join('');

    content = `
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <span class="text-sm font-semibold text-gray-500 bg-gray-100 py-1 px-3 rounded-full">${modeBadge}</span>
          <div class="flex items-center space-x-3">
            <div id="l1-timer" class="flex items-center text-red-600 font-mono font-bold text-lg bg-red-50 px-3 py-1 rounded-lg border border-red-100 shadow-sm w-[105px] justify-center">
              ${icons.Clock} ${getFormattedTime()}
            </div>
            <div class="flex space-x-2">
              <span class="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">${state.currentIdx + 1} / ${state.questions.length}</span>
              <span class="text-sm font-bold text-red-600 bg-red-50 px-3 py-1 rounded-lg">오답: ${state.wrongQuestions.length}</span>
            </div>
          </div>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5 mb-8">
          <div class="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style="width: ${progress}%"></div>
        </div>
        <div class="mb-8">
          <span class="inline-block text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded mb-3">[${q.category}]</span>
          <h2 class="text-xl font-bold text-gray-800 leading-tight">${q.text}</h2>
          ${q.targetSvg ? `<div class="mt-6 flex justify-center py-6 bg-white rounded-xl border-2 border-dashed border-gray-200 shadow-sm">${getModelSvg(q.targetSvg, 'w-32 h-32')}</div>` : ''}
        </div>
        <div class="space-y-3">
          ${optionsHtml}
        </div>
        ${state.isWrongPaused ? `
          <div class="mt-8">
            <div class="mb-3 text-center text-red-500 font-bold text-sm">정답(초록색)을 확인하고 다음으로 넘어가세요!</div>
            <button onclick="handleLesson1NextQuestion()" class="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center text-lg">
              다음 문제로 ➔
            </button>
          </div>
        ` : ''}
      </div>
    `;
  } else if (state.quizState === 'result') {
    if (state.wrongQuestions.length === 0) {
      content = `
        <div class="p-8 text-center">
          <div class="mb-8 text-yellow-500 inline-block">${icons.Trophy.replace('w-6 h-6', 'w-16 h-16')}</div>
          <h2 class="text-3xl font-bold text-gray-800 mb-6">최종 마스터 달성!</h2>
          <div class="bg-yellow-50 p-6 rounded-xl mb-6 border-2 border-yellow-200">
            <p class="text-yellow-700 font-bold text-lg mb-2">완벽합니다! 모든 기호를 마스터했습니다!</p>
            ${state.endTime && state.startTime ? `
              <div class="flex items-center justify-center text-yellow-600 font-semibold bg-white py-2 px-4 rounded-lg inline-flex shadow-sm mt-3 border border-yellow-200">
                ${icons.Clock} 총 소요 시간: ${Math.floor((state.endTime - state.startTime) / 60000)}분 ${Math.floor(((state.endTime - state.startTime) % 60000) / 1000)}.${Math.floor(((state.endTime - state.startTime) % 1000) / 10).toString().padStart(2, '0')}초
              </div>
            ` : ''}
          </div>
          <button onclick="window.handleLesson1BackToStart()" class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 px-6 rounded-xl flex items-center justify-center transition-colors">
            ${icons.RotateCcw} 처음 화면으로 돌아가기
          </button>
        </div>
      `;
    } else {
      content = `
        <div class="p-8 text-center">
          <div class="mb-8">
            <h2 class="text-3xl font-bold text-gray-800 mb-2">학습 진행 중...</h2>
            <p class="text-gray-600 mt-2">이번 라운드 ${state.questions.length}문제 중 <br/><span class="text-blue-600 font-bold text-2xl">${state.questions.length - state.wrongQuestions.length}</span> 문제를 맞혔습니다.</p>
          </div>
          <div class="bg-red-50 p-4 rounded-xl mb-6">
            <p class="text-red-600 font-semibold mb-1">앗, 아직 헷갈리는 내용이 있어요!</p>
            <p class="text-sm text-red-500">${state.wrongQuestions.length}개의 문제를 틀렸습니다.</p>
            <p class="text-sm font-bold text-red-600 mt-2">모두 맞출 때까지 반복합니다!</p>
          </div>
          <button onclick="handleLesson1RetryWrong()" class="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center transition-colors text-lg shadow-md">
            ${icons.Play} 틀린 문제 다시 풀기 (${state.retryCountdown}초)
          </button>
        </div>
      `;
    }
  }

  container.innerHTML = `
    <div class="min-h-screen bg-transparent flex justify-center pb-12 font-sans text-gray-800 py-6" id="tw-root">
      <div id="l1-container" class="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden transition-shadow mx-auto ${shakeClass}">
        <!-- 헤더 -->
        <div class="bg-blue-600 p-6 text-center">
          <h1 class="text-2xl font-bold text-white tracking-wide">물질을 기호로 표현하는 방법</h1>
          <p class="text-blue-200 mt-2 text-sm">필수 암기 마스터 퀴즈</p>
        </div>
        ${content}
      </div>
    </div>
  `;
}

// Timer rendering optimization to prevent full DOM re-renders every 10ms
setInterval(() => {
  if (state.quizState === 'playing' && document.getElementById('l1-timer')) {
    const el = document.getElementById('l1-timer');
    el.innerHTML = `${icons.Clock} ${getFormattedTime()}`;
  }
}, 30);

export function initLesson1() {
  setState({ quizState: 'start', selectedOption: null, isChecking: false, isWrongPaused: false, isShaking: false });
}

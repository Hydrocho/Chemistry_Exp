import { state, updateState } from './state.js';
import { MOLECULES, REACTIONS } from './constants.js';
import { createMoleculeCard, showSuccessModal, renderAtomDisplay, shuffleArray } from './utils.js';
import { drag, initDragAndDrop, setOnDropComplete } from './dragdrop.js';

setOnDropComplete(checkCurrentPhaseCompletion);

export function startLesson2() {
    updateNav('nav-lesson2');
    // 홈 화면은 숨기고 레슨 2 콘텐츠 표시
    document.querySelectorAll('.step-content').forEach(s => s.classList.remove('active'));
    document.getElementById('home-view').classList.remove('active');
    document.getElementById('lesson2-content').style.display = 'block';

    goToStep(0); // Lesson 2의 첫 화면 (반응 선택)
}

export function goHome() {
    updateNav('nav-home');
    // 모든 레슨 콘텐츠 숨기기
    document.getElementById('lesson2-content').style.display = 'none';
    document.querySelectorAll('.step-content').forEach(s => s.classList.remove('active'));

    // 홈 화면 활성화
    document.getElementById('home-view').classList.add('active');
}

function updateNav(id) {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

export function selectReaction(key) {
    state.selectedReaction = REACTIONS[key];
    state.coeffsState = {};
    [...state.selectedReaction.reactants, ...state.selectedReaction.products].forEach(id => {
        state.coeffsState[id] = 1;
    });

    initStepUI();
    goToStep(1);
}

export function initStepUI() {
    document.querySelectorAll('.description-text').forEach(el => {
        el.innerText = state.selectedReaction.desc;
        el.onclick = openQuestModal; // 클릭 시 모달 열기
    });

    // 2단계 가이드 반응식 대입
    const step2Guide = document.getElementById('step2-guide');
    if (step2Guide) {
        step2Guide.querySelector('.side:nth-child(1)').innerText = state.selectedReaction.reactants.map(id => MOLECULES[id].name).join(' + ');
        step2Guide.querySelector('.side:nth-child(3)').innerText = state.selectedReaction.products.map(id => MOLECULES[id].name).join(' + ');
    }

    // 1단계 슬롯 초기화
    initSlots('step1', 'slot-name');
    // 2단계 슬롯 초기화
    initSlots('step2', 'slot-formula');
    // 3단계 인터랙티브 영역 초기화
    initStep3UI();
}

export function openQuestModal() {
    const modal = document.getElementById('quest-modal');
    const title = document.getElementById('quest-modal-title');
    const text = document.getElementById('quest-modal-text');

    title.innerText = state.selectedReaction.title;
    text.innerText = state.selectedReaction.desc;
    modal.classList.remove('hidden');
}

export function closeQuestModal() {
    document.getElementById('quest-modal').classList.add('hidden');
}

function initSlots(stepId, slotClass) {
    const reactantsArea = document.querySelector(`#${stepId} .side-container:nth-child(1) .drop-zone-v4`);
    const productsArea = document.querySelector(`#${stepId} .side-container:nth-child(3) .drop-zone-v4`);

    const createSlotGroup = (id) => {
        const group = document.createElement('div');
        group.className = 'zone-slot';

        const slot = document.createElement('div');
        slot.className = slotClass;
        slot.dataset.target = id;
        group.appendChild(slot);
        return group;
    };

    reactantsArea.innerHTML = '';
    state.selectedReaction.reactants.forEach((id, idx) => {
        reactantsArea.appendChild(createSlotGroup(id));
        if (idx < state.selectedReaction.reactants.length - 1) {
            const plus = document.createElement('span');
            plus.className = 'inner-plus';
            plus.innerText = '+';
            reactantsArea.appendChild(plus);
        }
    });

    productsArea.innerHTML = '';
    state.selectedReaction.products.forEach((id, idx) => {
        productsArea.appendChild(createSlotGroup(id));
        if (idx < state.selectedReaction.products.length - 1) {
            const plus = document.createElement('span');
            plus.className = 'inner-plus';
            plus.innerText = '+';
            productsArea.appendChild(plus);
        }
    });

    initDragAndDrop();
}

function initStep3UI() {
    const guide = document.querySelector('#step3 .name-equation-guide');
    guide.querySelector('.side:nth-child(1)').innerText = state.selectedReaction.reactants.map(id => MOLECULES[id].name).join(' + ');
    guide.querySelector('.side:nth-child(3)').innerText = state.selectedReaction.products.map(id => MOLECULES[id].name).join(' + ');

    const interactiveArea = document.querySelector('#step3 .equation-interactive-v2');
    interactiveArea.innerHTML = '';

    const createGroup = (ids) => {
        const group = document.createElement('div');
        group.className = 'term-group';
        ids.forEach((id, idx) => {
            const term = document.createElement('div');
            term.className = 'term';
            term.innerHTML = `
                <div class="coeff-stepper">
                    <button class="step-up" onclick="changeCoeff('${id}', 1)">▲</button>
                    <div class="coeff-value" id="val-${id}">1</div>
                    <button class="step-down" onclick="changeCoeff('${id}', -1)">▼</button>
                </div>
                <span class="formula">${MOLECULES[id].formula}</span>
            `;
            group.appendChild(term);
            if (idx < ids.length - 1) {
                const plus = document.createElement('span');
                plus.className = 'plus';
                plus.innerText = '+';
                group.appendChild(plus);
            }
        });
        return group;
    };

    interactiveArea.appendChild(createGroup(state.selectedReaction.reactants));
    const arrow = document.createElement('span');
    arrow.className = 'big-arrow';
    arrow.innerText = '→';
    interactiveArea.appendChild(arrow);
    interactiveArea.appendChild(createGroup(state.selectedReaction.products));
}

export function setupInventory() {
    let invId;
    if (state.currentPhase === 1) invId = 'integrated-inventory';
    else if (state.currentPhase === 2) invId = 'step2-inventory';
    else return;

    const container = document.getElementById(invId);
    if (!container) return;
    container.innerHTML = '';

    const mode = (state.currentPhase === 1) ? 'name' : 'interactive';

    // 선택된 반응의 물질들 + 모든 분자 풀에서 섞어서 노출 (방해 요소 추가)
    const allMoleculeIds = Object.keys(MOLECULES);
    const shuffledIds = shuffleArray([...allMoleculeIds]);

    shuffledIds.forEach(id => {
        container.appendChild(createMoleculeCard(id, mode, drag));
    });

    initDragAndDrop();
}

export function checkCurrentPhaseCompletion() {
    const stepPrefix = (state.currentPhase === 1) ? '#step1' : '#step2';
    const slotClass = (state.currentPhase === 1) ? '.slot-name' : '.slot-formula';

    // 반응물 영역과 생성물 영역을 구분하여 체크
    const reactantSlots = document.querySelectorAll(`${stepPrefix} .side-container:nth-child(1) ${slotClass}`);
    const productSlots = document.querySelectorAll(`${stepPrefix} .side-container:nth-child(3) ${slotClass}`);

    const getPlacedIds = (slots) =>
        [...slots].map(s => s.firstElementChild?.dataset.moleculeId).filter(id => id);

    const placedReactants = getPlacedIds(reactantSlots);
    const placedProducts = getPlacedIds(productSlots);

    const requiredReactants = [...state.selectedReaction.reactants];
    const requiredProducts = [...state.selectedReaction.products];

    // 개수와 구성 물질이 모두 일치하는지 확인 (순서 상관 없음)
    const isMatch = (placed, required) => {
        if (placed.length !== required.length) return false;
        return [...placed].sort().join(',') === [...required].sort().join(',');
    };

    if (isMatch(placedReactants, requiredReactants) && isMatch(placedProducts, requiredProducts)) {
        showSuccessModal(state.currentPhase);
    }
}

export function handleModalAction() {
    document.getElementById('success-modal').classList.add('hidden');
    if (state.currentPhase === 1) goToStep(2);
    else if (state.currentPhase === 2) goToStep(3);
}

export function goToStep(step) {
    state.currentPhase = step;

    document.querySelectorAll('.step-content').forEach(s => s.classList.remove('active'));

    let targetId;
    if (step === 0) targetId = 'step-selection';
    else if (step === 1) targetId = 'step1';
    else if (step === 2) targetId = 'step2';
    else if (step === 3) targetId = 'step3';

    const target = document.getElementById(targetId);
    if (target) {
        target.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // PPT 컨트롤(리셋 버튼)은 레슨 1단계 이상에서만 표시
    const ppt = document.querySelector('.ppt-controls');
    if (ppt) ppt.style.display = (step > 0) ? 'block' : 'none';

    // 표시 모드 라디오 버튼 동기화
    document.querySelectorAll(`input[name^="view-mode"]`).forEach(input => {
        input.checked = (input.value === state.currentViewMode);
    });

    setupInventory();
    if (step === 3) updateBalance();
}

export function toggleViewMode(mode) {
    state.currentViewMode = mode;
    document.body.classList.remove('view-mode-formula', 'view-mode-model');
    document.body.classList.add(`view-mode-${mode}`);
    if (state.currentPhase === 3) updateBalance();
}

export function changeCoeff(id, delta) {
    const newVal = state.coeffsState[id] + delta;
    if (newVal >= 1 && newVal <= 9) {
        state.coeffsState[id] = newVal;
        document.getElementById(`val-${id}`).innerText = newVal;
        updateBalance();
    }
}

export function updateBalance() {
    const atoms = {};
    state.selectedReaction.balanceAtoms.forEach(a => atoms[a] = { r: 0, p: 0 });

    state.selectedReaction.reactants.forEach(id => {
        const count = state.coeffsState[id];
        const molAtoms = MOLECULES[id].atoms;
        for (const [a, c] of Object.entries(molAtoms)) {
            if (atoms[a]) atoms[a].r += count * c;
        }
    });

    state.selectedReaction.products.forEach(id => {
        const count = state.coeffsState[id];
        const molAtoms = MOLECULES[id].atoms;
        for (const [a, c] of Object.entries(molAtoms)) {
            if (atoms[a]) atoms[a].p += count * c;
        }
    });

    let allMatched = true;
    for (const item of Object.values(atoms)) {
        if (item.r !== item.p) allMatched = false;
    }

    renderAtomDisplay('reactant', state.selectedReaction.reactants, state.coeffsState, atoms, state.currentViewMode);
    renderAtomDisplay('product', state.selectedReaction.products, state.coeffsState, atoms, state.currentViewMode);

    const badge = document.getElementById('balance-badge');
    const center = document.querySelector('.balance-status-center');
    if (allMatched) {
        badge.innerText = '일치';
        badge.className = 'status-badge match';
        center.classList.add('success');
    } else {
        badge.innerText = '불일치';
        badge.className = 'status-badge mismatch';
        center.classList.remove('success');
    }

    document.getElementById('success-celebration').classList.toggle('hidden', !allMatched);
}

export function resetGame() {
    // 상태 초기화 후 홈으로 이동
    state.selectedReaction = null;
    state.coeffsState = {};
    state.currentPhase = 0;
    document.getElementById('lesson2-content').style.display = 'none';
    goHome();
}

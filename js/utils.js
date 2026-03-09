import { MOLECULES } from './constants.js';

export function createMoleculeCard(id, mode, dragHandler) {
    const m = MOLECULES[id];
    const card = document.createElement('div');
    card.className = 'molecule-card';
    card.draggable = true;
    card.id = `card-${id}-${Math.random().toString(36).substr(2, 5)}`;
    card.dataset.moleculeId = id;
    card.addEventListener('dragstart', dragHandler);

    if (mode === 'name') {
        card.classList.add('name-only');
        card.innerHTML = `<span class="card-name">${m.name}</span>`;
    } else {
        card.innerHTML = `
            <div class="formula">${m.formula}</div>
            <div class="molecule-svg">${m.svg}</div>
        `;
    }
    return card;
}

export function showSuccessModal(currentPhase) {
    const title = document.getElementById('modal-title');
    const text = document.getElementById('modal-text');
    const btn = document.getElementById('modal-btn');

    if (currentPhase === 1) {
        title.innerText = '1단계 성공!';
        text.innerHTML = '반응물과 생성물의 이름을 완벽하게 배치했습니다.<br>이제 화학식으로 나타내 볼까요?';
        btn.innerText = '2단계 시작하기 →';
    } else if (currentPhase === 2) {
        title.innerText = '2단계 성공!';
        text.innerHTML = '모든 물질을 화학식(모형)으로 정확히 연결했습니다.<br>마지막 3단계: 계수 맞추기로 이동합니다.';
        btn.innerText = '3단계 시작하기 →';
    }
    document.getElementById('success-modal').classList.remove('hidden');
}

export function renderAtomDisplay(side, moleculeIds, coeffs, atomData, currentViewMode) {
    const symbolArea = document.getElementById(`${side}-symbols`);
    const countArea = document.getElementById(`${side}-counts`);

    let symbolOutput = '';
    moleculeIds.forEach((id, idx) => {
        const count = coeffs[id];
        const singleSymbol = (currentViewMode === 'model') ? MOLECULES[id].svg : MOLECULES[id].symbolStr;
        for (let i = 0; i < count; i++) {
            symbolOutput += `<span class="symbol-unit">${singleSymbol}</span> `;
        }
        if (idx < moleculeIds.length - 1) symbolOutput += ' + ';
    });
    symbolArea.innerHTML = symbolOutput;

    let countOutput = '';
    for (const [atom, data] of Object.entries(atomData)) {
        const val = (side === 'reactant') ? data.r : data.p;
        const otherVal = (side === 'reactant') ? data.p : data.r;
        const isMatch = val === otherVal;
        countOutput += `<div class="count-item" style="color: ${isMatch ? '#22c55e' : '#ef4444'}">
            ${atom} : ${val} 개
        </div>`;
    }
    countArea.innerHTML = countOutput;
}

export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

import { state } from './state.js';

export function allowDrop(ev) {
    ev.preventDefault();
}

export function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    // 폴리필에서 드래그 이벤트로 인식하도록 추가
    ev.dataTransfer.effectAllowed = "move";
}

export function dragEnter(ev) {
    ev.preventDefault();
    const dropSlot = ev.target.closest('.slot-name, .slot-formula');
    if (dropSlot) {
        dropSlot.classList.add('drag-over');
    }
}

export function dragLeave(ev) {
    const dropSlot = ev.target.closest('.slot-name, .slot-formula');
    if (dropSlot) {
        dropSlot.classList.remove('drag-over');
    }
}

/** 
 * drop handler needs a callback to check completion which will be provided by game.js 
 */
let onDropComplete = () => { };

export function setOnDropComplete(cb) {
    onDropComplete = cb;
}

export function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const draggedElement = document.getElementById(data);
    const dropSlot = ev.target.closest('.slot-name, .slot-formula, .card-inventory');

    if (!dropSlot || !draggedElement) return;

    dropSlot.classList.remove('drag-over');

    if (dropSlot.classList.contains('card-inventory')) {
        dropSlot.appendChild(draggedElement);
        onDropComplete();
        return;
    }

    if (dropSlot.children.length === 0) {
        const isCorrectType = (state.currentPhase === 1 && dropSlot.classList.contains('slot-name')) ||
            (state.currentPhase === 2 && dropSlot.classList.contains('slot-formula'));

        if (isCorrectType) {
            dropSlot.appendChild(draggedElement);
        }
    }

    onDropComplete();
}

export function initDragAndDrop() {
    document.querySelectorAll('.slot-name, .slot-formula, .card-inventory').forEach(el => {
        el.removeEventListener('dragover', allowDrop);
        el.removeEventListener('drop', drop);
        el.removeEventListener('dragenter', dragEnter);
        el.removeEventListener('dragleave', dragLeave);

        el.addEventListener('dragover', allowDrop);
        el.addEventListener('drop', drop);
        el.addEventListener('dragenter', dragEnter);
        el.addEventListener('dragleave', dragLeave);
    });
}

// --- Custom Touch Drag Implementation for Mobile ---
let activeTouchCard = null;
let touchClone = null;
let currentDropSlot = null;

document.addEventListener('touchstart', (ev) => {
    if (ev.touches.length > 1) return;
    const card = ev.target.closest('.molecule-card');
    if (!card) return;

    activeTouchCard = card;

    // Create visual clone
    touchClone = card.cloneNode(true);
    const rect = card.getBoundingClientRect();

    Object.assign(touchClone.style, {
        position: 'fixed',
        left: rect.left + 'px',
        top: rect.top + 'px',
        width: rect.width + 'px',
        height: rect.height + 'px',
        opacity: '0.8',
        zIndex: '9999',
        pointerEvents: 'none',
        margin: 0,
        transform: 'scale(1.05)',
        transition: 'none',
        boxShadow: '0 12px 24px rgba(0,0,0,0.2)'
    });

    document.body.appendChild(touchClone);
    activeTouchCard.style.opacity = '0.3';
    currentDropSlot = null;
}, { passive: false });

document.addEventListener('touchmove', (ev) => {
    if (!activeTouchCard || !touchClone) return;
    ev.preventDefault(); // Prevent scrolling while dragging

    const touch = ev.touches[0];
    touchClone.style.left = (touch.clientX - touchClone.offsetWidth / 2) + 'px';
    touchClone.style.top = (touch.clientY - touchClone.offsetHeight / 2) + 'px';

    const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
    document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));

    currentDropSlot = null;
    if (targetElement) {
        const dropSlot = targetElement.closest('.slot-name, .slot-formula, .card-inventory');
        if (dropSlot) {
            dropSlot.classList.add('drag-over');
            currentDropSlot = dropSlot;
        }
    }
}, { passive: false });

document.addEventListener('touchend', (ev) => {
    if (!activeTouchCard || !touchClone) return;

    document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));

    if (currentDropSlot) {
        if (currentDropSlot.classList.contains('card-inventory')) {
            currentDropSlot.appendChild(activeTouchCard);
            onDropComplete();
        } else if (currentDropSlot.children.length === 0) {
            const isCorrectType = (state.currentPhase === 1 && currentDropSlot.classList.contains('slot-name')) ||
                (state.currentPhase === 2 && currentDropSlot.classList.contains('slot-formula'));

            if (isCorrectType) {
                currentDropSlot.appendChild(activeTouchCard);
                onDropComplete();
            }
        }
    }

    touchClone.remove();
    touchClone = null;
    activeTouchCard.style.opacity = '1';
    activeTouchCard = null;
    currentDropSlot = null;
});

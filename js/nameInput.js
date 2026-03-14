
import { saveScore } from './supabaseClient.js';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const EMOJIS = ['😄', '🧪', '🔥', '🏆', '😎', '💡', '🧪', '⚗️'];

let state = {
    nameIndices: [0, 0, 0],
    selectedEmojiIndex: 0,
    callback: null,
    gameData: null
};

export function showNameInputModal(gameId, score, callback) {
    state.gameData = { gameId, score };
    state.callback = callback;
    state.nameIndices = [0, 0, 0];
    state.selectedEmojiIndex = 0;

    renderModal();
    document.getElementById('name-input-modal').classList.remove('hidden');
}

function renderModal() {
    const container = document.getElementById('name-input-modal');
    if (!container) return;

    container.innerHTML = `
        <div class="name-input-content">
            <h2 class="retro-title">Enter Your Record</h2>
            <div class="retro-score">SCORE: ${formatTime(state.gameData.score)}</div>
            
            <div class="retro-entry-container">
                <div class="letter-slots">
                    ${state.nameIndices.map((idx, i) => `
                        <div class="letter-slot">
                            <button class="retro-btn up" onclick="window.changeLetter(${i}, -1)">▲</button>
                            <div class="letter-box">${ALPHABET[idx]}</div>
                            <button class="retro-btn down" onclick="window.changeLetter(${i}, 1)">▼</button>
                        </div>
                    `).join('')}
                </div>
                
                <div class="emoji-selection">
                    <p class="section-label">Select Your Sentiment</p>
                    <div class="emoji-grid">
                        ${EMOJIS.map((emoji, i) => `
                            <button class="emoji-btn ${state.selectedEmojiIndex === i ? 'selected' : ''}" 
                                onclick="window.selectEmoji(${i})">${emoji}</button>
                        `).join('')}
                    </div>
                </div>
            </div>

            <div class="modal-actions">
                <button class="submit-btn" onclick="window.submitScore()">REGISTER RECORD</button>
            </div>
        </div>
    `;
}

window.changeLetter = function(slotIndex, delta) {
    state.nameIndices[slotIndex] = (state.nameIndices[slotIndex] + delta + ALPHABET.length) % ALPHABET.length;
    renderModal();
};

window.selectEmoji = function(index) {
    state.selectedEmojiIndex = index;
    renderModal();
};

window.submitScore = async function() {
    const playerName = state.nameIndices.map(idx => ALPHABET[idx]).join('');
    const sentiment = EMOJIS[state.selectedEmojiIndex];
    
    // UI Feedback: Loading state
    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.innerText = 'SAVING...';
    submitBtn.disabled = true;

    const result = await saveScore(state.gameData.gameId, playerName, sentiment, state.gameData.score);
    
    document.getElementById('name-input-modal').classList.add('hidden');
    
    if (state.callback) {
        state.callback({ playerName, sentiment, score: state.gameData.score });
    }
};

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const cents = Math.floor((seconds * 100) % 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${cents.toString().padStart(2, '0')}`;
}

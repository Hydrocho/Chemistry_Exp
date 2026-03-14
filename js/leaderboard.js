import { getTopScores } from './supabaseClient.js';

const CACHE_DURATION = 30 * 1000; // 30 seconds
let cache = {
    // period: { timestamp: 123, data: [...] }
};

export async function showLeaderboard(gameId) {
    const container = document.getElementById('leaderboard-modal');
    container.classList.remove('hidden');
    
    renderLeaderboard(gameId, 'daily'); // Default to daily
}
export async function renderLeaderboard(gameId, period) {
    const listContainer = document.getElementById('leaderboard-list');
    listContainer.innerHTML = '<div class="loading">Loading scores...</div>';

    const now = Date.now();
    const cacheKey = `${gameId}-${period}`;

    // Check cache
    if (cache[cacheKey] && (now - cache[cacheKey].timestamp < CACHE_DURATION)) {
        renderList(cache[cacheKey].data, listContainer);
        return;
    }
    
    // Update tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.period === period);
    });

    const scores = await getTopScores(gameId, 10, period);
    
    // Save to cache
    cache[cacheKey] = {
        timestamp: now,
        data: scores
    };

    renderList(scores, listContainer);
}

function renderList(scores, listContainer) {
    if (scores.length === 0) {
        listContainer.innerHTML = '<div class="no-scores">No records yet. Be the first!</div>';
        return;
    }

    listContainer.innerHTML = scores.map((s, i) => `
        <div class="leaderboard-item rank-${i + 1}">
            <div class="rank">${i + 1}</div>
            <div class="player-info">
                <span class="sentiment">${s.sentiment || '😊'}</span>
                <span class="name">${s.player_name}</span>
            </div>
            <div class="score">${formatTime(s.score)}</div>
        </div>
    `).join('');
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const cents = Math.floor((seconds * 100) % 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${cents.toString().padStart(2, '0')}`;
}

window.switchLeaderboardTab = function(period) {
    // We assume gameId is stored or passed elsewhere, for now we assume 'memory-match'
    renderLeaderboard('memory-match', period);
};

window.closeLeaderboard = function() {
    document.getElementById('leaderboard-modal').classList.add('hidden');
};

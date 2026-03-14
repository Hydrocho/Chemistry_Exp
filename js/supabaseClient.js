
// Supabase configuration
// IMPORTANT: Replace these with your actual Supabase project credentials
const SUPABASE_URL = 'https://tnyxdqdljzkvzdaqiugo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRueXhkcWRsanprdnpkYXFpdWdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MzkxMDksImV4cCI6MjA4OTAxNTEwOX0.kZbTPCEooY5lapDItMFcNu0sCGcdPawqlgfssxtlVvo'; // User needs to provide this

let supabase = null;

export function getSupabase() {
    if (!supabase && typeof supabase !== 'undefined' && window.supabase) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    return supabase;
}

export async function saveScore(gameId, playerName, sentiment, score) {
    const client = getSupabase();
    if (!client) {
        console.error('Supabase client not initialized');
        return null;
    }

    const { data, error } = await client
        .from('high_scores')
        .insert([
            { game_id: gameId, player_name: playerName, sentiment: sentiment, score: score }
        ]);

    if (error) {
        console.error('Error saving score:', error);
        return null;
    }
    return data;
}

export async function getTopScores(gameId, limit = 10, period = 'all') {
    const client = getSupabase();
    if (!client) return [];

    let query = client
        .from('high_scores')
        .select('player_name, sentiment, score') // Only fetch what we need
        .eq('game_id', gameId)
        .order('score', { ascending: true }) 
        .limit(limit);

    if (period === 'daily') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        query = query.gte('created_at', today.toISOString());
    } else if (period === 'monthly') {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        query = query.gte('created_at', lastMonth.toISOString());
    }

    const { data, error } = await query;
    if (error) {
        console.error('Error fetching scores:', error);
        return [];
    }
    return data;
}

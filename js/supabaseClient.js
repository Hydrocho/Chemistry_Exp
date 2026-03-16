
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

export async function updateStudentActivity(studentId, name, sentiment, activity, testStatusObj = {}) {
    const client = getSupabase();
    if (!client) return null;

    // Use upsert to create or update student record based on student_id
    // Note: This requires student_id to be a unique or primary key for upsert to work as intended, 
    // or we can just use the name if we assume students have unique names per class.
    // Better to use student_id as the unique identifier.
    
    const updateData = {
        student_id: studentId,
        student_name: name,
        sentiment: sentiment,
        current_activity: activity,
        updated_at: new Date().toISOString()
    };

    // Merge test statuses (test1_status, test2_status, etc.)
    Object.keys(testStatusObj).forEach(key => {
        updateData[`${key}_status`] = testStatusObj[key];
    });

    const { data, error } = await client
        .from('student_monitoring')
        .upsert(updateData, { onConflict: 'student_id' });

    if (error) {
        console.error('Error updating student activity:', error);
        return null;
    }
    return data;
}

export function subscribeToMonitoring(classPrefix, callback) {
    const client = getSupabase();
    if (!client) return null;

    // Filter by class_prefix if provided
    return client
        .channel('public:student_monitoring')
        .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: 'student_monitoring' 
        }, (payload) => {
            // Manual filtering for the starting digits of student_id
            if (!classPrefix || (payload.new && payload.new.student_id.startsWith(classPrefix))) {
                callback(payload);
            }
        })
        .subscribe();
}

export async function getAllStudentsInClass(classPrefix) {
    const client = getSupabase();
    if (!client) return [];

    let query = client
        .from('student_monitoring')
        .select('*');
    
    if (classPrefix) {
        query = query.like('student_id', `${classPrefix}%`);
    }

    const { data, error } = await query;
    if (error) {
        console.error('Error fetching students:', error);
        return [];
    }
    return data;
}

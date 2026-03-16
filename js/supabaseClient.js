
// Supabase configuration
// IMPORTANT: Replace these with your actual Supabase project credentials
const SUPABASE_URL = 'https://mmoosithvmqceqhbfxwl.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_CnZKWGAY_7PRPMtu0CQvEQ_YS0T-ced';

let supabase = null;

export function getSupabase() {
    if (!supabase && window.supabase) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    return supabase;
}

/**
 * PIN 번호를 HMAC-SHA256 방식으로 해싱합니다 (Salt 추가).
 * 웹 표준 Crypto API를 사용하므로 브라우저에서 직접 실행 가능합니다.
 */
async function hashPin(pin, salt) {
    if (!crypto.subtle) {
        throw new Error("보안 컨텍스트(HTTPS)가 아니어서 암호화 기능을 사용할 수 없습니다.");
    }
    const encoder = new TextEncoder();
    const data = encoder.encode(pin + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyStudent(schoolId, pin) {
    const client = getSupabase();
    if (!client) return { success: false, message: '서버 연결 실패' };

    try {
        // 1. 학번으로 학생 정보 조회
        const { data: student, error: fetchError } = await client
            .from('students')
            .select('id, name, pin')
            .eq('school_id', schoolId)
            .maybeSingle();

        if (fetchError || !student) {
            return { success: false, message: '일치하는 학생 정보를 찾을 수 없습니다.' };
        }

        // 2. PIN 검증
        const hashedPin = await hashPin(pin, student.id);
        if (student.pin !== hashedPin) {
            return { success: false, message: '비밀번호가 일치하지 않습니다.' };
        }

        return { 
            success: true, 
            data: {
                student_id: schoolId,
                name: student.name,
                uuid: student.id
            }
        };
    } catch (err) {
        console.error('Login verification error:', err);
        return { success: false, message: '인증 과정에서 오류가 발생했습니다.' };
    }
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

// 쿠폰 발급 상태를 저장하고 실제 쿠폰을 지급하는 함수 (중복 발급 방지)
export async function issueCoupon(schoolId, studentUuid) {
    const client = getSupabase();
    if (!client) return false;

    try {
        // 1. 이미 발급되었는지 확인 (DB 레벨에서 이중 체크)
        const { data: monitoring, error: checkError } = await client
            .from('student_monitoring')
            .select('coupon_issued')
            .eq('student_id', schoolId)
            .single();

        if (checkError || monitoring.coupon_issued) {
            console.log('Coupon already issued for:', schoolId);
            return false;
        }

        // 2. 실제 아바타 랜덤 쿠폰 지급 (coupons 테이블에 삽입)
        const { error: couponError } = await client
            .from('coupons')
            .insert({
                student_id: studentUuid,
                type: 'AVATAR_RANDOM',
                status: 'UNUSED',
                source: '화학 실험실 완료 보상',
                gacha_mode: 'RANDOM'
            });

        if (couponError) throw couponError;

        // 3. 모니터링 테이블 상태 업데이트
        const { error: updateError } = await client
            .from('student_monitoring')
            .update({ coupon_issued: true })
            .eq('student_id', schoolId);

        if (updateError) throw updateError;

        console.log('Successfully issued avatar coupon to:', schoolId);
        return true;
    } catch (err) {
        console.error('Coupon issue error:', err);
        return false;
    }
}

// 선생님의 모니터링 상태를 설정/해제 (수업 중 여부 확인용)
export async function setClassMonitoringStatus(classId, isActive) {
    const client = getSupabase();
    if (!client) return;

    try {
        const { error } = await client
            .from('class_sessions')
            .upsert({ 
                class_id: classId, 
                is_active: isActive, 
                last_ping: new Date().toISOString() 
            }, { onConflict: 'class_id' });
        
        if (error) throw error;
    } catch (err) {
        console.error('Error setting monitoring status:', err);
    }
}

// 선생님이 현재 해당 학급을 모니터링 중인지 확인
export async function isTeacherMonitoring(classId) {
    const client = getSupabase();
    if (!client) return false;

    try {
        const { data, error } = await client
            .from('class_sessions')
            .select('is_active, last_ping')
            .eq('class_id', classId)
            .maybeSingle();

        if (error || !data) return false;

        // 5분 이내의 핑이 있고 active 상태인 경우만 참으로 인정 (브라우저 비정상 종료 대비)
        const lastPing = new Date(data.last_ping);
        const diffMin = (new Date() - lastPing) / (1000 * 60);
        
        return data.is_active && diffMin < 5;
    } catch (err) {
        console.error('Error checking monitoring status:', err);
        return false;
    }
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

export async function getStudentData(studentId) {
    const client = getSupabase();
    if (!client) return null;

    const { data, error } = await client
        .from('student_monitoring')
        .select('*')
        .eq('student_id', studentId)
        .single();

    if (error) {
        if (error.code !== 'PGRST116') { // PGRST116 is 'not found'
            console.error('Error fetching student data:', error);
        }
        return null;
    }
    return data;
}

export async function deleteStudent(studentId) {
    const client = getSupabase();
    if (!client) return false;

    const { error } = await client
        .from('student_monitoring')
        .delete()
        .eq('student_id', studentId);

    if (error) {
        console.error('Error deleting student:', error);
        return false;
    }
    return true;
}

export async function deleteAllStudentsInClass(classPrefix) {
    const client = getSupabase();
    if (!client) return false;

    let query = client
        .from('student_monitoring')
        .delete();
    
    if (classPrefix) {
        query = query.like('student_id', `${classPrefix}%`);
    } else {
        // If no prefix, it would delete EVERYTHING. 
        // Let's make it explicit for safety or just return.
        // For now, let's allow it if explicitly called with empty string.
        query = query.neq('student_id', ''); 
    }

    const { error } = await query;

    if (error) {
        console.error('Error deleting class data:', error);
        return false;
    }
    return true;
}

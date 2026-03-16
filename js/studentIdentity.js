import { updateStudentActivity, getStudentData, verifyStudent } from './supabaseClient.js';

let currentTab = 'member'; // 'member' or 'guest'

export async function initStudentIdentity() {
    const studentId = localStorage.getItem('student_id');
    const studentName = localStorage.getItem('student_name');

    if (!studentId || !studentName) {
        showIdentityModal();
    } else {
        await updateStudentActivity(studentId, studentName, '', '접속함 (홈)');
        await syncStudentProgress(studentId);
    }
}

async function syncStudentProgress(studentId) {
    const existingData = await getStudentData(studentId);
    if (existingData) {
        for (let i = 1; i <= 6; i++) {
            const status = existingData[`test${i}_status`];
            if (status === 'completed' || status === 'completed_perfect') {
                if (window.setTestCompleted) window.setTestCompleted(`test${i}`);
            }
        }
    }
}

function showIdentityModal() {
    let modal = document.getElementById('identity-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'identity-modal';
        modal.className = 'modal-overlay';
        document.body.appendChild(modal);
    }

    renderModal();
    modal.classList.remove('hidden');
}

window.switchLoginTab = function(tab) {
    if (currentTab === tab) return;
    currentTab = tab;
    renderModal();
};

function renderModal() {
    const modal = document.getElementById('identity-modal');
    if (!modal) return;

    modal.innerHTML = `
        <div class="modal-content student-identity-content animate-pop">
            <header style="text-align: center; margin-bottom: 25px;">
                <h2 style="font-size: 1.5rem; font-weight: 800; color: #1e293b;">Chemistry Test</h2>
                <p style="font-size: 0.9rem; color: #64748b;">원하는 방식으로 입장하세요</p>
            </header>

            <div class="login-tabs">
                <button class="login-tab-btn ${currentTab === 'member' ? 'active' : ''}" onclick="window.switchLoginTab('member')">기존 학생 로그인</button>
                <button class="login-tab-btn ${currentTab === 'guest' ? 'active' : ''}" onclick="window.switchLoginTab('guest')">비회원 접속</button>
            </div>

            <div class="identity-form">
                <div class="input-group">
                    <label for="student-id-input">학번 (5자리)</label>
                    <input type="text" id="student-id-input" placeholder="학번 5자리를 입력하세요" maxlength="5" inputmode="numeric">
                </div>
                
                ${currentTab === 'member' ? `
                    <div class="input-group">
                        <label for="student-pin-input">비밀번호 (4자리)</label>
                        <input type="password" id="student-pin-input" placeholder="PIN 번호를 입력하세요" maxlength="4" inputmode="numeric">
                    </div>
                ` : `
                    <div class="input-group">
                        <label for="student-name-input">이름 (선택)</label>
                        <input type="text" id="student-name-input" placeholder="표시될 이름을 입력하세요">
                    </div>
                `}
            </div>

            <button class="login-submit-btn" onclick="window.submitIdentity()" id="submit-btn">
                ${currentTab === 'member' ? '로그인' : '접속하기'}
            </button>
        </div>
    `;
}

window.submitIdentity = async function() {
    const idInput = document.getElementById('student-id-input').value.trim();
    if (idInput.length !== 5) {
        alert('학번 5자리를 정확히 입력해 주세요.');
        return;
    }

    const submitBtn = document.getElementById('submit-btn');
    let studentName = '';

    if (currentTab === 'member') {
        const pinInput = document.getElementById('student-pin-input').value.trim();
        if (pinInput.length !== 4) {
            alert('비밀번호 4자리를 입력해 주세요.');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerText = '인증 중...';

        const result = await verifyStudent(idInput, pinInput);
        if (!result.success) {
            alert(result.message);
            submitBtn.disabled = false;
            submitBtn.innerText = '로그인';
            return;
        }
        studentName = result.data.name;
    } else {
        const nameInput = document.getElementById('student-name-input').value.trim();
        studentName = nameInput || `학생(${idInput})`;
    }

    localStorage.setItem('student_id', idInput);
    localStorage.setItem('student_name', studentName);
    localStorage.setItem('login_type', currentTab);
    if (currentTab === 'member' && result?.data?.uuid) {
        localStorage.setItem('student_uuid', result.data.uuid);
    }
    localStorage.removeItem('sentiment');

    await updateStudentActivity(idInput, studentName, '', '접속함 (홈)');
    await syncStudentProgress(idInput);

    document.getElementById('identity-modal').classList.add('hidden');
};

export async function logoutStudent() {
    if (confirm('로그아웃 하시겠습니까?')) {
        localStorage.removeItem('student_id');
        localStorage.removeItem('student_name');
        localStorage.removeItem('login_type');
        localStorage.removeItem('sentiment');
        location.reload(); 
    }
}

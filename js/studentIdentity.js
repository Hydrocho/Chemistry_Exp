import { updateStudentActivity } from './supabaseClient.js';

export function initStudentIdentity() {
    const studentId = localStorage.getItem('student_id');
    const studentName = localStorage.getItem('student_name');

    if (!studentId || !studentName) {
        showIdentityModal();
    } else {
        // Initial activity update
        updateStudentActivity(studentId, studentName, '', '접속함 (홈)');
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

    renderModal(modal);
    modal.classList.remove('hidden');
}

function renderModal(modal) {
    const savedId = localStorage.getItem('student_id') || '';
    const savedName = localStorage.getItem('student_name') || '';

    modal.innerHTML = `
        <div class="modal-content student-identity-content">
            <div class="modal-icon">👋</div>
            <h2 class="modal-title">학생 정보를 입력해 주세요</h2>
            <p class="modal-desc">선생님께서 학습 현황을 확인하실 수 있습니다.</p>
            
            <div class="identity-form">
                <div class="input-group">
                    <label for="student-id">학번 (5자리)</label>
                    <input type="text" id="student-id" placeholder="예: 30102" maxlength="5" value="${savedId}">
                </div>
                <div class="input-group">
                    <label for="student-name">이름</label>
                    <input type="text" id="student-name" placeholder="이름을 입력하세요" value="${savedName}">
                </div>
            </div>

            <button class="modal-next-btn" onclick="window.submitIdentity()" style="width: 100%; margin-top: 20px;">시작하기</button>
        </div>
    `;
}

window.submitIdentity = async function() {
    const idInput = document.getElementById('student-id').value.trim();
    const nameInput = document.getElementById('student-name').value.trim();

    if (idInput.length !== 5 || isNaN(idInput)) {
        alert('학번 5자리를 정확히 입력해 주세요 (예: 30102)');
        return;
    }

    if (nameInput.length < 2) {
        alert('이름을 2자 이상 입력해 주세요.');
        return;
    }

    localStorage.setItem('student_id', idInput);
    localStorage.setItem('student_name', nameInput);
    localStorage.removeItem('sentiment');

    const submitBtn = document.querySelector('.student-identity-content .modal-next-btn');
    submitBtn.innerText = '저장 중...';
    submitBtn.disabled = true;

    await updateStudentActivity(idInput, nameInput, '', '접속함 (홈)');

    document.getElementById('identity-modal').classList.add('hidden');
};

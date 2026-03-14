export const state = {
    selectedReaction: null,
    currentPhase: 0, // 0: Selection, 1: Step1, 2: Step2, 3: Step3
    currentViewMode: 'formula',
    coeffsState: {},
    currentLesson: 2
};

export function updateState(newState) {
    Object.assign(state, newState);
}

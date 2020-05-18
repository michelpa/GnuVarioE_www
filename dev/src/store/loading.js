
const initialState = {
    isLoading: false,
};

export const state = Object.assign({}, initialState);

export const actions = {
}

export const mutations = {
    setLoadingState: function (state, isLoading) {
        state.isLoading = isLoading;
    },
}

const getters = {
    isLoading(state) {
        return state.isLoading;
    },
}

export default {
    state,
    actions,
    mutations,
    getters
};
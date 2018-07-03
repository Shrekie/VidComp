// Flux vuex store for entire app
// TODO: Remove and split this file up.
export default {
    state: {
        count: 0
    },
    mutations: {
        increment (state) {
            state.count++;
        }
    }
};
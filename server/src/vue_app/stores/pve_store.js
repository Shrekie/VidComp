// Vuex store for entire app
// TODO: Remove and split this file up.
import Appapi from './../../api/application_api.js';

export default {
    state: {
        user: '',
        count: 0
    },
    actions:{
        getUser ({ commit }) {
            Appapi.getUser(user => {
                commit('setuser', user);
            });
        },
    },
    mutations: {
        setuser (state, user) {
            state.user = user;
        },
        incrementCount (state) {
            state.count++;
        }
    }
};
/*
    Vuex store for entire app
    #TODO: Remove and split this file up.
*/

import Appapi from './../../api/application_api.js';

export default {
    state: {
        users: [],
        count: 0
    },
    actions:{
        getUsers ({ commit }) {
            Appapi.getUsers(users => {
                commit('setusers', users);
            });
        },
        createUser (context, payload) {
            Appapi.createUser(payload.name, (response) => {
                console.log(response);
                context.dispatch('getUsers');
            });
        }
    },
    mutations: {
        setusers (state, users) {
            state.users = users;
        },
        incrementCount (state) {
            state.count++;
        }
    },
    getters: {
        getAllUsers (state) {
            return state.users;
        },
        getTotalCount (state) {
            return state.count;
        }
    }
};
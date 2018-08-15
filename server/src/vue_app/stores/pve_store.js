/*
    Vuex store for entire app
    TODO: Remove and split this file up.
*/

import Appapi from './../../vue_api/application_api.js';

export default {
    state: {
        users: [],
        count: 0,
        timeSliderTime: 0
    },
    actions:{
        getUsers ({ commit }) {
            Appapi.getUsers(users => {
                commit('setusers', users);
            });
        },
        createUser ({dispatch}, payload) {
            Appapi.createUser(payload.name, (response) => {
                console.log(response);
                dispatch('getUsers');
            });
        },

        setSliderTime ({ commit }, sliderTime) {
            commit('setSlider', sliderTime);
        }

    },
    mutations: {
        setusers (state, users) {
            state.users = users;
        },
        incrementCount (state) {
            state.count++;
        },

        setSlider (state, sliderTime) {
            state.timeSliderTime = sliderTime;
        }
    },
    getters: {
        getAllUsers (state) {
            return state.users;
        },
        getTotalCount (state) {
            return state.count;
        },
        sliderTime (state){
            return state.timeSliderTime;
        }
    }
};
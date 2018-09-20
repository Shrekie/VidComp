/*
    Vuex store for entire app
    TODO: Remove and split this file up.
*/

import Appapi from './../../vue_api/application_api.js';
import clientAuth from './../library/clientAuthentication/clientAuth.js'
import createMutationsSharer from 'vuex-shared-mutations'

export default {
    state: {
        users: [],
        projects: [],
        count: 0,
        timeSliderTime: 0,
        zoomScale: 1000,
        authenticated: false
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

        createProject({dispatch}, payload){
            Appapi.createProject(payload.name, (response) =>{
                console.log(response);
                dispatch('getProjects');
            });
        },

        getProjects ({ commit }) {
            Appapi.getProjects(projects =>{
                commit('setProjects', projects)
            });
        },

        setSliderTime ({ commit }, sliderTime) {
            commit('setSlider', sliderTime);
        },

        expandZoom ({ commit }) {
            commit('increaseZoom', 10);
        },

        shrinkZoom ({ commit }) {
            commit('decreaseZoom', 10);
        },

        getAuthenticated ({commit}) {
            clientAuth.checkAuthentication(function(response){
                commit('setAuthenticated', response);
            });
        },

        googleLogin({ commit }) {
            clientAuth.authenticate();
        }

    },
    mutations: {

        setusers (state, users) {
            state.users = users;
        },

        setProjects (state, projects) {
            state.projects = projects;
        },

        setAuthenticated (state, response) {
            state.authenticated = response;
        },

        incrementCount (state) {
            state.count++;
        },

        setSlider (state, sliderTime) {
            state.timeSliderTime = sliderTime;
        },

        increaseZoom (state, zoomAmount) {
            state.zoomScale += state.zoomScale/zoomAmount;
        },

        decreaseZoom (state, zoomAmount) {
            state.zoomScale -= state.zoomScale/zoomAmount;
        }
        
    },
    getters: {

        getAllUsers (state) {
            return state.users;
        },

        getAllProjects (state) {
            return state.projects;
        },

        getTotalCount (state) {
            return state.count;
        },

        sliderTime (state) {
            return state.timeSliderTime;
        },

        zoomScale (state) {
            return state.zoomScale;
        },

        authenticated (state){
            return state.authenticated
        }

    },
    plugins: [createMutationsSharer({ predicate: ['setAuthenticated'] })]
};
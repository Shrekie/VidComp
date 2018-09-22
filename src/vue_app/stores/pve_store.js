/*
    Vuex store for entire app
    TODO: Split this file up.
*/

import Appapi from './../../vue_api/application_api.js';
import clientAuth from './../library/clientAuthentication/clientAuth.js';
import createMutationsSharer from 'vuex-shared-mutations';

export default {

    state: {
        projects:[],
        ready:false,
        authenticated: false,
        zoomAmount: 10,
        mediaChange: false
    },

    actions:{

        getProjects ({commit}) {
            return new Promise((resolve, reject) => {
                Appapi.getProjects(projects => {
                    commit('setProjects', projects);
                    resolve(projects);
                });
            });
        },

        setProject ({dispatch, getters} , payload) {
            Appapi.setProject(getters.projectByName(payload.name), (response) => {
                dispatch('getProjects');
            });
        },

        createProject ({dispatch}, payload) {

            return new Promise((resolve, reject) => {

                var newProject = {
                    name: payload.name,
                    timeSliderTime: 0,
                    zoomScale: 1000,
                    layers: [{
                        layerIndex: 0
                    }],
                    media: [],
                    resources: []

                }
    
                Appapi.setProject(newProject, (response) => {

                    dispatch('getProjects').then(response => {
                        resolve(response);
                    }, error => {
                        console.log(error);
                    });

                });

            });

        },

        setLayersAndMedia({commit, dispatch, getters}, payload){
            payload.projectId = getters.projectIdByName(payload.name);
            commit('setLayers', payload);
            commit('setMedia', payload);
            dispatch('setProject',payload)
        },

        setLayers ({commit, dispatch, getters}, payload){
            payload.projectId = getters.projectIdByName(payload.name);
            commit('setLayers', payload);
            dispatch('setProject',payload);
        },

        setMedia ({commit, dispatch, getters}, payload){
            payload.projectId = getters.projectIdByName(payload.name);
            commit('setMedia', payload);
            dispatch('setProject', payload);
        },

        setResources ({commit, dispatch, getters}, payload){
            payload.projectId = getters.projectIdByName(payload.name);
            commit('setResources', payload);
            dispatch('setProject', payload);
        },

        setSliderTime ({ commit, dispatch, getters }, payload) {
            payload.projectId = getters.projectIdByName(payload.name);
            commit('setSlider', payload);
            //dispatch('setProject', payload);
        },

        expandZoom ({ commit, dispatch, getters}, payload) {
            payload.projectId = getters.projectIdByName(payload.name);
            commit('increaseZoom', payload);
            //dispatch('setProject', payload);
        },

        shrinkZoom ({ commit, dispatch, getters }, payload) {
            payload.projectId = getters.projectIdByName(payload.name);
            commit('decreaseZoom', payload);
            //dispatch('setProject', payload);
        },

        getAuthenticated ({commit}) {
            clientAuth.checkAuthentication(function(response){
                commit('setAuthenticated', response);
            });
        },

        mediaHasChanged({commit, getters}){
            commit('setMediaChange', !getters.mediaChange);
        },

        isReady({commit}){
            commit('setReadyStatus', true);
        },

        authenticate (){
            clientAuth.authenticate();
        }

    },

    mutations: {

        setProjects (state, projects) {
            state.projects = projects;
        },

        setLayers (state, payload){
            state.projects[payload.projectId].layers = payload.layers;
        },

        setMedia (state, payload){
            state.projects[payload.projectId].media = payload.media;
        },

        setResources (state, payload){
            state.projects[payload.projectId].resources = payload.resources;
        },

        setSlider (state, payload) {
            state.projects[payload.projectId].timeSliderTime = payload.timeSliderTime;
        },

        increaseZoom (state, payload) {
            state.projects[payload.projectId].zoomScale += 
            state.projects[payload.projectId].zoomScale/state.zoomAmount
        },

        decreaseZoom (state, payload) {
            state.projects[payload.projectId].zoomScale -= 
            state.projects[payload.projectId].zoomScale/state.zoomAmount
        },

        setMediaChange (state, payload){
            state.mediaChange = payload
        },

        setReadyStatus (state, payload){
            state.ready = payload
        },
        
        setAuthenticated (state, response) {
            state.authenticated = response;
        },

    },

    getters: {

        projects (state) {
            return state.projects;
        },

        layers: (state) => (name) => { 
            return state.projects.find(projects => projects.name === name).layers;
        },

        mediaByLayer: (state) => (name, layerIndex) => { 
            return (state.projects.find(projects => projects.name === name).media)
            .filter(media => media.layerIndex == layerIndex );
        },

        media: (state) => (name) => { 
            return state.projects.find(projects => projects.name === name).media;
        },

        resources: (state) => (name) => { 
            return state.projects.find(projects => projects.name === name).resources;
        },

        projectByName: (state) => (name) => {
            return state.projects.find(projects => projects.name === name);
        },

        projectIdByName: (state) => (name) => {
            return state.projects.findIndex(projects => projects.name === name);
        },

        sliderTime: (state) => (name) => {
            return state.projects.find(projects => projects.name === name).timeSliderTime;
        },

        zoomScale: (state) => (name) => {
            return state.projects.find(projects => projects.name === name).zoomScale;
        },

        ready (state) {
            return state.ready
        },

        mediaChange (state) {
            return state.mediaChange;
        },

        authenticated (state) {
            return state.authenticated
        }

    },
    
    plugins: [
        createMutationsSharer({ predicate: ['setAuthenticated'] })
    ]

};
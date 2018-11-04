/*
    Vuex store for entire app
    TODO: Split this file up.
*/

import Appapi from './../../vue_api/application_api.js';
import PopupAuth from '../../library/clientAuthentication/PopupAuth.js';
import createMutationsSharer from 'vuex-shared-mutations';

export default {

    state: {
        projects:[],
        projectsReady:false,
        authenticated: false,
        autoSaving: false,
        zoomAmount: 10,
        mediaChange: false,
        focusArea: [0, "none"]
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

        setSaving ({commit, getters} , payload) {

            commit('setAutosaving', true);
            Appapi.autoSave((response) => {

                Appapi.setProject(getters.projectByName(payload.name), (response) => {
                    commit('setAutosaving', false);
                });

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

        removeProject({dispatch}, projectName){
                
            Appapi.removeProject(projectName, (response) => {

                dispatch('getProjects').then(response => {
                    console.log(response);
                }, error => {
                    console.log(error);
                });

            });

        },

        logout(){

            return new Promise((resolve, reject) => {
                Appapi.logout((response) => {
                    console.log(response);
                    resolve();
                });
            });

        },

        setLayersAndMedia({commit, dispatch, getters}, payload){
            payload.projectId = getters.projectIdByName(payload.name);
            commit('setLayers', payload);
            commit('setMedia', payload);
            dispatch('setSaving', payload)
        },

        setLayers ({commit, dispatch, getters}, payload){
            payload.projectId = getters.projectIdByName(payload.name);
            commit('setLayers', payload);
            dispatch('setSaving',payload);
        },

        setMedia ({commit, dispatch, getters}, payload){
            payload.projectId = getters.projectIdByName(payload.name);
            commit('setMedia', payload);
            dispatch('setSaving', payload);
        },

        setResources ({commit, dispatch, getters}, payload){
            payload.projectId = getters.projectIdByName(payload.name);
            commit('setResources', payload);
            dispatch('setSaving', payload);
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
            PopupAuth.checkAuthentication(function(response){
                commit('setAuthenticated', response);
            });
        },

        setFocusArea ({commit}, payload){
            commit('setFocusArea', payload);
        },

        mediaHasChanged({commit, getters}){
            commit('setMediaChange', !getters.mediaChange);
        },

        projectLoaded({commit, getters}, payload){
            payload.projectId = getters.projectIdByName(payload.name);
            commit('setProjectLoaded', payload);
        },

        projectsReady({commit}){
            commit('setProjectsReady');
        },

        authenticate (){
            PopupAuth.authenticate();
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

        setAutosaving (state, payload){
            state.autoSaving = payload
        },

        setProjectLoaded (state, payload){
            state.projects[payload.projectId].projectLoaded = true;
        },

        setFocusArea (state, payload){
            state.focusArea = payload.timelineArea;
        },

        setProjectsReady (state){
            state.projectsReady = true;
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

        projectLoaded(state) {
            return state.projects.find(projects => projects.name === name).projectLoaded;
        },

        projectsReady (state) {
            return state.projectsReady;
        },

        focusArea (state) {
            return state.focusArea;
        },

        autoSaving (state) {
            return state.autoSaving;
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
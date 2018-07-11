/*
    API for VideoComposer project plugin.
*/

// TODO: change name of this file. 
// TODO: make anon func that gets project first and returns functions bound to it

import VideoComposer from './videoComposer.js';

var store = {
    projects: []
};

// Bind each canvas element to corresponding project
var setTarget = function(projectName, canvas){
    getProject(projectName).setTarget(canvas);
};

var newProject = function(projectName){
    store.projects.push({name: projectName, project: new VideoComposer()});
};

var getProject = function (projectName) {
    return store.projects.find(function(element) 
    {return element.name == projectName;}).project;
};

var addLayer = function (projectName, newLayer) {
    getProject(projectName).createLayer(newLayer);
};

var addMedia = function (projectName, mediaChange) {
    getProject(projectName).addMedia(mediaChange);
};

var getAllMedia = function (projectName, layerIndex) {
    return getProject(projectName).getAllMedia(layerIndex);
};

var getAllLayers = function (projectName) {
    return getProject(projectName).getAllLayers();
};

var changeLayer = function (projectName, layerChange) {
    getProject(projectName).editLayer(layerChange);
};

var changeResource = function (projectName, resourceChange){
    getProject(projectName).editResource(resourceChange);
};

var play = function(projectName){
    getProject(projectName).startPlaying();
};

var stop = function(projectName){
    getProject(projectName).stopPlaying();
};

var reset = function(projectName){
    getProject(projectName).resetPlayer();
};

var videoControl = function(projectName, frameHookName, frameHook){
    getProject(projectName).videoControl(frameHookName, frameHook);
};

var unbindAllFrameHooks = function(projectName){
    getProject(projectName).unbindAllFrameHooks();
};
        
export default {
    setTarget,
    changeResource,
    addMedia,
    changeLayer,
    newProject,
    getAllMedia,
    getAllLayers,
    addLayer,
    play,
    stop,
    reset,
    videoControl,
    unbindAllFrameHooks
};
/*
    API for VideoComposer project plugin.
*/

import VideoComposer from './videoComposer.js';

var store = {
    projects: new Map()
};

// Bind each canvas element to corresponding project
var setTarget = function(projectName, canvas){
    getProject(projectName).setTarget(canvas);
}

var newProject = function(projectName){
    store.projects.set(projectName, {project: new VideoComposer()});
}

var getProject = function (projectName) {
    return store.projects.get(projectName).project;
};

var addLayer = function (projectName, newLayer) {
    if(newLayer.resourceName){
        getProject(projectName).createLayer(newLayer, true);
    }else{
        getProject(projectName).createLayer(newLayer, false);
    }
};

var changeLayer = function (projectName, layerChange) {
    getProject(projectName).editLayer(layerChange);
}

var play = function(projectName){
    getProject(projectName).startDraw();
};
        
export default {
    setTarget,
    changeLayer,
    newProject,
    addLayer,
    play
};
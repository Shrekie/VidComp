/*
    API for VideoComposer project plugin.
*/

// Modules
import VideoProjection from './modules/videoProjection.js';
import Timeline from './modules/timeline.js';
import ResourceImporter from './modules/resourceImporter.js';
import Layer from './modules/layer.js';

var VideoComposer = function () {
    this.videoProjection = new VideoProjection();
    this.timeline = new Timeline();
    this.resourceImporter = new ResourceImporter();
};

var store = {
    projects: new Map()
};

// Bind each canvas element to corresponding project object
var setTarget = function(projectName, canvas){
    getProject(projectName).videoProjection.setTarget(canvas);
}

var newProject = function(projectName){
    store.projects.set(projectName, {project: new VideoComposer()});
}

var getProject = function (projectName) {
    return store.projects.get(projectName).project;
};

var addLayer = function (projectName, resourceLink, name) {

    getProject(projectName).resourceImporter.importResource
    (resourceLink, name, function(resource){
        var layer = new Layer(name, resource);
        getProject(projectName).timeline.addLayer(layer);
    });

};

var play = function(projectName){

    getProject(projectName).videoProjection
    .drawTimeline(getProject(projectName).timeline);

};
        
export default {
    setTarget,
    newProject,
    addLayer,
    play
};
/*
    Stores and retrieves a cache of VideoComposer projects
*/

import VideoComposer from './videoComposer.js';

export default function (){

    var store = {
        projects: []
    };

    var getProject = function (projectName) {
        return store.projects.find(function(element) 
        {return element.name == projectName;}).project;
    };

    var newProject = function(projectName){
        store.projects.push({name: projectName, project: new VideoComposer()});
    };

    var projectExists = function (projectName) {
        if(store.projects.find(function(element) 
        {return element.name == projectName;})) return true;
        else return false;
    };

    //TODO: this needs to be async
    // parses project json and generates VideoCompose projects.
    var loadProject = function(project) {
        
        if(projectExists(project.name)) return true;

        newProject(project.name);
        var vidProject = getProject(project.name);

        if(project.layers.length > 0){
            project.layers.forEach(layer => {
                vidProject.createLayer({layerIndex:layer.layerIndex});
            });
        }

        if(project.resources.length > 0){
            project.resources.forEach(resource => {
                vidProject.addResource({
                        name: resource.name,
                        resourceLink: resource.resourceLink,
                        resourceType: resource.type
                });
            });
        }

        if(project.media.length > 0){
            project.media.forEach(media => {
                vidProject.addMedia({

                    newMedia: {
                        layerIndex: media.layerIndex,
                        size: media.size,
                        timelineTime: media.timelineTime,
                        position: media.position,
                        videoStartTime: media.videoStartTime
                    },

                    resource: {
                        name: media.resource.name
                    }

                });
            });
        }

        vidProject.log();

        return true;

    };

    return{
        getProject,
        newProject,
        loadProject
    }
}


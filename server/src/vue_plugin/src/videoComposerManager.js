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

    return{
        getProject,
        newProject
    }
}


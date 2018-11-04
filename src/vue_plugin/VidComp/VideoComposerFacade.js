/*

    Singleton Factory Facade

*/

import VideoComposer from './VideoComposer.js';

class VideoComposerFacade {

    _store = {
        projects: []
    }

    _projectExists (projectName) {
        return this._store.projects.find(function(element) 
        {return element.name == projectName})
    }

    removeProject (projectName) {
        this._store.projects = this._store.projects
        .filter(function( project ) {
            return project.name != projectName;
        });
    }

    getProject (projectName) {
        return this._store.projects.find(function(element) 
        {return element.name == projectName;}).project;
    }

    newProject (projectName){
        this._store.projects.push({name: projectName, project: new VideoComposer()});
    }

    loadProject (project) {

        if(this._projectExists(project.name)) return true;

        this.newProject(project.name);
        var vidProject =  this.getProject(project.name);

        vidProject.compositionBuilder.constructProject(project);

        vidProject.log();

        return true;

    }

}

export default VideoComposerFacade
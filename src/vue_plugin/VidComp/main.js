/*
    Thomas Lindauer

    Entry point of plugin, install to vue app space.
*/

import VideoComposerManager from './videoComposerManager.js';
var videoComposerManager = new VideoComposerManager();

var videoProject =  {
    
    project: (projectName) => {
        return videoComposerManager.getProject(projectName)
    },
    
    new: (projectName) => {
        videoComposerManager.newProject(projectName);
        return videoComposerManager.getProject(projectName);
    },

    loadProject: (project) => {
        videoComposerManager.loadProject(project);
    }
    
};

export default {

    videoProject:videoProject,

    install(Vue, options) {

        Vue.directive('project-composition', {
            bind (el, binding, vnode, oldVnode) {
                console.log(videoProject.project(binding.value));
                videoProject.project(binding.value).setTarget(el);
            },
            unbind (el, binding, vnode, oldVnode) {
                console.log('unbound');
                // Cleanup for new instance of canvas
                videoProject.project(binding.value).stop();
                /*
                    every component hooking up should also bind to unbind,
                    so this might be overkill:
                */
               videoProject.project(binding.value).unbindAllFrameHooks();
            }

        });

        Vue.prototype.$vcomp = videoProject

    }

};
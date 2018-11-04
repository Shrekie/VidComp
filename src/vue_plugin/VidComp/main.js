/*
    Thomas Lindauer (github.com/Shrekie)

    Entry point of plugin, install to vue app space.
*/

import VideoComposerFacade from './VideoComposerFacade.js';
var videoComposerFacade = new VideoComposerFacade();

var videoProject =  {
    
    project: (projectName) => {
        return videoComposerFacade.getProject(projectName)
    },

    removeProject: (projectName) => {
        return videoComposerFacade.removeProject(projectName)
    },
    
    new: (projectName) => {
        videoComposerFacade.newProject(projectName);
        return videoComposerFacade.getProject(projectName);
    },

    loadProject: (project) => {
        return videoComposerFacade.loadProject(project);
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
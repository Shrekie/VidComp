/*
    Entry point of plugin, install to vue app space.
*/

import VideoComposerManager from './src/videoComposerManager.js';
var videoComposerManager = new VideoComposerManager();

var videoProjectDir = function (projectName){
    return videoComposerManager.getProject(projectName);
};

export default {
    videoProject (projectName) {
        videoComposerManager.newProject(projectName);
        return videoProjectDir(projectName);
    },
    install(Vue, options) {

        Vue.directive('project-composition', {
            bind (el, binding, vnode, oldVnode) {
                console.log('bound');
                videoProjectDir(binding.value).setTarget(el);
            },
            unbind (el, binding, vnode, oldVnode) {
                console.log('unbound');
                // Cleanup for new instance of canvas
                videoProjectDir(binding.value).stop();
                /*
                    every component hooking up should also bind to unbind,
                    so this might be overkill:
                */
               videoProjectDir(binding.value).unbindAllFrameHooks();
            }

        });

        Vue.prototype.$vcomp = videoProjectDir

    }
};
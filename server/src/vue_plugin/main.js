/*
    Entry point of plugin, install to vue app space.
*/

import VideoComposerManager from './src/videoComposerManager.js';

export default {

    install(Vue, options) {

        Vue.directive('project-composition', {
            bind (el, binding, vnode, oldVnode) {
                VideoComposerManager.setTarget(binding.expression, el);
            }
        });

        Vue.prototype.$vcomp = function (projectName) {

            var addLayer = function () {
                VideoComposerManager.addLayer(projectName, newLayer);
            };

            var addMedia = function () {
                VideoComposerManager.addMedia(projectName, newMedia);
            };

            var changeResource = function (resourceChange){
                VideoComposerManager.changeResource(projectName, resourceChange);
            };

            var changeLayer = function (layerChange){
                VideoComposerManager.changeLayer(projectName, layerChange);
            };

            var play = function () {
                VideoComposerManager.play(projectName);
            };

            return {
                addLayer,
                addMedia,
                changeResource,
                changeLayer,
                play
            }

        };

    },
    newProject: VideoComposerManager.newProject,
    addLayer: VideoComposerManager.addLayer,
    addMedia: VideoComposerManager.addMedia
};
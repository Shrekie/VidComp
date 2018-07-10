/*
    Entry point of plugin, install to vue app space.
*/

import VideoComposerManager from './src/videoComposerManager.js';

export default {

    install(Vue, options) {

        Vue.directive('project-composition', {
            bind (el, binding, vnode, oldVnode) {
                console.log('bound');
                VideoComposerManager.setTarget(binding.expression, el);
            },
            unbind (el, binding, vnode, oldVnode) {
                console.log('unbound');
                // Cleanup for new instance of canvas
                VideoComposerManager.stop(binding.expression);
                VideoComposerManager.unbindAllFrameHooks();
            }
        });

        Vue.prototype.$vcomp = function (projectName) {

            var addLayer = function (newLayer) {
                VideoComposerManager.addLayer(projectName, newLayer);
            };

            var addMedia = function (newMedia) {
                VideoComposerManager.addMedia(projectName, newMedia);
            };

            var getAllMedia = function (layerIndex) {
                return VideoComposerManager.getAllMedia(projectName, layerIndex);
            };
            
            var getAllLayers = function () {
                return VideoComposerManager.getAllLayers(projectName);
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

            var videoControl = function (frameHookName, frameHook) {
                VideoComposerManager.videoControl(projectName, frameHookName, frameHook);
            };

            var unbindAllFrameHooks = function () {
                VideoComposerManager.unbindAllFrameHooks();
            };

            return {
                addLayer,
                addMedia,
                getAllMedia,
                getAllLayers,
                changeResource,
                changeLayer,
                play,
                videoControl,
                unbindAllFrameHooks
            }

        };

    },
    newProject: VideoComposerManager.newProject,
    addLayer: VideoComposerManager.addLayer,
    addMedia: VideoComposerManager.addMedia
};
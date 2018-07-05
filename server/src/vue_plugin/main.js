/*
    Entry point of plugin, install to vue app space.
*/

import VideoComposer from './src/videoComposer.js';

export default {
    install(Vue, options) {

        Vue.directive('project-composition', {
            bind (el, binding, vnode, oldVnode) {
                VideoComposer.setTarget(binding.expression, el);
            }
        });

        Vue.prototype.$vcomp = function (projectName) {

            var addLayer = function () {
                VideoComposer.addLayer(projectName);
            };

            var play = function () {
                VideoComposer.play(projectName);
            };

            return {
                addLayer,
                play
            }

        };

    },
    newProject:VideoComposer.newProject,
    addLayer:VideoComposer.addLayer
};
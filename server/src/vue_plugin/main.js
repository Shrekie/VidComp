/*
    Entry point of plugin, install to vue app space.
*/

import VidCompMan from './src/projectManager.js';

export default {
    install(Vue, options) {

        Vue.directive('project-composition', {
            bind (el, binding, vnode, oldVnode) {
                VidCompMan.setTarget(binding.expression, el);
            }
        });

        Vue.prototype.$vcomp = function (projectName) {

            var addLayer = function () {
                VidCompMan.addLayer(projectName);
            };

            var changeLayer = function (layerChange){
                VidCompMan.changeLayer(projectName, layerChange);
            }

            var play = function () {
                VidCompMan.play(projectName);
            };

            return {
                addLayer,
                changeLayer,
                play
            }

        };

    },
    newProject:VidCompMan.newProject,
    addLayer:VidCompMan.addLayer
};
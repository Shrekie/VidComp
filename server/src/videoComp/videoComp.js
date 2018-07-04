/*
    Vue plugin for video composition and effects.
    Make your own online video editor, be it a small or a large one.
*/

export default {
    install(Vue, options) {

        Vue.mixin({
            created: function () {
                console.log('Plugin created.');
            }
        });

    }
};
import MediaDrawer from './mediaDrawer.js';

export default function () {

    this.videoOutput = {};

    var store = {
        hooks: []
    };

    var mediaDrawer = new MediaDrawer();

    this.setTarget = function (canvas) {
        this.videoOutput = {ctx: canvas.getContext('2d'), el: canvas};
    };

    this.startPlaying = function (sourceLoader) {
        mediaDrawer.drawSources(sourceLoader, this.videoOutput);
    };
    
    this.unbindAllFrameHooks = function () {
        store.hooks = [];
        mediaDrawer.unregisterFrameHooks();
    };

    this.videoControl = function (frameHookName, frameHook) {
        store.hooks.push({name: frameHookName, callbackHook:frameHook});
        mediaDrawer.registerFrameHooks(frameHook, store.hooks);
    }

    this.stopPlaying = function (sourceLoader) {
        mediaDrawer.stopDrawSources(sourceLoader);
    };

};
import MediaDrawer from './mediaDrawer.js';

export default function () {

    this.videoOutput = {};

    var store = {
        hooks: []
    };

    var mediaDrawer = new MediaDrawer();

    this.setTarget = function (canvas) {
        console.log(canvas);
        this.videoOutput = {ctx: canvas.getContext('2d'), el: canvas};
        console.log( this.videoOutput );
    };

    this.startPlaying = function (sourceLoader) {
        console.log(this.videoOutput);
        mediaDrawer.drawSources(sourceLoader, this.videoOutput);
    };
    
    this.resetPlayer = function (sourceLoader) {
        mediaDrawer.resetDrawSources(sourceLoader);
    }

    this.unbindAllFrameHooks = function () {
        store.hooks = [];
        mediaDrawer.unregisterFrameHooks();
    };

    this.videoControl = function (frameHookName, frameHook) {
        store.hooks.push({name: frameHookName, callbackHook:frameHook});
        mediaDrawer.registerFrameHooks({name: frameHookName, callbackHook:frameHook}, store.hooks);
    }

    this.stopPlaying = function (sourceLoader) {
        mediaDrawer.stopDrawSources(sourceLoader);
    };

};
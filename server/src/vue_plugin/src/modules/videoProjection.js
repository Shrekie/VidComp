import MediaDrawer from './mediaDrawer.js';

export default function () {

    this.videoOutput = {};
    var mediaDrawer = new MediaDrawer();

    this.setTarget = function (canvas) {
        this.videoOutput = {ctx: canvas.getContext('2d'), el: canvas};
    };

    this.startPlaying = function (sourceLoader) {
        mediaDrawer.drawSources(sourceLoader, this.videoOutput);
    };

    this.stopPlaying = function (sourceLoader) {
        mediaDrawer.stopDrawSources(sourceLoader);
    };

};
import MediaDrawer from './mediaDrawer.js';

export default function () {

    var videoOutput = {};
    var mediaDrawer = new MediaDrawer();

    this.setTarget = function (canvas) {
        videoOutput = {ctx: canvas.getContext('2d'), el: canvas};
    };

    this.startPlaying = function (sourceLoader) {
        mediaDrawer.drawSources(sourceLoader, videoOutput);
    };

};
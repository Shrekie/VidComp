// FIXME: kinda shallow
import MediaDrawer from './mediaDrawer.js';

export default function () {

    this.videoOutput = {};

    var store = {
        hooks: []
    };

    this.mediaDrawer = new MediaDrawer();

    this.setTarget = function (canvas) {
        this.videoOutput = {ctx: canvas.getContext('2d'), el: canvas};
    };

    this.startPlaying = function (sourceLoader) {
        this.mediaDrawer.drawSources(sourceLoader, this.videoOutput);
    };
    
    this.resetPlayer = function (sourceLoader) {
        this.mediaDrawer.resetDrawSources(sourceLoader);
    }

    this.stopPlaying = function (sourceLoader) {
        this.mediaDrawer.stopDrawSources(sourceLoader);
    };

};
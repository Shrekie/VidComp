import TimeTracker from './timeTracker.js';
import MediaDrawer from './mediaDrawer.js';
import InterfaceDrawer from './interfaceDrawer.js';
import CompositionRenderer from './compositionRenderer.js';

export default function () {

    this.videoOutput = {};
    this.timeTracker = new TimeTracker();
    this.mediaDrawer = new MediaDrawer(this.timeTracker);
    this.interfaceDrawer = new InterfaceDrawer(this.timeTracker);
    this.compositionRenderer = new CompositionRenderer();

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

    this.renderComposition = function (sourceLoader) {
        return this.compositionRenderer.render(sourceLoader, this.videoOutput, this);
    }

    this.scrubVideo = function(elapsedDateTime, sourceLoader){
        this.interfaceDrawer.scrubVideo(elapsedDateTime, sourceLoader, this.videoOutput);
    }

    this.setTimeDelay = function (time) {
        this.mediaDrawer.setTimeDelay(time);
    }

};
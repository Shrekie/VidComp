import TimeTracker from './timeTracker.js';
import MediaDrawer from './mediaDrawer.js';
import InterfaceDrawer from './interfaceDrawer.js';
import MediaTransform from './mediaTransform.js';
import CompositionRenderer from './compositionRenderer.js';

export default function (ContextHooks, timeline) {

    this.videoOutput = {};
    this.timeTracker = new TimeTracker();

    this.mediaDrawer = new MediaDrawer(ContextHooks, this.timeTracker);
    this.interfaceDrawer = new InterfaceDrawer(this.timeTracker);
    this.mediaTransform = new MediaTransform(this.timeTracker,
    this.interfaceDrawer, timeline);

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

    this.enableTransform = function(sourceLoader){
        this.mediaTransform.enableTransform(this.videoOutput, sourceLoader);
    }

    this.scrubVideo = function(elapsedDateTime){
        this.mediaTransform.transformScrub(elapsedDateTime);
    }

    this.setTimeDelay = function (time) {
        this.mediaDrawer.setTimeDelay(time);
    }
    
};
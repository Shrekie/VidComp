import MediaDrawer from './mediaDrawer.js';
import CompositionRenderer from './compositionRenderer.js';

export default function () {

    this.videoOutput = {};

    this.mediaDrawer = new MediaDrawer();
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
        this.compositionRenderer.render(sourceLoader, this.videoOutput, this);
    }

};
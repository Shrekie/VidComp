import PlaybackContainer from './PlaybackContainer.js';
import InterfaceDrawer from './InterfaceDrawer.js';
import MediaTransform from './MediaTransform.js';
import CompositionRenderer from './CompositionRenderer.js';

class VideoProjection {

    constructor(ContextHooks, sourceLoader, timeline){

        this.videoOutput = {};
        this.playbackContainer = new PlaybackContainer(ContextHooks, sourceLoader, this.videoOutput);
        this.interfaceDrawer = new InterfaceDrawer(sourceLoader, this.videoOutput);
        this.mediaTransform = new MediaTransform(this.interfaceDrawer, timeline);
        this.compositionRenderer = new CompositionRenderer(sourceLoader, this.videoOutput, this);

    }
    
    setTarget (canvas) {
        this.videoOutput.ctx = canvas.getContext('2d');
        this.videoOutput.el = canvas;
        return this.videoOutput;
    }

    startPlaying (sourceLoader) {
        this.playbackContainer.drawSources(sourceLoader, this.videoOutput);
    }
    
    resetPlayer (sourceLoader) {
        this.playbackContainer.resetDrawSources(sourceLoader);
    }

    stopPlaying (sourceLoader) {
        this.playbackContainer.stopDrawSources(sourceLoader);
    }

    renderComposition () {
        return this.compositionRenderer.render();
    }

    enableTransform (sourceLoader) {
        this.mediaTransform.enableTransform(this.videoOutput, sourceLoader);
    }

    scrubVideo (elapsedDateTime ){
        this.mediaTransform.transformScrub(elapsedDateTime);
    }

    setTimeDelay (time) {
        this.playbackContainer.setTimeDelay(time);
    }
    
}

export default VideoProjection;
import TimeTracker from './TimeTracker.js';
import MediaDrawer from './mediaDrawer.js';
import InterfaceDrawer from './interfaceDrawer.js';
import MediaTransform from './MediaTransform.js';
import CompositionRenderer from './CompositionRenderer.js';

class VideoProjection {

    constructor(ContextHooks, sourceLoader){

        this.videoOutput;
        this.timeTracker = new TimeTracker();
        this.mediaDrawer = new MediaDrawer(ContextHooks, this.timeTracker);
        this.interfaceDrawer = new InterfaceDrawer(this.timeTracker);
        this.mediaTransform = new MediaTransform(this.timeTracker,this.interfaceDrawer);
        this.compositionRenderer = new CompositionRenderer(sourceLoader, this);

    }
    
    setTarget (canvas) {
        this.videoOutput = {ctx: canvas.getContext('2d'), el: canvas};
    }

    startPlaying (sourceLoader) {
        this.mediaDrawer.drawSources(sourceLoader, this.videoOutput);
    }
    
    resetPlayer (sourceLoader) {
        this.mediaDrawer.resetDrawSources(sourceLoader);
    }

    stopPlaying (sourceLoader) {
        this.mediaDrawer.stopDrawSources(sourceLoader);
    }

    renderComposition () {
        return this.compositionRenderer.render(this.videoOutput);
    }

    enableTransform (sourceLoader) {
        this.mediaTransform.enableTransform(this.videoOutput, sourceLoader);
    }

    scrubVideo (elapsedDateTime ){
        this.mediaTransform.transformScrub(elapsedDateTime);
    }

    setTimeDelay (time) {
        this.mediaDrawer.setTimeDelay(time);
    }
    
};

export default VideoProjection;
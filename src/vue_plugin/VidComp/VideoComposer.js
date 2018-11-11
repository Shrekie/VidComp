//#TODO: Seperate into proper directories
import VideoProjection from './modules/VideoProjection.js';
import Timeline from './modules/Timeline.js';
import ResourceImporter from './modules/ResourceImporter.js';
import SourceLoader from './modules/SourceLoader.js';
import TrackLogger from './modules/TrackLogger.js';
import CompositionBuilder from './modules/CompositionBuilder.js';

//#TODO: make dependecy
import ContextHooks from '../../library/contextHook/ContextHook.js';

class VideoComposer {

    constructor(){

        this.resourceImporter = new ResourceImporter();
        this.sourceLoader = new SourceLoader(ContextHooks);

        this.timeline = new Timeline(ContextHooks, this.sourceLoader);
        this.videoProjection = new VideoProjection(ContextHooks, this.sourceLoader, this.timeline);

        this.trackLogger = new TrackLogger(this, this.timeline, this.sourceLoader);
        this.compositionBuilder = new CompositionBuilder(this.sourceLoader, 
        this.resourceImporter, this.timeline);

    }

    createLayer (newLayer) {
        return this.compositionBuilder.createLayer(newLayer);
    }

    addMedia (newMedia) {
        return this.compositionBuilder.addMedia(newMedia);
    }

    adjustMediaTimeShift (direction, layerIndex, mediaIndex, timelineTime) {
        this.timeline.shiftOrder.adjustMediaTimeShift(direction, 
        layerIndex, mediaIndex, timelineTime);
    }

    adjustMediaShift (currentTimelinePos, newTimelinePos) {
        this.timeline.shiftOrder.adjustMediaShift(currentTimelinePos, 
        newTimelinePos);
    }

    castControl (frameHookName, frameHook) {
        return this.sourceLoader.contextHooks
        .registerHooks({name:frameHookName, callbackHook:frameHook});
    }

    layerControl (frameHookName, frameHook) {
        return this.timeline.contextHooks
        .registerHooks({name:frameHookName, callbackHook:frameHook});
    }

    videoControl (frameHookName, frameHook) {

        if(frameHookName == 'drawingUpdate'){
            this.videoProjection.playbackContainer.contextHooks
            .initializeContextHook({name:frameHookName, callbackHook:frameHook});
        }
        return this.videoProjection.playbackContainer.contextHooks
        .registerHooks({name:frameHookName, callbackHook:frameHook});

    }

    unbindAllFrameHooks () {
        ContextHooks.unbindAllFrameHooks(); 
    }

    unbindFrameHook (frameHookParent, hookIndex) {
        ContextHooks.unbindFrameHook(frameHookParent, hookIndex);
    }

    undo () {
        this.trackLogger.undo();
    }

    redo () {
        this.trackLogger.redo();
    }

    log () {
        this.trackLogger.log();
    }

    addResource (resource) {
        this.resourceImporter.importResource(resource, this.sourceLoader);
    }

    setTarget (canvas) {
        return this.videoProjection.setTarget(canvas);
    }

    render () {
        return this.videoProjection.renderComposition();
    }

    getAllResources () {
        return this.resourceImporter.getAllResources();
    }

    getAllMedia () {
        return this.timeline.getAllMedia();
    }

    getAllLayerMedia (layerIndex) {
        return this.timeline.getLayer(layerIndex).getAllMedia();
    }

    getAllLayers () {
        return this.timeline.getAllLayers();
    }

    getMedia (layerIndex, mediaIndex) {
        return this.timeline.getLayer(layerIndex).getMedia(mediaIndex);
    }

    deleteLayerMedia (layerIndex, mediaIndex) {
        return this.timeline.deleteLayerMedia(layerIndex, mediaIndex);
    }

    preparedSources () {
        return this.compositionBuilder.preparedSources();
    }

    stop () {
        this.videoProjection.stopPlaying(this.sourceLoader);
    }

    play () {
        this.videoProjection.startPlaying(this.sourceLoader);
    }

    reset () {
        this.videoProjection.resetPlayer(this.sourceLoader);
    }

    scrubVideo (elapsedDateTime) {
        this.videoProjection.scrubVideo(elapsedDateTime, this.sourceLoader);
    }

    enableTransform () {
        this.videoProjection.enableTransform(this.sourceLoader);
    }

}

export default VideoComposer;

// Modules #TODO: Seperate into proper directories
import VideoProjection from './modules/videoProjection.js';
import Timeline from './modules/timeline.js';
import ResourceImporter from './modules/resourceImporter.js';
import SourceLoader from './modules/sourceLoader.js';
import Layer from './modules/layer.js';
import Logger from './modules/logger.js';
import ContextHooks from './modules/contextHooks.js';

export default function () {

    var timeline = new Timeline(ContextHooks);
    var videoProjection = new VideoProjection(ContextHooks, timeline);
    var resourceImporter = new ResourceImporter();
    var sourceLoader = new SourceLoader(ContextHooks);
    var logger = new Logger(this, timeline, sourceLoader);

    this.createLayer = function (newLayer) {

        if(newLayer.newResource && newLayer.newMedia){

            // create layer with media and resource
            newLayer.newMedia.resource = resourceImporter.importResource(newLayer.newResource, sourceLoader);
            var layer = new Layer(newLayer.newMedia.layerIndex);
            let mediaIndex = layer.addMedia(newLayer.newMedia);
            timeline.addLayer(layer);
            sourceLoader.loadMedia(layer.getMedia(mediaIndex));

            return {
                layerIndex:layer.layerIndex,
                mediaIndex:mediaIndex,
                loadedResource:newLayer.newMedia.resource.loadedResource
            }

        }else if (newLayer.newMedia) {

            // create layer with empty media
            var layer = new Layer(newLayer.newMedia.layerIndex);
            let mediaIndex = layer.addMedia(newLayer.newMedia);
            timeline.addLayer(layer);
            sourceLoader.loadMedia(layer.getMedia(mediaIndex));

            return {
                layerIndex:layer.layerIndex,
                mediaIndex:mediaIndex
            }

        }else{

            // create layer with no media
            var layer = new Layer(newLayer.layerIndex);
            timeline.addLayer(layer);

            return {
                layerIndex:layer.layerIndex
            }

        }

    };

    this.addMedia = function (newMedia) {
        
        if ( newMedia.newResource ){

            // add new resource to new media in existing layer
            var layer = timeline.getLayer(newMedia.newMedia.layerIndex);
            newMedia.newMedia.resource = resourceImporter.importResource(newMedia.newResource,sourceLoader);
            let mediaIndex = layer.addMedia(newMedia.newMedia);
            sourceLoader.loadMedia(layer.getMedia(mediaIndex));
            
            return {
                mediaIndex: mediaIndex,
                loadedResource:newMedia.newMedia.resource.loadedResource
            }

        }else if ( newMedia.resource ) {

            // add new media with existing resource
            var layer = timeline.getLayer(newMedia.newMedia.layerIndex);
            newMedia.newMedia.resource = resourceImporter.importResource(newMedia.resource, sourceLoader);
            let mediaIndex = layer.addMedia(newMedia.newMedia);
            sourceLoader.loadMedia(layer.getMedia(mediaIndex));

            return {
                mediaIndex: mediaIndex,
                loadedResource:newMedia.newMedia.resource.loadedResource
            }

        } else {

            // add new media without resource
            var layer = timeline.getLayer(newMedia.layerIndex);
            let mediaIndex = layer.addMedia(newMedia);
            sourceLoader.loadMedia(layer.getMedia(mediaIndex));

            return {
                mediaIndex: mediaIndex
            }

        }

    };

    this.adjustMediaTimeShift = function (direction, layerIndex, mediaIndex, timelineTime) {
        timeline.adjustMediaTimeShift(direction, layerIndex, mediaIndex, timelineTime, sourceLoader);
    }

    this.adjustMediaShift = function (currentTimelinePos, newTimelinePos) {
        timeline.adjustMediaShift(currentTimelinePos, newTimelinePos, sourceLoader);
    }

    // #SUGGESTION: handle all contexthooks on contextmanager
    this.castControl = function (frameHookName, frameHook) {
        return sourceLoader.contextHooks.registerHooks({name:frameHookName, callbackHook:frameHook});
    };

    this.layerControl = function (frameHookName, frameHook) {
        return timeline.contextHooks.registerHooks({name:frameHookName, callbackHook:frameHook});
    };

    this.videoControl = function (frameHookName, frameHook) {

        if(frameHookName == 'drawingUpdate'){
            videoProjection.mediaDrawer.contextHooks
            .initializeContextHook({name:frameHookName, callbackHook:frameHook});
        }

        return videoProjection.mediaDrawer.contextHooks
        .registerHooks({name:frameHookName, callbackHook:frameHook});

    };

    this.unbindAllFrameHooks = function () {
        ContextHooks.unbindAllFrameHooks();
    };

    this.unbindFrameHook = function (frameHookParent, hookIndex) {
        ContextHooks.unbindFrameHook(frameHookParent, hookIndex);
    };

    this.undo = function (){
        logger.undo();
    }

    this.redo = function () {
        logger.redo();
    }

    this.log = function (){
        logger.log();
    };

    this.addResource = function(resource) {
        resourceImporter.importResource(resource, sourceLoader);
    }

    this.setTarget = function (canvas) {
        videoProjection.setTarget(canvas);
    };

    this.render = function (){
        return videoProjection.renderComposition(sourceLoader);
    }

    this.getAllResources = function(){
        return resourceImporter.getAllResources();
    };

    this.getAllMedia = function () {
        return timeline.getAllMedia();
    };

    this.getAllLayerMedia = function (layerIndex) {
        return timeline.getLayer(layerIndex).getAllMedia();
    };

    this.getAllLayers = function () {
        return timeline.getAllLayers();
    };

    this.getMedia = function(layerIndex, mediaIndex){
        return timeline.getLayer(layerIndex).getMedia(mediaIndex);
    }

    this.deleteLayerMedia = function(layerIndex, mediaIndex){
        return timeline.deleteLayerMedia(layerIndex, mediaIndex, sourceLoader);
    }

    this.stop = function () {
        videoProjection.stopPlaying(sourceLoader);
    };

    this.play = function () {
        videoProjection.startPlaying(sourceLoader);
    };

    this.reset = function () {
        videoProjection.resetPlayer(sourceLoader);
    };

    this.scrubVideo = function (elapsedDateTime){
        videoProjection.scrubVideo(elapsedDateTime, sourceLoader);
    }

    this.enableTransform = function (){
        videoProjection.enableTransform(sourceLoader);
    }

};

/*
    #TODO: This needs to be the same here, server side and anywhere else.

    newMedia: {
        layerIndex: ,
        size: [, ],
        timelineTime:
        position: [,],
        videoStartTime: 0
    },

    newResource: {
        name:,
        resourceLink:,
        resourceType: 'image'
    }

*/
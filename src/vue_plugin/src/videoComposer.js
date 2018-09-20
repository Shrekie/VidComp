
// Modules #TODO: Seperate into proper directories
import VideoProjection from './modules/videoProjection.js';
import Timeline from './modules/timeline.js';
import ResourceImporter from './modules/resourceImporter.js';
import SourceLoader from './modules/sourceLoader.js';
import Layer from './modules/layer.js';

export default function () {

    var videoProjection = new VideoProjection();
    var timeline = new Timeline();
    var resourceImporter = new ResourceImporter();
    var sourceLoader = new SourceLoader();

    this.createLayer = function (newLayer) {

        if(newLayer.newResource && newLayer.newMedia){

            // create layer with media and resource
            newLayer.newMedia.resource = resourceImporter.importResource(newLayer.newResource, sourceLoader);
            var layer = new Layer(newLayer.newMedia.layerIndex);
            let mediaIndex = layer.addMedia(newLayer.newMedia);
            console.log(mediaIndex);
            timeline.addLayer(layer);
            sourceLoader.loadMedia(layer.getMedia(mediaIndex));

            return {
                layerIndex:layer.layerIndex,
                mediaIndex:mediaIndex
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

        console.log(newMedia);
        
        if ( newMedia.newResource ){

            // add new resource to new media in existing layer
            console.log(newMedia.newMedia.layerIndex);
            var layer = timeline.getLayer(newMedia.newMedia.layerIndex);
            newMedia.newMedia.resource = resourceImporter.importResource(newMedia.newResource,sourceLoader);
            console.log(layer);
            let mediaIndex = layer.addMedia(newMedia.newMedia);
            sourceLoader.loadMedia(layer.getMedia(mediaIndex));
            
            return {
                mediaIndex: mediaIndex
            }

        }else if ( newMedia.resource ) {

            // add new media with existing resource
            var layer = timeline.getLayer(newMedia.newMedia.layerIndex);
            newMedia.newMedia.resource = resourceImporter.importResource(newMedia.resource, sourceLoader);
            let mediaIndex = layer.addMedia(newMedia.newMedia);
            sourceLoader.loadMedia(layer.getMedia(mediaIndex));

            return {
                mediaIndex: mediaIndex
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

    this.addResource = function(resource) {
        resourceImporter.importResource(resource, sourceLoader);
    }

    this.changeResource = function(resourceChange){
        resourceImporter.changeResource(resourceChange, sourceLoader);
    };

    this.setTarget = function (canvas) {
        videoProjection.setTarget(canvas);
    };

    this.getAllResources = function(){
        return resourceImporter.getAllResources();
    };

    this.getAllMedia = function () {
        var allMedia = [];
        timeline.getAllLayers().forEach(function(layer){
            layer.getAllMedia().forEach(function(media){
                allMedia.push(media);
            })
        });
        return allMedia;
    };

    this.getAllLayers = function () {
        return timeline.getAllLayers();
    };

    this.getMedia = function(layerIndex, mediaIndex){
        return timeline.getLayer(layerIndex).getMedia(mediaIndex);
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
    
    this.adjustMediaTimeShift = function (direction, layerIndex, mediaIndex, timelineTime) {
        timeline.adjustMediaTimeShift(direction, layerIndex, mediaIndex, timelineTime);
    }

    this.adjustMediaShift = function (currentTimelinePos, newTimelinePos) {
        timeline.adjustMediaShift(currentTimelinePos, newTimelinePos, sourceLoader);
    }

    this.layerControl = function (frameHookName, frameHook) {
        return timeline.contextHooks.registerHooks({name:frameHookName, callbackHook:frameHook});
    };

    this.videoControl = function (frameHookName, frameHook) {

        videoProjection.mediaDrawer.contextHooks
        .registerHooks({name:frameHookName, callbackHook:frameHook});

        if(frameHookName == 'drawingUpdate'){
            videoProjection.mediaDrawer.contextHooks
            .initializeContextHook({name:frameHookName, callbackHook:frameHook});
        }

    };

    this.unbindAllFrameHooks = function () {
        videoProjection.mediaDrawer.contextHooks.unregisterAllHooks();
        timeline.contextHooks.unregisterAllHooks();
    };

    this.unbindFrameHook = function (frameHookParent, hookIndex) {
        //#TODO: add this onto the contexthook class
        switch(frameHookParent) {
            case "layerControl":
                timeline.contextHooks.unregisterHook(hookIndex);
                break;
            case "videoControl":
                videoProjection.mediaDrawer.contextHooks.unregisterHook(hookIndex);
                break;
        }
    };

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
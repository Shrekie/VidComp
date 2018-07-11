
// Modules
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
            var layer = new Layer(newLayer.newMedia.layerIndex, newLayer.newMedia);
            timeline.addLayer(layer);
            resourceImporter.importResource
            (newLayer.newResource, function(resource){
                newLayer.newMedia.resource = resource;
                layer.changeMedia(newLayer.newMedia);
                sourceLoader.loadMedia(layer.getMedia(newLayer.newMedia.name));
                if(newLayer.newResource.resourceLoaded) newLayer.newResource.resourceLoaded();
            });

        }else if (newLayer.newMedia) {

            // create layer with empty media
            var layer = new Layer(newLayer.newMedia.layerIndex, newLayer.newMedia);
            timeline.addLayer(layer);
            sourceLoader.loadMedia(layer.getMedia(newLayer.newMedia.name));

        }else{

            // create layer with no media
            var layer = new Layer(newLayer.layerIndex);
            timeline.addLayer(layer);

        }

    };

    this.addMedia = function (newMedia) {

        if ( newMedia.newResource ){

            // add new resource to new media in existing layer
            resourceImporter.importResource
            (newMedia.newResource, function(resource){
                var layer = timeline.getLayer(newMedia.layerIndex);
                newMedia.resource = resource;
                layer.addMedia(newMedia);
                sourceLoader.loadMedia(layer.getMedia(newMedia.name));
                if(newMedia.newResource.resourceLoaded) newMedia.newResource.resourceLoaded();
            });

        }else if ( newMedia.resource ) {

            // add new media with existing resource
            var layer = timeline.getLayer(newMedia.layerIndex);
            newMedia.resource = resourceImporter.existingResource(newMedia.resource.name);
            layer.addMedia(newMedia);
            sourceLoader.loadMedia(layer.getMedia(newMedia.name));

        } else {

            // add new media without resource
            var layer = timeline.getLayer(newMedia.layerIndex);
            layer.addMedia(newMedia);

        }

    };

    this.editResource = function(resourceChange){

        resourceImporter.changeResource(resourceChange, function(resource){
            // recast media, the source has changed.
            sourceLoader.loadSelectedResource(resource);
        });

    };

    this.editLayer = function(layerChange){
        var layer = timeline.getLayer(layerChange.layerIndex);
        layer.changeMedia(layerChange);
    };

    this.setTarget = function (canvas) {
        videoProjection.setTarget(canvas);
    };

    this.getAllMedia = function (layerIndex) {
        return timeline.getLayer(layerIndex).getAllMedia();
    };

    this.getAllLayers = function () {
        return timeline.getAllLayers();
    };

    this.stopPlaying = function () {
        videoProjection.stopPlaying(sourceLoader);
    };

    this.startPlaying = function () {
        videoProjection.startPlaying(sourceLoader);
    };

    this.resetPlayer = function () {
        videoProjection.resetPlayer(sourceLoader);
    };
    
    this.videoControl = function (frameHookName, frameHook) {
        videoProjection.videoControl(frameHookName, frameHook);
    };

    this.unbindAllFrameHooks = function () {
        videoProjection.unbindAllFrameHooks();
    };

};
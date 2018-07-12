
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
            newLayer.newMedia.resource = resourceImporter.importResource(newLayer.newResource, sourceLoader);
            layer.changeMedia(newLayer.newMedia);
            sourceLoader.loadMedia(layer.getMedia(newLayer.newMedia.name));

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

        console.log(newMedia);
        
        if ( newMedia.newResource ){

            // add new resource to new media in existing layer
            var layer = timeline.getLayer(newMedia.layerIndex);
            newMedia.resource = resourceImporter.importResource(newMedia.newResource,sourceLoader);
            layer.addMedia(newMedia);
            sourceLoader.loadMedia(layer.getMedia(newMedia.name));


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

    this.changeResource = function(resourceChange){
        resourceImporter.changeResource(resourceChange, sourceLoader);
    };

    this.changeLayer = function(layerChange){
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

    this.stop = function () {
        videoProjection.stopPlaying(sourceLoader);
    };

    this.play = function () {
        videoProjection.startPlaying(sourceLoader);
    };

    this.reset = function () {
        videoProjection.resetPlayer(sourceLoader);
    };

    /*
    this.timelineFeed = function(timelineHookName, timelineHook) {
        contextHooks.registerHooks({name:timelineHookName, callbackHook:timelineHook});
    }
    */
   
    this.videoControl = function (frameHookName, frameHook) {
        videoProjection.mediaDrawer
        .contextHooks
        .registerHooks({name:frameHookName, callbackHook:frameHook});
    };

    this.unbindAllFrameHooks = function () {
        videoProjection.mediaDrawer.contextHooks.unregisterHooks();
    };

};
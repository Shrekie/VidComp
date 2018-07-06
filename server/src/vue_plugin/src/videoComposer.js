
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

        if(newLayer.resourceLink && newLayer.mediaName){

            // create layer with media and resource
            resourceImporter.importResource
            (newLayer, function(resource){
                var layer = new Layer({mediaName: newLayer.mediaName, time: newLayer.time, resource});
                timeline.addLayer(layer);
                sourceLoader.loadMedia(layer.getMedia(newLayer.mediaName));
            });

        }else if (newLayer.mediaName) {

            // create layer with empty media
            var layer = new Layer({mediaName: newLayer.mediaName, time: newLayer.time});
            timeline.addLayer(layer);
            sourceLoader.loadMedia(layer.getMedia(newLayer.resourceName));

        }else{

            // create layer with no media
            var layer = new Layer();
            timeline.addLayer(layer);

        }

    };

    this.addMedia = function (newMedia) {

        if (newMedia.resourceLink){

            // add media to existing layer
            resourceImporter.importResource
            (newMedia, function(resource){
                var layer = timeline.getLayer(newMedia.layerIndex);
                newMedia.resource = resource;
                layer.addMedia(newMedia);
                sourceLoader.loadMedia(layer.getMedia(newMedia.mediaName));
            });

        }else{
            var layer = timeline.getLayer(newMedia.layerIndex);
            layer.addMedia(newMedia);
        }

    };

    this.editResource = function(resourceChange){

        resourceImporter.changeResource(resourceChange, function(resource){
            // recast media
            sourceLoader.loadSelectedMedia(resource);
        });

    };

    this.editLayer = function(layerChange){
        var layer = timeline.getLayer(layerChange.layerIndex);
        layer.changeMedia(layerChange);
    };

    this.setTarget = function (canvas) {
        videoProjection.setTarget(canvas);
    };

    this.startPlaying = function () {
        videoProjection.startPlaying(sourceLoader);
    };

};
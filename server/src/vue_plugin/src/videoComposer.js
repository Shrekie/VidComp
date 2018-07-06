
// Modules
import VideoProjection from './modules/videoProjection.js';
import Timeline from './modules/timeline.js';
import ResourceImporter from './modules/resourceImporter.js';
import ResourceLoader from './modules/resourceLoader.js';
import Layer from './modules/layer.js';

export default function () {

    var videoProjection = new VideoProjection();
    var timeline = new Timeline();
    var resourceImporter = new ResourceImporter();
    var resourceLoader = new ResourceLoader();

    this.createLayer = function (newLayer) {

        if(newLayer.resourceLink && newLayer.mediaName){

            // create layer with media and resource
            resourceImporter.importResource
            (newLayer, function(resource){
                var layer = new Layer({mediaName: newLayer.mediaName, time: newLayer.time, resource});
                timeline.addLayer(layer);
                resourceLoader.loadMedia(layer.getMedia(newLayer.mediaName));
            });

        }else if (newLayer.mediaName) {

            // create layer with empty media
            var layer = new Layer({mediaName: newLayer.mediaName, time: newLayer.time});
            timeline.addLayer(layer);
            resourceLoader.loadMedia(layer.getMedia(newLayer.resourceName));

        }else{

            // create layer with no media
            var layer = new Layer();
            timeline.addLayer(layer);

        }

    };

    this.editResource = function(resourceChange){

        resourceImporter.changeResource(resourceChange, function(resource){
            // recast media
            resourceLoader.loadSelectedMedia(resource);
        });

    };

    this.editLayer = function(layerChange){
        var layer = timeline.getLayer(layerChange.layerIndex);
        layer.changeMedia(layerChange);
    };

    this.setTarget = function (canvas) {
        videoProjection.setTarget(canvas);
    };

    this.startDraw = function () {
        videoProjection.drawTimeline(resourceLoader);
    };

};
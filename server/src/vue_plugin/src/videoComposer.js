/*
    API for VideoComposer project plugin.
*/

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

    this.createLayer = function (newLayer, withMedia) {
        if(withMedia){
            resourceImporter.importResource
            (newLayer.resourceLink, newLayer.resourceName, function(resource){
                var layer = new Layer(resource, newLayer.time);
                timeline.addLayer(layer);
                resourceLoader.loadResources(timeline);
            });
        }else{
            var layer = new Layer();
            timeline.addLayer(layer);
        }
    };

    this.editLayer = function(layerChange){

        var layer = timeline.getLayer(layerChange.layerIndex);

        if(layerChange.resourceLink){
            resourceImporter.importResource
            (layerChange.resourceLink, layerChange.resourceName, function(resource){
                layer.changeMedia(layerChange, resource);
                timeline.setLayer(layer, layerChange.layerIndex);
                resourceLoader.loadResources(timeline);
            });
        }else{
            layer.changeMedia(layerChange);
            timeline.setLayer(layer, layerChange.layerIndex);
        }

    };

    this.setTarget = function (canvas) {
        videoProjection.setTarget(canvas);
    };

    this.startDraw = function () {
        videoProjection.drawTimeline(resourceLoader);
    };

};
import ContextHooks from './contextHooks.js';
import mediaShift from './mediaShift.js';
import Layer from './layer.js';

export default function () {

    var store = {
        layers: []
    };

    this.contextHooks = new ContextHooks();

    this.getLayer = function (index) {
        return store.layers[index];
    }

    this.getAllLayers = function () {
        return store.layers;
    }

    this.addLayer = function (layer) {
        return store.layers.push(layer);
    };

    this.adjustMediaShift = function(currentTimelinePos, newTimelinePos, sourceLoader){

        /*

            Based on new position of media, apply changes to timeline.
            And return position 

            #FIXME: mediaIndex indifferent, only maintains uniqueness but makes mediaIndex dirty

        */

        if (newTimelinePos.layerIndex < 0){
            newTimelinePos.layerIndex = Math.abs( Math.abs(newTimelinePos.layerIndex) - currentTimelinePos.layerIndex );
        }else{
            newTimelinePos.layerIndex = newTimelinePos.layerIndex + currentTimelinePos.layerIndex;
        }
        // TODO: If new layerIndex is lower than "0" pre math.abs, push layers down and add new one on 0.
        if(newTimelinePos.layerIndex < 0) newTimelinePos.layerIndex = 0;

        var changedMedia = this.getLayer(currentTimelinePos.layerIndex).getMedia(currentTimelinePos.mediaIndex);
        
        var affectedLayerMedia = this.getLayer(newTimelinePos.layerIndex);
        if(!affectedLayerMedia){
            let newLayer = new Layer(newTimelinePos.layerIndex);
            this.addLayer(newLayer);
            affectedLayerMedia = newLayer.getAllMedia();
        } else {
            affectedLayerMedia = affectedLayerMedia.getAllMedia();
        }

        var changedMediaSize = changedMedia.timelineTime[1] - changedMedia.timelineTime[0];
        changedMedia.timelineTime[0] = newTimelinePos.timelineStartTime;
        changedMedia.timelineTime[1] = newTimelinePos.timelineStartTime + changedMediaSize;

        if(changedMedia.timelineTime[0] < 0){
            mediaShift.negativePush(affectedLayerMedia, changedMedia);
        }

        changedMedia.layerIndex = newTimelinePos.layerIndex;

        if(newTimelinePos.layerIndex == currentTimelinePos.layerIndex){

            mediaShift.checkShift(affectedLayerMedia, changedMedia);

            this.contextHooks.runContextHooks({name:'mediaShift', layerIndex: newTimelinePos.layerIndex});

        }else{

            
            this.getLayer(newTimelinePos.layerIndex).insertMedia(changedMedia);
            this.getLayer(currentTimelinePos.layerIndex).deleteMedia(currentTimelinePos.mediaIndex);
            
            mediaShift.checkShift(affectedLayerMedia, changedMedia);

            sourceLoader.sortMediaLayers();

            this.contextHooks.runContextHooks({name:'mediaShift', layerIndex: newTimelinePos.layerIndex});
            this.contextHooks.runContextHooks({name:'mediaShift', layerIndex: currentTimelinePos.layerIndex});

        }

    }

};
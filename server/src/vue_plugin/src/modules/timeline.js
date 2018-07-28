import ContextHooks from './contextHooks.js';
import mediaShift from './mediaShift.js';
import Layer from './layer.js';

export default function () {

    var store = {
        layers: []
    };

    this.contextHooks = new ContextHooks();

    this.getLayer = function (layerIndex) {
        return store.layers.find(function(layer){
            return layer.layerIndex == layerIndex;
        });
    }

    this.deleteLayer = function (layerIndex) {
        store.layers.splice(layerIndex, 1);
        store.layers.forEach(function(layer, index){
            layer.layerIndex = index;
        });
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
            #FIXME: mediaIndex indifferent, only maintains uniqueness but makes mediaIndex dirty

        */

        // determine new layer position based on relative value
        if (newTimelinePos.layerIndex < 0){
            if(!currentTimelinePos.layerIndex == 0){
                newTimelinePos.layerIndex = Math.abs( Math.abs(newTimelinePos.layerIndex) - currentTimelinePos.layerIndex );
            }else{
                newTimelinePos.layerIndex = 0;
            }
        }else{
            newTimelinePos.layerIndex = newTimelinePos.layerIndex + currentTimelinePos.layerIndex;
        }
        if(newTimelinePos.layerIndex < 0) newTimelinePos.layerIndex = 0;
        
        // get media from layer of layer index
        var affectedLayerMedia = this.getLayer(newTimelinePos.layerIndex);
        if(!affectedLayerMedia){
            let newLayer = new Layer(store.layers.length);
            this.addLayer(newLayer);
            affectedLayerMedia = newLayer.getAllMedia();
            newTimelinePos.layerIndex = store.layers.length - 1;
        } else {
            affectedLayerMedia = affectedLayerMedia.getAllMedia();
        }

        // apply position change to moved media
        var changedMedia = this.getLayer(currentTimelinePos.layerIndex).getMedia(currentTimelinePos.mediaIndex);
        var changedMediaSize = changedMedia.timelineTime[1] - changedMedia.timelineTime[0];
        changedMedia.timelineTime[0] = newTimelinePos.timelineStartTime;
        changedMedia.timelineTime[1] = newTimelinePos.timelineStartTime + changedMediaSize;
        
        if(changedMedia.timelineTime[0] < 0){
            mediaShift.negativePush(affectedLayerMedia, changedMedia);
        }

        changedMedia.layerIndex = newTimelinePos.layerIndex;

        
        if(newTimelinePos.layerIndex == currentTimelinePos.layerIndex){

            // same layer
            mediaShift.checkShift(affectedLayerMedia, changedMedia);
            this.contextHooks.runContextHooks({name:'mediaShift', layerIndex: newTimelinePos.layerIndex});

        }else{

            // new layer, delete from old one and add to new
            this.getLayer(newTimelinePos.layerIndex).insertMedia(changedMedia);
            this.getLayer(currentTimelinePos.layerIndex).deleteMedia(currentTimelinePos.mediaIndex);

            let currentMedia = this.getLayer(currentTimelinePos.layerIndex).getAllMedia();

            mediaShift.checkShift(affectedLayerMedia, changedMedia);

            sourceLoader.sortMediaLayers(); // FIXME: does this need to be aded after deleteLayer?

            
            if(!currentMedia.length > 0){

                // layer media moved from has 0 media, delete the layer
                this.deleteLayer(currentTimelinePos.layerIndex);
                this.contextHooks.runContextHooks({name:'indexShift', maxLength: store.layers.length -1});

            }else{

                this.contextHooks.runContextHooks({name:'mediaShift', layerIndex: newTimelinePos.layerIndex});
                this.contextHooks.runContextHooks({name:'mediaShift', layerIndex: currentTimelinePos.layerIndex});

            }

        }

    }

};
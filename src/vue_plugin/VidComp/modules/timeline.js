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

    this.deleteAllLayers = function () {
        store.layers.splice(0,store.layers.length)
    }

    this.deleteLayer = function (layerIndex) {
        store.layers.splice(layerIndex, 1);
        store.layers.forEach(function(layer, index){
            layer.layerIndex = index;
        });
        this.sortLayers();
    }

    this.getAllLayers = function () {
        return store.layers;
    }

    this.setAllLayers = function (cb) {
        store.layers.forEach((layer, index)=>{cb(layer, index)});
    }

    this.getAllMedia = function () {
        var allMedia = [];
        this.getAllLayers().forEach(function(layer){
            layer.getAllMedia().forEach(function(media){
                allMedia.push(media);
            })
        });
        return allMedia;
    }

    this.addLayer = function (layer) {
        return store.layers.push(layer);
    };

    this.sortLayers = function(){

        store.layers.forEach(function(layer, index){
            layer.getAllMedia().forEach(function(media, index){
                media.layerIndex = layer.layerIndex;
            });
        });

    }

    this.deleteLayerMedia = function(layerIndex, mediaIndex, sourceLoader){

        let layerDeleted = false;
        let mediaLayer = this.getLayer(layerIndex)
        sourceLoader.deleteSourceMedia(layerIndex, mediaIndex);
        mediaLayer.deleteMedia(mediaIndex);

        if(!mediaLayer.getAllMedia().length > 0 && layerIndex != 0){
            this.deleteLayer(layerIndex);
            layerDeleted = true;
        }

        this.contextHooks.runContextHooks({name:'mediaShift'});

        return layerDeleted;

    };

    this.adjustMediaTimeShift = function(direction, layerIndex, mediaIndex, timelineTime){
        
        var changedMedia = this.getLayer(layerIndex).getMedia(mediaIndex);
        var affectedLayerMedia = this.getLayer(layerIndex).getAllMedia();

        if(direction == "forwards"){
            mediaShift.shiftTimeMedia(affectedLayerMedia, direction, changedMedia, timelineTime);
        }else{
            mediaShift.shiftTimeMedia(affectedLayerMedia, direction, changedMedia, timelineTime);
        }

        this.contextHooks.runContextHooks({name:'mediaShift'});

    };
    
    //TODO: Change name of adjustMediaTimeShift and adjustMediaShift

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

        console.log(affectedLayerMedia);

        // apply position change to moved media
        var changedMedia = this.getLayer(currentTimelinePos.layerIndex).getMedia(currentTimelinePos.mediaIndex);
        var changedMediaSize = changedMedia.timelineTime[1] - changedMedia.timelineTime[0];

        changedMedia.timelineTime[0] = newTimelinePos.timelineStartTime;
        changedMedia.timelineTime[1] = newTimelinePos.timelineStartTime + changedMediaSize;

        mediaShift.formatTimelineValue(changedMedia);
        
        if(changedMedia.timelineTime[0] < 0){
            mediaShift.negativePush(affectedLayerMedia, changedMedia);
        }

        changedMedia.layerIndex = newTimelinePos.layerIndex;

        
        if(newTimelinePos.layerIndex == currentTimelinePos.layerIndex){

            // same layer
            mediaShift.checkShift(affectedLayerMedia, changedMedia);
            this.contextHooks.runContextHooks({name:'mediaShift'});

        }else{

            // new layer, delete from old one and add to new
            this.getLayer(newTimelinePos.layerIndex).insertMedia(changedMedia);
            this.getLayer(currentTimelinePos.layerIndex).deleteMedia(currentTimelinePos.mediaIndex);

            let currentMedia = this.getLayer(currentTimelinePos.layerIndex).getAllMedia();

            mediaShift.checkShift(affectedLayerMedia, changedMedia);

            sourceLoader.sortMediaLayers(); // SUGGESTION: does this need to be aded after deleteLayer?

            
            if(!currentMedia.length > 0){

                // layer media moved from has 0 media, delete the layer
                this.deleteLayer(currentTimelinePos.layerIndex);
                this.contextHooks.runContextHooks({name:'mediaShift'});
                if(changedMedia.layerIndex == newTimelinePos.layerIndex){
                    console.log(store.layers);
                }

            }else{

                this.contextHooks.runContextHooks({name:'mediaShift'});

            }

        }

    }

};
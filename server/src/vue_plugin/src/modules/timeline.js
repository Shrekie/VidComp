import ContextHooks from './contextHooks.js';

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

            currentTimelinePos.layerIndex
            currentTimelinePos.mediaIndex

            newTimelinePos.layerIndex
            newTimelinePos.timelineStartTime

        */
        
        if (newTimelinePos.layerIndex < 0){
            newTimelinePos.layerIndex = Math.abs(newTimelinePos.layerIndex) - currentTimelinePos.layerIndex;
        }else{
            newTimelinePos.layerIndex = newTimelinePos.layerIndex + currentTimelinePos.layerIndex;
        }

        if(newTimelinePos.layerIndex < 0) newTimelinePos.layerIndex = 0;

        var changedMedia = this.getLayer(currentTimelinePos.layerIndex).getMedia(currentTimelinePos.mediaIndex);

        var affectedLayerMedia = this.getLayer(newTimelinePos.layerIndex).getAllMedia();

        var changedMediaSize = changedMedia.timelineTime[1] - changedMedia.timelineTime[0];
        changedMedia.timelineTime[0] = newTimelinePos.timelineStartTime;
        changedMedia.timelineTime[1] = newTimelinePos.timelineStartTime + changedMediaSize;

        var shiftMedia = function(direction, shiftPos, media) {

            if(direction == 'forwards'){
                media.timelineTime[1] = media.timelineTime[1] + shiftPos;
                media.timelineTime[0] = media.timelineTime[0] + shiftPos;

            }else{
                media.timelineTime[1] = media.timelineTime[1] - shiftPos;
                media.timelineTime[0] = media.timelineTime[0] - shiftPos;
            }

            checkShift(media);

        };

        var checkShift = function (changedMedia) {
            
            affectedLayerMedia.forEach(function(media){

                if( 
                    
                    (changedMedia.timelineTime[0] > media.timelineTime[0] 
                    && 
                    changedMedia.timelineTime[0] < media.timelineTime[1]) 
                    
                    || 

                    (changedMedia.timelineTime[1] > media.timelineTime[0] && 
                    changedMedia.timelineTime[1] < media.timelineTime[1]) 
                    
                    ||

                    (media.timelineTime[0] > changedMedia.timelineTime[0] &&
                    media.timelineTime[1] < changedMedia.timelineTime[1])
                    
                ){
                    
                    var middleValue = ((media.timelineTime[1] - media.timelineTime[0])/2);
                    var ChangedmiddleValue = ((changedMedia.timelineTime[1] - changedMedia.timelineTime[0])/2);
                    var middleOfMediaPos = media.timelineTime[0] + middleValue;
                    var middleOfChangedMediaPos = changedMedia.timelineTime[0] + ChangedmiddleValue;



                    if(middleOfChangedMediaPos < middleOfMediaPos){
                        let shiftedFrontPos = changedMedia.timelineTime[1] - media.timelineTime[0];
                        shiftMedia('forwards', shiftedFrontPos, media);

                    }else{
                        let shiftedBackPos =  media.timelineTime[1] - changedMedia.timelineTime[0];
                        shiftMedia('backwards', shiftedBackPos, media);

                    }

                }

            });

        }

        checkShift(changedMedia);

        changedMedia.layerIndex = newTimelinePos.layerIndex;

        if(newTimelinePos.layerIndex == currentTimelinePos.layerIndex){

            this.contextHooks.runContextHooks({name:'mediaShift', layerIndex: newTimelinePos.layerIndex});

        }else{

            
            changedMedia.mediaIndex = this.getLayer(newTimelinePos.layerIndex).insertMedia(changedMedia);
            this.getLayer(currentTimelinePos.layerIndex).deleteMedia(currentTimelinePos.mediaIndex);
            sourceLoader.sortMediaLayers();

            this.contextHooks.runContextHooks({name:'mediaShift', layerIndex: newTimelinePos.layerIndex});
            this.contextHooks.runContextHooks({name:'mediaShift', layerIndex: currentTimelinePos.layerIndex});

        }

    }

    // FIXME: probably remove this, remember change
    this.eachLayer = function (cb) {
        store.layers.forEach(function(layer){
            cb(layer);
        });
    };

};
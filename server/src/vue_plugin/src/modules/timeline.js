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

    this.adjustMediaShift = function(currentTimelinePos, newTimelinePos){

        /*
            Based on new position of media, apply changes to timeline.
            And return position 

            currentTimelinePos.layerIndex
            currentTimelinePos.mediaIndex

            newTimelinePos.layerIndex
            newTimelinePos.timelineStartTime

        */

        var changedMedia = this.getLayer(currentTimelinePos.layerIndex).getMedia(currentTimelinePos.mediaIndex);

        var affectedLayerMedia = this.getLayer(newTimelinePos.layerIndex).getAllMedia();

        var shiftMedia = function(direction, shiftPos, media) {

            if(direction == 'forwards'){
                media.timelineTime[1] = media.timelineTime[1] + shiftPos;
                media.timelineTime[0] = media.timelineTime[0] + shiftPos;

            }else{
                media.timelineTime[1] = media.timelineTime[1] - shiftPos;
                media.timelineTime[0] = media.timelineTime[0] - shiftPos;
            }
                
        };

        var changedMediaSize = changedMedia.timelineTime[1] - changedMedia.timelineTime[0];
        changedMedia.timelineTime[0] = newTimelinePos.timelineStartTime;
        changedMedia.timelineTime[1] = newTimelinePos.timelineStartTime + changedMediaSize;

        affectedLayerMedia.forEach(function(media){
            if( (changedMedia.timelineTime[0] > media.timelineTime[0] && 
                changedMedia.timelineTime[0] < media.timelineTime[1]) || 
                (changedMedia.timelineTime[1] > media.timelineTime[0] && 
                    changedMedia.timelineTime[1] < media.timelineTime[1])  ) {
                
            
                console.log(changedMedia.timelineTime[0]);
                console.log(changedMedia.timelineTime[1]);
                var middleValue = ((changedMedia.timelineTime[1] - changedMedia.timelineTime[0])/2);

                var middleOfMediaPos = changedMedia.timelineTime[0] + middleValue;
                
                console.log(media.timelineTime[0]);
                console.log(middleOfMediaPos);

                if(media.timelineTime[0] > middleOfMediaPos){
                    let shiftedFrontPos = changedMedia.timelineTime[1] - media.timelineTime[0];
                    shiftMedia('forwards', shiftedFrontPos, media);

                }else{
                    let shiftedBackPos =  media.timelineTime[1] - changedMedia.timelineTime[0];
                    shiftMedia('backwards', shiftedBackPos, media);

                }

            }

        });

        console.log(affectedLayerMedia);


        if(newTimelinePos.layerIndex == currentTimelinePos.layerIndex){
            this.getLayer(currentTimelinePos.layerIndex).changeMedia(changedMedia);
            this.contextHooks.runContextHooks({name:'mediaShift', layerIndex: newTimelinePos.layerIndex});
        }else{
            this.getLayer(currentTimelinePos.layerIndex).deleteMedia(currentTimelinePos.mediaIndex);
            this.getLayer(newTimelinePos.layerIndex).addMedia(changedMedia);
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
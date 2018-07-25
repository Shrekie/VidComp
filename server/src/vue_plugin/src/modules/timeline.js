import ContextHooks from './contextHooks.js';

export default function () {

    var store = {
        layers: []
    };
    
    //TODO: media shifting in own class and extendable?
    // could implement like polymorphic shifting types based on how user wants shift to work
    var shiftMedia = function(affectedLayerMedia, direction, shiftPos, targetMedia) {

        var setShiftPos = function (direction, targetMedia, shiftPos){

            if(direction == "forwards"){
                targetMedia.timelineTime[1] = targetMedia.timelineTime[1] + shiftPos;
                targetMedia.timelineTime[0] = targetMedia.timelineTime[0] + shiftPos;
            }else{
                targetMedia.timelineTime[1] = targetMedia.timelineTime[1] - shiftPos;
                targetMedia.timelineTime[0] = targetMedia.timelineTime[0] - shiftPos;
            }

        }

        var checkCascade = function (direction, targetMedia, shiftPos){

            if(direction == "forwards"){

                affectedLayerMedia.forEach(function(media){
                    if(media.timelineTime[0] >= targetMedia.timelineTime[1] && 
                        targetMedia.timelineTime[1] + shiftPos > media.timelineTime[0]){
                        checkCascade(direction, media, shiftPos);
                        setShiftPos(direction, media, shiftPos);
                    }
                });
            
               
            }else{

                affectedLayerMedia.forEach(function(media){
                    if(media.timelineTime[1] <= targetMedia.timelineTime[0] && 
                        targetMedia.timelineTime[0] - shiftPos < media.timelineTime[1]){
                        checkCascade(direction, media, shiftPos);
                        setShiftPos(direction, media, shiftPos);
                    }
                });
                

            }

        }

        checkCascade(direction, targetMedia, shiftPos);
        setShiftPos(direction, targetMedia, shiftPos)

        let negativeMedia = [];
        
        affectedLayerMedia.forEach(function(media){
            if(media.timelineTime[0] < 0) negativeMedia.push(media);
        });

        if(negativeMedia.length > 0) negativePush(affectedLayerMedia, negativeMedia);

    };

    var checkShift = function (affectedLayerMedia, changedMedia) {
            
        affectedLayerMedia.forEach(function(media){

            if( 
                
                (changedMedia.timelineTime[0] > media.timelineTime[0] 
                && 
                changedMedia.timelineTime[0] < media.timelineTime[1]) 
                
                || 

                (changedMedia.timelineTime[1] > media.timelineTime[0] 
                && 
                changedMedia.timelineTime[1] < media.timelineTime[1]) 
                
                ||

                (media.timelineTime[0] > changedMedia.timelineTime[0] 
                &&
                media.timelineTime[1] < changedMedia.timelineTime[1])
                
            ){
                
                var middleValue = ((media.timelineTime[1] - media.timelineTime[0])/2);
                var ChangedmiddleValue = ((changedMedia.timelineTime[1] - changedMedia.timelineTime[0])/2);
                var middleOfMediaPos = media.timelineTime[0] + middleValue;
                var middleOfChangedMediaPos = changedMedia.timelineTime[0] + ChangedmiddleValue;



                if(middleOfChangedMediaPos < middleOfMediaPos){
                    let shiftedFrontPos = changedMedia.timelineTime[1] - media.timelineTime[0];
                    shiftMedia(affectedLayerMedia, 'forwards', shiftedFrontPos, media);

                }else if (middleOfChangedMediaPos > middleOfMediaPos){
                    let shiftedBackPos =  media.timelineTime[1] - changedMedia.timelineTime[0];
                    shiftMedia(affectedLayerMedia, 'backwards', shiftedBackPos, media);

                }

            }

        });

    }

    var negativePush = function(affectedLayerMedia, targetMedia){
        // adjust media if they were negatively positioned
        
        var targetedTargetMedia = 0; //FIXME: this name smh

        if(Array.isArray(targetMedia)){

            targetMedia.sort(function (a, b) {
                if (a.timelineTime[0] > b.timelineTime[0]) return 1;
                if (a.timelineTime[0] < b.timelineTime[0]) return -1;
                return 0;
            });

            targetedTargetMedia = targetMedia[targetMedia.length - 1];
        }else{
            targetedTargetMedia = targetMedia;
        }

        var shiftPos = Math.abs(targetedTargetMedia.timelineTime[0]);
        var timeSize = Math.abs(targetedTargetMedia.timelineTime[1] - targetedTargetMedia.timelineTime[0]);
        affectedLayerMedia.forEach(function(media){
            media.timelineTime[0] = media.timelineTime[0] + shiftPos;
            media.timelineTime[1] = media.timelineTime[1] + shiftPos;
        });
        targetedTargetMedia.timelineTime[0] = 0;
        targetedTargetMedia.timelineTime[1] = timeSize;

    }

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

            #FIXME: mediaIndex indifferent, only maintains uniqueness but makes mediaIndex dirty
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

        if(changedMedia.timelineTime[0] < 0){
            negativePush(affectedLayerMedia, changedMedia);
        }

        changedMedia.layerIndex = newTimelinePos.layerIndex;

        if(newTimelinePos.layerIndex == currentTimelinePos.layerIndex){

            checkShift(affectedLayerMedia, changedMedia);

            this.contextHooks.runContextHooks({name:'mediaShift', layerIndex: newTimelinePos.layerIndex});

        }else{

            
            this.getLayer(newTimelinePos.layerIndex).insertMedia(changedMedia);
            this.getLayer(currentTimelinePos.layerIndex).deleteMedia(currentTimelinePos.mediaIndex);
            
            checkShift(affectedLayerMedia, changedMedia);

            sourceLoader.sortMediaLayers();

            this.contextHooks.runContextHooks({name:'mediaShift', layerIndex: newTimelinePos.layerIndex});
            this.contextHooks.runContextHooks({name:'mediaShift', layerIndex: currentTimelinePos.layerIndex});

        }

    }

};
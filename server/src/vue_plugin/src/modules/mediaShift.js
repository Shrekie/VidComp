// could implement like polymorphic shifting types based on how user wants shift to work
function MediaShift() {

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
                // TODO: fix whitespace when i dont need to debug anymore
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

                } else {

                    // it is exactly on the middle, make it go forwards
                    let shiftedFrontPos = changedMedia.timelineTime[1] - media.timelineTime[0];
                    shiftMedia(affectedLayerMedia, 'forwards', shiftedFrontPos, media);

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

        /*
            "static push"

        if(Array.isArray(targetMedia)){
            shiftMedia(affectedLayerMedia, 'forwards', shiftPos, targetMedia[0]);
            targetMedia.forEach(function(media){
                media.timelineTime[0] = media.timelineTime[0] + shiftPos;
                media.timelineTime[1] = media.timelineTime[1] + shiftPos;
            });
        } 
        else {
            shiftMedia(affectedLayerMedia, 'forwards', shiftPos, targetedTargetMedia);
            media.timelineTime[0] = media.timelineTime[0] + shiftPos;
            media.timelineTime[1] = media.timelineTime[1] + shiftPos;
        }

        */

        affectedLayerMedia.forEach(function(media){
            media.timelineTime[0] = media.timelineTime[0] + shiftPos;
            media.timelineTime[1] = media.timelineTime[1] + shiftPos;
        });

        targetedTargetMedia.timelineTime[0] = 0;
        targetedTargetMedia.timelineTime[1] = timeSize;

    }

    return{
        shiftMedia,
        negativePush,
        checkShift
    }

}

// TODO: add the methods to prototype for proper static class
export default MediaShift();
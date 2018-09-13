import timeline from "./timeline";

// could implement like polymorphic shifting types based on how user wants shift to work
function MediaShift() {

    var formatTimelineValue = function(targetMedia){

        // make sure timelineTime is at 3 decimal places.
        targetMedia.timelineTime[0] =  Math.round(targetMedia.timelineTime[0] * 1000) / 1000;
        targetMedia.timelineTime[1] =  Math.round(targetMedia.timelineTime[1] * 1000) / 1000;

    }

    var setShiftPos = function (direction, targetMedia, shiftPos){

        if(direction == "forwards"){
            targetMedia.timelineTime[1] = targetMedia.timelineTime[1] + shiftPos;
            targetMedia.timelineTime[0] = targetMedia.timelineTime[0] + shiftPos;
        }else{
            targetMedia.timelineTime[1] = targetMedia.timelineTime[1] - shiftPos;
            targetMedia.timelineTime[0] = targetMedia.timelineTime[0] - shiftPos;
        }

        formatTimelineValue(targetMedia);

    }

    var checkCascade = function (affectedLayerMedia, direction, targetMedia, shiftPos){
        
        // cascades through affectedLayerMedia and shifts based on amount by shiftpos recursively

        // TODO: make the decimal format abstracted for predictedLength
        // predicted amount performed shift media has shifted
        var predictedLength = 0;

        if(direction == "forwards"){

            predictedLength = targetMedia.timelineTime[1] + shiftPos;
            predictedLength = Math.round(predictedLength * 1000) / 1000;
            console.log("FORWARDS");
            console.log("predictedLength: " +predictedLength);
            console.log("targetMedia.timelineTime[0]: " + targetMedia.timelineTime[0]);
            console.log("targetMedia.timelineTime[1]: " + targetMedia.timelineTime[1]);
            affectedLayerMedia.forEach(function(media){
                console.log("media.timelineTime[0]: " + media.timelineTime[1]);
                console.log("media.timelineTime[1]: " + media.timelineTime[1]);
                if(media.timelineTime[0] >= targetMedia.timelineTime[1] && 
                    predictedLength > media.timelineTime[0]){
                    checkCascade(affectedLayerMedia, direction, media, shiftPos);
                    setShiftPos(direction, media, shiftPos);
                }
            });
        
           
        }else{

            predictedLength = targetMedia.timelineTime[0] - shiftPos;
            predictedLength = Math.round(predictedLength * 1000) / 1000;
            console.log("BACK");
            console.log("predictedLength: " +predictedLength);
            console.log("targetMedia.timelineTime[0]: " + targetMedia.timelineTime[0]);
            console.log("targetMedia.timelineTime[1]: " + targetMedia.timelineTime[1]);
            affectedLayerMedia.forEach(function(media){
                console.log("media.timelineTime[0]: " + media.timelineTime[1]);
                console.log("media.timelineTime[1]: " + media.timelineTime[1]);
                if(media.timelineTime[1] <= targetMedia.timelineTime[0] && 
                    predictedLength < media.timelineTime[1]){
                    checkCascade(affectedLayerMedia, direction, media, shiftPos);
                    setShiftPos(direction, media, shiftPos);
                }
            });
            

        }

    }

    var shiftMedia = function(affectedLayerMedia, direction, shiftPos, targetMedia) {
        
        // end and start pattern of cascading media shifting
        console.log("DROP SHIFTPOS: " + shiftPos);

        checkCascade(affectedLayerMedia, direction, targetMedia, shiftPos);
        setShiftPos(direction, targetMedia, shiftPos)

        let negativeMedia = [];

        // set a array of media that are pushed negatively and give to negativePush
        affectedLayerMedia.forEach(function(media){
            if(media.timelineTime[0] < 0) negativeMedia.push(media);
        });

        if(negativeMedia.length > 0) negativePush(affectedLayerMedia, negativeMedia);

    };

    var shiftTimeMedia = function(affectedLayerMedia, direction, targetMedia, timelineTime){

        //TODO: bind this tighter with shiftMedia
        /*
            #SUGGESTION: seems a little forced, rather have the entire flow with checkShift, 
            to only push amount borders cross
        */
       
        var shiftPos = 0;

        if(direction=="forwards"){
            shiftPos = timelineTime - targetMedia.timelineTime[1];
        }else{
            shiftPos =  targetMedia.timelineTime[0] - timelineTime;
        }
        console.log("DRAG SHIFTPOS: " + shiftPos);
        checkCascade(affectedLayerMedia, direction, targetMedia, shiftPos);

        if(direction=="forwards"){
            targetMedia.timelineTime[1] = timelineTime;
        }else{
            targetMedia.timelineTime[0] = timelineTime;
        }
        
        formatTimelineValue(targetMedia);

        let negativeMedia = [];
        
        affectedLayerMedia.forEach(function(media){
            if(media.timelineTime[0] < 0) negativeMedia.push(media);
        });

        if(negativeMedia.length > 0) negativePush(affectedLayerMedia, negativeMedia);

    }

    var checkShift = function (affectedLayerMedia, changedMedia) {

        var specifyShift = function(changedMedia, media){
            // specifies how media should be pushed

            var middleValue = ((media.timelineTime[1] - media.timelineTime[0])/2);
            var ChangedmiddleValue = ((changedMedia.timelineTime[1] - changedMedia.timelineTime[0])/2);
            var middleOfMediaPos = media.timelineTime[0] + middleValue;
            var middleOfChangedMediaPos = changedMedia.timelineTime[0] + ChangedmiddleValue;
            var direction;
            var shiftPos;
    
            if(middleOfChangedMediaPos < middleOfMediaPos){
    
                shiftPos = changedMedia.timelineTime[1] - media.timelineTime[0];
                direction = 'forwards';
    
            }else if (middleOfChangedMediaPos > middleOfMediaPos){
    
                shiftPos =  media.timelineTime[1] - changedMedia.timelineTime[0];
                direction = 'backwards';
    
            } else {
                // it is exactly on the middle, make it go forwards
                shiftPos = changedMedia.timelineTime[1] - media.timelineTime[0];
                direction = 'forwards';
    
            }

            return {direction, shiftPos, media};

        };

        var shiftClosestSpecification = function(shiftSpecification, direction){

            // shifts either single specification or an array
            if(shiftSpecification.length <= 1){

                if(shiftSpecification.length > 0){
                    shiftMedia(affectedLayerMedia, shiftSpecification[0].direction,
                        shiftSpecification[0].shiftPos, shiftSpecification[0].media);
                }

            }else{
                
                // if array sort to closest based on direction

                if(direction == 'forwards'){

                    shiftSpecification.sort(function (a, b) {
                        if (a.media.timelineTime[0] < b.media.timelineTime[0])
                            return -1;
                        if (a.media.timelineTime[0] > b.media.timelineTime[0])
                            return 1;
                        return 0;
                    });

                }else{

                    shiftSpecification.sort(function (a, b) {
                        if (a.media.timelineTime[1] > b.media.timelineTime[1])
                            return -1;
                        if (a.media.timelineTime[1] < b.media.timelineTime[1])
                            return 1;
                        return 0;
                    });

                }
                
                shiftMedia(affectedLayerMedia, shiftSpecification[0].direction,
                    shiftSpecification[0].shiftPos, shiftSpecification[0].media);

            }

        }

        var targetedAffectedMedia = [];

        affectedLayerMedia.forEach(function(media){

            // check if drop position has media on it
            if( 
                // TODO: fix whitespace when i dont need to debug anymore
                // TODO: im pretty sure this check can be simplified
                media !== changedMedia

                &&
                (
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
                    media.timelineTime[1] <= changedMedia.timelineTime[1])

                    ||

                    (media.timelineTime[0] >= changedMedia.timelineTime[0] 
                    &&
                    media.timelineTime[1] <= changedMedia.timelineTime[1])
                )
            ){
                targetedAffectedMedia.push(media);
            }

        });

        if(targetedAffectedMedia.length > 0){

            // shift closest of the targeted affected media

            if(targetedAffectedMedia.length <= 1){

                let shiftSpecification = specifyShift(changedMedia, targetedAffectedMedia[0]);
                shiftMedia(affectedLayerMedia, shiftSpecification.direction,
                shiftSpecification.shiftPos, shiftSpecification.media);

            }else{

                let backwardShiftSpecifications = [];
                let forwardShiftSpecifications = []; 

                targetedAffectedMedia.forEach(function(media){

                    let shiftSpecification = specifyShift(changedMedia, media);

                    if(shiftSpecification.direction == "forwards"){
                        forwardShiftSpecifications.push(shiftSpecification);
                    }else{
                        backwardShiftSpecifications.push(shiftSpecification);
                    }

                });

                shiftClosestSpecification(forwardShiftSpecifications, 'forwards');
                shiftClosestSpecification(backwardShiftSpecifications, 'backwards');

            }

        }

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

            targetedTargetMedia = targetMedia[0];
        }else{
            targetedTargetMedia = targetMedia;
        }

        var shiftPos = Math.abs(targetedTargetMedia.timelineTime[0]);
        var timeSize = targetedTargetMedia.timelineTime[1] - targetedTargetMedia.timelineTime[0];

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
            formatTimelineValue(media);
        });

        targetedTargetMedia.timelineTime[0] = 0;
        targetedTargetMedia.timelineTime[1] = timeSize;
        formatTimelineValue(targetedTargetMedia);

    }

    return{
        
        shiftMedia,
        shiftTimeMedia,
        negativePush,
        checkShift,
        checkCascade,
        setShiftPos,
        formatTimelineValue

    }

}

// TODO: add the methods to prototype for proper static class
export default MediaShift();
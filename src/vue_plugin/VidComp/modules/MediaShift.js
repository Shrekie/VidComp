class MediaShift {

    // FIXME: static boyeee

    static formatTimelineValue (targetMedia) {

        // make sure timelineTime is at 3 decimal places.
        targetMedia.timelineTime[0] =  Math.round(targetMedia.timelineTime[0] * 1000) / 1000;
        targetMedia.timelineTime[1] =  Math.round(targetMedia.timelineTime[1] * 1000) / 1000;

    }

    static _setShiftPos (direction, targetMedia, shiftPos) {

        if(direction == "forwards"){
            targetMedia.timelineTime[1] = targetMedia.timelineTime[1] + shiftPos;
            targetMedia.timelineTime[0] = targetMedia.timelineTime[0] + shiftPos;
        }else{
            targetMedia.timelineTime[1] = targetMedia.timelineTime[1] - shiftPos;
            targetMedia.timelineTime[0] = targetMedia.timelineTime[0] - shiftPos;
        }

        MediaShift.formatTimelineValue(targetMedia);

    }

    static _checkCascade = function (affectedLayerMedia, direction, targetMedia, shiftPos){
        
        // cascades through affectedLayerMedia and shifts based on amount by shiftpos recursively

        // TODO: make the decimal format abstracted for predictedLength
        // predicted amount performed shift media has shifted
        var predictedLength = 0;

        if(direction == "forwards"){

            predictedLength = targetMedia.timelineTime[1] + shiftPos;
            predictedLength = Math.round(predictedLength * 1000) / 1000;

            affectedLayerMedia.forEach(function(media){
                if(media.timelineTime[0] >= targetMedia.timelineTime[1] && 
                    predictedLength > media.timelineTime[0]){
                    this._checkCascade(affectedLayerMedia, direction, media, shiftPos);
                    this._setShiftPos(direction, media, shiftPos);
                }
            }.bind(this));
        
           
        }else{

            predictedLength = targetMedia.timelineTime[0] - shiftPos;
            predictedLength = Math.round(predictedLength * 1000) / 1000;

            affectedLayerMedia.forEach(function(media){
                if(media.timelineTime[1] <= targetMedia.timelineTime[0] && 
                    predictedLength < media.timelineTime[1]){
                    this._checkCascade(affectedLayerMedia, direction, media, shiftPos);
                    this._setShiftPos(direction, media, shiftPos);
                }
            }.bind(this));
            

        }

    }

    static shiftMedia (affectedLayerMedia, direction, shiftPos, targetMedia) {
        
        // end and start pattern of cascading media shifting
        console.log("DROP SHIFTPOS: " + shiftPos);

        this._checkCascade(affectedLayerMedia, direction, targetMedia, shiftPos);
        this._setShiftPos(direction, targetMedia, shiftPos)

        let negativeMedia = [];

        // set a array of media that are pushed negatively and give to negativePush
        affectedLayerMedia.forEach(function(media){
            if(media.timelineTime[0] < 0) negativeMedia.push(media);
        });

        if(negativeMedia.length > 0) this.negativePush(affectedLayerMedia, negativeMedia);

    }

    static shiftTimeMedia (affectedLayerMedia, direction, targetMedia, timelineTime, sourceLoader){

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
        
        if(direction!="forwards") this._moveStartTime(shiftPos, targetMedia, sourceLoader);
        this._checkCascade(affectedLayerMedia, direction, targetMedia, shiftPos);

        if(direction=="forwards"){
            targetMedia.timelineTime[1] = timelineTime;
        }else{
            targetMedia.timelineTime[0] = timelineTime;
        }
        
        MediaShift.formatTimelineValue(targetMedia);

        let negativeMedia = [];
        
        affectedLayerMedia.forEach(function(media){
            if(media.timelineTime[0] < 0) negativeMedia.push(media);
        });

        if(negativeMedia.length > 0) this.negativePush(affectedLayerMedia, negativeMedia);

    }

    static _specifyShift (changedMedia, media) {

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

    }

    static _shiftClosestSpecification (affectedLayerMedia, shiftSpecification, direction) {

        // shifts either single specification or an array
        if(shiftSpecification.length <= 1){

            if(shiftSpecification.length > 0){
                this.shiftMedia(affectedLayerMedia, shiftSpecification[0].direction,
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
            
            this.shiftMedia(affectedLayerMedia, shiftSpecification[0].direction,
                shiftSpecification[0].shiftPos, shiftSpecification[0].media);

        }

    }

    static checkShift (affectedLayerMedia, changedMedia) {

        var targetedAffectedMedia = [];

        affectedLayerMedia.forEach(function(media){

            // check if drop position has media on it
            // FIXME: UHHHH
            if( media !== changedMedia &&
                ((changedMedia.timelineTime[0] > media.timelineTime[0] && 
                    changedMedia.timelineTime[0] < media.timelineTime[1]) || 
                    (changedMedia.timelineTime[1] > media.timelineTime[0] && 
                    changedMedia.timelineTime[1] < media.timelineTime[1]) ||
                    (media.timelineTime[0] > changedMedia.timelineTime[0] &&
                    media.timelineTime[1] <= changedMedia.timelineTime[1]) ||
                    (media.timelineTime[0] >= changedMedia.timelineTime[0] &&
                    media.timelineTime[1] <= changedMedia.timelineTime[1])
                )
            ){
                targetedAffectedMedia.push(media);
            }

        });

        if(targetedAffectedMedia.length > 0){

            // shift closest of the targeted affected media

            if(targetedAffectedMedia.length <= 1){

                let shiftSpecification = this._specifyShift(changedMedia, targetedAffectedMedia[0]);
                this.shiftMedia(affectedLayerMedia, shiftSpecification.direction,
                shiftSpecification.shiftPos, shiftSpecification.media);

            }else{

                let backwardShiftSpecifications = [];
                let forwardShiftSpecifications = []; 

                targetedAffectedMedia.forEach(function(media){

                    let shiftSpecification = this._specifyShift(changedMedia, media);

                    if(shiftSpecification.direction == "forwards"){
                        forwardShiftSpecifications.push(shiftSpecification);
                    }else{
                        backwardShiftSpecifications.push(shiftSpecification);
                    }

                }.bind(this));

                this._shiftClosestSpecification(affectedLayerMedia, 
                forwardShiftSpecifications, 'forwards');
                this._shiftClosestSpecification(affectedLayerMedia, 
                backwardShiftSpecifications, 'backwards');

            }

        }

    }

    static _moveStartTime = function (shiftPos, media, sourceLoader){

        let mediaCast = sourceLoader.getMediaCast(media);
        if(mediaCast){
            let newStartTime = media.videoStartTime - (shiftPos*100);
            media.videoStartTime = Math.floor((((newStartTime/mediaCast.duration)
            - (Math.ceil(newStartTime/mediaCast.duration)-1)) * mediaCast.duration )* 1e2) / 1e2;
        }

    }

    static negativePush = function(affectedLayerMedia, targetMedia){
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

        affectedLayerMedia.forEach(function(media){
            console.log(media);
            media.timelineTime[0] = media.timelineTime[0] + shiftPos;
            media.timelineTime[1] = media.timelineTime[1] + shiftPos;
            MediaShift.formatTimelineValue(media);
        });

        targetedTargetMedia.timelineTime[0] = 0;
        targetedTargetMedia.timelineTime[1] = timeSize;
        MediaShift.formatTimelineValue(targetedTargetMedia);

    }

}

export default MediaShift;
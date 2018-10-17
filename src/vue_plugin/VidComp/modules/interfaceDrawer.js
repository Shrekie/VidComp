export default function (timeTracker) {

    var timeTracker = timeTracker;

    this.scrubVideo = function (elapsedDateTime, sourceLoader, videoOutput, betweenFrames) {

        //TODO: make a draw/time helper utility
        timeTracker.elapsedDateTime = elapsedDateTime;
        timeTracker.startTime();
        timeTracker.trackTime();
        let elapsed = timeTracker.elapsed;
        let scrubBus = [];

        sourceLoader.eachSource().forEach(function(source){

            if(source.status == "ready"){

                if(source.type == 'image'){
                    if( elapsed >= source.media.timelineTime[0] && elapsed <= source.media.timelineTime[1]){
                        scrubBus.push(
                            new Promise(resolve => {
                                resolve(source);
                        }));
                    }
                }

                if(source.type == 'video'){

                    if( elapsed >= source.media.timelineTime[0] && elapsed <= source.media.timelineTime[1]){

                        // if paused, shift currentTime to correct pos
                        let currentTime = 
                        Math.floor((source.media.videoStartTime + 
                        (timeTracker.convertTimeInteger(elapsed) - 
                        timeTracker.convertTimeInteger(source.media.timelineTime[0])))*1e2)/1e2

                        // relative repeating of course
                        currentTime = ((currentTime/source.cast.duration)
                        -(Math.ceil(currentTime/source.cast.duration)-1)) * source.cast.duration;

                        source.cast.currentTime = Math.floor(currentTime * 1e2 ) / 1e2;
                        
                        scrubBus.push(
                        new Promise(resolve => {
                            source.cast.oncanplay = function() {
                                resolve(source);
                                source.cast.ontimeupdate = null;
                            };
                        }));


                    }

                }
            }


        });

        Promise.all(scrubBus).then(function(sources) {

            videoOutput.ctx.clearRect(0,0, videoOutput.el.width, videoOutput.el.height);

            sources.forEach(function(source){
                if(source.status == "ready"){
                    videoOutput.ctx.drawImage(source.cast, 
                    source.media.position[0], source.media.position[1],
                    source.media.size[0], source.media.size[1])
                    betweenFrames(source);
                }
            });

        });

    }

}
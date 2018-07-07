export default function () {

    // FIXME: this object has too many responsibilities, split up

    var startTime = 0;
    var nowTime = 0;
    var elapsed = 0;
    var isPlaying = false;
    var animationFrame = {};

    var trackTime = function(){

        nowTime = new Date();
        elapsed = nowTime - startTime;
        elapsed /= 1000;
        elapsed = Math.round(elapsed);

    };

    var resetContent = function (sourceLoader) {

        sourceLoader.eachSource(function(source){
            if(source.type == 'video'){
                if(!source.cast.paused){
                    // reset videos
                    source.cast.load();
                    source.cast.pause();
                }
            }
        });

    };

    var videoUpdate = function (sourceLoader, videoOutput) {

        videoOutput.ctx.clearRect(0,0, videoOutput.el.width, videoOutput.el.height);

        sourceLoader.eachSource(function(source){
            
            if(source.type == 'image'){
                if( elapsed >= source.media.timelineTime[0] && elapsed <= source.media.timelineTime[1]){
                    videoOutput.ctx.drawImage(source.cast, source.media.position[0], source.media.position[1],
                    source.media.size[0], source.media.size[1]);
                }
            }

            if(source.type == 'video'){
                if( elapsed >= source.media.timelineTime[0] && elapsed <= source.media.timelineTime[1]){
                    if(source.cast.paused){
                        // video starts displaying
                        source.cast.currentTime = source.media.videoStartTime;
                        source.cast.play();
                    } 
                    videoOutput.ctx.drawImage(source.cast, source.media.position[0], source.media.position[1],
                    source.media.size[0], source.media.size[1]);
                }else if(!source.cast.paused){
                    // video stops displaying
                    source.cast.load();
                    source.cast.pause();
                }
            }

        });
        
        trackTime();
        animationFrame = requestAnimationFrame(function () { videoUpdate(sourceLoader, videoOutput) });
    };

    this.stopDrawSources = function (sourceLoader) {

        if(isPlaying){

            resetContent(sourceLoader);
            cancelAnimationFrame(animationFrame);
            isPlaying = false;
            elapsed = 0;
            startTime = 0;

        }

    }

    this.drawSources = function (sourceLoader, videoOutput) {

        if(isPlaying){

            resetContent(sourceLoader);
            startTime = new Date();
            elapsed = 0;

        }else{

            isPlaying = true;
            animationFrame = requestAnimationFrame(function () { videoUpdate(sourceLoader, videoOutput) });
            startTime = new Date();

        }

    };

};
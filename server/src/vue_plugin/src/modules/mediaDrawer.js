// TODO: make a seperate scanner drawer? or re render on stop?

import ContextHooks from './contextHooks.js';

export default function () {

    // TODO: move 'TimeTracker' to own file
    var TimeTracker = function () {

        var startTime = 0;
        var nowTime = 0;
        this.elapsed = 0;
        this.elapsedDateTime = 0;
        this.isPlaying = false;
        
        this.trackTime = function () {
            nowTime = new Date();
            this.elapsedDateTime = nowTime - startTime;
            this.elapsed = this.elapsedDateTime;
            this.elapsed /= 100;
            this.elapsed = (Math.round(this.elapsed)/1000).toFixed(3);
        };

        this.resetTime = function () {
            this.elapsedDateTime = 0;
        };

        this.startTime = function(){
            startTime = (new Date() - this.elapsedDateTime);
        }

        this.convertTimeInteger = function (time) {
            var Newtime = time*100;
            return parseFloat(Newtime);
        }

    };

    var timeTracker = new TimeTracker();
    this.contextHooks = new ContextHooks({timeTracker});
    var animationFrame = {};

    var stopContent = function (sourceLoader) {

        sourceLoader.eachSource(function(source){
            if(source.type == 'video'){
                if(!source.cast.paused){
                    // pause videos
                    source.cast.pause();
                }
            }
        });

    };

    var videoUpdate = function (sourceLoader, videoOutput, contextHooks) {
        videoOutput.ctx.clearRect(0,0, videoOutput.el.width, videoOutput.el.height);
        timeTracker.trackTime();

        sourceLoader.eachSource(function(source){
            
            if(source.type == 'image'){
                if( timeTracker.elapsed >= source.media.timelineTime[0] && timeTracker.elapsed <= source.media.timelineTime[1]){
                    videoOutput.ctx.drawImage(source.cast, source.media.position[0], source.media.position[1],
                    source.media.size[0], source.media.size[1]);
                }
            }

            if(source.type == 'video'){
                if( timeTracker.elapsed >= source.media.timelineTime[0] && timeTracker.elapsed <= source.media.timelineTime[1]){
                    
                    // FIXME: if 'videoStartTime' + 'timelineTime[0]' is over the video length there is a error.
                    if(source.cast.paused){
                        source.cast.play();
                        // if paused, shift currentTime to correct pos
                        source.cast.currentTime = timeTracker.convertTimeInteger(source.media.videoStartTime) + 
                        (timeTracker.convertTimeInteger(timeTracker.elapsed) - 
                        timeTracker.convertTimeInteger(source.media.timelineTime[0]));
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

        contextHooks.runContextHooks({name: 'drawingUpdate', timeTracker});
        animationFrame = requestAnimationFrame(function () { videoUpdate(sourceLoader, videoOutput, contextHooks) }.bind(this));

    };

    this.stopDrawSources = function (sourceLoader) {

        if(timeTracker.isPlaying){

            cancelAnimationFrame(animationFrame);
            stopContent(sourceLoader);
            this.contextHooks.runContextHooks({name: 'beforeActionStart', action: 'stop'});
            timeTracker.isPlaying = false;
            this.contextHooks.runContextHooks({name: 'drawingUpdate', timeTracker});

        }

    };

    this.resetDrawSources = function (sourceLoader) {

        cancelAnimationFrame(animationFrame);
        stopContent(sourceLoader);
        timeTracker.resetTime();
        this.contextHooks.runContextHooks({name: 'beforeActionStart', action: 'reset'});
        timeTracker.isPlaying = false;
        this.contextHooks.runContextHooks({name: 'drawingUpdate', timeTracker});

    };

    this.drawSources = function (sourceLoader, videoOutput) {

        if(timeTracker.isPlaying){

            //resetContent(sourceLoader);
            //timeTracker.resetTime();

        }else{

            this.contextHooks.runContextHooks({name: 'beforeActionStart', action: 'play', timeTracker});
            stopContent(sourceLoader);
            timeTracker.isPlaying = true;
            animationFrame = requestAnimationFrame(function () { videoUpdate(sourceLoader, videoOutput, this.contextHooks) }.bind(this));
            timeTracker.startTime();

        }

    };

};
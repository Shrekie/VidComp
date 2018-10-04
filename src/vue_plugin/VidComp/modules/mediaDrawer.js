// TODO: make a seperate scanner drawer? or re render on stop?

import ContextHooks from './contextHooks.js';

export default function () {

    // TODO: move 'TimeTracker' to own file
    var TimeTracker = function () {

        var startTime = 0;
        var nowTime = 0;
        this.timeDelay = 1;
        this.elapsed = 0;
        this.elapsedDateTime = 0;
        this.isPlaying = false;
        
        this.trackTime = function () {
            nowTime = performance.now();
            this.elapsedDateTime = (nowTime - startTime);
            this.elapsed = (this.elapsedDateTime);
            this.elapsed = (this.elapsed/100000);
        };

        this.resetTime = function () {
            this.elapsedDateTime = 0;
        };

        this.startTime = function(){
            startTime = (performance.now() - (this.elapsedDateTime));
        }

        this.convertTimeInteger = function (time) {
            var Newtime = time*100;
            return parseFloat(Newtime);
        }

        this.setTimeDelay = function(time){
            this.timeDelay = time;
            console.log(time);
        }

    };

    var timeTracker = new TimeTracker();
    this.contextHooks = new ContextHooks({timeTracker});
    var animationFrame = {};
    var endTime = 0;
    var loadingBuffer = false;
    var playStateFlag = [false, false]; // flag for endTime and bufferInterrupt

    var stopContent = function (sourceLoader) {

        loadingBuffer = false;
        playStateFlag = [false, false];

        sourceLoader.eachSource.forEach(function(source){

            if(source.type == 'video' || source.type.includes('audio')){

                if(!source.cast.paused){

                    // pause videos
                    if(source.cast.playPromise){

                        source.cast.playPromise.then(_ => {
                            source.cast.pause();
                        })
                        .catch(error => {
                            console.log(error);
                        });

                    }else{

                        source.cast.pause();

                    }

                }

            }

        });

    };

    var videoUpdate = function (sourceLoader, videoOutput, contextHooks, mediaDrawer) {

        videoOutput.ctx.clearRect(0,0, videoOutput.el.width, videoOutput.el.height);
        timeTracker.trackTime();

        sourceLoader.eachSource.forEach(function(source){

            let elapsed = timeTracker.elapsed;
            if(source.type.includes('audio')!=true) elapsed *= timeTracker.timeDelay;

            if(source.status == "ready"){

                if(source.type == 'image'){
                    if( elapsed >= source.media.timelineTime[0] && elapsed <= source.media.timelineTime[1]){
                        videoOutput.ctx.drawImage(source.cast, source.media.position[0], source.media.position[1],
                        source.media.size[0], source.media.size[1]);
                    }
                }

                if(source.type == 'video' || source.type.includes('audio')){

                    if( elapsed >= source.media.timelineTime[0] && elapsed <= source.media.timelineTime[1]){
                    

                        // FIXME: if 'videoStartTime' + 'timelineTime[0]' is over the video length there is a error.
                        if(source.cast.paused){
                            // if paused, shift currentTime to correct pos
                            
                            source.cast.playPromise = source.cast.play();

                            source.cast.playPromise.then().then(_ => {

                                elapsed = timeTracker.elapsed;
                                if(source.type.includes('audio')!=true) elapsed *= timeTracker.timeDelay;

                                source.cast.currentTime = timeTracker.convertTimeInteger(source.media.videoStartTime) + 
                                (timeTracker.convertTimeInteger(elapsed)- 
                                timeTracker.convertTimeInteger(source.media.timelineTime[0]));
                                source.cast.playPromise = false;

                            })
                            .catch(error => {
                                console.log(error);
                            });

                        } 

                        if(source.type == 'video'){videoOutput.ctx.drawImage(source.cast, source.media.position[0], source.media.position[1],
                        source.media.size[0], source.media.size[1]);}

                    }else if(!source.cast.paused){

                        // video stops displaying
                        if(source.cast.playPromise){

                            source.cast.playPromise.then(_ => {
                                source.cast.pause();
                            })
                            .catch(error => {
                                console.log(error);
                            });

                        }else{

                            source.cast.pause();

                        }

                    }
                }
            }
        });

        var loadingBufferCheck = function(){

            loadingBuffer = false;

            for(var i = 0; i < sourceLoader.eachSource.length; i++) {

                if (sourceLoader.eachSource[i].cast.playPromise) {

                    sourceLoader.eachSource[i].cast.playPromise.then(_ => {

                        timeTracker.startTime();
                        loadingBufferCheck();
                        
                    })
                    .catch(error => {

                        console.log(error);

                    });

                    loadingBuffer = true;
                    break;
                    
                }

            }

            if( (loadingBuffer == false) && timeTracker.isPlaying ){
                animationFrame = requestAnimationFrame(function () { videoUpdate(sourceLoader, videoOutput, contextHooks, mediaDrawer) }.bind(this));
            }

            if(loadingBuffer != playStateFlag[0]){
                contextHooks.runContextHooks({name: 'bufferInterrupt', status:loadingBuffer});
                playStateFlag[0] = loadingBuffer;
            }

            if( timeTracker.convertTimeInteger(timeTracker.elapsed) > timeTracker.convertTimeInteger(endTime) && playStateFlag[1] == false ){
                contextHooks.runContextHooks({name: 'finished', status:"normal"});
                playStateFlag[1] = true;
            }

            if( timeTracker.convertTimeInteger(timeTracker.elapsed) > timeTracker.convertTimeInteger(endTime/timeTracker.timeDelay) && playStateFlag[1] == true){
                console.log(timeTracker.elapsed+ " " +endTime/timeTracker.timeDelay);
                contextHooks.runContextHooks({name: 'finished', status:"delayed"});
                mediaDrawer.stopDrawSources(sourceLoader);
            }


        }

        contextHooks.runContextHooks({name: 'drawingUpdate', timeTracker});
        loadingBufferCheck();
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
            endTime = sourceLoader.getEndTime();
            animationFrame = requestAnimationFrame(function () { videoUpdate(sourceLoader, videoOutput, this.contextHooks, this) }.bind(this));
            timeTracker.startTime();

        }

    };

    this.setTimeDelay = function (time){
        timeTracker.setTimeDelay(time);
    }

};
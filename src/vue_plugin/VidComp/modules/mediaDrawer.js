// TODO: make a seperate scanner drawer? or re render on stop?

export default function (ContextHooks, timeTracker) {

    var timeTracker = timeTracker
    this.contextHooks = ContextHooks.createHook("videoControl", {timeTracker});
    var animationFrame = {};
    var endTime = 0;
    var frameElapsed = 0;
    var playBus = [];
    var drawBus = [];
    var loadingBuffer = false;
    var playStateFlag = [false, false]; // flag for endTime and bufferInterrupt

    var stopContent = function (sourceLoader) {

        loadingBuffer = false;
        playStateFlag = [false, false];

        Promise.all(playBus).then().then().then(function(sources) {
            sourceLoader.eachSource().forEach(function(source){
                if(source.type == 'video' || source.type.includes('audio')){
                    source.cast.pause();
                }
            });
        });

    };

    var videoUpdate = function (sourceLoader, videoOutput, contextHooks, mediaDrawer) {

        timeTracker.trackTime();
        timeTracker.forgetTime = false;
        frameElapsed = timeTracker.elapsed;
        playBus = [];
        drawBus = [];

        sourceLoader.eachSource().forEach(function(source){

            let elapsed = frameElapsed;
            let delayedStart = 1;
            if(source.type.includes('audio')!=true) elapsed *= timeTracker.timeDelay;
            else
            delayedStart = timeTracker.timeDelay;

            if(source.status == "ready"){

                if(source.type == 'image'){
                    if( elapsed >= source.media.timelineTime[0] && elapsed <= source.media.timelineTime[1]){
                        drawBus.push(source);
                    }
                }

                if(source.type == 'video' || source.type.includes('audio')){

                    if( elapsed >= source.media.timelineTime[0] && 
                        
                        elapsed <= source.media.timelineTime[1]){

                         /*
                        elapsed <= source.media.timelineTime[0]/delayedStart + 
                        ((source.media.timelineTime[1]) - (source.media.timelineTime[0]))
                        */
                            
                        // FIXME: paused after canvas draw for some reason
                        if(source.cast.paused){
                            loadingBuffer = true;
                        } 
                        
                        drawBus.push(source);

                    }else if(!source.cast.paused){

                        // video stops displaying
                        if(source.status == "staging"){

                            source.cast.playPromise.then().then(_ => {
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

        // buffer hooks
        
        if(loadingBuffer != playStateFlag[0]){
            contextHooks.runContextHooks({name: 'bufferInterrupt', status:loadingBuffer});
            playStateFlag[0] = loadingBuffer;
        }

        if( timeTracker.convertTimeInteger(timeTracker.elapsed) > 
            timeTracker.convertTimeInteger(endTime) && playStateFlag[1] == false ){
            contextHooks.runContextHooks({name: 'finished', status:"normal"});
            playStateFlag[1] = true;
        }

        if( timeTracker.convertTimeInteger(timeTracker.elapsed) > 
            timeTracker.convertTimeInteger(endTime/timeTracker.timeDelay) && playStateFlag[1] == true){
            contextHooks.runContextHooks({name: 'finished', status:"delayed"});
            mediaDrawer.stopDrawSources(sourceLoader);
        }

        if(loadingBuffer){

            drawBus.forEach(function(source){

                if(source.type == 'video' || source.type.includes('audio')){

                if(!source.cast.paused){
                    source.cast.pause();
                }

                source.status = "staging";

                let elapsed = frameElapsed;
                if(source.type.includes('audio')!=true) elapsed *= timeTracker.timeDelay;
                
                // if paused, shift currentTime to correct pos
                let currentTime = 
                Math.floor((source.media.videoStartTime + 
                (timeTracker.convertTimeInteger(elapsed) - 
                timeTracker.convertTimeInteger(source.media.timelineTime[0])))*1e2)/1e2
        
                // relative repeating of course
                currentTime = ((currentTime/source.cast.duration)
                -(Math.ceil(currentTime/source.cast.duration)-1)) * source.cast.duration;
                
                source.cast.currentTime = Math.floor(currentTime * 1e2 ) / 1e2;

                source.cast.canPlayPromise = new Promise(resolve => {

                    source.cast.oncanplaythrough = function() {
                        resolve(source);
                        source.cast.oncanplaythrough = null;
                    };
                    
                });

                playBus.push(source.cast.canPlayPromise);

                } 

            });
            
        }

        var tickFrame = function(){


            if(loadingBuffer != playStateFlag[0]){
                contextHooks.runContextHooks({name: 'bufferInterrupt', status:loadingBuffer});
                playStateFlag[0] = loadingBuffer;
            }

            if( (!loadingBuffer) && timeTracker.isPlaying ){
                
                videoOutput.ctx.clearRect(0,0, videoOutput.el.width, videoOutput.el.height);

                drawBus.forEach(function(source){
                    if(source.status == "ready"){
                        if(!source.type.includes('audio')){
                            videoOutput.ctx.drawImage(source.cast, 
                            source.media.position[0], source.media.position[1],
                            source.media.size[0], source.media.size[1]);
                        }
                    }
                });

                animationFrame = requestAnimationFrame(function () { 
                videoUpdate(sourceLoader, videoOutput, contextHooks, mediaDrawer) }.bind(this));

            }

        }

        if(playBus.length > 0){
            
        Promise.all(playBus).then(function(sources) {

            let playStarted = [];

            sources.forEach(function(source){  

                //source.cast.canPlayPromise = null;

                playStarted.push(new Promise(resolve => {

                    if(!source.type.includes('image')){

                        source.cast.playPromise = source.cast.play();
                        source.cast.playPromise.then(_ => {
                            
                            source.status = "ready";
                            resolve(source);
            
                        });

                    }else{

                        source.status = "ready";
                        resolve(source);
                        
                    }

                }));

            });

            return playStarted;

        }).then(function(playStarted){

            Promise.all(playStarted).then(function(sources) {
                loadingBuffer = false;
                timeTracker.forgetTime = true;
                tickFrame();
            });

        });

        }else if (drawBus.length > 0) {

            tickFrame();

        } else {

            tickFrame();

        }

        contextHooks.runContextHooks({name: 'drawingUpdate', timeTracker});

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

            //this.resetDrawSources(sourceLoader);
            //timeTracker.resetTime();

        }else{

            this.contextHooks.runContextHooks({name: 'beforeActionStart', action: 'play', timeTracker});
            stopContent(sourceLoader);
            timeTracker.isPlaying = true;
            endTime = sourceLoader.getEndTime();
            timeTracker.startTime();
            animationFrame = requestAnimationFrame(function () { 
            videoUpdate(sourceLoader, videoOutput, this.contextHooks, this) }.bind(this));

        }

    };

    this.setTimeDelay = function (time){
        timeTracker.setTimeDelay(time);
    }

};
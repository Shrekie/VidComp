export default function () {

    var TimeTracker = function () {

        // TODO: rename this class.
        // the addition of isPlaying makes it weird.

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
            //console.log(time);
            var Newtime = time*100;
            //console.log(Newtime);
            return parseFloat(Newtime);
        }

    };

    var ContextHooks = function (drawingContext) {

        // TODO: make this run only when needed

        this.drawingContext = drawingContext;
        this.frameContextHooks = [];

        this.runContextHooks = function (contextType) {
            if(this.frameContextHooks){
                this.frameContextHooks.forEach(function(contextHook, index){

                    //console.log(contextType.name);
                    //console.log(contextHook.name);

                    if(contextType.name == 'drawingUpdate' && 
                    contextHook.name == contextType.name)
                        contextHook.callbackHook(contextHooks.drawingContext);

                    if(contextType.name == 'beforeActionStart' && 
                    contextHook.name == contextType.name)
                        contextHook.callbackHook(contextType.action, contextHooks.drawingContext);
                    

                });
            }
        }

    };

    var timeTracker = new TimeTracker();
    var contextHooks = new ContextHooks({timeTracker});
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

    var videoUpdate = function (sourceLoader, videoOutput) {

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

        contextHooks.runContextHooks({name: 'drawingUpdate'});
        animationFrame = requestAnimationFrame(function () { videoUpdate(sourceLoader, videoOutput) });

    };

    this.registerFrameHooks = function (newHook, frameContextHooks){
        // TODO: implement hook init on 'contextHooks'
        if(newHook.frameHookName == 'drawingUpdate')
            newHook.callbackHook(contextHooks.drawingContext);

        contextHooks.frameContextHooks = frameContextHooks;
    };

    this.unregisterFrameHooks = function () {
        // TODO: add argument for which to unregister
        contextHooks.frameContextHooks = [];
    };

    this.stopDrawSources = function (sourceLoader) {

        if(timeTracker.isPlaying){

            contextHooks.runContextHooks({name: 'beforeActionStart', action: 'stop'});
            cancelAnimationFrame(animationFrame);
            stopContent(sourceLoader);
            timeTracker.isPlaying = false;
            contextHooks.runContextHooks({name: 'drawingUpdate'});

        }

    };

    this.resetDrawSources = function (sourceLoader) {

        cancelAnimationFrame(animationFrame);
        stopContent(sourceLoader);
        timeTracker.resetTime();
        contextHooks.runContextHooks({name: 'beforeActionStart', action: 'reset'});
        timeTracker.isPlaying = false;
        contextHooks.runContextHooks({name: 'drawingUpdate'});

    };

    this.drawSources = function (sourceLoader, videoOutput) {

        if(timeTracker.isPlaying){

            //resetContent(sourceLoader);
            //timeTracker.resetTime();

        }else{

            contextHooks.runContextHooks({name: 'beforeActionStart', action: 'play'});
            stopContent(sourceLoader);
            timeTracker.isPlaying = true;
            animationFrame = requestAnimationFrame(function () { videoUpdate(sourceLoader, videoOutput) });
            console.log(timeTracker);
            timeTracker.startTime();

        }

    };

};
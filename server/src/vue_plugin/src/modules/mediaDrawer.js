export default function () {

    var TimeTracker = function () {

        var startTime = 0;
        var nowTime = 0;
        this.elapsed = 0;
        
        this.trackTime = function () {
            nowTime = new Date();
            this.elapsed = nowTime - startTime;
            this.elapsed /= 100;
            this.elapsed = (Math.round(this.elapsed)/1000).toFixed(3);
        };

        this.resetTime = function () {
            startTime = new Date();
            this.elapsed = 0;
        };

    };

    var ContextHooks = function (drawingContext) {

        this.drawingContext = drawingContext;
        this.frameContextHooks = [];

        this.runContextHooks = function () {
            if(this.frameContextHooks){
                this.frameContextHooks.forEach(function(contextHook, index){
                    contextHook.callbackHook(contextHooks.drawingContext);
                });
            }
        }

    };

    var timeTracker = new TimeTracker();
    var contextHooks = new ContextHooks({elapsed: timeTracker.elapsed});
    var isPlaying = false;
    var animationFrame = {};

    var resetContent = function (sourceLoader) {

        sourceLoader.eachSource(function(source){
            if(source.type == 'video'){
                if(!source.cast.paused){
                    // reset videos
                    source.cast.pause();
                    source.cast.load();
                }
            }
        });

    };

    var videoUpdate = function (sourceLoader, videoOutput) {

        videoOutput.ctx.clearRect(0,0, videoOutput.el.width, videoOutput.el.height);

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

        contextHooks.runContextHooks();
        contextHooks.drawingContext = {elapsed:timeTracker.elapsed};
        timeTracker.trackTime();
        animationFrame = requestAnimationFrame(function () { videoUpdate(sourceLoader, videoOutput) });

    };

    this.registerFrameHooks = function (hookInitialize, frameContextHooks){
        hookInitialize(contextHooks.drawingContext);
        contextHooks.frameContextHooks = frameContextHooks;
    };

    this.unregisterFrameHooks = function () {
        // TODO: add argument for which to unregister
        contextHooks.frameContextHooks = [];
    };

    this.stopDrawSources = function (sourceLoader) {

        if(isPlaying){

            resetContent(sourceLoader);
            cancelAnimationFrame(animationFrame);
            timeTracker.resetTime();
            isPlaying = false;
        }

    }

    this.drawSources = function (sourceLoader, videoOutput) {

        if(isPlaying){

            resetContent(sourceLoader);
            timeTracker.resetTime();

        }else{

            isPlaying = true;
            animationFrame = requestAnimationFrame(function () { videoUpdate(sourceLoader, videoOutput) });
            console.log(timeTracker);
            timeTracker.resetTime(); // TODO: maybe remove this, what if nav too fast ??

        }

    };

};
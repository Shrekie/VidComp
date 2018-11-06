import TimeTracker from './TimeTracker'

class RailBus {

    _playBus = [];
    _drawBus = [];

    clear () {
        this._playBus = [];
        this._drawBus = [];
    }

    enter (source) {
        this._drawBus.push(source);
    }

    conjugate (source) {
        this._playBus.push(source);
    }

    passengers () {
        return this._drawBus;
    }

    transitory () {
        return this._playBus.map(source => source.cast.canPlayPromise);
    }

    finishEnd (status) {
        /*
        *
        */
    }

    bufferAction (loadingBuffer) {
        /*
        *
        */
    }

    bridgedFrame (timeTracker) {
        /*
        *
        */
    }
    
}

class DrawStation  {

    railBus;

    _timeTracker;
    _sourceLoader;
    _videoOutput;

    _animationBridge = {};
    _endTime = 0;

    _loadingBuffer = false;
    _playStateFlag = [false, false];

    _stopContent () {

        this._loadingBuffer = false;
        this._playStateFlag = [false, false];


        this._sourceLoader.eachSource().forEach(function(source){
            
            if(source.type == 'video' || source.type.includes('audio')){
                
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

        });


    }

    _endFinishCheck () {

        if( TimeTracker.upScaleTime(this._timeTracker.elapsed) >=
        TimeTracker.upScaleTime(this._endTime) && this._playStateFlag[1] == false ){

            this.railBus.finishEnd("normal");
            this._playStateFlag[1] = true;

        }

        if( TimeTracker.upScaleTime(this._timeTracker.elapsed) >=
        TimeTracker.upScaleTime(this._endTime/this._timeTracker.timeDelay) 
        && this._playStateFlag[1] == true ){

            this.stop();
            this.railBus.finishEnd("delayed");

        }

    }

    _bufferCheck () {

        if(this._loadingBuffer != this._playStateFlag[0]){
            this.railBus.bufferAction(this._loadingBuffer);
            this._playStateFlag[0] = this._loadingBuffer;
        }

    }

    _renderTime (source) {

        if(source.type.includes('audio') != true) 
        return this._timeTracker.elapsed * this._timeTracker.timeDelay;
        else
        return this._timeTracker.elapsed;

    }

    _tickFrame = function(){

        if( (!this._loadingBuffer) && this._timeTracker.isPlaying ){

            this._videoOutput.ctx.clearRect(0,0, 
            this._videoOutput.el.width, this._videoOutput.el.height);

            this.railBus.passengers().forEach(function(source){
                if(source.status == "ready"){
                    if(!source.type.includes('audio')){
                        this._videoOutput.ctx.drawImage(source.cast, 
                        source.media.position[0], source.media.position[1],
                        source.media.size[0], source.media.size[1]);
                    }
                }
            }.bind(this));

            this.railBus.bridgedFrame(this._timeTracker);
            
            this._bufferCheck();

            this._animationBridge = window.requestAnimationFrame(this._animationConnect.bind(this));

        }

    }

    _animationConnect () {

        this._timeTracker.trackTime();

        this._endFinishCheck();

        this.railBus.clear();

        this._sourceLoader.eachSource().forEach(function(source){

            let elapsed = this._renderTime(source);

            if(source.status == "ready"){

                if(source.type == 'image'){
                    if( DrawStation.isInFrame(elapsed, source) ) {
                        this.railBus.enter(source);
                    }
                }

                if(source.type == 'video' || source.type.includes('audio')){

                    if( DrawStation.isInFrame(elapsed, source) ){

                        if(source.cast.paused){
                            this._loadingBuffer = true;
                        } 
                        
                        this.railBus.enter(source);

                    }else if(!source.cast.paused){
                        
                        // video stops displaying
                        if(source.status == "staging"){

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

        }.bind(this));

        this._bufferCheck();

        if(this._loadingBuffer){

            this.railBus.passengers().forEach(function(source){

                if(source.type == 'video' || source.type.includes('audio')){

                    if(!source.cast.paused){
                        source.cast.pause();
                    }

                    source.status = "staging";

                    let elapsed = this._renderTime(source);
                    
                    source.cast.currentTime = DrawStation.dotSpanCurrent(elapsed, source);

                    source.cast.canPlayPromise = new Promise(resolve => {

                        source.cast.oncanplaythrough = function() {
                            resolve(source);
                            source.cast.oncanplaythrough = null;
                        };
                        
                    });

                    this.railBus.conjugate(source);

                } 

            }.bind(this));
            
        }

        if(this.railBus.transitory().length > 0){
        
        Promise.all(this.railBus.transitory())
        .then(function(sources) {

            let playStarted = [];

            sources.forEach(function(source){  

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

                this._loadingBuffer = false;
                this._timeTracker.forgetTime = true;

                this._tickFrame();

            }.bind(this));

        }.bind(this));
        
        } else {

            this._tickFrame();

        }

    }

    stop () {

        if(this._timeTracker.isPlaying){

            window.cancelAnimationFrame(this._animationBridge);
            this._stopContent();
            this._timeTracker.isPlaying = false;

        }

    }

    reset () {

        window.cancelAnimationFrame(this._animationBridge);
        this._stopContent();
        this._timeTracker.resetTime();
        this._timeTracker.isPlaying = false;

    }

    start () {

        if(this._timeTracker.isPlaying){

            //this.resetDrawSources(sourceLoader);
            //timeTracker.resetTime();

        }else{

            this._stopContent();
            this._timeTracker.isPlaying = true;
            this._endTime = this._sourceLoader.getEndTime();
            this._timeTracker.startTime();
            this._animationBridge = window.requestAnimationFrame(this._animationConnect.bind(this));

        }

    }

    setTimeDelay (time) {
        this._timeTracker.setTimeDelay(time);
    }

    static isInFrame (elapsed, source) {
        return elapsed >= source.media.timelineTime[0] && elapsed <= source.media.timelineTime[1];
    }

    static dotSpanCurrent (elapsed, source) {

        // if paused, shift currentTime to correct pos
        let currentTime = 
        Math.floor((source.media.videoStartTime + 
        (TimeTracker.upScaleTime(elapsed) - 
        TimeTracker.upScaleTime(source.media.timelineTime[0])))*1e2)/1e2

        // relative repeating of course
        currentTime = ((currentTime/source.cast.duration)
        -(Math.ceil(currentTime/source.cast.duration)-1)) * source.cast.duration;
        
        return Math.floor(currentTime * 1e2 ) / 1e2;

    }

    constructor (timeTracker, sourceLoader, videoOutput) {
        this._timeTracker = timeTracker;
        this._sourceLoader = sourceLoader;
        this._videoOutput = videoOutput;

        this.railBus = new RailBus();
    }

}

export default DrawStation;
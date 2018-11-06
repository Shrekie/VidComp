class TimeTracker {

    _startTime = 0;
    _nowTime = 0;

    constructor(){

        this._startTime = 0;
        this._nowTime = 0;
        this.timeDelay = 1;
        this.elapsed = 0;
        this.elapsedDateTime = 0;
        this.forgetTime = false;
        this.isPlaying = false;

    }
    
    trackTime () {

        this._nowTime = performance.now();

        if(this.forgetTime) {this.startTime(); this.forgetTime = false;}

        this.elapsedDateTime = (this._nowTime - this._startTime);
        
        this.elapsed = TimeTracker.downScaleTime(this.elapsedDateTime);

    }

    resetTime () {
        this.elapsedDateTime = 0;
    }

    startTime () {
        this._startTime = (performance.now() - (this.elapsedDateTime));
    }

    static downScaleTime (time) {
        return time/100000;
    }

    static upScaleTime (time) {
        var Newtime = time*100;
        return parseFloat(Newtime);
    }

    setTimeDelay (time) {
        this.timeDelay = time;
    }

};

export default TimeTracker;
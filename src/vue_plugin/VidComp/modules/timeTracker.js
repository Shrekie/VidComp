export default function () {

    var startTime = 0;
    var nowTime = 0;
    this.timeDelay = 1;
    this.elapsed = 0;
    this.elapsedDateTime = 0;
    this.forgetTime = false;
    this.isPlaying = false;
    
    this.trackTime = function () {
        nowTime = performance.now();
        if(this.forgetTime) {this.startTime(); this.forgetTime = false;}
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
    }

};
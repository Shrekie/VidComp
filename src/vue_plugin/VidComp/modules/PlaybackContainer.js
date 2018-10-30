import DrawStation from './DrawStation.js'
import TimeTracker from './TimeTracker.js';

class PlaybackContainer {

    contextHooks;
    timeTracker;
    drawStation;

    constructor(ContextHooks, sourceLoader, videoOutput){

        this.timeTracker = new TimeTracker();
        
        this.contextHooks = ContextHooks.createHook("videoControl", {timeTracker:this.timeTracker});
        this.drawStation = new DrawStation(this.timeTracker, sourceLoader, videoOutput);

        this.drawStation.railBus.finishEnd = function (status){
            this.contextHooks.runContextHooks({name: 'finished', status: status});
            if(status == "delayed") this.stopDrawSources();
        }.bind(this);

        this.drawStation.railBus.bufferAction = function (loadingBuffer){
            this.contextHooks.runContextHooks({name: 'bufferInterrupt', status:loadingBuffer});
        }.bind(this);

        this.drawStation.railBus.bridgedFrame = function (timeTracker) {
            this.contextHooks.runContextHooks({name: 'drawingUpdate', timeTracker});
        }.bind(this);

    }

    stopDrawSources () {

        this.contextHooks.runContextHooks({name: 'beforeActionStart', action: 'stop'});
        this.drawStation.stop();

    }

    resetDrawSources = function () {

        this.contextHooks.runContextHooks({name: 'beforeActionStart', action: 'reset'});
        this.drawStation.reset();

    }

    drawSources = function () {

        this.contextHooks.runContextHooks({name: 'beforeActionStart', action: 'play', timeTracker:this.timeTracker});
        this.drawStation.start();

    }

    setTimeDelay = function (time){
        this.drawStation.setTimeDelay(time);
    }

}

export default PlaybackContainer;
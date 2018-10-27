import DrawStation from './DrawStation.js'
import TimeTracker from './TimeTracker.js'

class InterfaceDrawer {

    _scrubBus = [];
    _sourceLoader;
    _videoOutput;

    scrubVideo = function (elapsedDateTime, betweenFrames) {

        let elapsed = elapsedDateTime;
        this._scrubBus = [];

        this._sourceLoader.eachSource().forEach(function(source){

            if(source.status == "ready"){

                if(source.type == 'image'){
                    if( DrawStation.isInFrame(elapsed, source)){
                        this._scrubBus.push(
                            new Promise(resolve => {
                                resolve(source);
                        }));
                    }
                }

                if(source.type == 'video'){

                    if( DrawStation.isInFrame(elapsed, source) ){

                        source.cast.currentTime = DrawStation.dotSpanCurrent(elapsed, source);
                        
                        this._scrubBus.push(
                        new Promise(resolve => {
                            source.cast.oncanplay = function() {
                                resolve(source);
                                source.cast.ontimeupdate = null;
                            };
                        }));

                    }

                }
            }


        }.bind(this));

        Promise.all(this._scrubBus).then(function(sources) {

            this._videoOutput.ctx.clearRect(0,0, this._videoOutput.el.width, this._videoOutput.el.height);

            sources.forEach(function(source){
                if(source.status == "ready"){
                    this._videoOutput.ctx.drawImage(source.cast, 
                    source.media.position[0], source.media.position[1],
                    source.media.size[0], source.media.size[1])
                    betweenFrames(source);
                }
            }.bind(this));

        }.bind(this));

    }

    constructor(sourceLoader, videoOutput) {
        this._sourceLoader = sourceLoader;
        this._videoOutput = videoOutput;
    }

}


export default InterfaceDrawer;
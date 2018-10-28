import MotionHatch from '../../../library/dragResizeMotion/MotionHatch.js';
import TimeTracker from './TimeTracker.js'
import DrawStation from './DrawStation.js'

class BoundingMoveBox  {

    constructor(media) {

        this.media = media;
        this._setBounding();

    }

    moveBox (pos1, pos2){

        let newPos = 
        [this.media.position[0] - pos1, this.media.position[1] - pos2];

        this.media.position = newPos;

        this._setBounding();

    }

    _setBounding () {
        this.size = this.media.size;
        this.pos = this.media.position;
    }

    touchBox (cord) {

        this._setBounding();

        let right = this.size[0] + this.pos[0];
        let bottom = this.size[1] + this.pos[1];

        if((cord[0] < right && cord[0] > this.pos[0]) &&
           (cord[1] < bottom && cord[1] > this.pos[1])
        ){
            return true;
        }else{
            return false;
        }

    }

}

class BoundingControlResize extends BoundingMoveBox {

    constructor(media) {
        super(media);
    }

    _setBounding () {

        this.size = [MediaTransform.RESIZE_RADIAN*2, 
        MediaTransform.RESIZE_RADIAN*2];
        this.pos = [((this.media.position[0]+this.media.size[0])
        -(MediaTransform.RESIZE_OFFSET[0]*2)),
        ((this.media.position[1]+this.media.size[1])
        -(MediaTransform.RESIZE_OFFSET[0]*2))];

    }

    moveBox (pos1, pos2){

        let angle = Math.atan2(pos1, pos2) * 360 / Math.PI;

        if(angle>135 && angle<-315)
        this.media.size = [this.media.size[0] + pos1, this.media.size[1] + pos2];
        else
        this.media.size = [this.media.size[0] - pos1, this.media.size[1] - pos2];

        this._setBounding();

    }

}

class MediaTransform {

    static RESIZE_OFFSET = [60, 60];
    static RESIZE_RADIAN = 60;

    _interfaceDrawer;
    _timeline;
    _videoOutput;
    _sourceLoader;

    _elapsedDateTime;

    _boxBus = [];
    _touchedBox;
    _canvasRect;

    _pos1 = 0;
    _pos2 = 0;
    _pos3 = 0;
    _pos4 = 0;

    _drawControlArea = function (){

        this._interfaceDrawer.scrubVideo(this._elapsedDateTime, 
        function(source){

            this._videoOutput.ctx.beginPath();
            this._videoOutput.ctx.lineWidth = "5";
            this._videoOutput.ctx.strokeStyle = "white";
            this._videoOutput.ctx.setLineDash([10, 10]);
            this._videoOutput.ctx.rect(source.media.position[0], source.media.position[1],
            source.media.size[0], source.media.size[1]);
            this._videoOutput.ctx.closePath();

            this._videoOutput.ctx.stroke();

            this._videoOutput.ctx.beginPath();
            this._videoOutput.ctx.lineWidth = "3";
            this._videoOutput.ctx.strokeStyle = "black";
            this._videoOutput.ctx.setLineDash([]);
            this._videoOutput.ctx.arc((source.media.position[0]+source.media.size[0])
            -MediaTransform.RESIZE_OFFSET[0],
            (source.media.position[1]+source.media.size[1])
            -MediaTransform.RESIZE_OFFSET[0],MediaTransform.RESIZE_RADIAN,0,2*Math.PI);
            this._videoOutput.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            this._videoOutput.ctx.fill();
            this._videoOutput.ctx.closePath();

            this._videoOutput.ctx.stroke();

        }.bind(this));

    }

    _dragBox = function (e){

        MotionHatch.cursorHandler(e, function(e){

            this._pos1 = this._pos3 - e.clientX;
            this._pos2 = this._pos4 - e.clientY;
            this._pos3 = e.clientX;
            this._pos4 = e.clientY;

            this._touchedBox.moveBox(this._pos1, this._pos2);

            this._drawControlArea();

        }.bind(this));

    }

    _dragStop = function (e) {

        this._videoOutput.el.onmousemove = null;
        this._videoOutput.el.ontouchmove = null;
        
        document.ontouchend = null;
        document.onmouseup = null;

        this._timeline.contextHooks.runContextHooks({name:'mediaShift'});

    }

    _getMousePos = function (e) {

        this._canvasRect = this._videoOutput.el.getBoundingClientRect()
        var scaleX = this._videoOutput.el.width / this._canvasRect.width,
        scaleY = this._videoOutput.el.height / this._canvasRect.height;

        return {
            x: (e.clientX - this._canvasRect.left) * scaleX,
            y: (e.clientY - this._canvasRect.top) * scaleY
        };

    }

    _checkTouch = function (e) {

        MotionHatch.cursorHandler(e, function(e){

            let mousePos = this._getMousePos(e);

            this._touchedBox = this._boxBus.slice().reverse().find(function(box){
                return box.touchBox([mousePos.x, mousePos.y])
            });

            if(this._touchedBox){

                this._pos3 = e.clientX;
                this._pos4 = e.clientY;
                
                this._videoOutput.el.onmousemove = this._dragBox.bind(this);
                this._videoOutput.el.ontouchmove = this._dragBox.bind(this);

                document.onmouseup = this._dragStop.bind(this);
                document.ontouchend = this._dragStop.bind(this);

            }

        }.bind(this));

    }

    enableTransform = function(videoOutput, sourceLoader) {

        this._videoOutput = videoOutput;
        this._sourceLoader = sourceLoader;
        this._videoOutput.el.onmousedown = function(e){this._checkTouch(e)}.bind(this);
        this._videoOutput.el.ontouchstart = function(e){this._checkTouch(e)}.bind(this);

    }

    transformScrub = function  (elapsedDateTime) {

        this._elapsedDateTime = TimeTracker.downScaleTime(elapsedDateTime);
        this._boxBus = [];

        this._sourceLoader.eachSource().forEach(function(source){

            if(source.status == "ready"){
                if(!source.type.includes('audio')){

                    if( DrawStation.isInFrame(this._elapsedDateTime, source) ){

                        this._boxBus.push(new BoundingMoveBox(source.media));

                        this._boxBus.push(new BoundingControlResize(source.media));

                    }

                }
            }
            
        }.bind(this));

        this._drawControlArea();

    }

    constructor (interfaceDrawer, timeline) {
        this._interfaceDrawer = interfaceDrawer;
        this._timeline = timeline;
    }

}

export default MediaTransform;
import MotionHatch from './../../../library/dragResizeMotion/MotionHatch.js';

export default function (timeTracker, interfaceDrawer) {

    var _timeTracker = timeTracker,  
    _interfaceDrawer = interfaceDrawer,
    _videoOutput,
    _sourceLoader;

    var _elapsedDateTime;

    var boxBus = [];
    var touchedBox;
    var canvasRect;

    var pos1 = 0, pos2 = 0, 
    pos3 = 0, pos4 = 0;

    const RESIZE_OFFSET = [60, 60],
    RESIZE_RADIAN = 60

    class BoundingMoveBox  {

        constructor(media) {

            this.media = media;
            this.setBounding();

        }

        moveBox (pos1, pos2){

            let newPos = 
            [this.media.position[0] - pos1, this.media.position[1] - pos2];

            this.media.position = newPos
            this.media.size = touchedBox.size

            this.setBounding();

        }

        setBounding () {
            this.size = this.media.size;
            this.pos = this.media.position;
        }

        touchBox (cord) {

            this.setBounding();

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

        setBounding () {

            this.size = [RESIZE_RADIAN*2, RESIZE_RADIAN*2];
            this.pos = [((this.media.position[0]+this.media.size[0])-(RESIZE_OFFSET[0]*2)),
            ((this.media.position[1]+this.media.size[1])-(RESIZE_OFFSET[0]*2))];

        }

        moveBox (pos1, pos2){

            let angle = Math.atan2(pos1, pos2) * 360 / Math.PI;

            if(angle>135 && angle<-315)
            this.media.size = [this.media.size[0] + pos1, this.media.size[1] + pos2];
            else
            this.media.size = [this.media.size[0] - pos1, this.media.size[1] - pos2];

            this.setBounding();

        }

    }

    var drawControlArea = function (){

        _interfaceDrawer.scrubVideo(_elapsedDateTime, _sourceLoader, _videoOutput, function(source){

            _videoOutput.ctx.beginPath();
            _videoOutput.ctx.lineWidth = "5";
            _videoOutput.ctx.strokeStyle = "white";
            _videoOutput.ctx.setLineDash([10, 10]);
            _videoOutput.ctx.rect(source.media.position[0], source.media.position[1],
            source.media.size[0], source.media.size[1]);
            _videoOutput.ctx.closePath();

            _videoOutput.ctx.stroke();

            _videoOutput.ctx.beginPath();
            _videoOutput.ctx.lineWidth = "3";
            _videoOutput.ctx.strokeStyle = "black";
            _videoOutput.ctx.setLineDash([]);
            _videoOutput.ctx.arc((source.media.position[0]+source.media.size[0])-RESIZE_OFFSET[0],
            (source.media.position[1]+source.media.size[1])-RESIZE_OFFSET[0],RESIZE_RADIAN,0,2*Math.PI);
            _videoOutput.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            _videoOutput.ctx.fill();
            _videoOutput.ctx.closePath();

            _videoOutput.ctx.stroke();

        });

    }

    var dragBox = function (e){

        MotionHatch.cursorHandler(e, function(e){

            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            touchedBox.moveBox(pos1, pos2);

            drawControlArea();

        });

    }

    var dragStop = function (e) {

        _videoOutput.el.onmousemove = null;
        _videoOutput.el.ontouchmove = null;

    }

    var getMousePos = function (e) {

        canvasRect = _videoOutput.el.getBoundingClientRect()
        var scaleX = _videoOutput.el.width / canvasRect.width,
        scaleY = _videoOutput.el.height / canvasRect.height;

        return {
            x: (e.clientX - canvasRect.left) * scaleX,
            y: (e.clientY - canvasRect.top) * scaleY
        };

    }

    var checkTouch = function (e) {

        MotionHatch.cursorHandler(e, function(e){

            let mousePos = getMousePos(e);

            touchedBox = boxBus.slice().reverse().find(function(box){
                return box.touchBox([mousePos.x, mousePos.y])
            });

            if(touchedBox){

                pos3 = e.clientX;
                pos4 = e.clientY;
                
                _videoOutput.el.onmousemove = dragBox;
                _videoOutput.el.ontouchmove = dragBox;

                window.addEventListener('mouseup', dragStop);
                window.addEventListener('touchend', dragStop);

            }

        });

    };

    this.enableTransform = function(videoOutput, sourceLoader) {

        _videoOutput = videoOutput;
        _sourceLoader = sourceLoader;
        _videoOutput.el.onmousedown = function(e){checkTouch(e)};
        _videoOutput.el.ontouchstart = function(e){checkTouch(e)};

    }

    this.transformScrub = function  (elapsedDateTime) {

        //TODO: make a draw/time helper utility
        _elapsedDateTime = elapsedDateTime;
        _timeTracker.elapsedDateTime = elapsedDateTime;
        _timeTracker.startTime();
        _timeTracker.trackTime();
        let elapsed = _timeTracker.elapsed;
        boxBus = [];

        _sourceLoader.eachSource().forEach(function(source){

            if(source.status == "ready"){
                if(!source.type.includes('audio')){
                    if( elapsed >= source.media.timelineTime[0] && elapsed <= source.media.timelineTime[1]){

                        boxBus.push(new BoundingMoveBox(source.media));

                        boxBus.push(new BoundingControlResize(source.media));

                    }
                }
            }
            
        });

        drawControlArea();

    }

}
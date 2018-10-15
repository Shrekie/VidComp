import MotionEvents from './../../../vue_app/library/dragResizeMotion/motionEvents.js'; //TODO: move library to top public level

export default function (timeTracker, interfaceDrawer, timeline) {

    var _timeTracker = timeTracker,  
    _interfaceDrawer = interfaceDrawer,
    _timeline = timeline,
    _videoOutput,
    _sourceLoader;

    var _elapsedDateTime;

    var boxBus = [];
    var touchedBox;

    var pos1 = 0, pos2 = 0, 
    pos3 = 0, pos4 = 0;

    var boundingMoveBox = function (size, pos, media) {

        this.size = size, this.pos = pos,
        this.media = media;

        this.moveBox = function (pos){
            this.pos = pos;
        }

        this.touchBox = function (cord) {

            let right = this.size[0] + this.pos[0];
            let bottom = this.size[0] + this.pos[1];

            console.log(right);
            console.log(bottom);
            console.log(cord);
            console.log(this.pos);

            if((cord[0] < right && cord[0] > this.pos[0]) &&
               (cord[1] < bottom && cord[1] > this.pos[1])
            ){
                return true;
            }else{
                return false;
            }

        }

    }

    var dragBox = function (e){

        MotionEvents.cursorHandler(e, function(e){

            var changedMedia = _timeline.getLayer(touchedBox.media.layerIndex).getMedia(touchedBox.media.mediaIndex);

            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            touchedBox.moveBox([changedMedia.position[0] - pos1, changedMedia.position[1] - pos2]);

            changedMedia.position = [changedMedia.position[0] - pos1, changedMedia.position[1] - pos2];
            changedMedia.size = touchedBox.size;

            _interfaceDrawer.scrubVideo(_elapsedDateTime, _sourceLoader, _videoOutput, function(source){
                _videoOutput.ctx.beginPath();
                _videoOutput.ctx.lineWidth = "6";
                _videoOutput.ctx.strokeStyle = "red";
                _videoOutput.ctx.rect(source.media.position[0], source.media.position[1],
                source.media.size[0], source.media.size[1]);
                _videoOutput.ctx.stroke();
                _videoOutput.ctx.closePath();

            });

        });

    }

    var dragStop = function (e) {

        _videoOutput.el.onmousemove = null;
        _videoOutput.el.ontouchmove = null;

    }

    var checkTouch = function (e) {

        MotionEvents.cursorHandler(e, function(e){

            var rect = _videoOutput.el.getBoundingClientRect(),
            scaleX = _videoOutput.el.width / rect.width,
            scaleY = _videoOutput.el.height / rect.height;

            let mousePos = {
                x: (e.clientX - rect.left) * scaleX,
                y: (e.clientY - rect.top) * scaleY
            };

            touchedBox = boxBus.slice().reverse().find(function(box){
                return box.touchBox([mousePos.x, mousePos.y])
            });

            console.log(touchedBox);

            if(touchedBox){

                pos3 = e.clientX;
                pos4 = e.clientY;
                
                _videoOutput.el.onmousemove = dragBox;
                _videoOutput.el.ontouchmove = dragBox;

                _videoOutput.el.onmouseup = dragStop;
                _videoOutput.el.ontouchend = dragStop;

            }

        });

    };

    this.enableTransform = function(videoOutput, sourceLoader) {

        _videoOutput = videoOutput;
        _sourceLoader = sourceLoader;
        _videoOutput.el.onmousedown = function(e){checkTouch(e)};
        MotionEvents.holdNonSwipeTouch(videoOutput.el, checkTouch);

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

            if(!source.type.includes('audio')){
                if( elapsed >= source.media.timelineTime[0] && elapsed <= source.media.timelineTime[1]){
                    boxBus.push(new boundingMoveBox(source.media.size, source.media.position, source.media));
                }
            }

        });

        _interfaceDrawer.scrubVideo(_elapsedDateTime, _sourceLoader, _videoOutput, function(source){
            _videoOutput.ctx.beginPath();
            _videoOutput.ctx.lineWidth = "6";
            _videoOutput.ctx.strokeStyle = "red";
            _videoOutput.ctx.rect(source.media.position[0], source.media.position[1],
            source.media.size[0], source.media.size[1]);
            _videoOutput.ctx.stroke();
            _videoOutput.ctx.closePath();
        });

        /*

        Promise.all(drawBus).then(function(sources) {

            sources.forEach(function(source){
                videoOutput.ctx.clearRect(0,0, videoOutput.el.width, videoOutput.el.height);
                videoOutput.ctx.drawImage(source.cast, 
                source.media.position[0], source.media.position[1],
                source.media.size[0], source.media.size[1])
            });

            if(sources.length <= 0) videoOutput.ctx.clearRect(0,0, videoOutput.el.width, videoOutput.el.height);

        });

        */

    }

}
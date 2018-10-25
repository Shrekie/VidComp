import MotionHatch from "./MotionHatch.js"

// Stream transcending buffer mojo motion flow

class MotionEvent  {

    // TODO: make pos array
    _pos1 = 0;
    _pos2 = 0;
    _pos3 = 0; 
    _pos4 = 0;

    _ghostLeft;
    _ghostRight;
    _widthGhost;


    static snapPoints = [];

    static snapCalculation (mediaElement, elementToSnap) {

        /*
        * 
        */

    }

    _elementMove (e) {

        /*
        *
        */

    }

    _openMotion (e) {
        
        MotionHatch.cursorHandler(e, function(e){

            this.onDragBegin();
            this.moveElement.style.zIndex = 10000;

            MotionEvent.snapCalculation(this.media, this.moveElement);

            this._ghostLeft = (this.moveElement.offsetLeft - this._pos1);
            this._ghostRight = this._ghostLeft + this.moveElement.offsetWidth;
            this._widthGhost = this.moveElement.offsetWidth;

            this._pos3 = e.clientX;
            this._pos4 = e.clientY;

            document.onmouseup = function(){this._closeMotion(this.moveElement, function(){
                this.onDragClose(
                    this.moveElement.offsetTop, 
                    (this.moveElement.offsetLeft)
                );
            }.bind(this))}.bind(this);

            document.onmousemove = this._elementMove.bind(this);
    
            document.ontouchend = function(){this._closeMotion(this.moveElement, function(){
                this.onDragClose(
                    this.moveElement.offsetTop, 
                    (this.moveElement.offsetLeft)
                );
            }.bind(this))}.bind(this);

            document.ontouchmove = this._elementMove.bind(this);

        }.bind(this));

    }

    _closeMotion = function(moveElement, cb) {

        document.onmouseup = null;
        document.onmousemove = null;

        document.ontouchend = null;
        document.ontouchmove = null;

        moveElement.style.zIndex = 1;

        cb();

    };

    _snapCheck () {

        var snapResult = {
            left:{snapped:false, snapPosition:0}, 
            right:{snapped:false, snapPosition:0}
        };

        for(var i = 0; i < MotionEvent.snapPoints.length; i++){
            if(this._ghostLeft >= MotionEvent.snapPoints[i].snapRange[0] && 
            this._ghostLeft <= MotionEvent.snapPoints[i].snapRange[1]){
                snapResult.left.snapped = true;
                snapResult.left.snapPosition = MotionEvent.snapPoints[i].snapPosition;

            }
            
            if(this._ghostRight >= MotionEvent.snapPoints[i].snapRange[0] && 
            this._ghostRight <= MotionEvent.snapPoints[i].snapRange[1]){

                snapResult.right.snapped = true;
                snapResult.right.snapPosition = MotionEvent.snapPoints[i].snapPosition;

            }
        }

        return snapResult;

    }

    constructor(media, triggerElement, 
        moveElement, onDragBegin, onDragClose) {

        this.media = media;
        this.onDragClose = onDragClose;
        this.onDragBegin = onDragBegin;
        this.moveElement = moveElement;
        this.triggerElement = triggerElement;
        this.triggerElement.onmousedown = this._openMotion.bind(this);
        MotionHatch.holdNonSwipeTouch(this.triggerElement, this._openMotion.bind(this));
    
    }

}

class DragMedia extends MotionEvent {

    _elementMove (e) {
        
        MotionHatch.cursorHandler(e, function(e){

            this._pos1 = this._pos3 - e.clientX;
            this._pos2 = this._pos4 - e.clientY;
            this._pos3 = e.clientX;
            this._pos4 = e.clientY;

            this._ghostLeft = (this._ghostLeft - this._pos1);
            this._ghostRight = this._ghostLeft + this.moveElement.offsetWidth;

            let snapResult = this._snapCheck();
            if(!(snapResult.left.snapped || snapResult.right.snapped) ){
                this.moveElement.style.left = this._ghostLeft + "px";
                this.moveElement.style.left = (this.moveElement.offsetLeft - this._pos1) + "px";
            }else if (snapResult.left.snapped){
                this.moveElement.style.left = snapResult.left.snapPosition + "px";
            } else if(snapResult.right.snapped){
                this.moveElement.style.left = (snapResult.right.snapPosition - this.moveElement.offsetWidth) + "px";
            }
  
            this.moveElement.style.top = (this.moveElement.offsetTop - this._pos2) + "px";

        }.bind(this));

    }

    constructor(media, triggerElement, 
    moveElement, onDragBegin, onDragClose) {

        super(media, triggerElement, 
        moveElement, onDragBegin, onDragClose);
    
    }

}

class ResizeMedia extends MotionEvent {

    _elementMove (e) {
        
        MotionHatch.cursorHandler(e, function(e){

            this._pos1 = this._pos3 - e.clientX;
            this._pos3 = e.clientX;
            this._ghostRight = this._ghostRight - this._pos1;

            if(this.direction == "right"){
                this._widthGhost = this._widthGhost - this._pos1;
                this._ghostLeft = this._ghostLeft +  this._pos1;
            }else{
                this._widthGhost = this._widthGhost + this._pos1;
                this._ghostLeft = this._ghostLeft -  this._pos1;
            }

            let snapResult = this._snapCheck();
            
            //FIXME: this.widthGhost > 80 check not smoothest minimum decrease
            if(this._widthGhost > 80){

                if(this.direction == "right"){

                    if(!snapResult.right.snapped){

                        this.moveElement.style.width =  this._widthGhost + "px";

                    }else{
                        
                        var widthIncrease = snapResult.right.snapPosition -
                        this.moveElement.offsetLeft;

                        this.moveElement.style.width = widthIncrease + "px";
                    }

                }else{

                    if(!snapResult.left.snapped){

                        this.moveElement.style.left = this._ghostLeft + "px";
                        this.moveElement.style.width =  this._widthGhost + "px";

                    }else{

                        var widthIncrease = this.moveElement.offsetLeft - 
                        snapResult.left.snapPosition;

                        this.moveElement.style.left = snapResult.left.snapPosition + "px";
                        this.moveElement.style.width = (this.moveElement.offsetWidth + 
                        widthIncrease) + "px";
                    }

                }

            }

        }.bind(this));
    
    }

    constructor(media, triggerElement, 
    moveElement, onDragBegin, onDragClose, direction) {

        super(media, triggerElement, 
        moveElement, onDragBegin, onDragClose);

        this.direction = direction;
    }


}

export default {MotionEvent, DragMedia, ResizeMedia};
import MotionEvents from "./motionEvents.js"

var DragResizeMedia = function () {

    var enableDrag = function (media, triggerElement, dragElement, onDragBegin, onDragClose) {

        var dragMouseDown = function(e) {
            MotionEvents.cursorHandler(e, function(e){

                this.onDragBegin();

                DragResizeMedia.prototype.
                snapCalculation(this.media, this.dragElement);
                // get the mouse cursor position at startup:
                dragElement.style.zIndex = 10000;
                this.ghostLeft = (this.dragElement.offsetLeft - this.pos1);
                this.ghostRight = this.ghostLeft + this.dragElement.offsetWidth;
                this.pos3 = e.clientX;
                this.pos4 = e.clientY;

                document.onmouseup = function(){closeDragElement(dragElement, function(){
                    this.onDragClose(
                        this.dragElement.offsetTop, 
                        (this.dragElement.offsetLeft)
                    );
                }.bind(this))}.bind(this);

                document.onmousemove = elementDrag;
        
                document.ontouchend = function(){dragElement, closeDragElement(dragElement, function(){
                    this.onDragClose(
                        this.dragElement.offsetTop, 
                        (this.dragElement.offsetLeft)
                    );
                }.bind(this))}.bind(this);

                document.ontouchmove = elementDrag;
    
            }.bind(this));
    
        }.bind(this);
    
    
    
        var elementDrag = function(e) {
            
            MotionEvents.cursorHandler(e, function(e){
    
                // calculate the new cursor position:
                this.pos1 = this.pos3 - e.clientX;
                this.pos2 = this.pos4 - e.clientY;
                this.pos3 = e.clientX;
                this.pos4 = e.clientY;
                this.ghostLeft = (this.ghostLeft - this.pos1);
                this.ghostRight = this.ghostLeft + this.dragElement.offsetWidth;

                // set the element's new position:
                if(!snapCheck(this.ghostLeft, this.ghostRight, this.dragElement)){
                    this.dragElement.style.left = this.ghostLeft + "px";
                    this.dragElement.style.left = (this.dragElement.offsetLeft - this.pos1) + "px";
                }
                this.dragElement.style.top = (this.dragElement.offsetTop - this.pos2) + "px";
    
            }.bind(this));
    
        }.bind(this);
    
        var snapCheck = function(ghostLeft, ghostRight, element) {

            let snapPoints = DragResizeMedia.prototype.snapPoints;

            for(var i = 0; i < snapPoints.length; i++){
                if(ghostLeft >= snapPoints[i].snapRange[0] && ghostLeft <= snapPoints[i].snapRange[1]){
                    element.style.left = snapPoints[i].snapPosition + "px";
                    return true;
                }else if(ghostRight >= snapPoints[i].snapRange[0] && ghostRight <= snapPoints[i].snapRange[1]){
                    element.style.left = (snapPoints[i].snapPosition - element.offsetWidth) + "px";
                    return true;
                }
            }
    
            return false;
    
        }.bind(this);

        this.media = media;
        this.onDragClose = onDragClose;
        this.onDragBegin = onDragBegin;
        this.dragElement = dragElement;
        this.triggerElement = triggerElement;
        this.pos1 = 0, this.pos2 = 0, 
        this.pos3 = 0, this.pos4 = 0; // SUGGESTION: make these global var on this class
        this.triggerElement.onmousedown = dragMouseDown;
        MotionEvents.holdNonSwipeTouch(this.triggerElement, dragMouseDown);

    };

    var enableResize = function(media, dragElement, resizeElement, onDragClose, direction){
        
        var resizeMouseDown = function(e){

            MotionEvents.cursorHandler(e, function(e){

                DragResizeMedia.prototype.
                snapCalculation(this.media, this.resizeElement);

                resizeElement.style.zIndex = 10000;
                this.widthGhost = this.resizeElement.offsetWidth;
                this.ghostLeftResize = this.resizeElement.offsetLeft;
                this.ghostRightResize = this.ghostLeft + this.widthGhost;
    
                this.ghostLeft = this.dragElement.offsetLeft;
                this.ghostRight = this.ghostLeft + this.dragElement.offsetWidth;
                this.dragElement.style.left = this.ghostLeft + "px";
                this.pos3 = e.clientX;
                
                document.onmouseup = function(){closeDragElement(resizeElement, function(){
                    this.onDragClose(
                        this.dragElement.offsetTop, 
                        (this.dragElement.offsetLeft)
                    );
                }.bind(this))}.bind(this);

                document.onmousemove = elementResize;
    
                document.ontouchend = function(){closeDragElement(resizeElement, function(){
                    this.onDragClose(
                        this.dragElement.offsetTop, 
                        (this.dragElement.offsetLeft)
                    );
                }.bind(this))}.bind(this);

                document.ontouchmove = elementResize;
    
            }.bind(this));
    
        }.bind(this);

        var elementResize = function(e){
            MotionEvents.cursorHandler(e, function(e){

                this.pos1 = this.pos3 - e.clientX;
                this.pos3 = e.clientX;
                this.ghostRight = this.ghostLeft + this.dragElement.offsetWidth;
    
                if(this.direction == "right"){
                    this.widthGhost = this.widthGhost - this.pos1;
                    this.ghostLeft = this.ghostLeft -  this.pos1;
                }else{
                    this.widthGhost = this.widthGhost + this.pos1;
                    this.ghostLeftResize = this.ghostLeftResize - this.pos1;
                }
    
                this.ghostLeftResize = this.ghostLeftResize 
                this.ghostRightResize = this.ghostLeftResize + this.widthGhost;
    
                var checkSnap = snapCheckResize(this.ghostLeftResize, this.ghostRightResize, 
                this.resizeElement);
                
                //TODO: this.widthGhost > 30 check not smoothest minimum decrease
                if(this.widthGhost > 80){
                    if(this.direction == "right"){
                        if(!checkSnap.right.snapped){
                            this.resizeElement.style.width =  this.widthGhost + "px";
                            this.dragElement.style.left = this.ghostLeft + "px";
                        }else{
                            var widthIncrease = checkSnap.right.snapPosition - 
                            (this.resizeElement.offsetWidth + this.resizeElement.offsetLeft);
                            this.resizeElement.style.width = (this.resizeElement.offsetWidth + 
                            widthIncrease) + "px";
                            this.dragElement.style.left = this.dragElement.offsetLeft + 
                            widthIncrease + "px";
                        }
                    }else{
                        if(!checkSnap.left.snapped){
                            this.resizeElement.style.left = this.ghostLeftResize + "px";
                            this.resizeElement.style.width =  this.widthGhost + "px";
                        }else{
                            var widthIncrease = this.resizeElement.offsetLeft - 
                            checkSnap.left.snapPosition;
                            this.resizeElement.style.left = checkSnap.left.snapPosition + "px";
                            this.resizeElement.style.width = (this.resizeElement.offsetWidth + 
                            widthIncrease) + "px";
                        }
                    }
                }
    
            }.bind(this));
    
    
        }.bind(this);

        var snapCheckResize = function(ghostLeft, ghostRight, element) {

            let snapPoints = DragResizeMedia.prototype.snapPoints;

            var snapResult = {
                left:{snapped:false, snapPosition:0}, 
                right:{snapped:false, snapPosition:0}
            };
    
            for(var i = 0; i < snapPoints.length; i++){
    
                if(ghostLeft >= snapPoints[i].snapRange[0] && ghostLeft <= 
                    snapPoints[i].snapRange[1]){
                    snapResult.left.snapped = true;
                    snapResult.left.snapPosition = snapPoints[i].snapPosition;
                }
                
                if(ghostRight >= snapPoints[i].snapRange[0] && ghostRight <= 
                    snapPoints[i].snapRange[1]){
                    snapResult.right.snapped = true;
                    snapResult.right.snapPosition = snapPoints[i].snapPosition;
                }
            }
    
            return snapResult;
    
        }.bind(this);

        this.media = media;
        this.onDragClose = onDragClose;
        this.dragElement = dragElement;
        this.direction = direction;
        this.resizeElement = resizeElement;
        this.pos1 = 0, this.pos2 = 0, 
        this.pos3 = 0, this.pos4 = 0;
        this.dragElement.onmousedown = resizeMouseDown;
        this.dragElement.ontouchstart = resizeMouseDown;
    };

    var closeDragElement = function(moveElement, cb) {

        document.onmouseup = null;
        document.onmousemove = null;

        document.ontouchend = null;
        document.ontouchmove = null;

        //#TODO: just like closeDragElement, make a startDragElement
        moveElement.style.zIndex = 1;
        cb();

    };

    return{
        enableResize,
        enableDrag
    }

}

DragResizeMedia.prototype.snapPoints = [];

DragResizeMedia.prototype.snapCalculation = function(){
    console.log("no snap calculation");
}

export default DragResizeMedia;
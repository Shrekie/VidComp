
var MotionEvents = function () {

    this.onDragClose = function(){};
    this.media;
    this.widthGhost = 0;
    this.direction = 0;
    this.dragElement = {};
    this.triggerElement = {};
    this.resizeElement = {};
    this.triggerElement.onmousedown = null;
    

    this.enableDrag = function (media, triggerElement, dragElement, onDragClose) {
        this.media = media;
        this.onDragClose = onDragClose;
        this.dragElement = dragElement;
        this.triggerElement = triggerElement;
        this.triggerElement.onmousedown = dragMouseDown;
    }

    this.enableResize = function(media, dragElement, resizeElement, onDragClose, direction){
        this.media = media;
        this.onDragClose = onDragClose;
        this.dragElement = dragElement;
        this.direction = direction;
        this.resizeElement = resizeElement;
        this.dragElement.onmousedown = resizeMouseDown;
    }

    var resizeMouseDown = function(e){
        e = e || window.event;
        e.preventDefault();
        this.snapCalculation(this.media, this.resizeElement);
        // get the mouse cursor position at startup:
        console.log(this.dragElement.offsetLeft);

        this.widthGhost = this.resizeElement.offsetWidth;
        this.ghostLeftResize = this.resizeElement.offsetLeft;
        this.ghostRightResize = this.ghostLeft + this.widthGhost;

        this.ghostLeft = this.dragElement.offsetLeft;
        this.ghostRight = this.ghostLeft + this.dragElement.offsetWidth;
        this.dragElement.style.left = this.ghostLeft + "px";
        this.pos3 = e.clientX;
        
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementResize;
    }.bind(this);

    var dragMouseDown = function(e) {

        e = e || window.event;
        e.preventDefault();
        this.snapCalculation(this.media, this.dragElement);
        // get the mouse cursor position at startup:
        this.ghostLeft = (this.dragElement.offsetLeft - this.pos1);
        this.ghostRight = this.ghostLeft + this.dragElement.offsetWidth;
        this.pos3 = e.clientX;
        this.pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;

    }.bind(this);

    var elementResize = function(e){

        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
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

        var checkSnap = snapCheckResize(this.ghostLeftResize, this.ghostRightResize, this.resizeElement);
        if(this.widthGhost > 20){
            if(this.direction == "right"){
                if(!checkSnap.right.snapped){
                    this.resizeElement.style.width =  this.widthGhost + "px";
                    this.dragElement.style.left = this.ghostLeft + "px";
                }else{
                    var widthIncrease = checkSnap.right.snapPosition - (this.resizeElement.offsetWidth + this.resizeElement.offsetLeft);
                    this.resizeElement.style.width = (this.resizeElement.offsetWidth + widthIncrease) + "px";
                    console.log(checkSnap.right.snapPosition);
                    console.log(this.dragElement.offsetLeft);
                    this.dragElement.style.left = this.dragElement.offsetLeft + widthIncrease + "px";
                }
            }else{
                if(!checkSnap.left.snapped){
                    this.resizeElement.style.left = this.ghostLeftResize + "px";
                    this.resizeElement.style.width =  this.widthGhost + "px";
                }else{
                    var widthIncrease = this.resizeElement.offsetLeft - checkSnap.left.snapPosition;
                    this.resizeElement.style.left = checkSnap.left.snapPosition + "px";
                    this.resizeElement.style.width = (this.resizeElement.offsetWidth + widthIncrease) + "px";
                }
            }
        }


    }.bind(this);

    var elementDrag = function(e) {
        e = e || window.event;
        e.preventDefault();
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
    }.bind(this);


    var snapCheckResize = function(ghostLeft, ghostRight, element) {

        console.log(this.widthGhost);

        var snapResult = {
            left:{snapped:false, snapPosition:0}, 
            right:{snapped:false, snapPosition:0}
        };

        for(var i = 0; i < this.snapPoints.length; i++){

            if(ghostLeft >= this.snapPoints[i].snapRange[0] && ghostLeft <= this.snapPoints[i].snapRange[1]){
                //element.style.left = this.snapPoints[i].snapPosition + "px";
                //this.dragElement.style.left = this.ghostLeft + "px";
                console.log("LEFT HIT");
                snapResult.left.snapped = true;
                snapResult.left.snapPosition = this.snapPoints[i].snapPosition;
            }
            
            if(ghostRight >= this.snapPoints[i].snapRange[0] && ghostRight <= this.snapPoints[i].snapRange[1]){
                //element.style.left = (this.snapPoints[i].snapPosition - element.offsetWidth) + "px";
                //this.resizeElement.style.width =  this.widthGhost + "px";
                //this.dragElement.style.left = this.ghostLeft + "px";
                console.log("RIGHT HIT");
                snapResult.right.snapped = true;
                snapResult.right.snapPosition = this.snapPoints[i].snapPosition;
            }
        }

        return snapResult;

    }.bind(this);

    var snapCheck = function(ghostLeft, ghostRight, element) {
        //console.log(this.snapPoints);
        for(var i = 0; i < this.snapPoints.length; i++){
            if(ghostLeft >= this.snapPoints[i].snapRange[0] && ghostLeft <= this.snapPoints[i].snapRange[1]){
                element.style.left = this.snapPoints[i].snapPosition + "px";
                console.log("LEFT HIT");
                return true;
            }else if(ghostRight >= this.snapPoints[i].snapRange[0] && ghostRight <= this.snapPoints[i].snapRange[1]){
                element.style.left = (this.snapPoints[i].snapPosition - element.offsetWidth) + "px";
                return true;
            }
        }

        return false;

    }.bind(this);

    var closeDragElement = function() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;

        //FIXME: OFFSET LEFT NOT CORRECT LEFT POSITION
        this.onDragClose(
            this.dragElement.offsetTop, 
            (this.dragElement.offsetLeft)
        );
    }.bind(this);

}

//FIXME: this wont work, need unique for each instance or change each invocation
MotionEvents.prototype.pos1 = 0;
MotionEvents.prototype.pos2 = 0;
MotionEvents.prototype.pos3 = 0;
MotionEvents.prototype.pos4 = 0;
MotionEvents.prototype.ghostRight = 0;
MotionEvents.prototype.ghostLeft = 0;
MotionEvents.prototype.snapPoints = [];

MotionEvents.prototype.setSnapPoints = function (snapPoints){
    MotionEvents.prototype.snapPoints = snapPoints;
}

MotionEvents.prototype.snapCalculation = function(){
    console.log("no snap calculation");
}

export default MotionEvents;
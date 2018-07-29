
var MotionEvents = function () {

    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    var ghostLeft = 0;
    var ghostRight = 0;

    this.onDragClose = function(){};
    this.media;
    this.element = {};
    this.element.onmousedown = null;

    this.enableDrag = function (media, element, onDragClose) {
        this.media = media;
        this.onDragClose = onDragClose;
        this.element = element;
        this.element.onmousedown = dragMouseDown;
    }

    var dragMouseDown = function(e) {

        e = e || window.event;
        e.preventDefault();
        this.snapCalculation(this.media, this.element);
        // get the mouse cursor position at startup:
        ghostLeft = (this.element.offsetLeft - pos1);
        ghostRight = ghostLeft + this.element.offsetWidth;
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;

    }.bind(this);

    var elementDrag = function(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        ghostLeft = (ghostLeft - pos1);
        ghostRight = ghostLeft + this.element.offsetWidth;

        // set the element's new position:
        if(!snapCheck(ghostLeft, ghostRight, this.element)){
            this.element.style.left = ghostLeft + "px";
            this.element.style.left = (this.element.offsetLeft - pos1) + "px";
        }
        this.element.style.top = (this.element.offsetTop - pos2) + "px";
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

        console.log("OFFSET LEFT")
        console.log(this.element.offsetLeft);
        console.log(this.element.offsetLeft - pos1);
        //FIXME: OFFSET LEFT NOT CORRECT LEFT POSITION
        this.onDragClose(
            this.element.offsetTop, 
            (this.element.offsetLeft)
        );
    }.bind(this);

}

MotionEvents.prototype.snapPoints = [];

MotionEvents.prototype.setSnapPoints = function (snapPoints){
    MotionEvents.prototype.snapPoints = snapPoints;
}

MotionEvents.prototype.snapCalculation = function(){
    console.log("no snap calculation");
}

export default MotionEvents;
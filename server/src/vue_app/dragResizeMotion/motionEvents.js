
export default function () {

    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    this.onDragClose = function(){};
    this.element = {};
    this.element.onmousedown = null;

    var holdStart = 0;
    var holdTimeout;

    this.enableDrag = function (element, onDragClose) {
        this.onDragClose = onDragClose;
        this.element = element;
        this.element.onmousedown = dragMouseDown;
    }

    var dragMouseDown = function(e) {
        
        /*
        clearTimeout(holdTimeout);
 
        holdTimeout = setTimeout(function(){

            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;

        }, 300);

        document.onmouseup = function(){
            clearTimeout(holdTimeout);
            closeDragElement();
        }
        */

        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;

    };

    var elementDrag = function(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        this.element.style.top = (this.element.offsetTop - pos2) + "px";
        this.element.style.left = (this.element.offsetLeft - pos1) + "px";
    }.bind(this);

    var closeDragElement = function() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
        this.onDragClose(
            this.element.offsetTop - pos2, 
            (this.element.offsetLeft - pos1)
        );
    }.bind(this);

}
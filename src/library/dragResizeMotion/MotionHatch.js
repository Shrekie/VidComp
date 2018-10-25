class MotionHatch {

    static holdNonSwipeTouch (triggerElement, dragMouseDown) {

        var touchduration = 500;
        var swipestrength = 30;
        var preventDefault = false;
        var timer;
        var startX;
        var startY;
        var moveX;
        var moveY;

        triggerElement.ontouchstart = function(e) {

            startX = e.touches[0].pageX;
            startY = e.touches[0].pageY;
            timer = setTimeout(function(){
                preventDefault = true;
                dragMouseDown(e);
            }.bind(this), touchduration);

            return true;

        }

        triggerElement.ontouchend = function(e) {

            e.preventDefault();

            if (timer) {
                clearTimeout(timer);
            }

        }

        triggerElement.ontouchmove = function(e) {

            if(preventDefault){
                e.preventDefault();
            }

            moveX = e.touches[0].pageX;
            moveY = e.touches[0].pageY;

            var xDiff = startX - moveX;
            var yDiff = startY - moveY;

            if( Math.abs(xDiff) > swipestrength || Math.abs(yDiff) > swipestrength){
                clearTimeout(timer);
            }

        }


    }

    static cursorHandler (e, cb) {

        e = e || window.event;
        e.preventDefault();

        var cursorOveridden = {};
        cursorOveridden = e;

        if(e.touches){
            cursorOveridden.clientX = e.touches[0].pageX;
            cursorOveridden.clientY = e.touches[0].pageY;
        }

        cb(cursorOveridden);

    }

}

export default MotionHatch;
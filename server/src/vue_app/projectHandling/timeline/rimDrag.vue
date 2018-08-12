<!-- 
	Main user interaction section
-->

<template>
    <div class="rimDrag" ref="rimPoint">
    </div>
</template>

<script>

    /*
        #SUGGESTION: ss
    */

import MotionEvents from './../../dragResizeMotion/motionEvents.js';

export default {
    
    name: "rimDrag",

    props: ['mediaIndex', 'layerIndex', 'projectName', 'elementToResize', 'direction'],
    
	data() {
		return {
            motionEvents: new MotionEvents (),
            rightDirection:0,
            leftDirection:0
		}
    },

    methods: {

        setDirection () {
            if(this.direction == "right"){
                this.leftDirection = "unset";
                this.rightDirection = "0px";
                this.$refs.rimPoint.style.left = this.leftDirection;
                this.$refs.rimPoint.style.right = this.rightDirection;
            }else{ 
                this.leftDirection = "0px";
                this.rightDirection = "unset";
                this.$refs.rimPoint.style.left = this.leftDirection;
                this.$refs.rimPoint.style.right = this.rightDirection;
            }
            this.$refs.rimPoint.style.width = "10px";
        }

    },

    mounted: function () {
        console.log(this.elementToResize);
        
        var media = this.$vcomp(this.projectName).getMedia(this.layerIndex, this.mediaIndex);
        
        this.motionEvents.enableResize(media, this.$refs.rimPoint, 
        this.elementToResize.mediaContainer, function(top, left){
            
            console.log('dropped RIM');
            var direction = 0;
            var timelineTime = 0;

            if(this.direction == "right"){
                timelineTime = (this.elementToResize.mediaContainer.offsetWidth + 
                this.elementToResize.mediaContainer.offsetLeft) / 1000;
                direction = "forwards";
            }else{
                timelineTime = this.elementToResize.mediaContainer.offsetLeft / 1000;
                direction = "backwards";
            }
            
            this.$vcomp(this.projectName)
            .adjustMediaTimeShift(direction, 
            this.layerIndex, this.mediaIndex, timelineTime);
            

            this.setDirection();

        }.bind(this), this.direction);

        this.setDirection();
        
    }  
    
};

</script>

<style>

.rimDrag{
    background: #c4d3f99c;
    width: 10px;
    position: absolute;
    height: 40px;
    border: 1px solid black;
}

</style>
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
                this.rightDirection = "0";
                this.$refs.rimPoint.style.left = this.leftDirection;
                this.$refs.rimPoint.style.right = this.rightDirection;
            }else{
                this.leftDirection = "0";
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

            //this.$refs.rimPoint.style.top = "0px";
            //this.$refs.rimPoint.style.left = this.mediaLeft
            this.setDirection();
        }.bind(this), this.direction);

        this.setDirection();
        
    }  
    
};

</script>

<style>

.rimDrag{
    background:red;
    width: 10px;
    height: inherit;
    position: absolute;
    top: 15px;
    height: 10px;
    border-radius: 20px;
}

</style>
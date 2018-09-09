<!-- 
	Main user interaction section
-->

<template>
    <div class="rimDrag" ref="rimPoint">
	    <v-icon small v-if="this.direction == 'right'">mdi-chevron-right</v-icon>
        <v-icon small v-else>mdi-chevron-left</v-icon>
    </div>
</template>
<script>

import MotionEvents from './../../dragResizeMotion/motionEvents.js';

export default {
    
    name: "rimDrag",

    props: ['mediaIndex', 'layerIndex', 'projectName', 'elementToResize', 'direction'],
    
	data() {
		return {
            rightDirection:0,
            resizeMotion:0,
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
        }

    },

    mounted: function () {
        
        var media = this.$vcomp(this.projectName).getMedia(this.layerIndex, this.mediaIndex);
        
        this.resizeMotion = new MotionEvents().enableResize(media, this.$refs.rimPoint, 
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
    width: 25px;
    position: absolute;
    height: 60px;
    /*border: 1px solid black;*/
}
.rimDrag .mdi-chevron-left,
.rimDrag .mdi-chevron-right
{
    font-size: 20px !important;

    margin-top: 80%;
    color: #000000;
}

</style>
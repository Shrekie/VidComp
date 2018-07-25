<!-- 
	Inserts images into video composer project
-->

<template>

<div class="mediaContainer" ref="media"
v-bind:style="{ width: mediaWidth, left: mediaLeft }" ></div>


</template>

<script>
import MotionEvents from './../../dragResizeMotion/motionEvents.js';

export default {
    name: "media",
    props: ['mediaIndex', 'layerIndex', 'timelineTime', 'projectName'],
    data() {

		return {
            mediaWidth: "0px",
            mediaLeft: "50%",
            motionEvents: new MotionEvents ()
        }
        
    },
    methods: {
        setMediaSize () {
            // FIXME: change name, it also positions.
            this.mediaWidth = ((this.timelineTime[1]-this.timelineTime[0])*1000) + 'px';
            this.mediaLeft = (this.timelineTime[0]*1000) + 'px';

        }
    },
    computed: {
    },
    mounted: function () {
        console.log(this.mediaIndex);
        
        this.motionEvents.enableDrag(this.$refs.media, function(top, left){
            
            console.log('dropped element');
            var nextLayerPixels = 70;

            var newLayerIndex = Math.sign((top/nextLayerPixels)) * 
            Math.floor(Math.abs((top/nextLayerPixels)));

            this.$vcomp(this.projectName)
            .adjustMediaShift({
                    layerIndex: this.layerIndex, mediaIndex:this.mediaIndex
                },{
                    layerIndex:newLayerIndex,
                    timelineStartTime: (left/1000)
            });

            this.$refs.media.style.top = "0px";
        }.bind(this));

        this.setMediaSize();

    }
};

</script>

<style>

.mediaContainer:hover{
    opacity: 0.5 !important;
}

.mediaContainer{
    display: inline-block;
    position: absolute;
    background-color: forestgreen;
    border: 1px solid black;
    height: 60px;
    width: 0px;
    user-select: none;
    z-index: 1;
}

</style>
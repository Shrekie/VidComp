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
            mediaIndex: this.mediaIndex,
            projectName: this.projectName,
            timelineTime: this.timelineTime,
            layerIndex: this.layerIndex,
            mediaWidth: "0px",
            mediaLeft: "50%",
            motionEvents: new MotionEvents ()
        }
        
    },
    methods: {
        setMediaSize () {

            this.mediaWidth = ((this.timelineTime[1]-this.timelineTime[0])*1000) + 'px';
            this.mediaLeft = (this.timelineTime[0]*1000) + 'px';

        }
    },
    computed: {
        mediaWidth: function () {
            return this.mediaWidth;
        },
        mediaLeft: function () {
            return this.mediaLeft;
        }
    },
    mounted: function () {
        console.log(this.mediaIndex);
        
        this.motionEvents.enableDrag(this.$refs.media, function(top, left){
            console.log('dropped element');
            console.log(left);
            this.$vcomp(this.projectName)
            .adjustMediaShift({
                    layerIndex: this.layerIndex, mediaIndex:this.mediaIndex
                },{
                    layerIndex:1,
                    timelineStartTime: (left/1000)
            });

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
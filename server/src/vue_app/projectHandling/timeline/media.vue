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

        },

        updateElement () {
            this.$forceUpdate();
        },

    },

    computed: {
    },

    mounted: function () {

        var media = this.$vcomp(this.projectName).getMedia(this.layerIndex, this.mediaIndex);
        this.motionEvents.enableDrag(media, this.$refs.media, function(top, left){
            
            console.log('dropped element');
            var nextLayerPixels = 40;

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
            this.$refs.media.style.left = this.mediaLeft

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
    height: 40px;
    width: 0px;
    user-select: none;
    z-index: 1;
}

</style>
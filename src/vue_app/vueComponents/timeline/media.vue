<!-- 
	Inserts images into video composer project
-->

<template>

<div class="mediaContainer" ref="mediaContainer"
v-bind:style="{ width: `${mediaWidth}px`, left: `${mediaLeft}px` }" >

    <RimDrag v-bind:media-index="mediaIndex" 
    v-bind:layer-index="layerIndex" v-bind:project-name="projectName"
    v-bind:element-to-resize="this.$refs"
    v-bind:direction='"right"' v-if="mediaWidth > 70"></RimDrag>

    <RimDrag v-bind:media-index="mediaIndex" 
    v-bind:layer-index="layerIndex" v-bind:project-name="projectName"
    v-bind:element-to-resize="this.$refs"
    v-bind:direction='"left"' v-if="mediaWidth > 70"></RimDrag>

    <div class="media" ref="media"> </div>

</div>


</template>

<script>

import MotionEvents from './../../library/dragResizeMotion/motionEvents.js';
import RimDrag from './rimDrag.vue';

export default {
    name: "media",

    components: {
        RimDrag
    },

    props: ['mediaIndex', 'layerIndex', 'timelineTime', 'projectName'],

    data() {

		return {
            mediaWidth: "0px",
            mediaLeft: "50%",
            dragMotion:0,
            mediaElem: this.$refs.media
        }
        
    },

    methods: {

        setMediaSize () {
            // FIXME: change name, it also positions.
            this.mediaWidth = ((this.timelineTime[1]-this.timelineTime[0]) * this.zoomScale);
            this.mediaLeft = (this.timelineTime[0] * this.zoomScale);
        },

    },

    computed: {
        
        zoomScale (){
            return this.$store.getters.zoomScale(this.projectName);
        }
        
    },

    mounted: function () {
        
        //TODO: disable drag media when playing
        var media = this.$vcomp.project(this.projectName).getMedia(this.layerIndex, this.mediaIndex);
        this.dragMotion = new MotionEvents().enableDrag(media, this.$refs.media, this.$refs.mediaContainer, function(top, left){
            
            var nextLayerPixels = 60;
            var newLayerIndex = Math.sign((top/nextLayerPixels)) * 
            Math.floor(Math.abs((top/nextLayerPixels)));

            this.$vcomp.project(this.projectName)
            .adjustMediaShift({
                    layerIndex: this.layerIndex, mediaIndex:this.mediaIndex
                },{
                    layerIndex:newLayerIndex,
                    timelineStartTime: (left/this.zoomScale)
            });

            this.setMediaSize();

            this.$refs.mediaContainer.style.top = "0px";
            this.$refs.mediaContainer.style.left = this.mediaLeft

        }.bind(this));
        
        
        this.setMediaSize();
        
    }
    
};

</script>

<style>

.mediaContainer{
    display: inline-block;
    position: absolute;
    background-color: #1c4ec1;
    height: 60px;
    width: 0px;
    user-select: none;
    border: 1px solid #2f2f2f;
    border-radius: 3px;
    z-index: 1;
}

.media{
    height: 100%;
    width:100%;
    background: #757575
}

</style>
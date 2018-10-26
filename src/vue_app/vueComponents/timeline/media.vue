<!-- 
	Inserts images into video composer project
-->

<template>
<div class="mediaContainer" ref="mediaContainer"
v-bind:style="{width:`${mediaWidth}px`,left:`${mediaLeft}px`}" 
v-bind:class="{selectedMedia: focusArea}">

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

import MotionTide from './../../../library/dragResizeMotion/MotionTide.js';
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

        selectArea() {
            this.$store.dispatch('setFocusArea', {timelineArea: [this.layerIndex, this.mediaIndex]});
        },

        deselectArea(){
            this.$store.dispatch('setFocusArea', {timelineArea: [this.layerIndex, "none"]});
        }

    },

    computed: {
        
        zoomScale (){ 
            return this.$store.getters.zoomScale(this.projectName);
        },

        focusArea (){
            let focusArea = this.$store.getters.focusArea;
            return focusArea[0] == this.layerIndex && focusArea[1] == this.mediaIndex;
        }
        
    },

    mounted: function () {
        
        //TODO: disable drag media when playing
        var media = this.$vcomp.project(this.projectName).getMedia(this.layerIndex, this.mediaIndex);
        this.dragMotion = new MotionTide.DragMedia(media, this.$refs.media, this.$refs.mediaContainer,
        function(){this.selectArea();}.bind(this),

        function(top, left){
            
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

            if(newLayerIndex != 0) this.deselectArea();

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
    cursor: pointer;
    border: 1px solid #2f2f2f;
    border-radius: 3px;
    z-index: 1;
}

.selectedMedia{
    border: 3px solid white !important;
}

.media{
    height: 100%;
    width:100%;
    background: #757575
}

</style>
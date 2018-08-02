<!-- 
	Inserts images into video composer project
-->

<template>

<div class="mediaContainer" ref="mediaContainer"
v-bind:style="{ width: mediaWidth, left: mediaLeft }" >

    <RimDrag v-bind:media-index="mediaIndex" 
    v-bind:layer-index="layerIndex" v-bind:project-name="projectName"
    v-bind:element-to-resize="this.$refs"
    v-bind:direction='"right"'></RimDrag>

    <RimDrag v-bind:media-index="mediaIndex" 
    v-bind:layer-index="layerIndex" v-bind:project-name="projectName"
    v-bind:element-to-resize="this.$refs"
    v-bind:direction='"left"'></RimDrag>

    <div class="media" ref="media"> </div>

</div>


</template>

<script>

import MotionEvents from './../../dragResizeMotion/motionEvents.js';
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
            motionEvents: new MotionEvents (),
            mediaElem: this.$refs.media
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
        this.motionEvents.enableDrag(media, this.$refs.media, this.$refs.mediaContainer, function(top, left){
            
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

            this.$refs.mediaContainer.style.top = "0px";
            this.$refs.mediaContainer.style.left = this.mediaLeft

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
    background-color: #1c4ec1;
    height: 40px;
    width: 0px;
    user-select: none;
    z-index: 1;
}

.media{
    height: 100%;
    width:100%;
    background: #1c4ec1;
}

</style>
<!-- 
	Inserts images into video composer project
-->

<template>
<div>
    <div class="timelineContainer">
        <div ref="timeline" class="viewport">

            <TimelineEditor v-bind:project-name="projectName"></TimelineEditor>

        </div>
    </div>
</div>
</template>

<script>

import TimelineEditor from './timelineEditor.vue';
import MotionTide from './../../../library/dragResizeMotion/MotionTide.js';

export default {

    name: "editorPort",

    props: ['projectName'],

    components: {
        TimelineEditor,
    },

    computed:{

        zoomScale (){
            console.log(this.projectName);
            return this.$store.getters.zoomScale(this.projectName);
        },

    },

    mounted: function () {
        
        MotionTide.MotionEvent.snapCalculation = function(mediaElement, elementToSnap){

            let rangeOfSnap = 4;
            let snapPoints = [];

            snapPoints.push({
                snapRange:[-4, 4],
                snapPosition:0,
                layerPos:0
            });

            let allLayerMedia = 
            this.$vcomp.project(this.projectName).getAllMedia()

            allLayerMedia.forEach(function(media){
                if(media !== mediaElement){

                    let layerPos = media.layerIndex;

                    media.timelineTime.forEach(function(timelineTime){

                        let snapPoint = {
                            snapRange:[],
                            snapPosition:0,
                            layerPos:0
                        };

                        let frontSnap = ((timelineTime*this.zoomScale) + rangeOfSnap);
                        let backSnap = ((timelineTime*this.zoomScale) - rangeOfSnap);
                        let snapPosition = timelineTime*this.zoomScale;
                        snapPoint.snapRange = [backSnap, frontSnap];
                        snapPoint.snapPosition = snapPosition;
                        snapPoint.layerPos = layerPos;
                        snapPoints.push(snapPoint);

                    }.bind(this));

                }
            }.bind(this))

            MotionTide.MotionEvent.snapPoints = snapPoints;
            
        }.bind(this);

    },
        
    beforeDestroy: function () {
        this.$vcomp.project(this.projectName).unbindAllFrameHooks();
    }
    
};

</script>

<style>

.timelineContainer{
    background-color: #C5C5C5;
    margin: 10px auto;
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    transform: translateZ(0);
}

.viewport{
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 3;
    touch-action: pan-y pan-x;
    /*
        #TODO: remove scrollbar support entirely, implement own "scrollbars"
        Scrolling will still be based on "scrolling" just always hide the overflow.
    */
    padding-bottom: 60px;
    overflow: overlay; 
}

</style>
<!-- 
	Inserts images into video composer project
-->

<template>
    <div class="timelineContainer">
        <div ref="timeline" class="viewport">

                <TimelineSlider ref="timelineSlider"></TimelineSlider>

                <Layer ref="layers" v-bind:layer-index="layer.layerIndex" v-bind:project-name="projectName" 
                v-for="layer in allLayers" :key="layer.layerIndex"></Layer>

        </div>
    </div>
</template>

<script>

import Layer from './layer.vue';
import TimelineSlider from './timelineSlider.vue';

export default {

    name: "timelineEditor",
    components: {
        Layer,
        TimelineSlider
	},
    methods: {
        setVideoStartTime: function (){

            // TODO: move this behaviour more to component?
            this.$vcomp(this.projectName).videoControl('beforeActionStart', function(context){
                
                if(context.action == 'play'){
                    var startTime = (this.$refs.timeline.scrollLeft*100)
                    console.log(startTime);
                    console.log(context);
                    context.timeTracker.elapsedDateTime = startTime;
                    // FIXME: will probably not use scrollbars so fix these
                    this.$refs.timeline.style.overflow = "hidden";
                }

                if(context.action == 'stop'){
                    this.$refs.timeline.style.overflow = "overlay";
                }

                if(context.action == 'reset'){
                    this.$refs.timeline.scrollLeft = 0;
                    this.$refs.timeline.style.overflow = "overlay";
                }
    
            }.bind(this));

        },
        updateScrolling: function () {

            this.$vcomp(this.projectName).videoControl('drawingUpdate', function(context){

                if(context.timeTracker.isPlaying){
                    var currentSliderTime = ((context.timeTracker.convertTimeInteger(context.timeTracker.elapsed))*10);
                    if(currentSliderTime != this.$refs.timeline.scrollLeft) this.$refs.timeline.scrollLeft = currentSliderTime;
                }
    
            }.bind(this));

        }
    },
    props: ['projectName'],
	data() {

        var allLayers = this.$vcomp(this.projectName).getAllLayers();

        console.log(allLayers);

		return {
            allLayers,
            projectName: this.projectName
        }
        
    },
    mounted: function () {
        this.setVideoStartTime();
        this.updateScrolling();
    },

    beforeDestroy: function () {
        this.$vcomp(this.projectName).unbindAllFrameHooks();
        console.log('beforeDestroy');
    }
    
};

</script>

<style>

.timelineContainer{
    background-color: yellow;
    margin: 10px auto;
    width: 100%;
    height: 240px;
    max-height: 240px;
    position: relative;
    overflow:hidden;
    transform: translateZ(0);
    
}

.viewport{
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 3;
    /*
        #TODO: remove scrollbar support entirely, implement own "scrollbars"
        Scrolling is will still be based on "scrolling" just always hide the overflow.
    */
    overflow: overlay; 
}

</style>
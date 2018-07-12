<!-- 
	Inserts images into video composer project
-->

<template>
    <div ref="timeline" class="timelineContainer">

        <TimelineSlider ref="timelineSlider"></TimelineSlider>
        <Layer ref="layers" v-bind:layer-index="layer.layerIndex" v-bind:project-name="projectName" 
        v-for="layer in allLayers" :key="layer.layerIndex"></Layer>
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

        // TODO: move this behaviour more to component?
        // TODO: make overflow not scrollable when playing
        this.$vcomp(this.projectName).videoControl('beforeActionStart', function(action, drawContext){
            
            console.log(action);

            if(action == 'play'){
                var startTime = (this.$refs.timeline.scrollLeft*100)
                console.log(startTime);
                drawContext.timeTracker.elapsedDateTime = startTime;
            }

            if(action == 'reset'){
                this.$refs.timeline.scrollLeft = 0;
            }
 
        }.bind(this));

        this.$vcomp(this.projectName).videoControl('drawingUpdate', function(drawContext){
            if(drawContext.timeTracker.isPlaying){
                var currentSliderTime = ((drawContext.timeTracker.convertTimeInteger(drawContext.timeTracker.elapsed))*10);
                if(currentSliderTime != this.$refs.timeline.scrollLeft) this.$refs.timeline.scrollLeft = currentSliderTime;
            }
 
        }.bind(this));

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
    margin-top: 20px;
    width: 100%;
    max-height: 240px;
    height: 240px;
    overflow: auto;
}

</style>
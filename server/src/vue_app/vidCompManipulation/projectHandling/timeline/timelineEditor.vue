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
            
            if(action == 'play'){
                var startTime = (this.$refs.timeline.scrollLeft*100)
                console.log(startTime);
                drawContext.timeTracker.elapsedDateTime = startTime;
                // FIXME: will probably not use scrollbars so fix these
                this.$refs.timeline.style.overflow = "hidden";
            }

            if(action == 'stop'){
                this.$refs.timeline.style.overflow = "overlay";
            }

            if(action == 'reset'){
                this.$refs.timeline.scrollLeft = 0;
                this.$refs.timeline.style.overflow = "overlay";
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
    margin: 0 auto;
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
    /*
        #TODO: THE SCROLLLLLLLLLLLLLLLLL
        I hate how this is implemented.
        Most probably hide the overflow and navigate with custom made scrolling
    */
    overflow: overlay; 

}

/*
    MAKE SCROLL ALWAYS OVERLAYED U BROWSER CUCKS
    with scroll: 1649
    without scroll: 1666
    (chrome)
*/

</style>
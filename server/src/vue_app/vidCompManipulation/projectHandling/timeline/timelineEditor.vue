<!-- 
	Inserts images into video composer project
-->

<template>
<div ref="timeline" class="timelineContainer">
    <Layer ref="layers" v-bind:layer-index="layer.layerIndex" v-bind:project-name="projectName" 
    v-for="layer in allLayers" :key="layer.layerIndex">
</div>
</template>

<script>

import Layer from './layer.vue';

export default {

    name: "timelineEditor",
    components: {
		Layer
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

        console.log(this.$refs.timeline.scrollLeft);
        console.log(this.$refs.layers[0]);
        // FIXME: this is intensive for some reason, maybe just scrolling is better lol
        this.$vcomp(this.projectName).videoControl('timelineSlider', function(drawContext){

            var currentSliderTime = parseFloat(drawContext.elapsed) * 1000;
            var rightStyleLayer = this.$refs.layers[0].$el.style.right;
            var convertedToPX = (currentSliderTime+'px');
            if(convertedToPX != rightStyleLayer) this.$refs.layers[0].$el.style.transform = 'translate(-'+convertedToPX+')';
 
        }.bind(this));

    },
    unbind: function () {
         this.$vcomp(this.projectName).unbindAllFrameHooks();
         console.log('unbound');
    }
    
};

</script>

<style>

.timelineContainer{
    background-color: yellow;
    padding-top: 20px;
    margin-top: 20px;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

</style>
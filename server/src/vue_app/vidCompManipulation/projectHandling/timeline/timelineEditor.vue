<!-- 
	Inserts images into video composer project
-->

<template>
<div class="timelineContainer">
    <Layer v-bind:layer-index="layer.layerIndex" v-bind:project-name="projectName" 
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
        
    }
    
};

</script>

<style>

.timeLineContainer{
    background-color: yellow;
    width: 100%;
    height: 100%;
}

</style>
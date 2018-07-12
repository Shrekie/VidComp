<!-- 
	Inserts images into video composer project
-->

<template>
<div class="layerContainer" v-bind:style="{ width: layerSize }">

    <!-- <v-btn small color="primary" @click="showInsertMedia">add Media</v-btn> -->

    <Media ref="medias" v-bind:media-name="media.name" 
    v-bind:project-name="projectName" v-bind:timeline-time="media.timelineTime"
    v-for="media in allLayerMedia" :key="media.name"></Media>

</div>
</template>

<script>

import Media from './media.vue';

export default {
    name: "layer",
    components: {
        Media
	},
    props: ['layerIndex', 'projectName'],
    data() {

        var allLayerMedia = this.$vcomp(this.projectName).getAllMedia(this.layerIndex);
        console.log(allLayerMedia);
		return {
            allLayerMedia,
            projectName: this.projectName,
            width: "100px"
        }
        
    },
    computed: {
        layerSize: function () {
            return this.width;
        }
    },
    methods: {
        setInitalLayerSize () {
            if(!this.allLayerMedia.length) return "100px";
            var currentTotal = 0;
            console.log(this.allLayerMedia);
            this.allLayerMedia.forEach(element => {
                console.log(element);
                if(element.timelineTime[1] > currentTotal)
                currentTotal = element.timelineTime[1];
            });
            this.width = (currentTotal*1000) + 'px';
            console.log(this.width);
        },
        showInsertMedia () {
            this.$router.push({ path: `${this.projectName}/addmedia/${this.layerIndex}`});
        }
    },
    mounted: function () {
        this.setInitalLayerSize();
        console.log(this.width);
    }
};
</script>

<style>

.layerContainer{
    display: inline-block;
    position: relative;
    margin-top: 20px;
    margin-bottom: 20px;
    background-color: gray;
    height: 60px;
    width: 0px;
    margin-right: 50%;
    margin-left: 50%;
}

</style>
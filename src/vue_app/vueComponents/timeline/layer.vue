<!-- 
	Inserts images into video composer project
-->

<template>
<div class="layerContainer" v-bind:style="{ width: `${layerWidth}px` }">

    <Media ref="mediaElements" v-bind:media-index="media.mediaIndex" v-bind:layer-index="layerIndex" 
    v-bind:project-name="projectName" v-bind:timeline-time="media.timelineTime"
    v-for="media in allLayerMedia" 
    :key='media.timelineTime[0] + "-" + mediaChange'>
    </Media> <!-- #TODO: this key man, maybe just do indexshift always -->

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

        return {
            width:"0",
            updateLayer:false
        }
        
    },

    computed: {

        layerWidth: function () {
            return this.setLayerWidth();
        },

        zoomScale (){
            return this.$store.getters.zoomScale(this.projectName);
        },

        allLayerMedia (){
            return this.$vcomp.project(this.projectName).getAllLayerMedia(this.layerIndex);
        },

        mediaChange (){
            return this.$store.getters.mediaChange;
        }

    },
    
    methods: {

        setLayerWidth (){
            
            if(this.allLayerMedia.length == 0 ) return "100px";
            var currentTotal = 0;
            this.allLayerMedia.forEach(element => {
                if(element.timelineTime[1] > currentTotal)
                currentTotal = element.timelineTime[1];
            });
            this.width = Math.round((currentTotal * this.zoomScale));
            
            return this.width;

        }

    },

};
</script>

<style>

.layerContainer{
    display: inline-block;
    position: relative;
    vertical-align:bottom;
    margin-top: 10px;
    background-color: #DADADA;
    height: 60px;
    width: 0px;
    margin-right: 50%;
    margin-left: 50%;
}

</style>
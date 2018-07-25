<!-- 
	Inserts images into video composer project
-->

<template>
<div class="layerContainer" v-bind:style="{ width: layerSize }">

    <!-- <v-btn small color="primary" @click="showInsertMedia">add Media</v-btn> -->

    <Media ref="mediaElements" v-bind:media-index="media.mediaIndex" v-bind:layer-index="layerIndex" 
    v-bind:project-name="projectName" v-bind:timeline-time="media.timelineTime"
    v-for="media in allLayerMedia" 
    :key='media.timelineTime[0] + 
    " - " +
    media.mediaIndex + 
    " - " + 
    layerSize'></Media> <!-- #TODO: this key, i dont like this -->

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
        
        return {
            allLayerMedia,
            width: "100px"
        }
        
    },
    computed: {
        layerSize: function () {
            return this.width;
        }
    },
    methods: {
        setLayerSize () {

            if(!this.allLayerMedia.length) return "100px";
            var currentTotal = 0;
            this.allLayerMedia.forEach(element => {
                if(element.timelineTime[1] > currentTotal)
                currentTotal = element.timelineTime[1];
            });
            this.width = (currentTotal*1000) + 'px';

        },
        showInsertMedia () {
            this.$router.push({ path: `${this.projectName}/addmedia/${this.layerIndex}`});
        },
        layerUpdate () {
            this.$vcomp(this.projectName).layerControl('mediaShift', function(context){
                if(context.layerIndex == this.layerIndex){
                    console.log('reload media')
                    // TODO: fix id media to something better also fix reloading to less forced
                    // TODO: when layer empty, delete or something
                    this.allLayerMedia = this.$vcomp(this.projectName).getAllMedia(this.layerIndex);
                    this.allLayerMedia.splice(this.allLayerMedia.length);
                    this.setLayerSize();
                }
            }.bind(this));
        }
    },
    mounted: function () {
        this.setLayerSize();
        this.layerUpdate();
    }
};
</script>

<style>

.layerContainer{
    display: inline-block;
    position: relative;
    vertical-align:bottom;
    margin-top: 20px;
    margin-bottom: 20px;
    background-color: gray;
    height: 60px;
    width: 0px;
    margin-right: 50%;
    margin-left: 50%;
}

</style>
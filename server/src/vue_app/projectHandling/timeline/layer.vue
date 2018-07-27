<!-- 
	Inserts images into video composer project
-->

<template>
<div class="layerContainer" v-bind:style="{ width: layerSize }">

    <!-- <v-btn small color="primary" @click="showInsertMedia">add Media</v-btn> -->

    <Media ref="mediaElements" v-bind:media-index="media.mediaIndex" v-bind:layer-index="layerIndex" 
    v-bind:project-name="projectName" v-bind:timeline-time="media.timelineTime"
    v-for="media in allLayerMedia" 
    :key='media.timelineTime[0] + " - " + media.mediaIndex + " - " + layerSize'>
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

        var allLayerMedia = this.$vcomp(this.projectName).getAllMedia(this.layerIndex);

        var horizontalMediaChange = null;
        var verticalMediaChange = null;

        return {
            allLayerMedia,
            width: "100px",
            horizontalMediaChange,
            verticalMediaChange
        }
        
    },

    computed: {
        layerSize: function () {

            return this.width;

        }
    },

    watch:{
        
        allLayerMedia(){
            this.allLayerMedia = this.$vcomp(this.projectName).getAllMedia(this.layerIndex);
        }

    },
    methods: {

        updateLayer () {

            this.allLayerMedia = this.$vcomp(this.projectName).getAllMedia(this.layerIndex);
            this.allLayerMedia.splice(this.allLayerMedia.length);
            this.setLayerSize();

        },

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

            // TODO: reloading is so forced, dont like it
            this.horizontalMediaChange = this.$vcomp(this.projectName)
            .layerControl('mediaShift', 
            function(context){
                if(context.layerIndex == this.layerIndex){
                    console.log('reload media' + this.layerIndex );
                    this.updateLayer();
                }
            }.bind(this));

            this.verticalMediaChange = this.$vcomp(this.projectName)
            .layerControl('indexShift', 
            function(context){
                if(this.layerIndex <= context.maxLength){
                    console.log('reload media' + this.layerIndex );
                    this.updateLayer();
                }
            }.bind(this));

        }
    },

    mounted: function () {

        this.setLayerSize();
        this.layerUpdate();

    },

    beforeDestroy: function () {

        this.$vcomp(this.projectName).
        unbindFrameHook('layerControl', this.horizontalMediaChange);
        this.$vcomp(this.projectName)
        .unbindFrameHook('layerControl', this.verticalMediaChange);

        console.log('beforeDestroy');

    }

};
</script>

<style>

.layerContainer{
    display: inline-block;
    position: relative;
    vertical-align:bottom;
    margin-top: 0px;
    margin-bottom: 10px;
    background-color: gray;
    height: 40px;
    width: 0px;
    margin-right: 50%;
    margin-left: 50%;
}

</style>
<!-- 
	Inserts images into video composer project
-->

<template>
<div class="layerContainer" v-bind:style="{ width: `${layerWidth}px` }">

    <Media ref="mediaElements" v-bind:media-index="media.mediaIndex" v-bind:layer-index="layerIndex" 
    v-bind:project-name="projectName" v-bind:timeline-time="media.timelineTime"
    v-for="media in allLayerMedia" 
    :key='media.timelineTime[0] + " - " + updateLayer'>
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

        var allLayerMedia = this.$vcomp.project(this.projectName).getAllMedia(this.layerIndex);

        var horizontalMediaChange = null;
        var verticalMediaChange = null;

        return {
            allLayerMedia,
            horizontalMediaChange,
            verticalMediaChange,
            updateLayer:false,
            width:"0"
        }
        
    },

    computed: {

        layerWidth: function () {
            return this.setLayerWidth();
        },

        zoomScale (){
            return this.$store.getters.zoomScale;
        }

    },

    watch:{
        
        updateLayer(){

            //TODO: this is not top level hack
            this.allLayerMedia = this.$vcomp.project(this.projectName).getAllMedia(this.layerIndex);
            this.setLayerWidth();

        }

    },
    
    methods: {

        setLayerWidth (){

            if(!this.allLayerMedia.length) return "100px";
            var currentTotal = 0;
            this.allLayerMedia.forEach(element => {
                if(element.timelineTime[1] > currentTotal)
                currentTotal = element.timelineTime[1];
            });
            this.width = Math.round((currentTotal * this.zoomScale));
            
            return this.width;

        },

        registerLayerHooks () {

            // TODO: reloading is so forced, dont like it
            // Change is only horizontal, only shift exact layer index.
            this.horizontalMediaChange = this.$vcomp.project(this.projectName)
            .layerControl('mediaShift', 
            function(context){
                if(context.layerIndex == this.layerIndex){
                    console.log('reload media' + this.layerIndex );
                    this.updateLayer = !this.updateLayer;
                }
            }.bind(this));

             // Change is vertical, shift layer cascadingly.
            this.verticalMediaChange = this.$vcomp.project(this.projectName)
            .layerControl('indexShift', 
            function(context){
                if(this.layerIndex <= context.maxLength){
                    console.log('reload media' + this.layerIndex );
                    this.updateLayer = !this.updateLayer;
                }
            }.bind(this));

        }
    },

    mounted: function () {
        
        console.log("LAYER MOUNTED");
        this.registerLayerHooks();
 
    },

    beforeDestroy: function () {

        this.$vcomp.project(this.projectName).
        unbindFrameHook('layerControl', this.horizontalMediaChange);
        this.$vcomp.project(this.projectName)
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
    margin-top: 10px;
    background-color: #DADADA;
    height: 60px;
    width: 0px;
    margin-right: 50%;
    margin-left: 50%;
}

</style>
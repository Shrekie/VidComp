<!-- 
	Inserts images into video composer project
-->

<template>
<div>
    <div class="timelineContainer">
        <div ref="timeline" class="viewport">

                <TimelineSlider ref="timelineSlider"></TimelineSlider>
        
                <Layer ref="layers" v-bind:layer-index="layer.layerIndex" v-bind:project-name="projectName" 
                v-for="layer in allLayers" :key="layer.layerIndex + ' ' + zoomScale + '' + layer.updateLayer">
                </Layer>

        </div>
    </div>

</div>
</template>

<script>
import Layer from './layer.vue';
import TimelineSlider from './timelineSlider.vue';
import MotionEvents from './../../library/dragResizeMotion/motionEvents.js';

export default {

    name: "timelineEditor",

    props: ['projectName'],

	data() {

        var allLayers = this.$vcomp(this.projectName).getAllLayers();

        console.log(allLayers);

		return {
            allLayers,
            //TODO: implement this better
            playing:false
        }
        
    },

    computed:{

        timeSliderTime (){
            return this.$store.getters.sliderTime;
        },

        zoomScale (){
            return this.$store.getters.zoomScale;
        }

    },

    watch: {
        zoomScale (newVal, oldVal) {
            this.$refs.timeline.scrollLeft = this.$refs.timeline.scrollLeft * (newVal / oldVal);
        }
    },

    components: {
        Layer,
        TimelineSlider
    },
    
    methods: {

        //TODO: maybe put this on rimDrag or something
        // calculates and registers snap points for all layers.
        determineSnaps: function(){

            MotionEvents.prototype.snapCalculation = function(mediaElement, elementToSnap){

                let rangeOfSnap = 4;
                let snapPoints = [];

                snapPoints.push({
                    snapRange:[-4, 4],
                    snapPosition:0,
                    layerPos:0
                });

                this.allLayers.forEach(function(layer){

                    let allLayerMedia = layer.getAllMedia();

                    allLayerMedia.forEach(function(media){
                        if(media !== mediaElement){

                            let layerPos = media.layerIndex;

                            media.timelineTime.forEach(function(timelineTime){

                                let snapPoint = {
                                    snapRange:[],
                                    snapPosition:0,
                                    layerPos:0
                                };

                                let frontSnap = ((timelineTime*this.zoomScale) + rangeOfSnap);
                                let backSnap = ((timelineTime*this.zoomScale) - rangeOfSnap);
                                let snapPosition = timelineTime*this.zoomScale;
                                snapPoint.snapRange = [backSnap, frontSnap];
                                snapPoint.snapPosition = snapPosition;
                                snapPoint.layerPos = layerPos;
                                snapPoints.push(snapPoint);

                            }.bind(this));

                        }
                    }.bind(this))

                }.bind(this));

                MotionEvents.prototype.snapPoints = snapPoints;
                
            }.bind(this);
        },

        registerVideoControlEvents: function (){

            // TODO: move this behaviour more to component?
            this.$vcomp(this.projectName).videoControl('beforeActionStart', function(context){
                
                if(context.action == 'play'){
                    var startTime = (this.$refs.timeline.scrollLeft * 100) / (this.zoomScale/1000);
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

        registerScrollHooks: function () {

            // set the scrollLeft to stored value
            this.$nextTick(function () {
                this.$refs.timeline.scrollLeft = this.timeSliderTime;
            });
            
            // scrollLeft update hook loop
            this.$vcomp(this.projectName).videoControl('drawingUpdate', function(context){

                if(context.timeTracker.isPlaying){
                    var currentSliderTime = context.timeTracker.elapsed * this.zoomScale;
                    this.$refs.timeline.scrollLeft = currentSliderTime;
                }
    
            }.bind(this));

            // update stored scollLeft value on scroll
            this.$refs.timeline.onscroll = function(event){
                this.$store.dispatch('setSliderTime', this.$refs.timeline.scrollLeft);
            }.bind(this)


        }

    },


    mounted: function () {
        
        console.log("TIMELINE MOUNTED");
        this.registerVideoControlEvents();
        this.registerScrollHooks();
        this.determineSnaps();
        //this.$eventHub.$on('edit-enabled', this.editEnabled);
        
    },

    beforeDestroy: function () {

        this.$vcomp(this.projectName).unbindAllFrameHooks();
        //this.$eventHub.$off('edit-enabled');
        console.log('beforeDestroy');

    }
    
};

</script>

<style>

.timelineContainer{
    background-color: #C5C5C5;
    margin: 10px auto;
    width: 100%;
    height: 30vh;
    position: relative;
    overflow:hidden;
    transform: translateZ(0);
    
}

.viewport{
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 3;
    touch-action: pan-y pan-x;
    /*
        #TODO: remove scrollbar support entirely, implement own "scrollbars"
        Scrolling will still be based on "scrolling" just always hide the overflow.
    */
    padding-bottom: 60px;
    overflow: overlay; 
}

</style>
<!-- 
	Inserts images into video composer project
-->

<template>
<div>
    <div class="timelineContainer">
        <div ref="timeline" class="viewport">

                <TimelineSlider ref="timelineSlider"></TimelineSlider>
        
                <Layer ref="layers" v-bind:layer-index="layer.layerIndex" v-bind:project-name="projectName" 
                v-for="layer in allLayers" :key="layer.layerIndex">
                </Layer>

        </div>
    </div>

</div>
</template>

<script>
import Layer from './layer.vue';
import TimelineSlider from './timelineSlider.vue';
import MotionEvents from './../../dragResizeMotion/motionEvents.js';

export default {

    name: "timelineEditor",

    props: ['projectName'],

	data() {

        var allLayers = this.$vcomp(this.projectName).getAllLayers();

        console.log(allLayers);

		return {
            allLayers
        }
        
    },

    computed:{
        timeSliderTime (){
            return this.$store.getters.sliderTime;
        }
    },

    components: {
        Layer,
        TimelineSlider
    },
    
    methods: {

        //TODO: maybe put this on rimDrag or something
        determineSnaps: function(){

            MotionEvents.prototype.snapCalculation = function(mediaElement, elementToSnap){

                let rangeOfSnap = 4;
                let snapPoints = [];

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

                                let frontSnap = (timelineTime*1000) + rangeOfSnap
                                let backSnap = (timelineTime*1000) - rangeOfSnap
                                let snapPosition = timelineTime*1000;
                                snapPoint.snapRange = [backSnap, frontSnap];
                                snapPoint.snapPosition = snapPosition;
                                snapPoint.layerPos = layerPos;
                                snapPoints.push(snapPoint);

                            });

                        }
                    })

                });

                MotionEvents.prototype.snapPoints = snapPoints;
                
            }.bind(this);
        },

        setVideoStartTime: function (){

            // TODO: move this behaviour more to component?
            this.$vcomp(this.projectName).videoControl('beforeActionStart', function(context){
                
                if(context.action == 'play'){
                    var startTime = (this.$refs.timeline.scrollLeft*100)
                    console.log(startTime);
                    console.log(context);
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

        updateScrolling: function () {

            // set the scrollLeft to stored value
            this.$nextTick(function () {
                this.$refs.timeline.scrollLeft = this.timeSliderTime;
            });
            
            // scrollLeft update hook loop
            this.$vcomp(this.projectName).videoControl('drawingUpdate', function(context){

                if(context.timeTracker.isPlaying){
                    var currentSliderTime = ((context.timeTracker.convertTimeInteger(context.timeTracker.elapsed))*10);
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
        this.setVideoStartTime();
        this.updateScrolling();
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
    /*
        #TODO: remove scrollbar support entirely, implement own "scrollbars"
        Scrolling will still be based on "scrolling" just always hide the overflow.
    */
    padding-bottom: 60px;
    overflow: overlay; 
}

</style>
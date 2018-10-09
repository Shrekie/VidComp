<!-- 
	Inserts images into video composer project
-->

<template>
<div>
    <div class="timelineContainer">
        <div ref="timeline" class="viewport">

            <TimelineSlider ref="timelineSlider"></TimelineSlider>
    
            <Layer ref="layers" v-bind:layer-index="layer.layerIndex" v-bind:project-name="projectName" 
            v-for="layer in allLayers" :key="layer.layerIndex + ' ' + mediaChange + '' + zoomScale">
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

		return {
            //TODO: set things to disabled when this is true
            playing:false
        }
        
    },

    computed:{

        timeSliderTime (){
            return this.$store.getters.sliderTime(this.projectName);
        },

        zoomScale (){
            return this.$store.getters.zoomScale(this.projectName);
        },

        allLayers (){
            return  this.$vcomp.project(this.projectName).getAllLayers();
        },

        mediaChange (){
            return this.$store.getters.mediaChange;
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

        registerShiftHooks: function(){

            this.$vcomp.project(this.projectName)
            .layerControl('mediaShift', 
            function(context){

                let layerMedia = {
                    name: this.projectName,
                    media: this.$vcomp.project(this.projectName).getAllMedia(),
                    layers: this.$vcomp.project(this.projectName).getAllLayers()
                };

                console.log('%c MEDIASHIFT CONTEXT ', 'background: #222; color: #bada55');

                // log
                this.$vcomp.project(this.projectName).log();

                // render
                this.$store.dispatch('mediaHasChanged');
                
                // autosave
                this.$store.dispatch('setLayersAndMedia',layerMedia);



            }.bind(this));

        },

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

                let allLayerMedia = 
                this.$vcomp.project(this.projectName).getAllMedia()

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

                MotionEvents.prototype.snapPoints = snapPoints;
                
            }.bind(this);
        },

        registerVideoControlEvents: function (){

            // TODO: move this behaviour more to component?
            this.$vcomp.project(this.projectName).videoControl('beforeActionStart', function(context){
                
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
            this.$vcomp.project(this.projectName).videoControl('drawingUpdate', function(context){

                if(context.timeTracker.isPlaying){
                    var currentSliderTime = context.timeTracker.elapsed * this.zoomScale;
                    this.$refs.timeline.scrollLeft = currentSliderTime;
                }
    
            }.bind(this));

            // update stored scollLeft value on scroll
            this.$refs.timeline.onscroll = function(event){
                this.$store.dispatch('setSliderTime', {name: this.projectName, timeSliderTime: this.$refs.timeline.scrollLeft});
            }.bind(this)


        }

    },


    mounted: function () {
        
        // TODO: split these to components
        this.registerVideoControlEvents();
        this.registerScrollHooks();
        this.determineSnaps();
        this.registerShiftHooks();
        
    },

    beforeDestroy: function () {

        this.$vcomp.project(this.projectName).unbindAllFrameHooks();

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
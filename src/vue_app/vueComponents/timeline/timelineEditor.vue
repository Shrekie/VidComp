<!-- 
	Inserts images into video composer project
-->

<template>
<div>

    <TimelineSlider ref="timelineSlider"></TimelineSlider>

    <Layer ref="layers" v-bind:layer-index="layer.layerIndex" v-bind:project-name="projectName" 
    v-for="layer in allLayers" :key="layer.layerIndex + ' ' + mediaChange + '' + zoomScale">
    </Layer>

</div>
</template>

<script>
import Layer from './layer.vue';
import TimelineSlider from './timelineSlider.vue';

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
            this.$parent.$refs.timeline.scrollLeft = this.$parent.$refs.timeline.scrollLeft * (newVal / oldVal);
        }
    },

    components: {
        Layer,
        TimelineSlider
    },
    
    methods: {

        triggerTransform: function(){

            if(!this.playing){

                this.$vcomp.project(this.projectName)
                .scrubVideo((this.$parent.$refs.timeline.scrollLeft * 100) / (this.zoomScale/1000));

            }

        },

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

                // transform update
                this.triggerTransform();

            }.bind(this));

        },

        registerVideoControlEvents: function (){

            // TODO: move this behaviour more to component?
            this.$vcomp.project(this.projectName).videoControl('beforeActionStart', function(context){
                
                // TODO: encapsulate moving time
                if(context.action == 'play'){
                    var startTime = Math.round((this.$parent.$refs.timeline.scrollLeft * 100) / (this.zoomScale/1000));
                    context.timeTracker.elapsedDateTime = startTime;
                    this.playing = true;
                    this.$parent.$refs.timeline.style.overflow = "hidden";
                }

                if(context.action == 'stop'){
                    this.playing = false;
                    this.$parent.$refs.timeline.style.overflow = "overlay";
                }

                if(context.action == 'reset'){
                    this.playing = false;
                    this.$parent.$refs.timeline.scrollLeft = 0;
                    this.$parent.$refs.timeline.style.overflow = "overlay";
                }

                this.triggerTransform();
    
            }.bind(this));

        },

        registerScrollHooks: function () {

            // set the scrollLeft to stored value
            this.$nextTick(function () {
                this.$parent.$refs.timeline.scrollLeft = this.timeSliderTime;
            });
            
            // scrollLeft update hook loop
            this.$vcomp.project(this.projectName).videoControl('drawingUpdate', function(context){

                if(context.timeTracker.isPlaying){
                    var currentSliderTime = context.timeTracker.elapsed * this.zoomScale;
                    this.$parent.$refs.timeline.scrollLeft = currentSliderTime;
                }
    
            }.bind(this));

            // update stored scollLeft value on scroll
            this.$parent.$refs.timeline.onscroll = function(event){
    
                this.$store.dispatch('setSliderTime', 
                {name: this.projectName, timeSliderTime: this.$parent.$refs.timeline.scrollLeft});

                this.$nextTick(function () {
                    this.triggerTransform();
                });
        
            }.bind(this);

        },

        registerTransformHooks: function () {

            this.$vcomp.project(this.projectName)
            .castControl('resourceCasted', 
            function(context){
                this.triggerTransform();
            }.bind(this));

        }

    },


    mounted: function () {
        
        this.registerVideoControlEvents();
        this.registerScrollHooks();
        this.registerTransformHooks();
        this.registerShiftHooks();
        
    },

};

</script>
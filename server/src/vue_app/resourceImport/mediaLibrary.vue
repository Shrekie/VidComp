<!-- 
    Button sheet media importer manager
-->

<template>
    
   
        <v-flex xs10 offset-xs1 text-xs-center>

         

                <v-text-field
                label="Data URL"
                box
                ></v-text-field>
                <v-btn small color="primary" @click="getMedia">Get media</v-btn>
                
  
        </v-flex>

        
</template>

<script>

export default {
    name: "mediaLibrary",

    props: ['projectName'],

    computed:{
        timeSliderTime (){
            return this.$store.getters.sliderTime;
        }
    },

    methods: {

        getMedia () {
            
            console.log(this.timeSliderTime);

            var mediaMeta = this.$vcomp(this.projectName).addMedia({
                layerIndex: 0,
                size: [100, 100],
                timelineTime: [(this.timeSliderTime/1000), ( (this.timeSliderTime/1000) + 0.1 )],
                position: [40, 40],
                videoStartTime: 0.03,
                resource: {
                    name: 'catvideoTwo'
                }
            });

            this.$vcomp(this.projectName)
            .adjustMediaShift({
                    layerIndex: 0, mediaIndex: mediaMeta.mediaIndex
                },{
                    layerIndex: 0,
                    timelineStartTime: this.timeSliderTime/1000
            });
        }

    },
	data() {
		return {
		}
	}
};
</script>

<style>
</style>
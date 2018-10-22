<!-- 
	Main user interaction section
-->

<template>

<v-flex xs12 text-xs-center>
 
        <v-card flat>
            
            <v-btn icon :to="'/project/' + this.projectName"
            :disabled="loadingRender || loadingffmpeg">
                <v-icon>mdi-arrow-left-bold-circle</v-icon>
            </v-btn>
            
        </v-card>


    <v-container>
        <Playback v-bind:project-name="projectName" ref="playback">
        </Playback>
    </v-container>

    <v-progress-linear :indeterminate="true" v-if="loadingRender"></v-progress-linear>

    <v-card flat>
            
        <v-btn fab icon round @click="renderVideo" 
        :disabled="loadingRender || loadingffmpeg">
            <v-icon large>mdi-file-download</v-icon>
        </v-btn>

        <v-progress-circular v-if="loadingffmpeg"
            :size="35"
            color="primary"
            indeterminate
        ></v-progress-circular>
            
    </v-card>

</v-flex>

</template>

<script>

import Playback from './playback.vue';

export default {

	name: "render",

    props: ['projectName'],
    
    components: {
        Playback
	},

	data() {
		return {
            loadingRender:false,
            loadingffmpeg:false,
            loadedProject:false
		}
    },
    
    methods: {

        renderVideo(){

            var renderStages = this.$vcomp.project(this.projectName).render();

            this.loadingRender = true;

            this.$refs.playback.playcontrolsHidden = true;

            renderStages.renderDone.then(function(){

                this.loadingRender = false;
                this.loadingffmpeg = true;
                
            }.bind(this));

            renderStages.loadffmpeg.then(function(){

                this.loadingffmpeg = false;
                this.$refs.playback.playcontrolsHidden = false;

            }.bind(this));
 
        }

    },

	
};
</script>

<style>
</style>
<!-- 
	Main user interaction section
-->

<template>

<v-flex xs12 text-xs-center>
 
        <v-card flat>
            
            <v-btn icon :to="'/project/' + this.projectName">
                <v-icon>mdi-arrow-left-bold-circle</v-icon>
            </v-btn>
            
        </v-card>


    <v-container>
        <Playback v-bind:project-name="projectName">
        </Playback>
    </v-container>

    <v-card flat>
            
        <v-btn fab icon round @click="renderVideo">
            <v-icon large>mdi-file-download</v-icon>
        </v-btn>
            
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
			loadedProject:false
		}
    },
    
    methods: {
        renderVideo(){
            this.$vcomp.project(this.projectName).render();
        }
    }

	
};
</script>

<style>
</style>
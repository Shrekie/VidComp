<template>

	<v-flex xs12 text-xs-center>

		<div id="canvasLockAspectContainer">
			
			<canvas v-project-composition=this.projectName width="1280" height="720">   
            </canvas>

		</div>
		
		<v-btn icon @click="playVideo" v-if="!playcontrolsHidden" exact>
			<v-icon>mdi-play</v-icon>
		</v-btn>
		<v-btn icon @click="stopVideo" v-if="!playcontrolsHidden" exact>
			<v-icon>mdi-pause</v-icon>
		</v-btn>
		<v-btn icon @click="resetVideo" v-if="!playcontrolsHidden" exact>
			<v-icon>mdi-skip-backward</v-icon>
		</v-btn>

	</v-flex>

</template>

<script>

export default {
	
	name: "playback",

	props: ['projectName'],
	
	data() {
		return {
			playcontrolsHidden:false
		}
	},
	
	methods: {

		playVideo () {
			this.$vcomp.project(this.projectName).play();
		},

		stopVideo () {
			this.$vcomp.project(this.projectName).stop();
		},

		resetVideo () {
			this.$vcomp.project(this.projectName).reset();
        }
        
    },
    
};
</script>

<style>

@media screen and (max-width: 780px) {
    #canvasLockAspectContainer{
		width: 256px !important;
		height: 144px !important;
	}
}

#canvasLockAspectContainer{
	margin: 0 auto;
	overflow: hidden;
	width: 720px; 
	height: 405px;
}

#canvasLockAspectContainer canvas{
	width: 100%;
	margin-bottom: 56.25%;
	background: #C5C5C5;
}
</style>
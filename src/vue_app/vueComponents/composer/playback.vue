<template>

	<v-flex xs12 text-xs-center>

		<div id="canvasLockAspectContainer">
			<canvas v-project-composition=this.projectName width="1280" height="720">
                
            </canvas>
		</div>
		
		<v-btn icon @click="playVideo">
			<v-icon>mdi-play</v-icon>
		</v-btn>
		<v-btn icon @click="stopVideo">
			<v-icon>mdi-pause</v-icon>
		</v-btn>
		<v-btn icon @click="resetVideo">
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
		max-width: 320px !important;
		max-height: 160px !important;
	}
}

#canvasLockAspectContainer{
	margin: 0 auto;
	overflow: hidden;
	max-width: 640px; 
	max-height: 320px;
}

#canvasLockAspectContainer canvas{
	width: 100%;
	margin-bottom: 56.25%;
	background: #C5C5C5;
}
</style>
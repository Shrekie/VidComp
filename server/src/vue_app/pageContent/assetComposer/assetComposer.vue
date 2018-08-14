<!-- 
	Composition of project, editing control
-->

<template>
<v-flex xs12 text-xs-center>
	
	<!-- #TODO: add in component -->
	<div id="canvasLockAspectContainer">
		<canvas v-project-composition=this.projectName></canvas>
	</div>
	<router-view>

	</router-view>
	<v-btn small color="primary" @click="playVideo">Play</v-btn>
	<v-btn small color="primary" @click="stopVideo">Pause</v-btn>
	<v-btn small color="primary" @click="resetVideo">&lt;</v-btn>
</v-flex>
</template>

<script>


// TODO: pass projectName from props

export default {
	name: "assetComposer",
	props: ['projectName'],
	
	data() {
		return {
		}
	},
	methods: {
		playVideo () {
			this.$vcomp(this.projectName).play();
		},
		stopVideo () {
			this.$vcomp(this.projectName).stop();
		},
		resetVideo () {
			this.$vcomp(this.projectName).reset();
		},
		importVideo () {
			console.log("import media");
		}
	}
};
</script>

<style>

@media screen and (max-width: 780px) {
    #canvasLockAspectContainer{
		max-width: 360px !important;
		max-height: 190px !important;
	}
}

#canvasLockAspectContainer{
	margin: 0 auto;
	overflow: hidden;
	max-width: 640px; 
	max-height: 330px;
}

#canvasLockAspectContainer canvas{
	width: 100%;
	margin-bottom: 56.25%;
	border: 1px solid;
	background: gold;
}
</style>
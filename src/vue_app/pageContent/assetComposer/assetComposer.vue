<!-- 
	Composition of project, editing control
-->

<template>
<v-layout>
	<v-flex xs12 text-xs-center>

		<v-toolbar app dense flat>
			<v-btn icon>
			<v-icon>mdi-arrow-left</v-icon>
		</v-btn>

		<v-spacer></v-spacer>
		<v-toolbar-title style="margin-left:0px">{{this.projectName}}</v-toolbar-title>
		<v-spacer></v-spacer>
		<v-btn icon>
		<v-icon>mdi-upload</v-icon>
		</v-btn>

		</v-toolbar>

		<!-- #TODO: add in component -->
		<!-- #TODO: LOOK AT THIS: https://vuetifyjs.com/en/layout/aspect-ratios -->
		<div id="canvasLockAspectContainer">
			<canvas v-project-composition=this.projectName></canvas>
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

		<v-card flat>
			<v-btn icon>
				<v-icon>mdi-undo</v-icon>
			</v-btn>
			<v-btn icon>
				<v-icon>mdi-redo</v-icon>
			</v-btn>
			<v-btn icon>
				<v-icon>mdi-magnify-plus-outline</v-icon>
			</v-btn>
			<v-btn icon>
				<v-icon>mdi-magnify-minus-outline</v-icon>
			</v-btn>
		</v-card>

		<router-view>

		</router-view>

		<v-card flat>
			<v-btn icon :to="'/resources/' + this.projectName + '/video'">
				<v-icon>mdi-plus-circle</v-icon>
			</v-btn>
		</v-card>

	</v-flex>
</v-layout>
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
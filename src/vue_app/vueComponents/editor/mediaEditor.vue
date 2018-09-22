<!-- 
	Composition of project, editing control
-->

<template>

	<v-flex xs12 text-xs-center>

		<v-toolbar app dense flat>
		<v-btn icon :to="'/'">
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
			<v-btn icon @click="undoEdit">
				<v-icon>mdi-undo</v-icon>
			</v-btn>
			<v-btn icon @click="redoEdit">
				<v-icon>mdi-redo</v-icon>
			</v-btn>
			<v-btn icon @click="$store.dispatch('expandZoom', {name: projectName})">
				<v-icon>mdi-magnify-plus-outline</v-icon>
			</v-btn>
			<v-btn icon @click="$store.dispatch('shrinkZoom', {name: projectName})">
				<v-icon>mdi-magnify-minus-outline</v-icon>
			</v-btn>
		</v-card>

		<router-view>

		</router-view>

		<v-card flat>
			<v-btn icon :to="'/project/' + this.projectName + '/resources/video'">
				<v-icon>mdi-plus-circle</v-icon>
			</v-btn>
		</v-card>

	</v-flex>

</template>

<script>

export default {
	
	name: "mediaEditor",

	props: ['projectName'],
	
	data() {
		return {
		}
	},

	computed:{
        zoomScale (){
            return this.$store.getters.zoomScale(this.projectName);
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
		},

		logRestoreSave(){

			this.$store.dispatch('setLayersAndMedia',{name: this.projectName,
			media: this.$vcomp.project(this.projectName).getAllMedia(),
			layers: this.$vcomp.project(this.projectName).getAllLayers()});

			this.$store.dispatch('mediaHasChanged');

		},

		undoEdit (){

			this.$vcomp.project(this.projectName).undo();
			this.logRestoreSave();

		},

		redoEdit (){

			this.$vcomp.project(this.projectName).redo();
			this.logRestoreSave();

		},
		
		importVideo () {
			console.log("import media");
		}
	},

	created (){
		console.log("HELLO");
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
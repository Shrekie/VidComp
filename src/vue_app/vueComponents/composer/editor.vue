<!-- 
	Composition of project, editing control
-->

<template>

	<v-flex xs12 text-xs-center>

		<v-toolbar app dense flat>

			<v-toolbar-items>
				<v-btn icon :to="'/'">
					<v-icon>mdi-arrow-left</v-icon>
				</v-btn>
			</v-toolbar-items>

			<v-spacer></v-spacer>

				<v-toolbar-title >
					{{this.projectName}}
				</v-toolbar-title>
				
				<v-progress-circular
					indeterminate
					color="gray"
					:size="20"
					:width="1"
					class="ml-2 mb-1"
					:style="{visibility: this.autoSaving ? 'visible' : 'hidden'}"
				></v-progress-circular>

			<v-spacer></v-spacer>

			<v-toolbar-items>
				<v-btn icon :to="'/project/' + this.projectName + '/render'">
					<v-icon>mdi-file-download</v-icon>
				</v-btn>
			</v-toolbar-items>

		</v-toolbar>

		<Playback v-bind:project-name="projectName">
		</Playback>

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
		
		<v-bottom-nav
        :value="true" app>

			<v-btn icon color="white" :to="'/project/' + this.projectName + '/resources/video'">
				<v-icon large>mdi-plus-box</v-icon>
			</v-btn>

			<v-btn icon v-if="this.selectedMenu" @click="deleteLayerMedia">
				<v-icon large>mdi-delete</v-icon>
			</v-btn>

        </v-bottom-nav>

	</v-flex>

</template>

<script>

import Playback from './playback.vue';

export default {
	
	name: "editor",

	props: ['projectName'],

	components: {
        Playback
	},
	
	data() {
		return {
		}
	},

	computed:{

        zoomScale (){
            return this.$store.getters.zoomScale(this.projectName);
		},

		selectedMenu (){
			return this.focusArea[1] != "none";
		},

		focusArea (){
            return this.$store.getters.focusArea;
		},

		autoSaving (){
            return this.$store.getters.autoSaving;
		}
		
	},
	
	methods: {

		logRestoreSave(){

			//FIXME: just call mediashift context on logger?
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

		deleteLayerMedia(){

			let newLayerPointer = this.$vcomp.project(this.projectName)
			.deleteLayerMedia(this.focusArea[0], this.focusArea[1]);

            this.$store.dispatch('setFocusArea', {timelineArea: [newLayerPointer, "none"]});
 
		},
		
		importVideo () {
			console.log("import media");
		}

	},

	mounted: function () {

		this.$store.dispatch('setFocusArea', {timelineArea: [0, "none"]});
		this.$vcomp.project(this.projectName).enableTransform();
		
    },

};
</script>

<style>

</style>
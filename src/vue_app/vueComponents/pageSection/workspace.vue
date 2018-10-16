<!-- 
	Main user interaction section
-->

<template>

<v-layout align-center>
	
	<router-view v-if="loadedProject"></router-view>

</v-layout>

</template>

<script>
export default {

	name: "workspace",

	props: ['projectName'],

	data() {
		return {
			loadedProject:false
		}
	},

	computed: {

		projectByName () {
			return this.$store.getters.projectByName(this.projectName);
		}

	},

	mounted (){
		if(this.projectByName) 
		this.loadedProject = this.$vcomp.loadProject(this.projectByName);
	}
	
	
};
</script>

<style>
</style>
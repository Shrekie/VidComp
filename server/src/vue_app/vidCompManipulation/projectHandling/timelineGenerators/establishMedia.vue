<!-- 
	Main user interaction section
-->

<template>
<v-layout align-center>
	<p>AYY add media</p>
</v-layout>
</template>

<script>

export default {
    name: "workspaceContent",
    props: ['layerIndex', 'projectName'],
	data() {
        console.log(this.layerIndex);
        console.log(this.projectName);
		return {
		}
	}
};
</script>

<style>
</style>
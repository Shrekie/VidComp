<!-- 
	App window container
-->

<template>
<v-app>
<v-navigation-drawer v-model="drawer" fixed temporary app touchless width="120">
	<router-view name="sidebar"></router-view> <!-- #TODO: add this as component -->
</v-navigation-drawer>
<v-toolbar app dense>
	<v-btn color="pink" @click.stop="drawer = !drawer">Toggle</v-btn>
	<v-toolbar-title>Progressive Video Editor</v-toolbar-title>
</v-toolbar>
<v-content>
	<v-container grid-list-md text-xs-center>
		<router-view name="workspace"></router-view>
	</v-container>
</v-content>
<v-footer app></v-footer>
</v-app>
</template>

<script>
export default {
	name: "appWindow",
	data() {
		return {
			drawer: null
		}
	}
};
</script>

<style>

</style>
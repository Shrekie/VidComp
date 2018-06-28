<template>
<v-app>
<v-navigation-drawer app>
	<router-view name="sidebar"></router-view>
</v-navigation-drawer>
<v-toolbar app></v-toolbar>
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
		}
	}
};
</script>

<style>

</style>
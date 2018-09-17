<!-- 
	App window container
-->

<template>
<v-app dark>
<v-content>
	<v-container grid-list-md text-xs-center>
		<router-view name="workspace"></router-view>
	</v-container>
</v-content>
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
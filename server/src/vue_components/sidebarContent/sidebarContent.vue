<template>
<v-flex xs12 sm4 text-xs-center>
	<div>
		<router-link to="/">Home</router-link>
	</div>
	<div>
		<router-link to="/upload">Upload</router-link>
	</div>
	<div>
		<router-link to="/compose">Edit</router-link>
	</div>
</v-flex>
</template>

<script>

export default {
	name: "sidebarContent",
	data() {
		return {
		}
	}
};
</script>

<style>
</style>
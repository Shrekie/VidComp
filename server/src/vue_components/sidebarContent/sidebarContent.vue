<!-- 
	Sidebar
-->

<template>
<v-layout align-center>
	<v-flex xs12 text-xs-center>
		<div>
			<router-link to="/" tag="v-btn">Edit</router-link>
		</div>
		<div>
			<router-link to="/upload" tag="v-btn">Upload</router-link>
		</div>
		<div>
			<router-link to="/compose" tag="v-btn">Edit</router-link>
		</div>
	</v-flex>
</v-layout>
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
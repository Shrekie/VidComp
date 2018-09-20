<!-- 
	Main user interaction section
-->

<template>

<v-layout align-center>
	
	<router-view></router-view>

</v-layout>

</template>

<script>
import Authenticate from './../user/authenticate.vue';

export default {

	name: "workspace",

	components: {
        Authenticate
    },

	data() {
		return {
		}
	},
	
};
</script>

<style>
</style>
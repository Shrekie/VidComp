<!-- 
	App window container
-->

<template>
<v-app dark>
<v-content>
	<v-container grid-list-md text-xs-center fluid>
		<Authenticate>
		</Authenticate>
		<router-view v-if="this.projectsReady"></router-view>
	</v-container>
</v-content>
</v-app>
</template>

<script>
import Authenticate from './../user/authenticate.vue';

export default {

	name: "appWindow",
	
	components: {
        Authenticate
	},

	computed:{

		projectsReady() {
			return this.$store.getters.projectsReady;
		}

	},
	
	data() {
		return {

		}
	}
};
</script>

<style>

</style>
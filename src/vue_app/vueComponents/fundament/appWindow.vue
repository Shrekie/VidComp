<!-- 
	App window container
-->

<template>
<v-app dark>
<v-content>
	<v-container grid-list-md text-xs-center>
		<Authenticate>
		</Authenticate>
		<router-view name="workspace" v-if="this.ready"></router-view>
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
		ready() {
			return this.$store.getters.ready;
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
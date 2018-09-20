<!-- 
	App window container
-->

<template>
<v-app dark>
<v-content>
	<v-container grid-list-md text-xs-center v-if="this.ready">
		<router-view name="workspace"></router-view>
	</v-container>
</v-content>
	<Authenticate>
	</Authenticate>
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
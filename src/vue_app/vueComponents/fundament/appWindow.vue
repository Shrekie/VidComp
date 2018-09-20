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
	
	data() {
		return {

		}
	}
};
</script>

<style>

</style>
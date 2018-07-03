<!-- 
	Composition of project, editing control
-->

<template>
<v-flex xs12 text-xs-center>
	<v-btn small color="primary" @click="increment">Edit</v-btn>
	<p>{{count}}</p>
</v-flex>
</template>

<script>

export default {
	name: "assetComposer",
	data() {
		return {
		}
	},
	methods: {
		increment (){
			this.$store.commit('increment');
		}
	},
	computed: {
		count () {
			return this.$store.state.count;
		}
  	}
};
</script>

<style>
</style>
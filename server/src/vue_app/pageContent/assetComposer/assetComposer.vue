<!-- 
	Composition of project, editing control
-->

<template>
<v-flex xs12 text-xs-center>
	<p>{{user}}</p>
	<v-btn small color="primary" @click="increment">Increment</v-btn>
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
		increment () {
			this.$store.commit('incrementCount');
		}
	},
	computed: {
		count () {
			return this.$store.state.count;
		},
		user () {
			return this.$store.state.user;
		}
	},
	created: function(){
    	this.$store.dispatch('getUser');
  	}
};
</script>

<style>
</style>
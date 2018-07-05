<!-- 
	Uploader and manager of assets loaded into the project
-->

<template>
<v-flex xs12 text-xs-center>
	<v-text-field label="name" v-model="userName"></v-text-field>
	<v-btn small color="primary" @click="newUser">Create User</v-btn>
	<p v-for="user in users" :key="user.id">{{user.name}}</p>
	<v-btn small color="primary" @click="increment">Increment</v-btn>
	<p>{{count}}</p>
</v-flex>
</template>

<script>

export default {
	name: "assetRelocator",
	data() {
		return {

		}
	},
	methods: {
		increment () {
			this.$store.commit('incrementCount');
		},
		newUser () {
			this.$store.dispatch('createUser', { name: this.userName });
		}
	},
	computed: {
		count () {
			return this.$store.getters.getTotalCount;
		},
		users () {
			return this.$store.getters.getAllUsers;
		}
	},
	created: function(){
    	this.$store.dispatch('getUsers');
  	}
};
</script>

<style>
</style>
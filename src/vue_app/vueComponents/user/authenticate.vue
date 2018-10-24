<!-- 
	Authenticates and initializes user
-->

<template>

		<v-card app flat color="grey darken-3" v-if="this.authenticated == false">

			<v-container>
				<v-btn  large round @click="googleLogin" color="grey darken-2">
					<v-icon large >mdi-google</v-icon>
					<v-icon large flip>mdi-content-save</v-icon>
				</v-btn>
			</v-container>

			<v-container>
				<v-tooltip
				bottom
				>
				<v-icon slot="activator">mdi-help-circle-outline</v-icon>
				Press the button to login with Google, <br>
				which is used to save your progress
				</v-tooltip>
			</v-container>

		</v-card>

</template>

<script>

export default {

	name: "authenticate",

	data() {
		return {
			ready:false
		}
	},

    watch: {

        authenticated (newVal, oldVal) {
			if(newVal){

				this.$store.dispatch('getProjects').then(response => {

					this.$store.dispatch('projectsReady');

				}, error => {

				});

			}
		}
		
	},
	
	computed: {

		authenticated () {
			return this.$store.getters.authenticated;
		},

		projects () {
			return this.$store.getters.projects;
		}

    },

	methods: {
		googleLogin (){
			this.$store.dispatch('authenticate');
		}
	},
	  
	mounted: function () {
    	this.$store.dispatch('getAuthenticated');
    }
	
};
</script>

<style>
</style>
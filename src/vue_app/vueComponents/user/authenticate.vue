<template>

		<v-card app flat color="grey darken-3" v-if="this.authenticated == false">

			<v-container>
				<h1 class="display-2" style="text-decoration: underline;">VidComp</h1>
				<p class="subheading">Online Video Editor</p>
				<p class="subheading mt-1">Press the button to sign in and continue</p>
				<v-btn large round @click="googleLogin" color="grey darken-2">
					<v-icon large >mdi-google</v-icon>
					<v-icon large flip>mdi-content-save</v-icon>
				</v-btn>
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
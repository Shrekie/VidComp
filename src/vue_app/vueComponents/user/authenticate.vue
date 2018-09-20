<!-- 
	Authenticates and initializes user
-->

<template>

    <v-footer app flat height="60" color="grey darken-3" v-if="this.authenticated == false">
        <v-spacer></v-spacer>

        <v-btn icon large @click="googleLogin" color="red lighten-2">
            <v-icon normal>mdi-account-edit</v-icon>
            <v-icon small flip>mdi-content-save</v-icon>
        </v-btn>

        <v-spacer></v-spacer>
    </v-footer>


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

					this.projects.forEach(project => {
						console.log(project.name);
						this.$vcomp.loadProject(project);
					});

					this.$store.dispatch('isReady');

				}, error => {
					console.log(error);

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
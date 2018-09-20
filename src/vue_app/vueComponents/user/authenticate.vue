<!-- 
	Main user interaction section
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
		}
	},

	computed: {

		authenticated () {
			return this.$store.getters.authenticated;
		}

    },

	methods: {
		googleLogin (){
			this.$store.dispatch('googleLogin');
			console.log(this.authenticated);
		}
	},
	  
	mounted: function () {
        //this.$store.dispatch('getAuthenticated');
    }
	
};
</script>

<style>
</style>
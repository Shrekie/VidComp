<template>

    <v-flex xs12 text-xs-center>

        <v-container>

            <v-icon x-large color="green" v-if="this.authenticated == true">mdi-check</v-icon>
            
            <v-icon x-large color="red" v-if="this.authenticated == false">mdi-account-search</v-icon>
            
        </v-container>

        <v-container>

            <v-btn large @click="closeWindow" color="grey darken-3">
                <v-icon x-large >mdi-arrow-right-bold-circle</v-icon>
            </v-btn>

        </v-container>

    </v-flex>

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
		closeWindow (){
            window.close();
		}
	},

	mounted: function(){
        this.$store.dispatch('getAuthenticated');
	}
	
};
</script>

<style>
</style>
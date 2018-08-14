<!-- 
    Button sheet media importer manager
-->

<template>
    <div class="text-xs-center">
        <v-bottom-sheet>

        <v-btn
            slot="activator"
            color="purple"
            dark>
            Import Media
        </v-btn>

        <v-card height="250px">

        <v-card-title class="blue white--text">
        <span class="headline">Import Media</span>

        <v-spacer></v-spacer>

        </v-card-title>

        <v-flex xs10 offset-xs1 text-xs-center>

            <v-form>

                <v-text-field
                label="Data URL"
                box
                ></v-text-field>
                <v-btn small color="primary" @click="getMedia">Get media</v-btn>
                
            </v-form>
        </v-flex>

        </v-card>
        


        </v-bottom-sheet>
    </div>
</template>

<script>

export default {
    name: "mediaImporter",

    props: ['projectName'],

    methods: {

        getMedia () {

            this.$vcomp(this.projectName).addMedia({
                layerIndex: 0,
                size: [100, 100],
                timelineTime: [0, 0.2],
                position: [40, 40],
                videoStartTime: 0.03,
                resource: {
                    name: 'catvideoTwo'
                }
            });

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
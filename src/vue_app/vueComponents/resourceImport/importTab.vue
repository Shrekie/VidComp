<!-- 
    Resource importer manager
    #TODO: This file should be named resourceImporter, same with URL.
-->

<template>
        <v-flex xs12 text-xs-center>


        <v-toolbar app dense flat>

            <v-toolbar-items>
            <v-btn icon :to="'/project/' + this.projectName + '/resources/video'">
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            </v-toolbar-items>

            <v-spacer></v-spacer>

            <v-toolbar-items>
                <v-btn icon :to="'/project/' + this.projectName + '/import/youtube'"
                :disabled="importing">
                    <v-icon>mdi-youtube</v-icon>
                </v-btn>

                <v-btn icon :to="'/project/' + this.projectName + '/import/global'"
                :disabled="importing">
                    <v-icon >mdi-link-variant</v-icon>
                </v-btn>

                <v-btn icon disabled>
                    <v-icon >mdi-harddisk</v-icon>
                </v-btn>
            </v-toolbar-items>
        
		</v-toolbar>

        <router-view  v-on:importing-resource="disableButtonsOnImport" ></router-view>

        </v-flex>
</template>

<script>

export default {

    name: "importTab",

    props: ['projectName'],

    methods: {
        disableButtonsOnImport(isImporting){
            this.importing = isImporting;
        }
    },

    data() {

        return {
            importing:false
        }

    }
    
};
</script>

<style>

</style>
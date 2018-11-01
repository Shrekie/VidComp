<!-- 
    Resource importer manager
    #TODO: This file should be named resourceImporter, same with URL.
-->

<template>
        <v-flex xs12 text-xs-center>

            <v-card flat>

                <v-btn icon :to="'/project/' + this.projectName + '/resources/video'">
                    <v-icon>mdi-arrow-left-bold-circle</v-icon>
                </v-btn>
                
            </v-card>

            <v-card flat class="mt-1">

                <v-btn icon :to="'/project/' + this.projectName + '/import/youtube'">
                    <v-icon>mdi-youtube</v-icon>
                </v-btn>

                <v-btn icon :to="'/project/' + this.projectName + '/import/global'">
                    <v-icon >mdi-link-variant</v-icon>
                </v-btn>

                <v-btn icon disabled>
                    <v-icon >mdi-harddisk</v-icon>
                </v-btn>

            </v-card>

            <router-view></router-view>

        </v-flex>
</template>

<script>

export default {

    name: "importTab",

    props: ['projectName'],
    
};
</script>

<style>

</style>
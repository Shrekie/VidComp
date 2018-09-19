<!-- 
    Resource importer manager
    #TODO: This file should be named resourceImporter, same with URL.
-->

<template>

    <v-flex xs12 text-xs-center>

        <v-layout>
            <v-flex xs12 text-xs-center>
                <v-card flat>
                    <v-container>
                        <v-layout row wrap text-xs-center>
                            <v-card flat tile width="130px" height="130px"
                            :to="'/new'"
                            class="mediaBox" style="text-align: center !important;"
                            >
                                <v-icon class="addBox">mdi-plus</v-icon>
                            </v-card>

                            <Resource v-bind:resource="resource"
                            v-for="resource in allProjects"
                            :key="resource.name"
                            ref="mediaBox" v-on:resource-select="resourceSelect">
                            </Resource>
                        </v-layout>
                    </v-container>
                </v-card>
            </v-flex>
        </v-layout>

        <v-card flat>
            <v-btn icon :disabled="activeProject == 0" 
            @click="getMedia">
                <v-icon>mdi-check</v-icon>
            </v-btn>
        </v-card>

    </v-flex>
        
</template>

<script>

import Resource from '../resourceImport/resource.vue';

export default {

    name: "projectLibrary",

    components: {
        Resource
    },

    computed:{

		allProjects () {
			return this.$store.getters.getAllProjects;
        }
        
    },

    methods: {

        resourceSelect (childRef) {

            //TODO: maybe not have the unique ID be the name of resource?
            this.$refs.mediaBox.forEach(projectComponent => {
                if(childRef.name != projectComponent.resource.name){
                    projectComponent.unselectResource();
                    console.log(projectComponent);
                }else{
                    projectComponent.selectResource();
                    this.activeProject = projectComponent.resource;
                }
            });

        },

        getMedia () {

            this.$router.push({ path: `/compose/${this.activeProject.name}`});

        }

    },

	data() {

        var activeProject = 0;

		return {
            activeProject
        }
        
    },
    
    created: function(){
    	this.$store.dispatch('getProjects');
    }
      
};

</script>

<style>

.addBox{
    margin-top: 32% !important;
    font-size: 40px;
}

</style>
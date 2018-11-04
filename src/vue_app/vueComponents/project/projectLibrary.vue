<!-- 
    Resource importer manager
    #TODO: This file should be named resourceImporter, same with URL.
-->

<template>

    <v-flex xs12 text-xs-center>

        <v-toolbar app>
            
            <v-btn icon @click="logout">
				<v-icon>mdi-arrow-left</v-icon>
			</v-btn>

            <v-spacer></v-spacer>

            <v-btn icon :to="'/new'">
                <v-icon large>mdi-plus-box</v-icon>
            </v-btn>

        </v-toolbar>

        <v-layout>
            <v-flex xs12 text-xs-center>
                <v-card flat>
                    <v-container>
                        <v-layout row wrap text-xs-center>

                            <Resource v-bind:resource="resource"
                            v-for="resource in allProjects"
                            :key="resource.name"
                            ref="mediaBox" v-on:resource-select="resourceSelect">
                            </Resource>

                            <v-container  v-if="allProjects.length == 0">
                                <v-btn icon :to="'/new'">
                                    <v-icon large>mdi-plus-box</v-icon>
                                </v-btn>
                            </v-container>

                        </v-layout>
                    </v-container>
                </v-card>
            </v-flex>
        </v-layout>

        <v-bottom-nav
        :value="true"
        app
        >
            <v-btn icon :disabled="activeProject == 0" 
            @click="getMedia">
                <v-icon large>mdi-check</v-icon>
            </v-btn>

            <v-btn icon v-if="this.activeProject" 
            @click="removeProject">
				<v-icon large>mdi-delete</v-icon>
			</v-btn>

        </v-bottom-nav>

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
			return this.$store.getters.projects;
        }
        
    },

    methods: {

        resourceSelect (childRef) {

            //TODO: maybe not have the unique ID be the name of resource?
            this.$refs.mediaBox.forEach(projectComponent => {
                if(childRef.name != projectComponent.resource.name){
                    projectComponent.unselectResource();
                }else{
                    projectComponent.selectResource();
                    this.activeProject = projectComponent.resource;
                }
            });

        },

        logout(){

            this.$store.dispatch('logout').then(function(){
                location.reload()
            }.bind(this))

        },

        removeProject() {

            this.$store.dispatch('removeProject', this.activeProject.name);
            this.$vcomp.removeProject(this.activeProject.name);
            this.activeProject = false;

        },

        getMedia () {

            this.$router.push({ path: `project/${this.activeProject.name}`});

        }

    },

	data() {

		return {
            activeProject: false,
        }
        
    }
      
};

</script>

<style>

.addBox{
    margin-top: 32% !important;
    font-size: 40px;
}

</style>
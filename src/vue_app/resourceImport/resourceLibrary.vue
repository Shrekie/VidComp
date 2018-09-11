<!-- 
    Resource importer manager
    #TODO: This file should be named resourceImporter, same with URL.
-->

<template>
    
    <v-layout>

        <v-flex xs12 text-xs-center>
            
            <v-card flat>
                <v-btn icon :to="'/compose/' + this.projectName">
                    <v-icon>mdi-minus-circle</v-icon>
                </v-btn>
            </v-card>

            <v-layout>

                <v-flex xs12 text-xs-center>
                <v-card flat>

                    <v-btn icon 
                    :to="'/resources/' + this.projectName + '/video'" 
                    :disabled="resourceTypeView == 'video'"
                    @click="activeResource=0">
                        <v-icon>mdi-video-image</v-icon>
                    </v-btn>
                    <v-btn icon 
                    :to="'/resources/' + this.projectName + '/image'" 
                    :disabled="resourceTypeView == 'image'"
                    @click="activeResource=0">
                        <v-icon>mdi-image</v-icon>
                    </v-btn>
                    <v-btn icon 
                    :to="'/resources/' + this.projectName + '/audio'" 
                    :disabled="resourceTypeView == 'audio'"
                    @click="activeResource=0">
                        <v-icon>mdi-volume-high</v-icon>
                    </v-btn>

                    <v-container>

                        <v-layout row wrap text-xs-center>

                            <v-card flat tile width="130px" height="130px"
                            :to="'/compose/' + this.projectName"
                            class="mediaBox"
                            >
                                <v-icon class="addBox">mdi-plus</v-icon>
                            </v-card>

                            <Resource v-bind:resource="resource"
                            v-for="resource in allResources"
                            :key="resource.name"
                            ref="mediaBox" v-on:resource-select="resourceSelect"
                            v-if="resource.type == resourceTypeView">
                            
                            </Resource>

                        </v-layout>

                    </v-container>

                </v-card >
                </v-flex>
                
            </v-layout>

            <v-card flat>
                <v-btn icon :disabled="activeResource == 0" 
                @click="getMedia">
                    <v-icon>mdi-check</v-icon>
                </v-btn>
                <v-btn icon :disabled="activeResource == 0" 
                :to="'/compose/' + this.projectName">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-btn icon :disabled="activeResource == 0" 
                :to="'/compose/' + this.projectName">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
            </v-card>

        </v-flex>

    </v-layout>
        
</template>

<script>

import Resource from './resource.vue';

export default {

    name: "resourceLibrary",

    components: {
        Resource
    },

    props: ['projectName', 'resourceTypeView'],

    computed:{
        timeSliderTime (){
            return this.$store.getters.sliderTime;
        }
    },

    methods: {

        resourceSelect (childRef) {

            //TODO: maybe not have the unique ID be the name of resource?
            this.$refs.mediaBox.forEach(resourceComponent => {
                if(childRef.name != resourceComponent.resource.name){
                    resourceComponent.unselectResource();
                }else{
                    resourceComponent.selectResource();
                    this.activeResource = resourceComponent.resource;
                }
            });

        },

        getMedia () {

            var mediaMeta = this.$vcomp(this.projectName).addMedia({
                layerIndex: 0,
                size: [300, 160],
                timelineTime: [(this.timeSliderTime/1000), ( (this.timeSliderTime/1000) + 0.1 )],
                position: [0, 0],
                videoStartTime: 0,
                resource: {
                    name: this.activeResource.name
                }
            });

            this.$vcomp(this.projectName)
            .adjustMediaShift({
                    layerIndex: 0, mediaIndex: mediaMeta.mediaIndex
                },{
                    layerIndex: 0,
                    timelineStartTime: this.timeSliderTime/1000
            });

            this.$router.push({ path: `/compose/${this.projectName}`});

        }

    },

	data() {

        var allResources = this.$vcomp(this.projectName).getAllResources();
        var activeResource = 0;

		return {
            activeResource,
            allResources
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
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

                    <v-container>

                        <v-layout row wrap >

                            <v-card flat tile width="130px" height="130px"
                            :to="'/compose/' + this.projectName"
                            class="mediaBox"
                            >
                                <v-icon class="addBox">mdi-plus</v-icon>
                            </v-card>

                            <Resource v-bind:resource="resource"
                            v-for="resource in allResources"
                            :key="resource.name"
                            ref="mediaBox" v-on:resource-select="resourceSelect">
                            
                            </Resource>

                        </v-layout>

                    </v-container>

                <!--
                <v-card flat>
                    <v-text-field
                    label="Data URL"
                    box></v-text-field>
                    <v-btn small color="primary" @click="getMedia">Get media</v-btn>
                </v-card>
                -->
                </v-card >
                </v-flex>
            </v-layout>

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

    props: ['projectName'],

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
                }
            });

        },

        getMedia () {
            
            console.log(this.timeSliderTime);

            var mediaMeta = this.$vcomp(this.projectName).addMedia({
                layerIndex: 0,
                size: [100, 100],
                timelineTime: [(this.timeSliderTime/1000), ( (this.timeSliderTime/1000) + 0.1 )],
                position: [40, 40],
                videoStartTime: 0.03,
                resource: {
                    name: 'catvideoTwo'
                }
            });

            this.$vcomp(this.projectName)
            .adjustMediaShift({
                    layerIndex: 0, mediaIndex: mediaMeta.mediaIndex
                },{
                    layerIndex: 0,
                    timelineStartTime: this.timeSliderTime/1000
            });
        }

    },

	data() {

        var allResources = this.$vcomp(this.projectName).getAllResources();

		return {
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
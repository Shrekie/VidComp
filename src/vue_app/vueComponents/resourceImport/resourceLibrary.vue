<template>

    <v-flex xs12 text-xs-center>

        <v-toolbar app >

            <v-toolbar-items>

            <v-btn icon :to="'/project/' + this.projectName" exact>
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>

            </v-toolbar-items>

            <v-spacer></v-spacer>

            <v-toolbar-items>

                <v-btn icon :to="'/project/' + this.projectName + '/import/youtube'" exact>
                    <v-icon large>mdi-plus-box</v-icon>
                </v-btn>

                <v-btn icon 
                :to="'/project/' + this.projectName + '/resources/video'" 
                :disabled="resourceTypeView == 'video'"
                @click="activeResource=0">
                    <v-icon>mdi-video-image</v-icon>
                </v-btn>
                <v-btn icon 
                :to="'/project/' + this.projectName + '/resources/image'" 
                :disabled="resourceTypeView == 'image'"
                @click="activeResource=0">
                    <v-icon>mdi-image</v-icon>
                </v-btn>
                <v-btn icon 
                :to="'/project/' + this.projectName + '/resources/audio'" 
                :disabled="resourceTypeView == 'audio'"
                @click="activeResource=0">
                    <v-icon>mdi-volume-high</v-icon>
                </v-btn>

            </v-toolbar-items>

		</v-toolbar>

        <v-layout>

            <v-flex xs12 text-xs-center>
            <v-card flat>


                <v-container>

                    <v-layout row wrap text-xs-center>

                        <Resource v-bind:resource="resource"
                        v-for="resource in allResources"
                        :key="resource.name"
                        ref="mediaBox" v-on:resource-select="resourceSelect"
                        v-if="resource.type == resourceTypeView">
                        
                        </Resource>

                        <v-container v-if="allResources.length == 0">
                            <v-btn icon :to="'/project/' + this.projectName + '/import/youtube'" exact>
                                <v-icon large>mdi-plus-box</v-icon>
                            </v-btn>
                        </v-container>

                    </v-layout>

                </v-container>

            </v-card >
            </v-flex>
            
        </v-layout>

        <v-bottom-nav
        :value="true"
        app
        >

            <v-btn icon :disabled="activeResource == 0" 
                @click="getMedia">
                <v-icon large>mdi-check</v-icon>
            </v-btn>

        </v-bottom-nav>



    </v-flex>
        
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
            return this.$store.getters.sliderTime(this.projectName);
        },

        zoomScale (){
            return this.$store.getters.zoomScale(this.projectName);
        },

        allResources (){
            return this.$store.getters.resources(this.projectName);
        },

        focusArea (){
            return this.$store.getters.focusArea;
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

            var mediaMeta = this.$vcomp.project(this.projectName).addMedia({
                newMedia: {
                    layerIndex: this.focusArea[0],
                    size: [1280, 720],
                    timelineTime: [((this.timeSliderTime/this.zoomScale) - 0.05), ( (this.timeSliderTime/this.zoomScale) + 0.05 )],
                    position: [0, 0],
                    videoStartTime: 0,
                },
                newResource: {
                    name: this.activeResource.name,
                    resourceLink: this.activeResource.resourceLink,
                    origin: this.activeResource.origin
                }
            });

            this.$vcomp.project(this.projectName)
            .adjustMediaShift({
                    layerIndex: this.focusArea[0], mediaIndex: mediaMeta.mediaIndex
                },{
                    layerIndex: 0,
                    timelineStartTime: ((this.timeSliderTime/this.zoomScale) - 0.05)
            });

            this.$store.dispatch('setMedia',{name: this.projectName,
            media: this.$vcomp.project(this.projectName).getAllMedia()});

            this.$vcomp.project(this.projectName).log();

            this.$router.push({ path: `/project/${this.projectName}`});

        }

    },

	data() {

        var activeResource = 0;
		return {
            activeResource,
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
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

            <v-layout>
                <v-flex xs12 text-xs-center align-center>
                    <v-card flat>

                        <v-btn @click="importMedia">
                            <v-icon>mdi-upload</v-icon>
                        </v-btn>

                        <v-flex xs8 offset-xs2>
                            <v-text-field v-model="mediaURL"
                            append-icon="mdi-link-variant"
                            outline
                            >
                                <v-tooltip
                                slot="prepend"
                                bottom
                                >
                                <v-icon slot="activator">mdi-help-circle-outline</v-icon>
                                Paste image, video or audio URL to import it.
                                </v-tooltip>
                            
                            </v-text-field>
                        </v-flex>

                        <v-progress-circular v-if="loadingResource" class="mb-4"
                            :size="50"
                            color="primary"
                            indeterminate
                        ></v-progress-circular>

                        <!--
                        <v-card flat>
                            <input type="file" ref="inputBox" @change="uploadFile">
                        </v-card>
                        -->

                    </v-card>
                </v-flex>
            </v-layout>

        </v-flex>
</template>

<script>

export default {

    name: "importGlobal",

    props: ['projectName'],

    computed: {
        
        timeSliderTime (){
            return this.$store.getters.sliderTime(this.projectName);
        },

        zoomScale (){
            return this.$store.getters.zoomScale(this.projectName);
        },

        focusArea (){
            return this.$store.getters.focusArea;
        }

    },

    methods: {
        
        /*
        uploadFile () {
            console.log(this.$refs.inputBox.files);
        },
        */

        importMedia() {

            this.loadingResource = true;

            var mediaMeta = this.$vcomp.project(this.projectName).addMedia({

                newMedia: {
                    layerIndex: this.focusArea[0],
                    size: [1280, 720],
                    timelineTime: [((this.timeSliderTime/this.zoomScale) - 0.05), ( (this.timeSliderTime/this.zoomScale) + 0.05 )],
                    position: [0,0],
                    videoStartTime: 0
                },

                newResource: {
                    name: this.mediaURL,
                    resourceLink: this.mediaURL,
                    resourceType: 'searching'
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

            mediaMeta.loadedResource.then(function () {

                this.$store.dispatch('setResources',{name: this.projectName,
                resources: this.$vcomp.project(this.projectName).getAllResources()});

                this.loadingResource = false;

                this.$router.push({ path: `/project/${this.projectName}`});

            }.bind(this));

        }

    },

    data() {

        var mediaURL;
        var loadingResource = false;

        return {
            mediaURL,
            loadingResource
        }

    }
    
};
</script>

<style>

</style>
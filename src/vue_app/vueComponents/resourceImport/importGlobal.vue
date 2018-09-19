<!-- 
    Resource importer manager
    #TODO: This file should be named resourceImporter, same with URL.
-->

<template>
        <v-flex xs12 text-xs-center>

            <v-card flat>
                <v-btn icon :to="'/resources/' + this.projectName + '/video'">
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
                            ></v-text-field>
                        </v-flex>

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
            return this.$store.getters.sliderTime;
        },
        zoomScale (){
            return this.$store.getters.zoomScale;
        }
    },

    methods: {

        importMedia() {

            var mediaMeta = this.$vcomp.project(this.projectName).addMedia({

                newMedia: {
                    layerIndex: 0,
                    size: [300, 160],
                    timelineTime: [((this.timeSliderTime/this.zoomScale) - 0.05), ( (this.timeSliderTime/this.zoomScale) + 0.05 )],
                    position: [0,0],
                    videoStartTime: 0
                },

                newResource: {
                    name: this.mediaURL,
                    resourceLink: this.mediaURL,
                    resourceType: 'image'
                }

            });

            this.$vcomp.project(this.projectName)
            .adjustMediaShift({
                    layerIndex: 0, mediaIndex: mediaMeta.mediaIndex
                },{
                    layerIndex: 0,
                    timelineStartTime: ((this.timeSliderTime/this.zoomScale) - 0.05)
            });

            this.$router.push({ path: `/compose/${this.projectName}`});

        }

    },

    data() {

        var mediaURL;

        return {
            mediaURL
        }

    }
    
};
</script>

<style>

</style>
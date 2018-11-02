<!-- 
    Resource importer manager
    #TODO: This file should be named resourceImporter, same with URL.
-->

<template>
<v-card flat class="mt-1">
    <v-container grid-list-md text-xs-center>
        <v-layout row wrap>

                <v-flex xs10 offset-xs1>
                <v-text-field v-model="mediaURL" :disabled="loadingResource"
                @click:append="importMedia"
                @keyup.enter.native="importMedia"
                append-icon="mdi-upload"
                placeholder="Import with URL"
                solo
                light
                >

                </v-text-field>
                </v-flex>

                <v-progress-circular v-if="loadingResource" class="mb-4"
                    :size="50"
                    color="primary"
                    indeterminate
                ></v-progress-circular>

        </v-layout>
    </v-container>
</v-card>
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
        
        importMedia() {

            this.loadingResource = true;
            this.$emit('importing-resource', this.loadingResource);

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
                    origin: "global"
                }

            });

            this.$vcomp.project(this.projectName)
            .adjustMediaShift({
                layerIndex: this.focusArea[0], mediaIndex: mediaMeta.mediaIndex
            },{
                layerIndex: 0,
                timelineStartTime: ((this.timeSliderTime/this.zoomScale) - 0.05)
            });

            this.$vcomp.project(this.projectName).log();

            mediaMeta.loadedResource.then(function () {

                this.$store.dispatch('setMedia',{name: this.projectName,
                media: this.$vcomp.project(this.projectName).getAllMedia()});

                this.$store.dispatch('setResources',{name: this.projectName,
                resources: this.$vcomp.project(this.projectName).getAllResources()});

                this.loadingResource = false;
                this.$emit('importing-resource', this.loadingResource);

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
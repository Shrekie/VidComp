<template>
<v-card flat class="mt-1">
    <v-container grid-list-md text-xs-center>
        <v-layout row wrap>

            <v-flex xs10 offset-xs1>
                <v-text-field v-model="searchTerm" :disabled="loadingResource"
                @click:append="searchYoutube"
                @keyup.enter.native="searchYoutube"
                append-icon="mdi-magnify"
                placeholder="Search on YouTube"
                solo
                light
                >
                </v-text-field>
            </v-flex>

            <v-flex xs12>
                <v-progress-circular v-if="loadingResource" class="mb-4"
                    :size="50"
                    color="primary"
                    indeterminate
                ></v-progress-circular>
            </v-flex>

            <Resource v-bind:resource="ytresult"
            v-for="ytresult in searchResults"
            ref="mediaBox"
            v-on:resource-select="resourceSelect"
            :key="ytresult.id">
            </Resource>

            <v-bottom-nav
            :value="true"
            app
            >

            <v-btn icon :disabled="activeResource == 0 || loadingResource" 
                @click="importMedia">
                <v-icon large>mdi-check</v-icon>
            </v-btn>

        </v-bottom-nav>

        </v-layout>
    </v-container>
</v-card>
</template>

<script>

import YoutubeSearch from 'youtube-search';
import Resource from './resource.vue';

export default {

    name: "importGlobal",

    props: ['projectName'],

    components: {
        Resource
    },

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

        searchYoutube(){

            this.loadingResource = true;
            this.$emit('importing-resource', this.loadingResource);

            var opts = {
                maxResults: 21,
                type:"video",
                videoDuration: "short",
                key: 'AIzaSyBYWmTP9-BunEMzGEBsqvz57RiwRA4uEp0'
            };

            YoutubeSearch(this.searchTerm, opts, function(err, results) {
                if(err) return console.log(err);
                this.searchResults = results;
                this.loadingResource = false;
                this.$emit('importing-resource', this.loadingResource);
                console.dir(results);
            }.bind(this));

        },

        resourceSelect (childRef) {

            this.$refs.mediaBox.forEach(resourceComponent => {
                if(childRef.id != resourceComponent.resource.id){
                    resourceComponent.unselectResource();
                    resourceComponent.resourceName = "";
                }else{
                    resourceComponent.selectResource();
                    resourceComponent.resourceName = resourceComponent.resource.title;
                    this.activeResource = resourceComponent.resource;
                    this.activeMediaChild = resourceComponent;
                }
            });

        },

        disableNotSelectedMediaBox (option) {
            this.$refs.mediaBox.forEach(resourceComponent => {
                if(this.activeMediaChild.resource.id != resourceComponent.resource.id){
                    if(option)
                    resourceComponent.$el.style.display = "none";
                    else
                    resourceComponent.$el.style.display = "block";
                }
            });
        },

        importMedia() {

            this.loadingResource = true;
            this.$emit('importing-resource', this.loadingResource);
            this.disableNotSelectedMediaBox(true);

            var mediaMeta = this.$vcomp.project(this.projectName).addMedia({

                newMedia: {
                    layerIndex: this.focusArea[0],
                    size: [1280, 720],
                    timelineTime: [((this.timeSliderTime/this.zoomScale) - 0.05), ( (this.timeSliderTime/this.zoomScale) + 0.05 )],
                    position: [0,0],
                    videoStartTime: 0
                },

                newResource: {
                    name: this.activeResource.title,
                    resourceLink: this.activeResource.link,
                    origin: "youtube"
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

            mediaMeta.fetchResponse.then(function () {

                this.$store.dispatch('setMedia',{name: this.projectName,
                media: this.$vcomp.project(this.projectName).getAllMedia()});

                this.$store.dispatch('setResources',{name: this.projectName,
                resources: this.$vcomp.project(this.projectName).getAllResources()});

                this.loadingResource = false;
                this.$emit('importing-resource', this.loadingResource);
                this.disableNotSelectedMediaBox(false);

                this.$router.push({ path: `/project/${this.projectName}`});

            }.bind(this));

        }

    },

    mounted: function () {
        
        this.searchYoutube();
        
    },

    data() {

        return {
            searchTerm:"Cats",
            loadingResource:false,
            activeResource:0,
            activeMediaChild:0,
            mediaUrl:0,
            searchResults:[]
        }

    }
    
};
</script>

<style>

</style>
<!-- 
    Resource importer manager
    #TODO: This file should be named resourceImporter, same with URL.
-->

<template>

        <v-card flat tile @click.native="$emit('resource-select', resource)"
        class="mediaBox resourceFlair" ref="mediaBox">
            <v-card-title>
                <p style="word-break: break-all;">{{this.resourceName}}</p>
            </v-card-title>
        </v-card>

</template>

<script>

export default {

    name: "resource",

    props: ['resource'],

    computed: {
    },

    methods: {

        selectResource: function(){
            this.selected = true;
            this.$refs.mediaBox.$el.style.border = "5px solid white";
        },

        unselectResource: function(){
            this.selected = false;
            this.$refs.mediaBox.$el.style.border = "none";
        },

    },

    mounted: function () {

        if(this.resource.thumbnails){
            this.$refs.mediaBox.$el.style.background = `url(${this.resource.thumbnails.default.url})`;
        }
    },

	data() {    
		return {
            resourceName: this.resource.name,
            selected: false
        }
    }
    
};
</script>

<style>

.mediaBox{
    width: 150px;
    height: 150px;
    background-color: #C5C5C5 !important;
    margin-right:auto;
    margin-left:auto;
    margin-bottom:5px;
    text-align: left;
    overflow: hidden;
    color: white;
}
.resourceFlair{
    background-repeat: no-repeat !important;
    background-size: 150px 150px !important;
    text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
}
.mediaBox:hover{
    cursor:pointer;
}

</style>
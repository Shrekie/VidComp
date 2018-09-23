<!-- 
    Resource importer manager
    #TODO: This file should be named resourceImporter, same with URL.
-->

<template>

    <div v-on:click="$emit('resource-select', resource)">

        <v-card flat tile 
        width="130px" height="130px" 
        class="mediaBox" ref="mediaBox">
            <v-card-title>
                <p style="word-break: break-all;">{{this.resource.name}}</p>
            </v-card-title>
        </v-card>

    </div>

</template>

<script>

export default {

    name: "resource",

    props: ['resource'],

    computed: {

    },

    methods: {

        selectResource: function(){
            this.$refs.mediaBox.$el.style.border = "5px solid white";
        },

        unselectResource: function(){
            this.$refs.mediaBox.$el.style.border = "none";
        }

    },

	data() {    
		return {
        }
    }
    
};
</script>

<style>

.mediaBox{
    background-color: #C5C5C5 !important;
    margin-right:5px;
    margin-bottom:5px;
    text-align: left;
    overflow: hidden;
}
.mediaBox:hover{
    cursor:pointer;
}

</style>
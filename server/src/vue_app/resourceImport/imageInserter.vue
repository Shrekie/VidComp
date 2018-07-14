<!-- 
	Inserts images into video composer project
-->

<template>
<div>
    <v-text-field label="Image Link" v-model="imageLink"></v-text-field>
    <v-text-field label="Name of media" v-model="mediaName"></v-text-field>
    <v-text-field label="Name of resource" v-model="resourceName"></v-text-field>
    <v-text-field label="Start Time" v-model="startTime"></v-text-field>
    <v-text-field label="End Time" v-model="endTime"></v-text-field>
    <v-btn small color="primary" @click="addImage">Add Image</v-btn>
</div>
</template>

<script>

export default {
    name: "imageInserter",
    methods: {
        addImage () {
            this.$vcomp('test').addMedia({
                mediaName: this.mediaName,
                layerIndex: 0,
                resourceName: this.resourceName,
                resourceLink: this.imageLink,
                resourceType: 'image',
                position: [50,50],
                size: [300, 300],
                time: [this.startTime, this.endTime]
            });
        }
    },
	data() {
		return {
		}
	}
};
</script>

<style>
</style>
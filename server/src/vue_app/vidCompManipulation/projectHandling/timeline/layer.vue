<!-- 
	Inserts images into video composer project
-->

<template>
<div class="layerContainer">
    <v-btn small color="primary" @click="showInsertMedia">add Media</v-btn>
</div>
</template>

<script>

export default {
    name: "layer",
    methods: {
        showInsertMedia () {
            const projectName = this.projectName;
            const layerIndex = this.layerIndex;

            this.$router.push({ path: `${projectName}/addmedia/${layerIndex}`});
        }
    },
    props: ['layerIndex', 'projectName'],
	data() {
        console.log(this.layerIndex);
        var allLayerMedia = this.$vcomp(this.projectName).getAllMedia(this.layerIndex);
		return {
            allLayerMedia
		}
	}
};
</script>

<style>

.layerContainer{
    background-color: gray;
    height: 50;
    width: 50;
}

</style>
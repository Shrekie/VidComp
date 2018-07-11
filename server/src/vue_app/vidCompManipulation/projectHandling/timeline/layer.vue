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
            this.$router.push({ path: `${this.projectName}/addmedia/${this.layerIndex}`});
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
    display: inline-block;
    position: relative;
    margin-top: 20px;
    margin-bottom: 20px;
    background-color: gray;
    height: 60px;
    width: 1000px;
    margin-right: 50%;
    margin-left: 50%;
}

</style>
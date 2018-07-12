<!-- 
	Inserts images into video composer project
-->

<template>
<div class="mediaContainer">
    <v-btn small color="primary" @click="showInsertMedia">add Media</v-btn>
</div>
</template>

<script>

export default {
    name: "media",
    methods: {
        showInsertMedia () {

        }
    },
    props: ['layerIndex', 'projectName'],
	data() {
		return {

		}
	}
};
</script>

<style>

.mediaContainer{
    display: inline-block;
    position: relative;
    margin-top: 20px;
    margin-bottom: 20px;
    background-color: gray;
    height: 60px;
    width: 100px;
    margin-right: 50%;
    margin-left: 50%;
}

</style>
<!-- 
	Composition of project, editing control
-->

<template>
<v-flex xs12 text-xs-center>
	<canvas v-project-composition="test"></canvas>
	<v-btn small color="primary" @click="playVideo">Play</v-btn>
	<v-btn small color="primary" @click="newImage">Change Image</v-btn>
</v-flex>
</template>

<script>

export default {
	name: "assetComposer",
	data() {
		return {
		}
	},
	methods: {
		playVideo () {
			this.$vcomp('test').play();
		},
		newImage () {
			this.$vcomp('test').changeResource({
				resourceName: 'ImgurImage',
				resourceLink: 'https://i.imgur.com/71t58N9.jpg'
			});
		}
	}
};
</script>

<style>
canvas{
	width: 100%;
	height: 500px;
}
</style>
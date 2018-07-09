<!-- 
	Composition of project, editing control
-->

<template>
<v-flex xs12 text-xs-center>

	<canvas v-project-composition="test"></canvas>
	<v-btn small color="primary" @click="playVideo">Play</v-btn>
	<v-btn small color="primary" @click="newImage">Change Image</v-btn>
	<router-view>

	</router-view>
</v-flex>
</template>

<script>
import ImageInserter from './../../vidCompManipulation/resourceImport/imageInserter.vue';

export default {
	name: "assetComposer",
	components: {
		ImageInserter
	},
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
				name: 'BunnyVideo',
				resourceLink: 'https://i.imgur.com/71t58N9.jpg',
				resourceType: 'image'
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
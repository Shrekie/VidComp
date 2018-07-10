<!-- 
	Composition of project, editing control
-->

<template>
<v-flex xs12 text-xs-center>
	
	<!-- #TODO: add in component -->
	<div id="canvasLockAspectContainer">
		<canvas v-project-composition="test"></canvas>
	</div>
	<v-btn small color="primary" @click="playVideo">Play</v-btn>
	<v-btn small color="primary" @click="playVideo">Pause</v-btn>
	<v-btn small color="primary" @click="playVideo">Reset</v-btn>

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
		}
	}
};
</script>

<style>

@media screen and (max-width: 780px) {
    #canvasLockAspectContainer{
		max-width: 360px !important;
		max-height: 190px !important;
	}
}

#canvasLockAspectContainer{
	margin: 0 auto;
	overflow: hidden;
	max-width: 640px;
	max-height: 330px;
}

#canvasLockAspectContainer canvas{
	width: 100%;
	margin-bottom: 56.25%;
	border: 1px solid;
	background: gold;
}
</style>
<!-- 
	Main user interaction section
-->

<template>
<div id="timelineSlider"></div>
</template>

<script>

// FIXME: timelineSlider messes up on zoom, fix: no scroll overflow on <html> 
// ^ this fixes when website more applike

export default {
    name: "timelineSlider",
	data() {
		return {
		}
	}
};

</script>

<style>
#timelineSlider{
    border: solid 1px blue;
    width: 5px;
    background-color: red;
    max-height: inherit;
    height: 190px;
    position: fixed;
    left: 50%;
    z-index: 1;
}
</style>
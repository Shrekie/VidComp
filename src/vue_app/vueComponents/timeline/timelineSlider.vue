<!-- 
	Main user interaction section
-->

<template>
    <div id="timelineSlider"></div>
</template>

<script>

    /*
        FIXME: if scroll overflow is not overlay the timeslider is misaligned.
        add some js or something that readjusts slider, also have dynamic top or something
        when user zooms, remember element is fixed.
    */

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
    border: solid 1px black;
    width: 5px;
    background-color: white;
    max-height: inherit;
    height: 100%;
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    z-index: 100000;
}

</style>
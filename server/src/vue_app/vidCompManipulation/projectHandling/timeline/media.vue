<!-- 
	Inserts images into video composer project
-->

<template>
<div class="mediaContainer" v-bind:style="{ width: mediaWidth, left: mediaLeft }" >
    
</div>
</template>

<script>

export default {
    name: "media",
    props: ['mediaName', 'timelineTime', 'projectName'],
    data() {

		return {
            projectName: this.projectName,
            timelineTime: this.timelineTime,
            width: "0px",
            left: "50%"
        }
        
    },
    methods: {
        getInitalMediaSize () {
            console.log(((this.timelineTime[1]-this.timelineTime[0])*1000));
            this.width = ((this.timelineTime[1]-this.timelineTime[0])*1000) + 'px';
            this.left = (this.timelineTime[0]*1000) + 'px';
        }
    },
    computed: {
        mediaWidth: function () {
            return this.width;
        },
        mediaLeft: function () {
            return this.left;
        }
    },
    mounted: function () {
        this.getInitalMediaSize();
        console.log(this.width);
    }
};
</script>

<style>

.mediaContainer{
    display: inline-block;
    position: absolute;
    background-color: forestgreen;
    border: 1px solid black;
    height: 60px;
    width: 0px;
}

</style>
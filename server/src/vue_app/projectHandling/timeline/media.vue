<!-- 
	Inserts images into video composer project
-->

<template>
<div>
    <div class="mediaContainer" v-bind:style="{ width: mediaWidth, left: mediaLeft }" >
        
    </div>
    <!--
    <div class="addMediaContainer" v-bind:style="{ width: addMediaWidth, left: addMediaLeft }" >
        
    </div>
    -->
</div>
</template>

<script>

export default {
    name: "media",
    props: ['mediaIndex', 'timelineTime', 'projectName'],
    data() {

		return {
            mediaIndex: this.mediaIndex,
            projectName: this.projectName,
            timelineTime: this.timelineTime,
            mediaWidth: "0px",
            mediaLeft: "50%",
            addMediaLeft: "50%",
            addMediaWidth: "0px"
        }
        
    },
    methods: {
        getInitalMediaSize () {

            this.mediaWidth = ((this.timelineTime[1]-this.timelineTime[0])*1000) + 'px';
            this.mediaLeft = (this.timelineTime[0]*1000) + 'px';
            this.addMediaLeft = (this.timelineTime[1]*1000) + 'px';
            this.addMediaWidth = ((this.timelineTime[1]-this.timelineTime[0])*1000) + 'px';

        }
    },
    computed: {
        mediaWidth: function () {
            return this.mediaWidth;
        },
        mediaLeft: function () {
            return this.mediaLeft;
        },
        addMediaLeft: function () {
            return this.addMediaLeft;
        },
        addMediaLeft: function () {
            return this.addMediaWidth;
        }
    },
    mounted: function () {
        console.log(this.mediaIndex);
        this.getInitalMediaSize();
    }
};
</script>

<style>

.addMediaContainer{
    display: inline-block;
    position: absolute;
    background-color: red;
    border: 1px solid black;
    width: 100%;
    height: 60px;
}

.mediaContainer:hover{
    opacity: 0.5 !important;
}

.mediaContainer{
    display: inline-block;
    position: absolute;
    background-color: forestgreen;
    border: 1px solid black;
    height: 60px;
    width: 0px;
}

</style>
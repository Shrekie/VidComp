var templates = {

    blankProject : {
        name: "New Project",
        layers: [{
            layerIndex: 0
        }],
        media: [],
        resources: [] 
    },

    mediaResource:
    {
        newMedia: {
            layerIndex: 0,
            size: [1280, 720],
            timelineTime: [0, 0],
            position: [0,0],
            videoStartTime: 0
        },
      
        newResource: {
            name: 'https://i.imgur.com/Cd08zcw.mp4',
            resourceLink: 'https://i.imgur.com/Cd08zcw.mp4',
            origin: "global",
        }

    },

    videoExamples:{

    },

    closeTimeline: 0.155,
    
    farTimeline: 1.335,

    timelineTimeSmall: [0, 0.3]

}

templates.mediaResource.newMedia.timelineTime = templates.timelineTimeSmall;

export default templates;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Resource = new Schema({

    name: String,
    url: String,
    type: String,
    origin: String,
    resourceLink: String

});

var Layers = new Schema({

    layerIndex: Number

});

var Media = new Schema({

    layerIndex: Number,
    mediaIndex: Number,
    size: [Number, Number],
    timelineTime: [Number, Number],
    position: [Number, Number],
    videoStartTime: Number,
    resource: Resource

});

var Project = new Schema({

    profileID: Number,
    name: String,
    timeSliderTime: Number,
    zoomScale: Number,
    layers: [Layers],
    media: [Media],
    resources: [Resource]
    
});

module.exports = mongoose.model('Project', Project);
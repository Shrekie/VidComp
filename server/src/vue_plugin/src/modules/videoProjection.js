export default function () {

    var videoOutput = {};

    this.setTarget = function (canvas) {
        videoOutput = canvas.getContext('2d');
    };

    this.drawTimeline = function (timeline) {

        timeline.eachLayer(function(layer){
            if(layer.data.rawResource.type == 'image'){
                var canvasImage = new Image();
                canvasImage.onload = function () {
                    videoOutput.drawImage(canvasImage, 0, 0);
                }
                canvasImage.src = layer.data.rawResource.url;
            }
        });

    };

};
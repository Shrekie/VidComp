export default function () {

    var videoOutput = {};

    this.setTarget = function (canvas) {
        videoOutput = canvas.getContext('2d');
    };

    this.drawTimeline = function (resourceLoader) {

        // TODO: put this in drawer module
        var loop = function () {

            resourceLoader.eachResource(function(source){
                if(source.type == 'image'){
                    videoOutput.drawImage(source.resource, 0, 0);
                }
                requestAnimationFrame(loop);
            });

        };

        requestAnimationFrame(loop);

    };

};
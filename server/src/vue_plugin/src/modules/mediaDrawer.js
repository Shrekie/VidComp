export default function () {

    var startTime = 0;
    var nowTime = 0;
    var elapsed = 0;

    var trackTime = function(){

        nowTime = new Date();
        elapsed = nowTime - startTime;
        elapsed /= 1000;
        elapsed = Math.round(elapsed);

    };

    this.drawSources = function (sourceLoader, videoOutput) {

        // TODO: put this in drawer module
        var videoUpdate = function () {

            videoOutput.ctx.clearRect(0,0, videoOutput.el.width, videoOutput.el.height);

            sourceLoader.eachSource(function(source){
                
                if(source.type == 'image'){
                    //console.log(source.media.time[0]);
                    if( elapsed >= source.media.time[0] && elapsed <= source.media.time[1]){
                        videoOutput.ctx.drawImage(source.cast, 0, 0);
                    }
                }

            });
            
            console.log(elapsed + " seconds");
            trackTime();
            requestAnimationFrame(videoUpdate);
        };

        startTime = new Date();
        requestAnimationFrame(videoUpdate);

    };

};
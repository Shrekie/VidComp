export default  function () {

    var stageStreams = function (controlledSources, canvasStream, done){

        var audioTracks = [];
        const audioContext = new AudioContext();
        controlledSources.forEach(function(source){
            audioTracks.push(source.getAudioTracks()[0]);
        });
        const streamSource = audioTracks.map(tracks => 
            audioContext.createMediaStreamSource(new MediaStream([tracks])));
        const combined = audioContext.createMediaStreamDestination();
        streamSource.forEach(source => source.connect(combined));
        combined.stream.addTrack(canvasStream.getVideoTracks()[0]);

        done(combined.stream);

    }

    var recordStream = function (time, stream, options, videoProjection, sourceLoader, done){

        var recordedBlobs = [];
        var mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorder.ondataavailable = function (event) {
            if(!event || !event.data || !event.data.size) alert('Failed.');
            if (event.data && event.data.size > 0) {
                recordedBlobs.push(event.data);
            }
        }

        videoProjection.startPlaying(sourceLoader);
        mediaRecorder.start(100);

        mediaRecorder.onstop = function (event){
            var videoBlob = new Blob(recordedBlobs, {type: options.mimeType})
            var fileReader = new FileReader();
            fileReader.onload = function() {
                var view1 = new DataView(this.result, 1, 500);              
                for(var i = 0; i < view1.byteLength; i++){
                    console.log(view1.getInt32(i).toString(16));
                    if(view1.getInt32(i).toString(16).includes("2ad7b1")){
                        view1.setUint32(i+4, 76800077);
                        break;
                    }
                }
                done(new Blob([new Uint8Array(view1.buffer)]));
                
            };
            fileReader.readAsArrayBuffer(videoBlob);
        };

        setTimeout(function(){ 
            videoProjection.stopPlaying(sourceLoader);
            videoProjection.resetPlayer(sourceLoader);
            mediaRecorder.stop();
        }, time);

    }

    this.render = function (sourceLoader, videoOutput, videoProjection){
        
        var options = {};

        if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
            options = {mimeType: 'video/webm; codecs=vp9'};
        } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
            options = {mimeType: 'video/webm; codecs=vp8'};
        } else {
        }
    
        var controlledSources = []
        sourceLoader.getControlledSources().forEach(function(source){
            source.cast.playbackRate = 0.3;
            controlledSources.push(source.cast.captureStream());
        });

        stageStreams(controlledSources, videoOutput.el.captureStream(), function(stream){

            recordStream(20000, stream, options, videoProjection, sourceLoader, function(file){

                sourceLoader.getControlledSources().forEach(function(source){
                    source.cast.playbackRate = 1.0;
                });
 
                var url = window.URL.createObjectURL(file);
                var downloadLink = document.createElement("a");
                downloadLink.download = 'file.webm';
                downloadLink.href = url 
                downloadLink.click();

            });

        });
        
    }

};
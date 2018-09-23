
export default  function () {

    this.render = function (sourceLoader, videoOutput, videoProjection){

        var options;
        if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
            options = {mimeType: 'video/webm; codecs=vp9'};
        } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
            options = {mimeType: 'video/webm; codecs=vp8'};
        } else {
        }
        
        var controlledSources = []

        // Tap into the streams of canvas and controlled video and audio
        sourceLoader.getControlledSources().forEach(function(source){
            controlledSources.push(source.cast.captureStream(30));
        });
        var canvasStream = videoOutput.el.captureStream(30);

        // Combine the streams into one MEGA MediaStream
        var audioTracks = [];
        const ac = new AudioContext();
        controlledSources.forEach(function(source){
            audioTracks.push(source.getAudioTracks()[0]);
        });
        const sources = audioTracks.map(t => ac.createMediaStreamSource(new MediaStream([t])));
        const dest = ac.createMediaStreamDestination();
        sources.forEach(s => s.connect(dest));
        dest.stream.addTrack(canvasStream.getVideoTracks()[0]);

        // Set up blob recording callback with MediaRecorder for dest stream
        var recordedBlobs = [];
        var mediaRecorder = new MediaRecorder(dest.stream, options);
        mediaRecorder.ondataavailable = function (event) {
            if(!event || !event.data || !event.data.size) alert('Failed.');
            if (event.data && event.data.size > 0) {
                recordedBlobs.push(event.data);
            }
        }

        // Play the streams and start recording    
        videoProjection.startPlaying(sourceLoader);
        mediaRecorder.start(100);

        mediaRecorder.onstop = function (event){
            
            var blob = new Blob(recordedBlobs, {type: options.mimeType});
            var url = window.URL.createObjectURL(blob);
            var downloadLink = document.createElement("a");
            downloadLink.download = 'video.webm';
            downloadLink.href = url;
            downloadLink.click();
            
        };

        setTimeout(function(){ 
            videoProjection.stopPlaying(sourceLoader);
            mediaRecorder.stop();
            //newStream.getTracks().forEach(track => track.stop());
        }, 24000);
        
    }

};
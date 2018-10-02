import ffmpeg from "ffmpeg.js";

export default  function () {

    var webmParser = {

        searchBinary: function (videoBlob, tagname, breakflag, done){

            this.findBinary(videoBlob, tagname, breakflag, function(currentIndex, dataView){
                done(currentIndex, dataView);
            })

        },

        setTimecodeScale: function (videoBlob, done){

            this.findBinary(videoBlob, '2ad7b1', true, function(currentIndex, dataView){
                dataView.setUint32(currentIndex+5, 85333325, false);
                done(dataView.buffer);
            })

        },

        findBinary: function(videoBlob, tagname, breakFlag, done){
            var fileReader = new FileReader();
            fileReader.onload = function() {
                var videoBuffer = this.result;
                var dataView = new DataView(videoBuffer, 0, videoBuffer.byteLength);        
                for(var i = 0; i < dataView.byteLength; i++){
                    try{     
                        if(dataView.getUint32(i).toString(16).includes(tagname)){
                            done(i, dataView);
                            if(breakFlag) break;
                        }
                    } catch(e) {
                        console.log(e);
                    }
                }
            };
            fileReader.readAsArrayBuffer(videoBlob);
        }

    }

    var combineAudio = function (audioTracks, done){

        const audioContext = new AudioContext();
        
        const streamSource = audioTracks.map(track =>
            audioContext.createMediaStreamSource(new MediaStream([track])));
        const combined = audioContext.createMediaStreamDestination();
        streamSource.forEach(source => source.connect(combined));
        done(combined);

    }

    var recordStream = function (time, stream, options, videoProjection, sourceLoader, done){

        var recordedBlobs = [];
        var mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorder.ondataavailable = function (event) {
            if(!event || !event.data || !event.data.size) alert('Failed fetching stream data..');
            if (event.data && event.data.size > 0) {
                recordedBlobs.push(event.data);
            }
        }

        videoProjection.startPlaying(sourceLoader);
        mediaRecorder.start(10);

        mediaRecorder.onstop = function (event){
            done(new Blob(recordedBlobs, {type: options.mimeType}), done);
        };

        setTimeout(function(){ 

            videoProjection.stopPlaying(sourceLoader);
            videoProjection.resetPlayer(sourceLoader);
            mediaRecorder.stop();
            stream.getTracks().forEach(track => track.stop());

        }, time);   

        setTimeout(function(){ 

            sourceLoader.stopUnreadyAudio();
            stream.getAudioTracks().forEach(track => {track.stop(); console.log(track);});

        }, time*0.33);

        /*

        videoProjection.bufferInterrupt(function(bufferingState){

            if(bufferingState == "loading"){
                if(mediaRecorder.state != "paused") mediaRecorder.pause()
            }
            else {
                if(mediaRecorder.state != "recording") mediaRecorder.start()
            }
            
        });
        */
    }

    this.render = function (sourceLoader, videoOutput, videoProjection){
        
        var options = {};

        if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
            options = {mimeType: 'video/webm;codecs=vp8'};
        } else {
            alert('video/webm;codecs=vp8 NOT SUPPORTED');
        }
 
        sourceLoader.getVideoSources().forEach(function(source){
            source.cast.playbackRate = 0.33;
        });setTimeout

        sourceLoader.getAudioSources().forEach(function(source){
            source.cast.muted = true;
        });

        videoProjection.setTimeDelay(0.33);

        videoProjection.resetPlayer(sourceLoader);

        var downloadFile = function (file){
            var url = window.URL.createObjectURL(file);
            var downloadLink = document.createElement("a");
            downloadLink.download = 'file.webm';
            downloadLink.href = url;
            downloadLink.click();    
        }

        var audioRender = new Promise((resolve, reject) => { 
            combineAudio(sourceLoader.getAudioSources().map(source => source.cast.captureStream().getAudioTracks()[0]), function(streamDest){
                recordStream(40000, streamDest.stream, options, videoProjection, sourceLoader, function(blob){

                    sourceLoader.getAudioSources().forEach(function(source){
                        source.cast.muted = false;
                    });

                    var fileReader = new FileReader();
                    fileReader.onload = function() {
                        resolve(this.result);
                    };
                    fileReader.readAsArrayBuffer(blob);

                })
            });
        });

        var videoRender = new Promise((resolve, reject) => { 
            recordStream(40000, videoOutput.el.captureStream(), options, videoProjection, sourceLoader, function(blob){

                sourceLoader.getVideoSources().forEach(function(source){
                    source.cast.playbackRate = 1.0;
                });

                webmParser.setTimecodeScale(blob, function(file){
                    resolve(file);
                });

            });
        })

        Promise.all([audioRender, videoRender]).then(function(values) {

            videoProjection.setTimeDelay(1);
            console.log(values);

            var result = ffmpeg({
                MEMFS: [{name: "audio.webm", data: new Uint8Array(values[0])}, {name: "video.webm", data: new Uint8Array(values[1])}],
                arguments: "-i video.webm -i audio.webm -c copy output.webm -shortest".split(" "),
                // Ignore stdin read requests.mp3
                stdin: function() {},
            });
            console.log(result.MEMFS[0]);
            downloadFile(new Blob([new Uint8Array(result.MEMFS[0].data)]));

        });
      
    }
    
};
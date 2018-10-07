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

    var recordStream = function (finishState, stream, options, videoProjection, sourceLoader, done){

        var recordedBlobs = [];

        var mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorder.ondataavailable = function (event) {
            if(!event || !event.data || !event.data.size) alert('Failed fetching stream data..');
            if (event.data && event.data.size > 0) {
                recordedBlobs.push(event.data);
            }
        }

        var bufferingState = videoProjection.mediaDrawer.contextHooks
        .registerHooks({name:'bufferInterrupt', callbackHook:function(bufferingState){
      
            if(bufferingState.status){
                if(mediaRecorder.state != "paused"){
                    mediaRecorder.pause();
                    console.log("STOP R");
                }
            }
            else {
                if(mediaRecorder.state != "recording"){
                    mediaRecorder.resume();
                    console.log("START R");
                }
            }

        }});

        videoProjection.startPlaying(sourceLoader);
        mediaRecorder.start(10);

        mediaRecorder.onstop = function (event){
            done(new Blob(recordedBlobs, {type: options.mimeType}), done);
            videoProjection.mediaDrawer.contextHooks.unregisterHook(playFinish);
        };

        var playFinish = videoProjection.mediaDrawer.contextHooks
        .registerHooks({name:'finished', callbackHook:function(finished){
            if(finished.status == finishState){
                mediaRecorder.stop();
                stream.getTracks().forEach(track => track.stop());
                videoProjection.mediaDrawer.contextHooks.unregisterHook(bufferingState);
            }

        }});
        
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
        });

        sourceLoader.getAudioSources().forEach(function(source){
            source.cast.muted = true;
        });

        videoProjection.setTimeDelay(0.3333);

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
                recordStream("normal", streamDest.stream, options, videoProjection, sourceLoader, function(blob){

                    var fileReader = new FileReader();
                    fileReader.onload = function() {
                        resolve(this.result);
                    };
                    fileReader.readAsArrayBuffer(blob);

                })
            });
        });

        var videoRender = new Promise((resolve, reject) => { 
            recordStream("delayed", videoOutput.el.captureStream(), options, videoProjection, sourceLoader, function(blob){

                webmParser.setTimecodeScale(blob, function(file){
                    resolve(file);
                });

            });
        })

        Promise.all([audioRender, videoRender]).then(function(values) {

            videoProjection.resetPlayer(sourceLoader);
            videoProjection.setTimeDelay(1);

            sourceLoader.getVideoSources().forEach(function(source){
                source.cast.playbackRate = 1.0;
            });

            sourceLoader.getAudioSources().forEach(function(source){
                source.cast.muted = false;
            });

            var result = ffmpeg({
                MEMFS: [{name: "audio.webm", data: new Uint8Array(values[0])}, {name: "video.webm", data: new Uint8Array(values[1])}],
                arguments: "-i video.webm -i audio.webm -c copy output.webm".split(" "),
                // Ignore stdin read requests.mp3
                stdin: function() {},
            });

            downloadFile(new Blob([new Uint8Array(result.MEMFS[0].data)]));

        });
      
    }
    
};
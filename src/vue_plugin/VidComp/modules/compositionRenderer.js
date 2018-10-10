export default  function () {

    var webmParser = {

        searchBinary: function (videoBlob, tagname, breakflag, done){

            this.findBinary(videoBlob, tagname, breakflag, function(currentIndex, dataView){
                done(currentIndex, dataView);
            })

        },

        setTimecodeScale: function (videoBlob, done){

            this.findBinary(videoBlob, '2ad7b1', true, function(currentIndex, dataView){
                alert(dataView.getUint32(currentIndex+5, false).toString(16));
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
            if(!event || !event.data || !event.data.size) console.log('%c NOTHING IN STREAM ', 'background: yellow; color: orange');
            if (event.data && event.data.size > 0) {
                recordedBlobs.push(event.data);
            }
        }

        var bufferingState = videoProjection.mediaDrawer.contextHooks
        .registerHooks({name:'bufferInterrupt', callbackHook:function(bufferingState){
      
            if(bufferingState.status){
                if(mediaRecorder.state != "paused"){
                    mediaRecorder.pause();
                    //alert("PAUSE");
                    console.log("STOP R");
                }
            }
            else {
                if(mediaRecorder.state != "recording"){
                    mediaRecorder.resume();
                    //alert("START");
                    console.log("START R");
                }
            }

        }});

        videoProjection.startPlaying(sourceLoader);
        mediaRecorder.start(100);

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

        var renderAudio, renderVideo;

        if(sourceLoader.getVideoSources().length > 0 && 
        sourceLoader.getAudioSources().length <= 0){
            // only video
            renderVideo = true;
            renderAudio = false;
        } 
        else if (sourceLoader.getVideoSources().length <= 0 && 
        sourceLoader.getAudioSources().length > 0){
            // only audio
            renderVideo = false;
            renderAudio = true;

        } else if (sourceLoader.getVideoSources().length > 0 && 
        sourceLoader.getAudioSources().length > 0){
            // both
            renderVideo = true;
            renderAudio = true;

        }else{
            alert("Nothing to render!");
            return false;
        }

        import("ffmpeg.js").then(function({ default: ffmpeg }){
        
        var options = {};

        if (MediaRecorder.isTypeSupported('video/webm;vp8')) {
            options = {mimeType: 'video/webm;codecs=vp8'};
        } else {
            alert('video/webm; NOT SUPPORTED');
        }
 
        sourceLoader.getVideoSources().forEach(function(source){
            source.cast.playbackRate = 0.33;
        });

        sourceLoader.getAudioSources().forEach(function(source){
            source.cast.muted = true;
        });

        videoProjection.setTimeDelay(0.333);

        videoProjection.resetPlayer(sourceLoader);

        var downloadFile = function (file){
            var url = window.URL.createObjectURL(file);
            var downloadLink = document.createElement("a");
            downloadLink.download = 'file.webm';
            downloadLink.href = url;
            downloadLink.click();    
        }
        
        var audioRender = new Promise((resolve, reject) => {

            if(!renderAudio){

                resolve("no audio");
                alert("NO AUDIO");
                return;

            } else {

                alert("THERE IS AUDIO");
                combineAudio(sourceLoader.getAudioSources().map(source => source.cast.captureStream().getAudioTracks()[0]), function(streamDest){
                    recordStream("normal", streamDest.stream, options, videoProjection, sourceLoader, function(blob){
                        var fileReader = new FileReader();
                        fileReader.onload = function() {
                            resolve(this.result);
                        };
                        fileReader.readAsArrayBuffer(blob);
                    })
                });

            }

        });

        var videoRender = new Promise((resolve, reject) => {

            /*
                #FIXME: only video trims end of video.
                (1): add artifical audio layer
                (2): vp9 opus without encoding
            */

            if(!renderVideo){

                resolve("no video");
                alert("NO VIDEO");
                return;

            }else{

                alert("THERE IS VIDEO");
                recordStream("delayed", videoOutput.el.captureStream(), options, videoProjection, sourceLoader, function(blob){
                    webmParser.setTimecodeScale(blob, function(file){
                        resolve(file);
                    });
                });

            }

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

            var encodeCombination;
            var argumentString;

            renderAudio, renderVideo;

            if(!renderAudio && renderVideo){
                // only video
                encodeCombination = [{name: "video.webm", data: new Uint8Array(values[1])}];
                argumentString = "-i video.webm -c copy output.webm".split(" ");
            } 
            else if (renderAudio && !renderVideo){
                // only audio
                encodeCombination = [{name: "audio.webm", data: new Uint8Array(values[0])}];
                argumentString = "-i audio.webm -c copy output.webm".split(" ");

            } else if (renderAudio && renderVideo){
                // both
                encodeCombination = [{name: "audio.webm", data: new Uint8Array(values[0])}, 
                {name: "video.webm", data: new Uint8Array(values[1])}];
                argumentString = "-i video.webm -i audio.webm -c copy output.webm".split(" ");

            }else{
                alert("Nothing to render!");
            }

            var result = ffmpeg({
                MEMFS: encodeCombination,
                arguments: argumentString,
                stdin: function() {},
            });

            downloadFile(new Blob([new Uint8Array(result.MEMFS[0].data)]));
            //downloadFile(new Blob([new Uint8Array(values[1])]));
        });

        });
    }
    
};
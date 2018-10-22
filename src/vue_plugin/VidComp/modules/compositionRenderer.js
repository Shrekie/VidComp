export default  function () {

    var webmParser = {

        searchBinary: function (videoBlob, tagname, breakflag, done){

            this.findBinary(videoBlob, tagname, breakflag, function(currentIndex, dataView){
                done(currentIndex, dataView);
            })

        },

        setTimecodeScale: function (videoBlob, done){

            this.findBinary(videoBlob, '2ad7b1', true, function(currentIndex, dataView){
                //alert(dataView.getUint32(currentIndex+5, false).toString(16));
                dataView.setUint32(currentIndex+5, 76800077, false);
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


    var audioBridge = {

        audioContext: new AudioContext(),
        streamSource: [],

    }

    var connectAudio = function (){

        audioBridge.streamSource.forEach(source => source.connect(audioBridge.audioContext.destination));

    }

    var combineAudio = function (audioTracks){

        return new Promise(function(resolve, reject){

            audioBridge.streamSource = audioTracks.map(cast =>
            audioBridge.audioContext.createMediaElementSource(cast));
            var dest = audioBridge.audioContext.createMediaStreamDestination();
            audioBridge.streamSource.forEach(source => source.connect(dest));
            resolve(dest);

        });

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

        mediaRecorder.ignoreMutedMedia = true;

        return mediaRecorder;
        
    }

    var downloadFile = function (file){
        var url = window.URL.createObjectURL(file);
        var downloadLink = document.createElement("a");
        downloadLink.download = 'file.webm';
        downloadLink.href = url;
        downloadLink.click();    
    }

    this.render = function (sourceLoader, videoOutput, videoProjection){

        var renderAudio, renderVideo;
        var renderStages = {loadffmpeg:0, renderDone:0};
        videoProjection.resetPlayer(sourceLoader);

        if(sourceLoader.getVideoSources().length > 0 && 
        sourceLoader.getAudioSources().length <= 0){

            // only video
            renderVideo = true;
            renderAudio = false;

        } else if (sourceLoader.getVideoSources().length <= 0 && 
        sourceLoader.getAudioSources().length > 0){

            // only audio
            renderVideo = false;
            renderAudio = true;

        } else if (sourceLoader.getVideoSources().length > 0 && 
        sourceLoader.getAudioSources().length > 0){

            // both
            renderVideo = true;
            renderAudio = true;

        } else {

            alert("Nothing to render!");
            renderStages.loadffmpeg = Promise.resolve();
            renderStages.renderDone = Promise.resolve();
            return renderStages;

        }

        var options = {};

        if (MediaRecorder.isTypeSupported('video/webm;vp8,opus')) {
            options = {mimeType: 'video/webm;codecs=vp8,opus'};
        } else {
            alert('video/webm; NOT SUPPORTED');
        }
 
        sourceLoader.getVideoSources().forEach(function(source){
            source.cast.playbackRate = 0.3;
        });

        videoProjection.setTimeDelay(0.3);
        var videoRecorder, audioRecorder, audioCombine;

        if(!renderAudio){

            audioCombine = Promise.resolve();

        } else {

            audioCombine = 
            combineAudio(sourceLoader.getAudioSources().map(source => source.cast));

        }

        var renderStart = audioCombine.then(function(streamDest){

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

                videoRecorder = recordStream("delayed", videoOutput.el.captureStream(), 
                options, videoProjection, sourceLoader, function(blob){
                    webmParser.setTimecodeScale(blob, function(file){
                        resolve(file);
                    });
                });

            }

        });

        var audioRender = new Promise((resolve, reject) => {

            if(!renderAudio){

                resolve("no audio");
                alert("NO AUDIO");
                return;

            } else {

                audioRecorder = recordStream("normal", streamDest.stream, options, 
                videoProjection, sourceLoader, function(blob){
                    var fileReader = new FileReader();
                    fileReader.onload = function() {
                        resolve(this.result);
                    };
                    fileReader.readAsArrayBuffer(blob);
                })

            }

        });

        var audioStartedRecording = new Promise(function(resolve, reject)
        {audioRecorder.onstart = function() {
            resolve();
        }})

        var videoStartedRecording = new Promise(function(resolve, reject)
        {videoRecorder.onstart = function() {
            resolve();
        }})

        videoProjection.resetPlayer(sourceLoader);
        videoProjection.startPlaying(sourceLoader);
        audioRecorder.start(5);
        videoRecorder.start(5);

        return Promise.all([videoStartedRecording, audioStartedRecording]).then(function() {
            return [videoRender, audioRender];
        });

        });

        var renderDone = renderStart.then(function(renderTracks){
            return Promise.all(renderTracks).then(function(values) {
                return values
            });
        });

        renderStages.renderDone = renderDone;

        renderStages.loadffmpeg = renderDone.then(function(values){

            return import("ffmpeg.js").then(function({ default: ffmpeg }){

                videoProjection.resetPlayer(sourceLoader);
                videoProjection.setTimeDelay(1);

                sourceLoader.getVideoSources().forEach(function(source){
                    source.cast.playbackRate = 1.0;
                });

                connectAudio();

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
                    encodeCombination = [{name: "audio.webm", data: new Uint8Array(values[1])}, 
                    {name: "video.webm", data: new Uint8Array(values[0])}];
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

            });

        });

        return renderStages;

    }
    
};
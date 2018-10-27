class MatroskaCoder {

    static searchBinary (videoBlob, tagname, breakflag, done) {

        this.findBinary(videoBlob, tagname, breakflag, function(currentIndex, dataView){
            done(currentIndex, dataView);
        })

    }

    static setTimecodeScale (videoBlob, done) {

        this._findBinary(videoBlob, '2ad7b1', true, function(currentIndex, dataView){
            dataView.setUint32(currentIndex+5, 76800077, false);
            done(dataView.buffer);
        })

    }

    static _findBinary (videoBlob, tagname, breakFlag, done) {

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

class AudioAdapter {

    _audioBridger = {
        audioContext: new AudioContext(),
        streamSource: [],
    }

    connectAudio () {
        this._audioBridger.streamSource.forEach(source =>
        source.connect(this._audioBridger.audioContext.destination));
    }

    combineAudio = function (audioTracks){

        return new Promise(function(resolve){

            this._audioBridger.streamSource = audioTracks.map(cast =>
                this._audioBridger.audioContext.createMediaElementSource(cast));

            var dest = this._audioBridger.audioContext.createMediaStreamDestination();

            this._audioBridger.streamSource.forEach(source => source.connect(dest));

            resolve(dest);

        }.bind(this));

    }
}

class StreamRecorder {

    _recordedBlobs = [];
    _mediaRecorder;
    _videoProjection;
    _finishState;
    _stream;
    _options;
    _done;

    _ignoreBufferInterrupt () {

        this._bufferingState = this._videoProjection.playbackContainer.contextHooks
        .registerHooks({name:'bufferInterrupt', callbackHook:function(bufferingState){    
    
            if(bufferingState.status){
                if(this._mediaRecorder.state != "paused"){
                    this._mediaRecorder.pause();
                    console.log("STOP R");
                }
            } else {
                if(this._mediaRecorder.state != "recording"){
                    this._mediaRecorder.resume();
                    console.log("START R");
                }
            }
    
        }.bind(this)});

    }

    _stateStop () {

        this._playFinish = this._videoProjection.playbackContainer.contextHooks
        .registerHooks({name:'finished', callbackHook:function(finished){
    
            if(finished.status == this._finishState){
    
                this._mediaRecorder.stop();
                this._stream.getTracks().forEach(track => track.stop());
                this._videoProjection.playbackContainer.contextHooks
                .unregisterHook(this._bufferingState);
    
            }
    
        }.bind(this)});

    }

    _fillMediaRecorder () {

        this._mediaRecorder = new MediaRecorder(this._stream, this._options);

        this._ignoreBufferInterrupt();

        this._mediaRecorder.ondataavailable = function (event) {

            if(!event || !event.data || !event.data.size) 
            console.log('%c NOTHING IN STREAM ', 'background: yellow; color: orange');

            if (event.data && event.data.size > 0) {
                this._recordedBlobs.push(event.data);
            }

        }.bind(this);

        this._mediaRecorder.onstop = function (event){

            this._done(new Blob(this._recordedBlobs, {type: this._options.mimeType}), this._done);
            this._videoProjection.playbackContainer.contextHooks.unregisterHook(this._playFinish);
            
        }.bind(this);

        this._stateStop();

        this._mediaRecorder.ignoreMutedMedia = true;

        return this._mediaRecorder;

    }

    static encoderOptions () {

        let options;

        if (MediaRecorder.isTypeSupported('video/webm;vp8,opus')) {
            options = {mimeType: 'video/webm;codecs=vp8,opus'};
        } else {

            alert('video/webm; NOT SUPPORTED');
            options = false;
        }

        return options;

    }

    constructor (finishState, stream, options, 
        videoProjection, done){

        this._videoProjection = videoProjection;
        this._finishState = finishState;
        this._stream = stream;
        this._done = done;
        this._options = options;


        return this._fillMediaRecorder();
        
    }

}

class OriginTemplater {

    static downloadFile (file) {

        var url = window.URL.createObjectURL(file);
        var downloadLink = document.createElement("a");
        downloadLink.download = 'file.webm';
        downloadLink.href = url;
        downloadLink.click();    
    }

//            -----
//    000oo <v(*_*)v> oo000
//            |   |
//            -----
//         TB54dZkzZOY
    static springStem (sourceLoader) {

        let renderFormat = {
            renderVideo:{},
            renderAudio:{}
        };

        renderFormat.renderVideo = 
        (sourceLoader.getVideoSources().length > 0);
        renderFormat.renderAudio = 
        (sourceLoader.getAudioSources().length > 0);

        return renderFormat

    }

}

class CompositionRenderer {

    _audioAdapter = new AudioAdapter();

    _renderFormat;
    _renderStages = {loadffmpeg:0, renderDone:0};
    _options;

    _recorders = [
    // videoRecorder ([0])
    // audioRecorder ([1])
    ]

    _audioCombiner;
    _audioDest;

    _sourceLoader;
    _videoOutput;
    _videoProjection;

    _cancelRender () {

        this._renderStages.loadffmpeg = Promise.resolve();
        this._renderStages.renderDone = Promise.resolve();
        return this._renderStages;

    }

    _tunePlayer (tuneAmount) {

        this._videoProjection.resetPlayer(this._sourceLoader);

        if(this._renderFormat.renderVideo){

            this._sourceLoader.getVideoSources().forEach(function(source){
                source.cast.playbackRate = tuneAmount;
            });
            this._videoProjection.setTimeDelay(tuneAmount);

        }

    }

    _buildRecording (recordingType) {

        return [ new Promise((resolve, reject) => {

            /*
                #FIXME: only video trims 
                end of video on mobile.

                (1): add artifical audio layer
                (2): vp9 opus without encoding
            */

            if(!this._renderFormat.renderVideo){

                console.log("NO VIDEO");
                this._recorders[0] = false;
                resolve("no video");

            }else{

                this._recorders[0] = new StreamRecorder("delayed", this._videoOutput.el.captureStream(), 
                this._options, this._videoProjection, function(blob){
                    MatroskaCoder.setTimecodeScale(blob, function(file){
                        resolve(file);
                    });
                });

            }

        }), new Promise((resolve, reject) => {

            if(!this._renderFormat.renderAudio){

                console.log("NO AUDIO");
                this._recorders[1] = false;
                resolve("no audio");

            } else {

                this._recorders[1] = new StreamRecorder("normal", this._audioDest.stream, 
                this._options, this._videoProjection, function(blob){

                    var fileReader = new FileReader();
                    fileReader.onload = function() {
                        resolve(this.result);
                    };
                    fileReader.readAsArrayBuffer(blob);

                })

            }

        })];

    }

    _startStreamRecorders () {

        let renderBuilds = this._buildRecording();

        let startedRecording = [];

        this._recorders.forEach(function(recorder, index){
            if(recorder){
                startedRecording[index] = new Promise(function(resolve, reject)
                {recorder.onstart = function() {
                    resolve();
                }});
            } else {
                startedRecording[index] = Promise.resolve();
            }
        })

        this._videoProjection.startPlaying(this._sourceLoader);

        this._recorders.forEach(function(recorder){
            if(recorder){
                recorder.start(5);
            }
        });

        return Promise.all(startedRecording).then(function() {

            return renderBuilds;

        });

    }

    render () {

        this._options = StreamRecorder.encoderOptions();
        this._renderFormat = OriginTemplater.springStem(this._sourceLoader);

        if(!(this._renderFormat.renderVideo || 
        this._renderFormat.renderAudio) || !this._options){
            return this._cancelRender();
        }
 
        this._tunePlayer(0.3);

        if(!this._renderFormat.renderAudio){
            this._audioCombiner = Promise.resolve();
        } else {
            this._audioCombiner = 
            this._audioAdapter.combineAudio(
            this._sourceLoader.getAudioSources().map(source => source.cast));
        }

        let renderDone = this._audioCombiner.then(function(audioDest){

            this._audioDest = audioDest;
            return this._startStreamRecorders();

        }.bind(this)).then(function(renderTracks){

            return Promise.all(renderTracks).then(function(recordedRender) {
                return recordedRender
            });

        });

        this._renderStages.renderDone = renderDone;

        this._renderStages.loadffmpeg = renderDone.then(function(recordedRender){

            return import("ffmpeg.js").then(function({ default: ffmpeg }){

                this._tunePlayer(1);
                this._audioAdapter.connectAudio();

                let ffmpegArguments = this._ffmpegArgGen(recordedRender);

                var result = ffmpeg({
                    MEMFS: ffmpegArguments.encodeCombination,
                    arguments: ffmpegArguments.argumentString,
                    stdin: function() {},
                });

                OriginTemplater.downloadFile(new Blob(
                [new Uint8Array(result.MEMFS[0].data)]));

            }.bind(this));

        }.bind(this));

        return this._renderStages;

    }

    _ffmpegArgGen (recordedRender) {


        let encodeCombination = false;
        let argumentString = false;

        //FIXME: redundant
        if(!this._renderFormat.renderAudio && 
            this._renderFormat.renderVideo){
            // only video
            encodeCombination = [
            {name: "video.webm", 
            data: new Uint8Array(recordedRender[0])}];
            argumentString = "-i video.webm -c copy output.webm".split(" ");

        } else if (this._renderFormat.renderAudio && 
            !this._renderFormat.renderVideo){
            // only audio
            encodeCombination = [
            {name: "audio.webm", 
            data: new Uint8Array(recordedRender[1])}];
            argumentString = "-i audio.webm -c copy output.webm".split(" ");

        } else if (this._renderFormat.renderAudio && 
            this._renderFormat.renderVideo){
            // both
            encodeCombination = [
            {name: "audio.webm", 
            data: new Uint8Array(recordedRender[1])}, 
            {name: "video.webm", 
            data: new Uint8Array(recordedRender[0])}];
            argumentString = "-i video.webm -i audio.webm -c copy output.webm".split(" ");

        }else {
            alert("Nothing to render!");
        }

        let ffmpegFeed = {
            encodeCombination,
            argumentString
        }

        return ffmpegFeed;

    }

    constructor (sourceLoader, videoOutput, videoProjection) {

        this._sourceLoader = sourceLoader;
        this._videoOutput = videoOutput;
        this._videoProjection = videoProjection;

    }
    
}

export default CompositionRenderer;
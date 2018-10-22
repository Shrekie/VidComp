import _ from 'lodash';

export default function (ContextHooks) {

    var store = {
        sources: []
    };

    this.contextHooks = ContextHooks.createHook("castControl");

    var Cast = function (media, cast, type, status){

        this.media = media;
        this.cast = cast;
        this.type = type;
        if (status == null) this.status = "ready";
        else this.status = status;
        this.loadedCast = {};

    }

    //TODO: Move this to blob analyzer
    var hasAudio = function (video) {
        return video.mozHasAudio ||
        Boolean(video.webkitAudioDecodedByteCount) ||
        Boolean(video.audioTracks && video.audioTracks.length);
    }

    // TODO: make casting async
    var castMedia = function (media){

        if(!media.resource) {

            console.log('YOU CASTED MEDIA WITH NO RESOURCE');

        }else if(media.resource.url == 'fetching'){
            
            // TODO: do something better while fetching
            var image = new Image();
            var imageCast = new Cast(media, image, 'image', "loading");

            imageCast.loadedCast = new Promise(function(resolve){

                image.onload = function() {
                    image.onload = null;
                    resolve(imageCast);
                    imageCast.status = "ready";
                };

                image.src = 'https://i.imgur.com/IaS4CqB.png';

            });

            store.sources.push(imageCast);

        }else{

            // TODO: in future just make a includes branch for audio

            if(media.resource.type == 'image'){

                var image = new Image();
                var imageCast = new Cast(media, image, media.resource.type, "loading");

                imageCast.loadedCast = new Promise(function(resolve){

                    image.onload = function() {
                        image.onload = null;
                        resolve(imageCast);
                        imageCast.status = "ready";
                    };
                    image.src = media.resource.url;

                });

                store.sources.push(imageCast);

            }
    
            if(media.resource.type == 'video'){

                var video = document.createElement("video");
                video.muted = true;
                
                var videoCast = new Cast(media, video, media.resource.type, "loading");

                videoCast.loadedCast = new Promise(function(resolve, reject){

                    video.oncanplay = function() {

                        if(hasAudio(video)){

                            var audio = document.createElement("audio");

                            var audioCast = new Cast(media, audio, 'audio-throw', "loading")

                            audio.oncanplay = function(){
                                
                                audio.oncanplay = null;
                                //audio.muted = false;
                                //video.playbackRate = 0.3;
                                //audio.playbackRate = 0.3;
                                videoCast.status = "ready";
                                audioCast.status = "ready";
                                resolve(audioCast);

                            }

                            audio.src = media.resource.url;

                            store.sources.push(audioCast);
                            
                        }else{

                            //video.playbackRate = 0.3;
                            videoCast.status = "ready";
                            resolve(videoCast);

                        }

                        video.oncanplay = null;

                    };

                    video.src = media.resource.url;

                });

                store.sources.push(videoCast);

            }

        }

    };

    var decastMedia = function (source) {

        // burn
        if(source.type.includes('video')){
            source.cast.pause();
            source.cast.src = '';
        }
        if(source.type.includes('image')){
            source.cast.src = '';
        }
        if(source.type.includes('audio')){
            source.cast.pause();
            source.cast.src = '';
        }
        //delete source.type;
        delete source.cast;
        delete source.status;

    };
 
    this.sortMediaLayers = function(){

        function compare(a,b) {
            if (a.media.layerIndex < b.media.layerIndex)
              return -1;
            if (a.media.layerIndex > b.media.layerIndex)
              return 1;
            return 0;
        }
          
        store.sources.sort(compare);
        console.log(store.sources);

    }

    this.eachSource = function (){
        return store.sources;
    }

    this.loadSelectedResource = function (resource) {

        // deletes and recasts media that has 'resource'

        let i = store.sources.length;

        while (i--) {
            if( store.sources[i].media.resource.name == resource.name ){
                store.sources[i].status = "deleting";
                decastMedia(store.sources[i]);
                if(store.sources[i].type.includes("throw") == false ) 
                castMedia(store.sources[i].media);
                store.sources.splice(i, 1);
            }
        }

        this.sortMediaLayers();
        
        this.whenCastReady(resource).then(function(mediaCast){
            this.contextHooks.runContextHooks({name:'resourceCasted'});
        }.bind(this));

    };

    this.whenCastReady = function (resource) {

        var castedMedia = store.sources.filter(source => 
        (source.media.resource.name == resource.name)
        && (!source.type.includes("throw")));
            
        return Promise.all(castedMedia.map(source => source.loadedCast));

    }

    this.deleteSourceMedia = function (layerIndex, mediaIndex){

        let mediaToDecast = store.sources.filter(function(source) {
            return source.media.layerIndex == layerIndex && 
            source.media.mediaIndex == mediaIndex;
        });

        store.sources = store.sources.filter(function(source) {
            return source.media.layerIndex != layerIndex || 
            source.media.mediaIndex != mediaIndex;
        });

        mediaToDecast.forEach(function(source){
            decastMedia(source);
        });

    };

    this.getEndTime = function () {
        return Math.max.apply(Math, store.sources.map(function(source) { return source.media.timelineTime[1]; }));
    };

    this.getControlledSources = function(){
        return store.sources.filter(source => source.type.includes("audio") || source.type.includes("video"));
    };

    this.getVideoSources = function (){
        return store.sources.filter(source => source.type == "video");
    };

    this.getAudioSources = function (){
        return store.sources.filter(source => source.type.includes("audio"));
    };

    this.getMediaCast = function (media) {
        return store.sources.find(source => source.media === media ).cast;
    }

    this.loadMedia = function (media) {

        castMedia(media);

        this.sortMediaLayers();

        this.whenCastReady(media.resource).then(function(mediaCast){
            this.contextHooks.runContextHooks({name:'resourceCasted'});
        }.bind(this));

    };

    this.clearSources = function () {
        store.sources.splice(0, store.sources.length)
    }

};
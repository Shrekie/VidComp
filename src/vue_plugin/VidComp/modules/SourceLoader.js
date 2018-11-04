import BlobAnalyzer from '../../../library/fileManager/BlobAnalyzer.js';

import _ from 'lodash';

class Cast {

    constructor(media, cast, type, status){

        this.media = media;
        this.cast = cast;
        this.type = type;
        if (status == null) this.status = "ready";
        else this.status = status;
        this.loadedCast = {};

    }

}

class SourceLoader {

    _store = {
        sources: []
    }

    contextHooks;

    _castMedia (media) {

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

                image.src = 'https://i.imgur.com/wWv5kKf.png';

            });

            this._store.sources.push(imageCast);

        }else{

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

                this._store.sources.push(imageCast);

            }
    
            if(media.resource.type == 'video'){

                var video = document.createElement("video");
                video.loop = true;

                video.muted = true;
                
                var videoCast = new Cast(media, video, media.resource.type, "loading");

                videoCast.loadedCast = new Promise(function(resolve, reject){

                    video.oncanplay = function() {

                        if(BlobAnalyzer.hasAudio(video)){

                            var audio = document.createElement("audio");
                            audio.loop = true;

                            var audioCast = new Cast(media, audio, 'audio-throw', "loading")

                            audio.oncanplay = function(){
                                
                                audio.oncanplay = null;
                                videoCast.status = "ready";
                                audioCast.status = "ready";
                                resolve(audioCast);

                            }

                            audio.src = media.resource.url;

                            this._store.sources.push(audioCast);
                            
                        }else{

                            videoCast.status = "ready";
                            resolve(videoCast);

                        }

                        video.oncanplay = null;

                    }.bind(this);

                    video.src = media.resource.url;

                }.bind(this));

                this._store.sources.push(videoCast);

            }

        }

    }

    _decastMedia (source) {

        //TODO: this is dumb
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

    }

    sortMediaLayers () {

        function compare(a,b) {
            if (a.media.layerIndex < b.media.layerIndex)
              return -1;
            if (a.media.layerIndex > b.media.layerIndex)
              return 1;
            return 0;
        }
          
        this._store.sources.sort(compare);

    }

    eachSource () {
        return this._store.sources;
    }

    loadSelectedResource (resource) {

        // deletes and recasts media that has 'resource'

        let i = this._store.sources.length;

        while (i--) {
            if( this._store.sources[i].media.resource.name == resource.name ){
                this._store.sources[i].status = "deleting";
                this._decastMedia(this._store.sources[i]);
                if(this._store.sources[i].type.includes("throw") == false ) 
                this._castMedia(this._store.sources[i].media);
                this._store.sources.splice(i, 1);
            }
        }

        this.sortMediaLayers();
        
        this._whenCastReady(resource).then(function(mediaCast){
            this.contextHooks.runContextHooks({name:'resourceCasted'});
        }.bind(this));

    }

    _whenCastReady (resource) {

        var castedMedia = this._store.sources.filter(source => 
        (source.media.resource.name == resource.name)
        && (!source.type.includes("throw")));
            
        return Promise.all(castedMedia.map(source => source.loadedCast));

    }

    deleteSourceMedia (layerIndex, mediaIndex) {

        let mediaToDecast = this._store.sources.filter(function(source) {
            return source.media.layerIndex == layerIndex && 
            source.media.mediaIndex == mediaIndex;
        });

        this._store.sources = this._store.sources.filter(function(source) {
            return source.media.layerIndex != layerIndex || 
            source.media.mediaIndex != mediaIndex;
        });

        mediaToDecast.forEach(function(source){
            this._decastMedia(source);
        }.bind(this));

    }

    getEndTime () {
        return Math.max.apply(Math, this._store.sources.map(function(source) 
        { return source.media.timelineTime[1]; }));
    }

    getVideoSources () {
        return this._store.sources.filter(source => source.type == "video");
    }

    getAudioSources () {
        return this._store.sources.filter(source => source.type.includes("audio"));
    }

    getMediaCast = function (media) {
        return this._store.sources.find(source => source.media === media ).cast;
    }

    getCastLoading () {
        return this._store.sources.map(source => source.loadedCast);
    }

    loadMedia (media) {

        this._castMedia(media);

        this.sortMediaLayers();

        this._whenCastReady(media.resource).then(function(mediaCast){
            this.contextHooks.runContextHooks({name:'resourceCasted'});
        }.bind(this));

    }

    clearSources = function () {
        this._store.sources.splice(0, this._store.sources.length)
    }

    constructor(ContextHooks){
        this.contextHooks = ContextHooks.createHook("castControl");
    }

}

export default SourceLoader;